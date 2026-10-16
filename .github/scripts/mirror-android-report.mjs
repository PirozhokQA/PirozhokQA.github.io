import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

// Only the public, sanitized snapshot is mirrored. No APK or test source is copied.
const manifest = JSON.parse(gunzipSync(Buffer.from(await readFile(
  new URL('./android-report-145870.manifest.gz.b64', import.meta.url), 'utf8'), 'base64')));
const origin = 'https://android-regression-reports-145870.lexa-pirozhkov2.chatgpt.site/';
const prefix = 'android-regression/145870-2026-10-15';
if (manifest.origin !== origin || manifest.target !== prefix || manifest.files.length !== 1381) {
  throw new Error('Unexpected report manifest');
}
const root = resolve(prefix);
let exists = false;
try { await access(root); exists = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
if (exists) throw new Error('Report snapshot already exists; refusing to overwrite it');
const names = new Set();
for (const file of manifest.files) {
  if (!/^[a-zA-Z0-9_.\-/]+$/.test(file.path) || file.path.split('/').some(p => !p || p === '.' || p === '..')
    || names.has(file.path) || !/^[a-f0-9]{64}$/.test(file.sha256) || file.size < 0 || file.size > 25000000) {
    throw new Error('Invalid report file entry');
  }
  names.add(file.path);
}
let next = 0;
let completed = 0;
let bytes = 0;
async function fetchPublicFile(path) {
  let url = new URL(path, origin);
  for (let redirect = 0; redirect < 5; redirect++) {
    const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(45000) });
    if (![301, 302, 303, 307, 308].includes(response.status)) return response;
    const location = response.headers.get('location');
    if (!location) throw new Error(`Missing redirect location for ${path}`);
    url = new URL(location, url);
    if (url.origin !== new URL(origin).origin) throw new Error(`Redirect outside report host for ${path}`);
    await response.body?.cancel();
  }
  throw new Error(`Too many redirects for ${path}`);
}
async function worker() {
  while (next < manifest.files.length) {
    const file = manifest.files[next++];
    const destination = resolve(root, file.path);
    if (!destination.startsWith(root + sep)) throw new Error('Path outside report directory');
    let buffer;
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const response = await fetchPublicFile(file.path);
        if (!response.ok) throw new Error(`HTTP ${response.status} for ${file.path}`);
        buffer = Buffer.from(await response.arrayBuffer());
        if (buffer.length !== file.size || createHash('sha256').update(buffer).digest('hex') !== file.sha256) {
          throw new Error(`Checksum mismatch for ${file.path}`);
        }
        break;
      } catch (error) {
        if (attempt === 3) throw error;
        await new Promise(done => setTimeout(done, (attempt + 1) * 1500));
      }
    }
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, buffer, { flag: 'wx' });
    bytes += buffer.length;
    completed++;
    if (completed % 100 === 0) console.log(`Verified ${completed}/${manifest.files.length} files`);
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
if (bytes !== manifest.totalBytes) throw new Error('Report byte count mismatch');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
git('add', '--', prefix);
const staged = git('diff', '--cached', '--name-only').split('\n');
if (staged.length !== manifest.files.length || staged.some(p => !p.startsWith(prefix + '/'))) {
  throw new Error('Unexpected files staged');
}
git('-c', 'user.name=Android report publisher', '-c',
  'user.email=159764465+PirozhokQA@users.noreply.github.com',
  'commit', '-m', 'Publish Allure snapshot for Android build 145870');
const sha = git('rev-parse', 'HEAD');
const branch = `android-report-145870-${process.env.GITHUB_RUN_ID}`;
if (!/^android-report-145870-[0-9]+$/.test(branch)) throw new Error('Unexpected workflow run ID');
git('push', 'origin', `HEAD:refs/heads/${branch}`);
console.log(`REPORT_COMMIT=${sha}`);
console.log(`REPORT_BRANCH=${branch}`);
console.log(`Published source: ${completed} files, ${bytes} bytes`);
if (process.env.GITHUB_STEP_SUMMARY) await writeFile(process.env.GITHUB_STEP_SUMMARY,
  `Report snapshot prepared: ${completed} files, ${bytes} bytes.\n\nCommit: ${sha}\n\nBranch: ${branch}\n`);
