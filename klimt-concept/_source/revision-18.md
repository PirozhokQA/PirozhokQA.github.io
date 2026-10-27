# Revision 18 — sloplint fixes and ub-mode code review

Date: 2026-10-27. Scope: existing Klimt design, all three languages, existing contact and booking handoff.

## Action log and reasons

1. Read the render report, shared templates and client booking code; confirmed GitHub baseline 40ef8e722636b672e3fbb82103b7c1ff0c8b647d before editing.
2. Reproduced three failing real-browser regression cases before source edits. At 375px, the home primary action ended at y=1075 with usable fold y=737; at 1280px it ended at y=1271. The hair action ended at y=970. Captions were 9–11px. No horizontal overflow was observed in those cases.
3. Reduced the shared header/wordmark stack, grouped the home introduction semantically, moved mobile copy/actions before its decorative image, and enlarged small captions. Existing salon facts, gallery references, prices, translations and booking controls are preserved. The repeated service context label remains as an accessible section label.
4. Reviewed booking boundaries, message composition, gallery gestures, menu/language interactions and source generation. Found duplicated booking time intervals; moved them to one immutable exported domain list consumed by both renderer and validator. Existing validation/message interfaces are preserved.
5. Tool availability: crapper, dryer and mutator are not available in this environment. No CRAP score, duplicate rank or mutation score is claimed. Manual review and behavioural regression tests are used instead.

## Verification results

6. The first-screen browser regression now passes 45/45 cases: RU/EN/HY; home, hair and brows/lashes; 360x800, 390x844, 768x1024, 1280x800 and 1920x1080. The primary booking action is inside the usable fold, horizontal overflow is absent, and the checked captions are at least 12px. The check waits for fonts and header/hero image decoding; its screenshots were inspected.
7. Existing verify.mjs and mobile-verify.mjs pass: booking/finder filtering and validation, safe message composition, photo/author references, clipboard success/fallback, Yerevan date boundary, multilingual structure, direct Instagram and gallery gestures.
8. Shared-slot checks pass: both generated selects and validation accept the same four immutable intervals in all three languages; an outside interval is rejected.
9. sloplint render audit: before 3 FAIL / 8 REFLEX / 2 WARN; after 0 FAIL / 3 REFLEX / 2 WARN. Ten after screenshots were generated. Some first-frame screenshots from the linter are captured before image paint; independent stable fold screenshots are also retained outside the published site.

## Reviewed remaining stylistic findings

- 44c / 79, service page: the short introduction intentionally exposes the procedure catalogue in the first screen. The linter measures only the introductory section, so it calls the area below that section empty while the actual screenshot shows procedures there. Keep the useful catalogue visible instead of growing an empty hero.
- 59, main page: the smallest desktop section gap is 90px versus the linter's preferred 120px. Keep the established spacing; no readability or overlap failure is present.
- WARN 59, main page: ten content sections preserve the service, price, team, visit, review and FAQ information already requested by the owner.
- WARN 77, service page: nested catalogue/gallery sections are grouped by the linter under the main wrapper, resulting in a misleading two-section count. The sections and their routes remain present.

## Code review conclusions

Client boundaries validate category/procedure/master consistency, optional phone, calendar dates and permitted local photo URLs. Message text is assigned through textarea/textContent, and no personal data is put in analytics events. The source generator continues to produce all three languages and preserve route/contact wiring. Shared booking intervals now have one owner. No unrelated framework rewrite, new backend, payment flow or calendar provider was introduced.

Screenshots and test helpers are stored in the sibling klimt-checks directory and are not published. No worktree was created, so no checkout cleanup is needed. Publish only the modified klimt-concept files, preserving the rest of the GitHub repository.

