import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const routes=JSON.parse(fs.readFileSync('src/data/routes.json','utf8'));
const decode=value=>value.replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>');
for(const [route,meta]of Object.entries(routes)){
 const html=fs.readFileSync(path.join('dist',route,'index.html'),'utf8');
 assert.equal(decode(html.match(/<title>([^<]*)<\/title>/)[1]),meta.title);
 assert.equal(decode(html.match(/<meta\s+name="description"\s+content="([^"]*)"/)[1]),meta.description);
 for(const [name,value]of Object.entries({'og:title':meta.title,'og:description':meta.description,'twitter:title':meta.title,'twitter:description':meta.description})){
  const match=html.match(new RegExp('<meta\\s+(?:name|property)="'+name+'"\\s+content="([^"]*)"'));
  assert.equal(decode(match[1]),value,'Initial '+name+' for '+route);
 }
 assert.ok(html.includes('https://www.sansahospital.com'+route));
 for(const id of ['AW-16486238727','fM1pCPWbgpoZEIeUoLU9','G-BHHJV6SPF7','3889613317984622','qxpgytcjju'])assert.ok(html.includes(id),'Tracking ID missing: '+id);
 assert.ok(!html.includes('aggregateRating'),'Unverified rating retained');
}
const sitemap=fs.readFileSync('dist/sitemap.xml','utf8');for(const [route,meta]of Object.entries(routes)){const included=sitemap.includes('<loc>https://www.sansahospital.com'+route+'</loc>');assert.equal(included,!meta.noindex,'Sitemap '+route);}
const robots=fs.readFileSync('dist/robots.txt','utf8');assert.ok(robots.includes('Disallow: /thank-you'));assert.ok(!robots.includes('Disallow: https:'));
const output={initialMetadataDocuments:Object.keys(routes).length,sitemapUrls:(sitemap.match(/<loc>/g)||[]).length,trackingIdsPreserved:5,unverifiedRatingsRemoved:true,robots:true};
fs.writeFileSync('docs/qa/static-results.json',JSON.stringify(output,null,2));console.log('PASS',JSON.stringify(output));
