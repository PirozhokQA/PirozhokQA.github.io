(() => {
 const menuButton=document.querySelector('.menu-toggle'),menu=document.querySelector('#mobile-menu');
 const closeMenu=()=>{menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label',menuButton.dataset.openLabel);};
 menuButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?menuButton.dataset.closeLabel:menuButton.dataset.openLabel);});
 menu.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){closeMenu();menuButton.focus();}});
 document.addEventListener('click',event=>{if(!event.target.closest('.header')&&!menu.hidden)closeMenu();});
 matchMedia('(min-width:901px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
 const updateLanguages=()=>document.querySelectorAll('.language-link').forEach(link=>{link.hash=location.hash;});
 updateLanguages();window.addEventListener('hashchange',updateLanguages);
 const filters=document.querySelector('.gallery-filters'),items=[...document.querySelectorAll('.gallery-item')],dialog=document.querySelector('.lightbox');
 filters.hidden=false;
 let selectedIndex=0,lastOpener=null;
 const visibleItems=()=>items.filter(item=>!item.hidden);
 filters.addEventListener('click',event=>{
  const button=event.target.closest('[data-filter]');if(!button)return;
  filters.querySelectorAll('button').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  items.forEach(item=>{item.hidden=button.dataset.filter!=='all'&&item.dataset.type!==button.dataset.filter;});
 });
 const showImage=index=>{
  const visible=visibleItems();selectedIndex=(index+visible.length)%visible.length;
  const item=visible[selectedIndex],image=item.querySelector('img'),link=item.querySelector('.gallery-open'),target=dialog.querySelector('figure>img');
  target.src=link.href;target.alt=image.alt;target.width=image.naturalWidth;target.height=image.naturalHeight;
  dialog.querySelector('.lightbox-caption').textContent=image.alt;
  dialog.querySelector('.lightbox-counter').textContent=(selectedIndex+1)+' / '+visible.length;
  dialog.querySelector('.lightbox-source').href=link.dataset.source;
 };
 document.querySelector('.gallery-grid').addEventListener('click',event=>{
  const link=event.target.closest('.gallery-open');if(!link||!dialog.showModal)return;
  event.preventDefault();lastOpener=link;showImage(visibleItems().indexOf(link.closest('.gallery-item')));dialog.showModal();document.body.classList.add('modal-open');
 });
 const close=()=>dialog.close();
 dialog.querySelector('.lightbox-close').addEventListener('click',close);
 dialog.querySelector('.lightbox-prev').addEventListener('click',()=>showImage(selectedIndex-1));
 dialog.querySelector('.lightbox-next').addEventListener('click',()=>showImage(selectedIndex+1));
 dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
 dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showImage(selectedIndex-1);}if(event.key==='ArrowRight'){event.preventDefault();showImage(selectedIndex+1);}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(lastOpener&&!lastOpener.closest('[hidden]'))lastOpener.focus();});
})();