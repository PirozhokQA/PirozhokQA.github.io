const root=document.documentElement;
let petalController=null;
const preference=matchMedia('(prefers-reduced-motion: reduce)');
let paused=preference.matches;
let manualPause=null;
const motionToggle=document.querySelector('.motion-toggle');
const frames=[...document.querySelectorAll('.hero-frame')];
const frameButtons=[...document.querySelectorAll('[data-frame]')];
let currentFrame=0,timer;
function showFrame(i){currentFrame=i;frames.forEach((f,j)=>{f.classList.toggle('active',i===j);f.setAttribute('aria-hidden',String(i!==j));frameButtons[j].setAttribute('aria-pressed',String(i===j));});}
function cycle(){clearInterval(timer);if(!paused&&!document.hidden)timer=setInterval(()=>showFrame((currentFrame+1)%frames.length),10000);}
function setMotion(){root.classList.toggle('motion-paused',paused);root.classList.toggle('js-motion',!paused);motionToggle.setAttribute('aria-pressed',String(paused));motionToggle.innerHTML=(paused?'▷':'Ⅱ')+' <span>'+(paused?document.body.dataset.resume:document.body.dataset.pause)+'</span>';cycle();petalController?.setPaused(paused);}
setMotion();
motionToggle.addEventListener('click',()=>{paused=!paused;manualPause=paused;setMotion();});
preference.addEventListener('change',e=>{if(manualPause===null){paused=e.matches;setMotion();}});
document.addEventListener('visibilitychange',cycle);
frameButtons.forEach((b,i)=>b.addEventListener('click',()=>{showFrame(i);cycle();}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');observer.unobserve(e.target);}}),{threshold:.08});
document.querySelectorAll('.reveal').forEach(e=>observer.observe(e));
const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('#mobile-nav');
function setMenu(open){menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?menuButton.dataset.close:menuButton.dataset.open);}
menuButton.addEventListener('click',()=>setMenu(menu.hidden));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){setMenu(false);menuButton.focus();}});
document.querySelectorAll('.language-select').forEach(select=>select.addEventListener('change',()=>{const target=new URL(select.value,location.origin);target.hash=location.hash;location.assign(target.href);}));
matchMedia('(min-width:768px)').addEventListener('change',e=>{if(e.matches)setMenu(false);});
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
// Soft petal motion inspired by a fluid first screen, using original canvas drawing.
function createPetalScene(canvas){
 const ctx=canvas?.getContext('2d');
 if(!ctx)return {setPaused(){}};
 const colours=[['#fffdf8','#ead9df','#b490a2'],['#fff0f3','#e6b5c9','#a86b8e'],['#f6eaf8','#d1b3da','#94698c'],['#efbad0','#ad527c','#6e294c']];
 let w=0,h=0,dpr=1,particles=[],raf=0,lastFrame=0,lastSpawn=0,userPaused=true;
 let pointer={x:-999,y:-999,at:0},lastBurst=0;
 const narrow=()=>w<768;
 const maxCount=()=>narrow()?22:40;
 function resize(){const b=canvas.getBoundingClientRect();w=b.width;h=b.height;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
 function flowerEdge(){const edge=document.querySelector('.floral-masthead')?.getBoundingClientRect().bottom||0;return edge>0?Math.min(edge-28,h*.4): -15;}
 function add(x=Math.random()*w,y=flowerEdge(),burst=false){
  if(particles.length>=maxCount())return;
  const c=Math.random();const colour=c<.4?0:c<.76?1:c<.93?2:3;
  particles.push({x,y,vx:(Math.random()-.5)*(burst?110:35),vy:(burst?-10:13)+Math.random()*23,size:(narrow()?7:9)+Math.random()*15,roll:Math.random()*Math.PI*2,spin:(Math.random()-.5)*1.7,turn:Math.random()*Math.PI*2,turnSpeed:.45+Math.random()*.8,age:0,life:9+Math.random()*8,phase:Math.random()*6.28,colour});
 }
 function drawPetal(p,now){
  const fade=Math.min(1,p.age/.9,(p.life-p.age)/2.2);
  if(fade<=0)return;
  const turn=Math.cos(p.turn),sx=(.22+.78*Math.abs(turn))*p.size;
  ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.roll);ctx.scale(sx,p.size*1.25);ctx.globalAlpha=fade*(p.colour===3?.43:.59);
  const tones=colours[p.colour];const g=ctx.createLinearGradient(-.7,-.9,.8,.9);g.addColorStop(0,tones[0]);g.addColorStop(.5,tones[1]);g.addColorStop(1,tones[2]);ctx.fillStyle=g;
  ctx.beginPath();ctx.moveTo(0,1);ctx.bezierCurveTo(-1.05,.42,-.92,-.67,-.12,-1);ctx.bezierCurveTo(.7,-1.18,1.02,-.06,0,1);ctx.fill();
  ctx.strokeStyle=p.colour===3?'#ffe0ee77':'#fffdfb99';ctx.lineWidth=.025;ctx.beginPath();ctx.moveTo(-.14,-.66);ctx.bezierCurveTo(.14,-.4,.2,.25,0,.76);ctx.stroke();ctx.restore();
 }
 function frame(now){
  raf=requestAnimationFrame(frame);
  if(now-lastFrame<32)return;
  const dt=Math.min((now-(lastFrame||now))/1000,.045);lastFrame=now;
  ctx.clearRect(0,0,w,h);
  if(now-lastSpawn>(narrow()?1450:950)){add();lastSpawn=now;}
  for(const p of particles){
   p.age+=dt;p.turn+=p.turnSpeed*dt;p.roll+=p.spin*dt;
   const dx=p.x-pointer.x,dy=p.y-pointer.y,dist=Math.hypot(dx,dy);
   if(now-pointer.at<500&&dist>2&&dist<155){const force=(1-dist/155)*150*dt;p.vx+=dx/dist*force;p.vy+=dy/dist*force*.7;}
   p.vx*=Math.exp(-.35*dt);p.vy+=(20-p.vy)*dt*.12;
   p.x+=(p.vx+Math.sin(p.age*.8+p.phase)*12)*dt;p.y+=p.vy*dt;
   drawPetal(p,now);
  }
  particles=particles.filter(p=>p.age<p.life&&p.y<h+60&&p.x>-100&&p.x<w+100);
 }
 function stop(){cancelAnimationFrame(raf);raf=0;lastFrame=0;ctx.clearRect(0,0,w,h);}
 function sync(){
  if(userPaused||preference.matches||document.hidden){stop();return;}
  if(raf)return;
  if(!particles.length){for(let i=0;i<(narrow()?5:9);i++){add(Math.random()*w,Math.random()*Math.min(h*.4,Math.max(100,flowerEdge())));particles[particles.length-1].age=Math.random()*2+.4;}}
  lastSpawn=performance.now();raf=requestAnimationFrame(frame);
 }
 resize();
 window.addEventListener('resize',resize,{passive:true});
 window.addEventListener('pointermove',e=>{
  if(userPaused||preference.matches||e.pointerType==='touch')return;
  const now=performance.now();pointer={x:e.clientX,y:e.clientY,at:now};
  if(now-lastBurst>320&&!e.target.closest('a,button,select,input,textarea')&&e.clientY<h*.85){add(e.clientX,e.clientY,true);add(e.clientX+12,e.clientY-8,true);lastBurst=now;}
 },{passive:true});
 window.addEventListener('pointerout',e=>{if(!e.relatedTarget)pointer.at=0;},{passive:true});
 document.addEventListener('visibilitychange',sync);
 preference.addEventListener('change',sync);
 return {setPaused(value){userPaused=value;sync();}};
}
petalController=createPetalScene(document.querySelector('.petal-canvas'));
petalController.setPaused(paused);