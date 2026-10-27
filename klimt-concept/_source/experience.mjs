import {BOOKING_TIME_SLOTS} from '../booking-core.mjs';
import {salon,texts} from '../../klimt-beauty-house/_source/content.mjs';
import {experienceText as ui,procedures,masters,reviews,faqItems,experienceConfig} from './experience-data.mjs';
import {priceGroups,formatPrice} from './pricing.mjs';
export {experienceConfig};
const base='/klimt-concept';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<span aria-hidden="true">↗</span>';
const slugList=['hair','nails','makeup','brows-lashes','cosmetology','elos'];
const category=(lang,slug)=>texts[lang].services[slugList.indexOf(slug)]?.[0]||'';
const priceFor=id=>priceGroups.flatMap(g=>g.items).find(p=>p.id===id);
const ext=(url,label,cls='')=>'<a class="'+cls+'" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+' '+arrow+'</a>';
export const bookLink=(lang,{service='',procedure='',master='',photo='',caption='',source='',label='',className='solid-button'}={})=>'<a class="'+className+'" href="#contact" data-open-booking data-service="'+esc(service)+'" data-procedure="'+esc(procedure)+'" data-master="'+esc(master)+'" data-photo="'+esc(photo)+'" data-caption="'+esc(caption)+'" data-photo-source="'+esc(source)+'">'+esc(label||ui[lang].book)+' '+arrow+'</a>';
export function procedureCatalogue(lang,slug){
 const t=ui[lang];
 return '<section class="procedure-section" id="procedures" aria-labelledby="procedures-title"><div class="procedure-heading"><h2 id="procedures-title">'+t.catalog+'</h2><p>'+t.included+'</p></div><div class="procedure-list">'+procedures.filter(p=>p.service===slug).map(p=>{
  const price=priceFor(p.id);
  return '<article class="procedure-card"><div><h3>'+p.name[lang]+'</h3><p>'+p.description[lang]+'</p><small>'+t.duration+'</small></div><div class="procedure-choice"><strong>'+esc(price?formatPrice(price,lang):t.priceRequest)+'</strong>'+bookLink(lang,{service:slug,procedure:p.id,className:'text-link'})+'</div></article>';
 }).join('')+'</div></section>';
}
export function helpSection(lang){
 const t=ui[lang];
 return '<section class="finder-section shell" id="finder"><div><h2>'+t.helpTitle+'</h2><p>'+t.helpIntro+'</p></div><a href="#contact" class="solid-button" data-open-finder>'+t.helpButton+' '+arrow+'</a></section>';
}
export function mastersSection(lang){
 const t=ui[lang];
 return '<section class="team-section shell" id="team" aria-labelledby="team-title"><div class="experience-heading"><h2 id="team-title">'+t.team+'</h2><p>'+t.teamIntro+'</p></div><div class="team-grid">'+masters.filter(m=>m.portrait).map(m=>'<article class="team-card"><div class="team-person"><img src="'+m.portrait+'" width="150" height="150" loading="lazy" decoding="async" alt="'+esc(m.name[lang])+', Klimt"><div><h3>'+m.name[lang]+'</h3><p>'+category(lang,m.service)+'</p></div></div><div class="team-actions">'+ext(m.source,t.masterWork,'text-link')+bookLink(lang,{service:m.service,master:m.id,label:t.masterBook,className:'text-link'})+'</div></article>').join('')+'</div></section>';
}
export function visitSection(lang){
 const t=ui[lang];
 return '<section class="visit-section" id="visit"><div class="shell visit-layout"><div class="visit-summary"><h2>'+t.visit+'</h2><p class="visit-address">'+texts[lang].address+'</p><p>'+t.hours+'</p></div><div class="visit-advice"><h3>'+t.visitBefore+'</h3><p>'+t.visitBeforeText+'</p><div class="visit-actions">'+ext(salon.maps.Google,t.route,'text-link')+bookLink(lang,{className:'text-link'})+'</div></div></div></section>';
}
export function reviewsSection(lang){
 const t=ui[lang],url='https://yandex.com/maps/org/klimt/76498610218/reviews/';
 return '<section class="reviews-section shell" id="reviews"><div class="experience-heading"><h2>'+t.reviews+'</h2><p>'+t.reviewsIntro+'</p></div><div class="review-grid">'+reviews.map(r=>'<article class="review-card"><p>'+esc(r.summary[lang])+'</p><footer><strong>'+esc(r.author)+'</strong><time datetime="'+r.date+'">'+new Intl.DateTimeFormat(lang,{year:'numeric',month:'long',day:'numeric',timeZone:'Asia/Yerevan'}).format(new Date(r.date+'T12:00:00Z'))+'</time>'+ext(r.source||url,t.reviewSource,'review-source')+'</footer></article>').join('')+'</div>'+ext(url,t.reviewAll,'text-link')+'</section>';
}
export function faqSection(lang){
 const t=ui[lang];
 return '<section class="faq-section shell" id="faq"><div class="experience-heading"><h2>'+t.faq+'</h2><p>'+t.faqIntro+'</p></div><div class="faq-list">'+faqItems.map(i=>'<details><summary>'+esc(i.q[lang])+'<span aria-hidden="true">+</span></summary><p>'+esc(i.a[lang])+'</p></details>').join('')+'</div></section>';
}
export function bookingExperience(lang){
 const t=ui[lang],services=slugList.map(slug=>({slug,name:category(lang,slug)}));
 const config={lang,base,origin:salon.origin,instagram:salon.instagram,phone:salon.phone,text:t,services,procedures:procedures.map(p=>({id:p.id,service:p.service,name:p.name[lang]})),masters:masters.map(m=>({id:m.id,service:m.service,name:m.name[lang]})),analytics:experienceConfig.analytics};
 const field=(name,label,input)=>'<label class="booking-field" for="booking-'+name+'"><span>'+label+'</span>'+input+'</label>';
 const input=(name,attrs)=>'<input id="booking-'+name+'" name="'+name+'" '+attrs+'>';
 const servicesOptions='<option value="">'+t.servicePrompt+'</option>'+services.map(s=>'<option value="'+s.slug+'">'+s.name+'</option>').join('');
 return '<dialog class="booking-dialog experience-dialog" id="booking-dialog" aria-labelledby="booking-title"><button class="dialog-close" type="button" data-close-dialog aria-label="'+t.close+'">×</button><div class="booking-form-view"><p class="eyebrow">Klimt Beauty House</p><h2 id="booking-title">'+t.bookingTitle+'</h2><p class="dialog-intro">'+t.bookingIntro+'</p><p class="booking-status">'+t.bookingStatus+'</p><form class="booking-form"><div class="booking-fields">'+
 field('service',t.service,'<select id="booking-service" name="service" required>'+servicesOptions+'</select>')+
 field('time',t.time,'<select id="booking-time" name="time"><option value="">'+t.anyTime+'</option>'+BOOKING_TIME_SLOTS.map(v=>'<option value="'+v+'">'+v+'</option>').join('')+'</select>')+
 '<label class="booking-field booking-wide" for="booking-comment"><span>'+t.comment+'</span><textarea id="booking-comment" name="comment" rows="3" maxlength="600" placeholder="'+t.commentHint+'"></textarea></label></div><p class="booking-selection" hidden></p><details class="booking-extras"><summary>'+t.moreOptions+'<span aria-hidden="true">+</span></summary><div class="booking-fields">'+
 field('procedure',t.procedure,'<select id="booking-procedure" name="procedure"></select>')+
 field('master',t.master,'<select id="booking-master" name="master"></select>')+
 field('date',t.date,input('date','type="date"'))+
 field('name',t.name,input('name','type="text" autocomplete="name" maxlength="80"'))+
 field('phone',t.phone,input('phone','type="tel" autocomplete="tel" inputmode="tel" maxlength="30"'))+
 '</div></details><figure class="booking-reference" hidden><img width="90" height="120" alt=""><figcaption><strong>'+t.reference+'</strong><p></p><button type="button" data-remove-reference>'+t.removeReference+'</button></figcaption></figure><p class="form-error" role="alert" hidden></p><div class="booking-submit"><button class="solid-button" type="submit">'+t.prepare+' '+arrow+'</button><a class="text-link" href="tel:'+salon.phone+'" data-track-call>'+t.call+' '+arrow+'</a></div><details class="privacy-note"><summary>'+t.privacy+'</summary><p>'+t.privacyText+'</p><p>'+t.privacyExternal+'</p></details></form></div><section class="booking-ready" hidden aria-labelledby="ready-title"><h2 id="ready-title" tabindex="-1">'+t.ready+'</h2><p>'+t.readyText+'</p><label for="booking-message">'+t.ready+'</label><textarea id="booking-message" rows="11" readonly></textarea><p class="copy-status" role="status" aria-live="polite"></p><p class="booking-status">'+t.sentNotice+'</p><div class="booking-ready-actions"><button class="solid-button" type="button" data-copy-message>'+t.copy+'</button>'+ext(salon.instagram,t.instagram,'text-link')+'<a class="text-link" href="tel:'+salon.phone+'" data-track-call>'+t.call+'</a><button class="text-link" type="button" data-edit-booking>'+t.edit+'</button></div></section></dialog>'+
 '<dialog class="finder-dialog experience-dialog" id="finder-dialog" aria-labelledby="finder-title"><button class="dialog-close" type="button" data-close-dialog aria-label="'+t.close+'">×</button><p class="eyebrow">Klimt Beauty House</p><h2 id="finder-title">'+t.quizTitle+'</h2><p class="finder-progress" aria-live="polite"></p><div class="finder-content"></div><div class="finder-actions"></div><p class="finder-note">'+t.quizNote+'</p></dialog>'+
 '<script type="application/json" id="klimt-experience-data">'+JSON.stringify(config).replace(/</g,'\\u003c')+'</script><noscript><p class="shell no-script">'+t.noScript+'</p></noscript>';
}
