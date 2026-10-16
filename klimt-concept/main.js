const root=document.documentElement;
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let paused=preference.matches;
let manualPause=null;
const motionToggle=document.querySelector('.motion-toggle');
const frames=[...document.querySelectorAll('.hero-frame')];
const frameButtons=[...document.querySelectorAll('[data-frame]')];
let currentFrame=0,timer;
function showFrame(i){currentFrame=i;frames.forEach((f,j)=>{f.classList.toggle('active',i===j);f.setAttribute('aria-hidden',String(i!==j));frameButtons[j].setAttribute('aria-pressed',String(i===j));});}
function cycle(){clearInterval(timer);if(!paused&&!document.hidden)timer=setInterval(()=>showFrame((currentFrame+1)%frames.length),10000);}
function setMotion(){root.classList.toggle('motion-paused',paused);root.classList.toggle('js-motion',!paused);motionToggle.setAttribute('aria-pressed',String(paused));motionToggle.innerHTML=(paused?'▷':'Ⅱ')+' <span>'+(paused?document.body.dataset.resume:document.body.dataset.pause)+'</span>';cycle();}
setMotion();
motionToggle.addEventListener('click',()=>{paused=!paused;manualPause=paused;setMotion();});
preference.addEventListener('change',e=>{if(manualPause===null){paused=e.matches;setMotion();}});
document.addEventListener('visibilitychange',cycle);
frameButtons.forEach((b,i)=>b.addEventListener('click',()=>{showFrame(i);cycle();}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('#mobile-nav');
function setMenu(open){menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.firstChild.textContent=(open?menuButton.dataset.close:menuButton.dataset.open);}
menuButton.addEventListener('click',()=>setMenu(menu.hidden));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){setMenu(false);menuButton.focus();}});
document.querySelectorAll('.language-link').forEach(a=>a.addEventListener('click',()=>{const u=new URL(a.href);u.hash=location.hash;a.href=u.href;}));
const serviceRows=[...document.querySelectorAll('.service-row')];
serviceRows.forEach(row=>row.addEventListener('toggle',()=>{if(row.open)serviceRows.forEach(other=>{if(other!==row)other.open=false;});}));
const photos=[...document.querySelectorAll('.gallery-open')];
const dialog=document.querySelector('.lightbox');
let currentPhoto=0,opener;
function displayPhoto(i){currentPhoto=(i+photos.length)%photos.length;const a=photos[currentPhoto];const pic=a.querySelector('img');const img=dialog.querySelector('img');img.src=a.href;img.alt=pic.alt;img.width=pic.width;img.height=pic.height;dialog.querySelector('figcaption').textContent=pic.alt+' · '+(currentPhoto+1)+' / '+photos.length;dialog.querySelector('.lightbox-source').href=a.dataset.source;}
photos.forEach((a,i)=>a.addEventListener('click',e=>{if(typeof dialog.showModal!=='function')return;e.preventDefault();opener=a;displayPhoto(i);dialog.showModal();dialog.querySelector('.lightbox-close').focus();}));
dialog.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
dialog.querySelector('.lightbox-prev').addEventListener('click',()=>displayPhoto(currentPhoto-1));
dialog.querySelector('.lightbox-next').addEventListener('click',()=>displayPhoto(currentPhoto+1));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();displayPhoto(currentPhoto+1);}if(e.key==='ArrowLeft'){e.preventDefault();displayPhoto(currentPhoto-1);}});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>opener?.focus());