import fs from 'node:fs';
import assert from 'node:assert/strict';
import {connect,navigate} from './cdp.mjs';
const original=JSON.parse(fs.readFileSync('src/data/original-content.json','utf8'));
const privacy=JSON.parse(fs.readFileSync('src/data/privacy.json','utf8'));
const c=await connect();const normalize=text=>text.replace(/\s+/g,' ').trim();const checks=[];
for(const [key,route]of Object.entries({gastro:'/Gastroenterology',liver:'/Hepatology',skin:'/Cosmetic-Dermatology',hair:'/Trichology'})){
 await navigate(c,'http://127.0.0.1:5173'+route);const text=normalize(await c.evaluate('document.querySelector("main").innerText'));
 assert.ok(text.includes(normalize(original[key].info.description)),key+' introduction');
 for(const card of original[key].cards)assert.ok(text.includes(normalize(card.description)),key+' '+card.title);
 checks.push(key+': full original introduction and all '+original[key].cards.length+' treatment descriptions');
}
await navigate(c,'http://127.0.0.1:5173/about/doctors');let text=normalize(await c.evaluate('document.querySelector("main").innerText'));
for(const doctor of original.doctors.doctors)for(const key of ['name','qualifications','description'])assert.ok(text.includes(normalize(doctor[key])),doctor.name+' '+key);checks.push('Both exact doctor names, qualifications and biographies');
await navigate(c,'http://127.0.0.1:5173/about/hospital');text=normalize(await c.evaluate('document.querySelector("main").innerText'));for(const card of [...original.facilities.hospitalCardContent,...original.values.aboutHospital])assert.ok(text.includes(normalize(card.description)),card.title);checks.push('Six original facility/care descriptions and all three vision/mission/values statements');
await navigate(c,'http://127.0.0.1:5173/derma-laser');await c.evaluate('document.querySelectorAll("details").forEach(d=>d.open=true)');text=normalize(await c.evaluate('document.querySelector("main").innerText'));for(const faq of original.faqs.questionsAndAnswers)assert.ok(text.includes(normalize(faq.answer)),faq.question);checks.push('All ten original laser FAQ answers');
await navigate(c,'http://127.0.0.1:5173/privacy-policy');text=normalize(await c.evaluate('document.querySelector("main").innerText'));for(const block of privacy)assert.ok(text.includes(normalize(block.text)),'Privacy clause missing');checks.push('All twenty original privacy-policy text blocks');
await navigate(c,'http://127.0.0.1:5173/gallery');assert.equal(await c.evaluate('document.querySelectorAll("main button[aria-label^=Enlarge]").length'),32);checks.push('All 32 original gallery photographs');
const inventory=fs.readFileSync('ASSET_INVENTORY.md','utf8');const paths=inventory.split('\n').filter(line=>line.startsWith('| ')&&!line.startsWith('| Filename')).map(line=>line.split('|')[2]?.trim()).filter(Boolean);for(const file of paths)assert.ok(fs.existsSync(file),'Original asset removed: '+file);checks.push('All '+paths.length+' inventoried original media files still exist');
fs.writeFileSync('docs/qa/content-results.json',JSON.stringify({checks},null,2));console.log(checks.map(check=>'PASS '+check).join('\n'));c.close();
