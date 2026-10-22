import {yerevanToday,validReference,validateBooking,composeMessage,finderGoals} from './booking-core.mjs';
const node=document.getElementById('klimt-experience-data');
if(node){
 const config=JSON.parse(node.textContent),t=config.text;
 const booking=document.getElementById('booking-dialog'),finder=document.getElementById('finder-dialog');
 const form=booking.querySelector('form'),formView=booking.querySelector('.booking-form-view'),ready=booking.querySelector('.booking-ready');
 const field=name=>form.querySelector('[name="'+name+'"]');
 const error=booking.querySelector('.form-error'),referenceBox=booking.querySelector('.booking-reference'),message=booking.querySelector('#booking-message');
 let bookingOpener=null,finderOpener=null,reference=null,quiz={step:0,service:'',goal:'',when:''};
 const track=(event,values={})=>{
  const detail={event,service:values.service||'',procedure:values.procedure||'',channel:values.channel||''};
  window.dispatchEvent(new CustomEvent('klimt:analytics',{detail}));
  if(config.analytics.enabled&&config.analytics.measurementId&&typeof window.gtag==='function')window.gtag('event',event,detail);
 };
 const option=(value,label)=>{const o=document.createElement('option');o.value=value;o.textContent=label;return o;};
 function updateChoices(procedure='',master=''){
  field('procedure').replaceChildren(option('',t.procedurePrompt),...config.procedures.filter(p=>p.service===field('service').value).map(p=>option(p.id,p.name)));
  field('master').replaceChildren(option('',t.anyMaster),...config.masters.filter(m=>m.service===field('service').value).map(m=>option(m.id,m.name)));
  field('procedure').value=config.procedures.some(p=>p.id===procedure&&p.service===field('service').value)?procedure:'';
  field('master').value=config.masters.some(m=>m.id===master&&m.service===field('service').value)?master:'';
  updateSelection();
 }
 function updateSelection(){
  const choices=[config.procedures.find(p=>p.id===field('procedure').value)?.name,config.masters.find(m=>m.id===field('master').value)?.name].filter(Boolean);
  const selection=booking.querySelector('.booking-selection');
  selection.hidden=!choices.length;selection.textContent=choices.length?t.selected+': '+choices.join(' · '):'';
 }
 function revealField(input){
  const extras=input.closest('.booking-extras');if(extras)extras.open=true;
  input.focus();
 }
 function updateReference(){
  referenceBox.hidden=!reference;
  const img=referenceBox.querySelector('img');
  if(reference){img.src=reference.url;img.alt=reference.caption;referenceBox.querySelector('figcaption p').textContent=reference.caption;}
  else{img.removeAttribute('src');img.alt='';}
 }
 function showForm(){formView.hidden=false;ready.hidden=true;error.hidden=true;booking.querySelector('.copy-status').textContent='';}
 function openBooking(options={},opener=null){
  if(typeof booking.showModal!=='function'){location.hash='contact';return;}
  bookingOpener=opener;showForm();booking.querySelector('.booking-extras').open=false;
  field('date').min=yerevanToday();
  field('service').value=config.services.some(s=>s.slug===options.service)?options.service:'';
  updateChoices(options.procedure,options.master);
  if(options.comment)field('comment').value=options.comment;
  const url=validReference(options.photo,config.origin);
  reference=url?{url,caption:options.caption||t.reference}:null;updateReference();
  booking.showModal();
  (field('service').value?field('time'):field('service')).focus({preventScroll:true});
  track('booking_open',{service:field('service').value,procedure:field('procedure').value});
 }
 function closeDialog(dialog){
  dialog.close();
 }
 document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-open-booking]');
  if(trigger){event.preventDefault();if(finder.open)finder.close();openBooking({service:trigger.dataset.service,procedure:trigger.dataset.procedure,master:trigger.dataset.master,photo:trigger.dataset.photo,caption:trigger.dataset.caption},trigger);return;}
  const find=event.target.closest('[data-open-finder]');
  if(find){if(typeof finder.showModal!=='function')return;event.preventDefault();finderOpener=find;quiz={step:0,service:'',goal:'',when:''};renderFinder();finder.showModal();finder.querySelector('input')?.focus();track('finder_open');}
  const close=event.target.closest('[data-close-dialog]');if(close)closeDialog(close.closest('dialog'));
  const call=event.target.closest('a[href^="tel:"]');if(call)track('contact_click',{channel:'phone',service:field('service').value});
  const instagram=event.target.closest('a[href^="https://www.instagram.com/klimt_beauty_house/"]');if(instagram)track('contact_click',{channel:'instagram',service:field('service').value});
 });
 field('service').addEventListener('change',()=>{updateChoices();reference=null;updateReference();});
 field('procedure').addEventListener('change',updateSelection);
 field('master').addEventListener('change',updateSelection);
 booking.querySelector('[data-remove-reference]').addEventListener('click',()=>{reference=null;updateReference();});
 form.addEventListener('invalid',event=>{const extras=event.target.closest('.booking-extras');if(extras)extras.open=true;},true);
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const data=Object.fromEntries(['service','procedure','master','name','phone','date','time','comment'].map(name=>[name,field(name).value]));
  const problem=validateBooking(data,config);
  if(problem){error.textContent=t[problem]||t.invalid;error.hidden=false;revealField(field(problem==='noPast'?'date':data.phone?'phone':'service'));return;}
  message.value=composeMessage({...data,reference},config);
  error.hidden=true;formView.hidden=true;ready.hidden=false;booking.scrollTop=0;ready.querySelector('h2').focus();
  track('booking_message_prepared',data);
 });
 booking.querySelector('[data-edit-booking]').addEventListener('click',()=>{showForm();field('service').focus();});
 booking.querySelector('[data-copy-message]').addEventListener('click',async()=>{
  const status=booking.querySelector('.copy-status');
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(message.value);status.textContent=t.copied;track('booking_message_copied',{service:field('service').value});}
  catch{message.focus();message.select();status.textContent=t.copyFailed;}
 });
 booking.addEventListener('close',()=>{if(bookingOpener?.isConnected&&!bookingOpener.closest('dialog:not([open])'))bookingOpener.focus();else document.querySelector('[data-open-booking]')?.focus();});
 finder.addEventListener('close',()=>{if(!booking.open)finderOpener?.focus();});
 [booking,finder].forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}));
 function renderFinder(){
  const content=finder.querySelector('.finder-content'),actions=finder.querySelector('.finder-actions');
  finder.querySelector('.finder-progress').textContent=quiz.step<3?String(quiz.step+1)+' / 3':t.quizResult;
  content.replaceChildren();actions.replaceChildren();
  if(quiz.step===3){
   const chosen=finderGoals(quiz.service).find(g=>g[0]===quiz.goal),p=config.procedures.find(p=>p.id===chosen?.[1]),service=config.services.find(s=>s.slug===quiz.service);
   const heading=document.createElement('h3');heading.textContent=p?.name||service.name;content.append(heading);
   const text=document.createElement('p');text.textContent=t[quiz.goal]+' · '+t[quiz.when];content.append(text);
   const book=document.createElement('button');book.type='button';book.className='solid-button';book.textContent=t.quizBook;
   book.addEventListener('click',()=>{const comment=t.quizMessage+': '+t[quiz.goal]+'. '+t.quizTiming+': '+t[quiz.when]+'.';finder.close();openBooking({service:quiz.service,procedure:p?.id||'',comment},finderOpener);track('finder_booking',{service:quiz.service,procedure:p?.id});});
   const work=document.createElement('a');work.className='text-link';work.href=config.base+'/'+config.lang+'/services/'+quiz.service+'/#work';work.textContent=t.quizWorks;
   actions.append(book,work);
  }else{
   const legendText=[t.quizArea,t.quizGoal,t.quizWhen][quiz.step],fieldset=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=legendText;fieldset.append(legend);
   const choices=quiz.step===0?config.services.map(s=>[s.slug,s.name]):quiz.step===1?finderGoals(quiz.service).map(g=>[g[0],t[g[0]]]):['quizSoon','quizEvent','quizExplore'].map(v=>[v,t[v]]);
   const prop=['service','goal','when'][quiz.step];
   choices.forEach(([value,label])=>{const item=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');input.type='radio';input.name='finder-step-'+quiz.step;input.value=value;input.checked=quiz[prop]===value;span.textContent=label;input.addEventListener('change',()=>{if(prop==='service'&&quiz.service!==value){quiz.goal='';}quiz[prop]=value;actions.querySelector('[data-finder-next]').disabled=false;});item.append(input,span);fieldset.append(item);});
   content.append(fieldset);
   const next=document.createElement('button');next.type='button';next.className='solid-button';next.dataset.finderNext='';next.textContent=quiz.step===2?t.quizShow:t.quizNext;next.disabled=!quiz[prop];next.addEventListener('click',()=>{if(!quiz[prop])return;quiz.step++;renderFinder();focusFinder();if(quiz.step===3)track('finder_completed',{service:quiz.service});});actions.append(next);
  }
  if(quiz.step>0){const back=document.createElement('button');back.type='button';back.className='text-link';back.textContent=t.quizBack;back.addEventListener('click',()=>{quiz.step--;renderFinder();focusFinder();});actions.append(back);}
 }
 function focusFinder(){const target=finder.querySelector('.finder-content legend,.finder-content h3');if(target){target.tabIndex=-1;target.focus();}}
 updateChoices();
}
