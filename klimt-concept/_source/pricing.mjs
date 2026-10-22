// Prices are transcribed from attributable salon sources, never estimated.
export const priceSource={
 url:'https://www.instagram.com/stories/highlights/17976133787928243/',
 label:'Instagram · Klimt Beauty House',
 reviewed:'2026-10-21'
};
export const haircutSource='https://2gis.am/yerevan/firm/70000001095756244/tab/info';
export const priceGroups=[
 {slug:'hair',items:[
  {id:'hair-cut',name:{ru:'Женская стрижка',en:"Women's haircut",hy:'Կանացի կտրվածք'},amount:2000,from:true,source:haircutSource}
 ]},
 {slug:'nails',items:[]},
 {slug:'makeup',items:[
  {id:'makeup-day',name:{ru:'Повседневный макияж',en:'Everyday makeup',hy:'Ամենօրյա դիմահարդարում'},amount:10000},
  {id:'makeup-evening',name:{ru:'Вечерний макияж',en:'Evening makeup',hy:'Երեկոյան դիմահարդարում'},amount:12000},
  {id:'makeup-wedding',name:{ru:'Свадебный макияж',en:'Wedding makeup',hy:'Հարսանեկան դիմահարդարում'},amount:15000},
  {id:'makeup-base',name:{ru:'Только тон',en:'Foundation only',hy:'Միայն տոնային'},amount:6000},
  {id:'makeup-eyes',name:{ru:'Только макияж глаз',en:'Eye makeup only',hy:'Միայն աչքեր'},amount:6000},
  {id:'makeup-lashes',name:{ru:'Накладные ресницы',en:'False eyelash application',hy:'Թարթիչների տեղադրում'},amount:4000},
  {id:'makeup-early',name:{ru:'Доплата за запись до 09:00',en:'Appointment before 09:00 — surcharge',hy:'Հավելավճար՝ մինչև 09:00 գրանցվելու դեպքում'},amount:2000,surcharge:true}
 ]},
 {slug:'brows-lashes',items:[]},
 {slug:'cosmetology',items:[]},
 {slug:'elos',items:[]}
];
export const priceTexts={
 ru:{title:'Услуги и цены',nav:'Цены',intro:'Цены в армянских драмах. Стоимость остальных услуг уточняйте у администратора.',from:'от',onRequest:'Стоимость по запросу',unknown:'Стоимость и подробности уточняйте у администратора.',note:'Цены из опубликованных материалов салона. Актуальную стоимость и состав услуги уточните при записи.',source:'Прайс салона · Instagram',haircutSource:'Цена стрижки · 2ГИС',book:'Обсудить запись',category:'Цены на услуги'},
 en:{title:'Services & prices',nav:'Prices',intro:'Prices are in Armenian drams. Please ask our administrator about other services.',from:'from',onRequest:'Price on request',unknown:'Please ask our administrator for prices and service details.',note:'Prices are taken from published salon information. Confirm current prices and what is included when booking.',source:'Salon price list · Instagram',haircutSource:'Haircut price · 2GIS',book:'Arrange a visit',category:'Service prices'},
 hy:{title:'Ծառայություններ և գներ',nav:'Գներ',intro:'Գները նշված են ՀՀ դրամով։ Մյուս ծառայությունների արժեքը ճշտեք ադմինիստրատորի հետ։',from:'սկսած',onRequest:'Արժեքը՝ հարցմամբ',unknown:'Արժեքն ու ծառայության մանրամասները ճշտեք ադմինիստրատորի հետ։',note:'Գները վերցված են սրահի հրապարակված նյութերից։ Գրանցվելիս ճշտեք գործող արժեքն ու ծառայության մեջ ներառվածը։',source:'Սրահի գնացուցակը · Instagram',haircutSource:'Կտրվածքի գինը · 2GIS',book:'Պայմանավորվել այցի մասին',category:'Ծառայությունների գներ'}
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>new Intl.NumberFormat('en-US').format(n).replaceAll(',','\u202f');
export function formatPrice(item,lang){
 if(item.amount==null)return priceTexts[lang].onRequest;
 const value=(item.surcharge?'+ ':'')+number(item.amount)+(item.max?'–'+number(item.max):'')+' ֏';
 return item.from?(lang==='hy'?value+'-ից':priceTexts[lang].from+' '+value):value;
}
export function priceRows(slug,lang){
 const group=priceGroups.find(group=>group.slug===slug);
 return (group?.items||[]).map(item=>`<div class="price-row"><dt>${esc(item.name[lang])}${item.note?`<small>${esc(item.note[lang])}</small>`:''}${!item.surcharge?`<a href="#contact" data-open-booking data-service="${esc(slug)}" data-procedure="${esc(item.id)}">${priceTexts[lang].book} ↗</a>`:''}</dt><dd>${esc(formatPrice(item,lang))}</dd></div>`).join('');
}
const sources=(lang,slug)=>`<div class="price-sources">${slug!=='hair'?`<a href="${priceSource.url}" target="_blank" rel="noopener noreferrer">${priceTexts[lang].source} ↗</a>`:''}${!slug||slug==='hair'?`<a href="${haircutSource}" target="_blank" rel="noopener noreferrer">${priceTexts[lang].haircutSource} ↗</a>`:''}</div>`;
export function priceSection(lang,services){
 const p=priceTexts[lang],groups=priceGroups.map((g,i)=>({...g,title:services[i][0]})).filter(g=>g.items.length);
 return `<section class="prices-section shell" id="prices" aria-labelledby="prices-title"><div class="prices-heading"><h2 id="prices-title">${p.title}</h2><p>${p.intro}</p></div><div class="price-groups">${groups.map((group,i)=>`<details class="price-group" ${i===0?'open':''}><summary><span>${group.title}</span><span class="price-disclosure" aria-hidden="true">+</span></summary><dl class="price-list">${priceRows(group.slug,lang)}</dl></details>`).join('')}</div><div class="price-footnote"><p>${p.note}</p>${sources(lang)}</div><a class="text-link" href="#contact" data-open-booking>${p.book} <span aria-hidden="true">↗</span></a></section>`;
}
export function servicePrices(slug,lang){
 const rows=priceRows(slug,lang),p=priceTexts[lang];
 if(!rows)return `<p class="service-price">${p.unknown}</p>`;
 return `<section class="service-prices" id="prices" aria-label="${p.category}"><h2>${p.category}</h2><dl class="price-list">${rows}</dl><p>${p.note}</p>${sources(lang,slug)}</section>`;
}
