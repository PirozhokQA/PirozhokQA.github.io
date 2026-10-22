export function yerevanToday(now=new Date()){
 return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Yerevan',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
}
export function validReference(value,origin){
 if(!value)return '';
 try{const url=new URL(value,origin);return url.origin===origin&&/^\/klimt-(concept|beauty-house)\/assets\/[a-z0-9_-]+\.(webp|png|jpg)$/i.test(url.pathname)?url.href:'';}catch{return '';}
}
export function validateBooking(data,config,today=yerevanToday()){
 if(!config.services.some(s=>s.slug===data.service)||String(data.name||'').length>80)return 'invalid';
 if(data.procedure&&!config.procedures.some(p=>p.id===data.procedure&&p.service===data.service))return 'invalid';
 if(data.master&&!config.masters.some(m=>m.id===data.master&&m.service===data.service))return 'invalid';
 if(data.phone&&(!/^[+\d\s().-]+$/.test(data.phone)||data.phone.replace(/\D/g,'').length<8||data.phone.replace(/\D/g,'').length>18))return 'invalid';
 if(String(data.comment||'').length>600)return 'invalid';
 if(data.time&&!['10:00–12:00','12:00–15:00','15:00–18:00','18:00–20:00'].includes(data.time))return 'invalid';
 if(data.date){if(!/^\d{4}-\d{2}-\d{2}$/.test(data.date))return 'invalid';const dt=new Date(data.date+'T12:00:00Z');if(!Number.isFinite(dt.getTime())||dt.toISOString().slice(0,10)!==data.date)return 'invalid';if(data.date<today)return 'noPast';}
 return '';
}
export function composeMessage(data,config){
 const t=config.text,lines=[t.messageHello,''];
 const append=(label,value)=>{if(String(value||'').trim())lines.push(label+': '+String(value).trim());};
 append(t.messageName,String(data.name||'').replace(/[\r\n]/g,' '));
 append(t.messagePhone,data.phone);
 append(t.messageService,config.services.find(s=>s.slug===data.service)?.name);
 append(t.messageProcedure,config.procedures.find(p=>p.id===data.procedure)?.name||t.procedurePrompt);
 append(t.messageMaster,config.masters.find(m=>m.id===data.master)?.name||t.anyMaster);
 if(data.date)append(t.messageDate,new Intl.DateTimeFormat(config.lang,{timeZone:'Asia/Yerevan',dateStyle:'long'}).format(new Date(data.date+'T12:00:00Z')));
 append(t.messageTime,data.time);
 append(t.messageComment,data.comment);
 const reference=validReference(data.reference?.url,config.origin);
 if(reference)append(t.messageReference,(data.reference.caption||'')+'\n'+reference);
 lines.push('',t.messageQuestion);
 return lines.join('\n');
}
export function finderGoals(service){
 const goals={
  hair:[['quizHairCut','hair-cut'],['quizHairColour','hair-color'],['quizHairStyle','hair-style']],
  nails:[['quizNailsCare','nails-manicure'],['quizNailsColour','nails-polish']],
  makeup:[['quizMakeupDay','makeup-day'],['quizMakeupEvent','makeup-evening']],
  'brows-lashes':[['quizBrows','brows-shape'],['quizLashes','lashes-led']],
  cosmetology:[['quizSkinClean','skin-clean'],['quizSkinCare','']],
  elos:[['quizElos','elos']]
 };
 return [...(goals[service]||[]),['quizConsult','']];
}
