import fs from "node:fs";
import assert from "node:assert/strict";
import { connect, delay, navigate } from "./cdp.mjs";
const c = await connect();
const routes = JSON.parse(fs.readFileSync("src/data/routes.json", "utf8"));
const origin = process.env.SANSA_QA_ORIGIN || "http://127.0.0.1:5173";
const production = origin.includes(":5175");
const widths = production
  ? [1440, 390]
  : [1920, 1440, 1366, 1280, 1024, 768, 430, 390, 375, 360];
const results = [];
const exceptions = [];
const localErrors = [];
c.on((m) => {
  if (m.method === "Runtime.exceptionThrown")
    exceptions.push(
      m.params.exceptionDetails.exception?.description ||
        m.params.exceptionDetails.text,
    );
  if (
    m.method === "Network.responseReceived" &&
    m.params.response.url.startsWith(origin) &&
    m.params.response.status >= 400
  )
    localErrors.push({
      url: m.params.response.url,
      status: m.params.response.status,
    });
});
fs.mkdirSync("docs/qa", { recursive: true });
for (const [route, meta] of Object.entries(routes)) {
  await c.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await navigate(c, origin + route);
  await delay(250);
  await c.evaluate(
    'Promise.all([...document.images].map(i=>{i.loading="eager";return i.decode().catch(()=>{});})).then(()=>true)',
  );
  for (const width of widths) {
    await c.send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 950,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await delay(50);
    const result = await c.evaluate(
      `JSON.stringify({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('main h1').length,title:document.title,description:document.querySelector('meta[name="description"]')?.content,canonical:document.querySelector('link[rel="canonical"]')?.href,images:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),emptyLinks:[...document.querySelectorAll('a')].filter(a=>!a.getAttribute('href')).length})`,
    );
    const data = JSON.parse(result);
    results.push({ route, width, ...data });
    assert.equal(data.scrollWidth, data.width, route + " overflow at " + width);
    assert.equal(data.h1, 1, route + " needs one h1");
    assert.equal(data.title, meta.title);
    assert.equal(data.description, meta.description);
    assert.equal(data.canonical, "https://www.sansahospital.com" + route);
    assert.deepEqual(data.images, [], route + " broken images");
    assert.equal(data.emptyLinks, 0);
  }
  console.log("PASS", route, "at", widths.length, "viewport widths");
}
assert.deepEqual(exceptions, []);
assert.deepEqual(localErrors, []);
// Keyboard/lightbox and mobile navigation behavior.
await navigate(c, origin + "/gallery");
await c.evaluate(
  'document.querySelector("main button[aria-label^=Enlarge]").click()',
);
await delay(100);
assert.equal(await c.evaluate('document.querySelector("dialog").open'), true);
await c.send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight" });
await delay(50);
assert.match(
  await c.evaluate('document.querySelector("dialog p").innerText'),
  /2 \/ 32/,
);
await c.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape" });
await delay(50);
assert.equal(await c.evaluate('document.querySelector("dialog").open'), false);
assert.equal(
  await c.evaluate(
    'document.activeElement.matches("button[aria-label^=Enlarge]")',
  ),
  true,
);
await c.evaluate(
  'document.querySelector("button[aria-controls=main-navigation]").click()',
);
assert.equal(
  await c.evaluate(
    'getComputedStyle(document.querySelector("#main-navigation")).display',
  ),
  "flex",
);
await c.evaluate(
  'document.querySelector("button[aria-controls=speciality-navigation]").focus();document.querySelector("button[aria-controls=speciality-navigation]").click()',
);
assert.equal(
  await c.evaluate(
    'document.querySelectorAll("#speciality-navigation a").length',
  ),
  7,
);
await c.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape" });
await delay(100);
assert.equal(
  await c.evaluate(
    'document.querySelector("button[aria-controls=main-navigation]").getAttribute("aria-expanded")',
  ),
  "false",
);
for (const width of [1440, 390]) {
  await c.send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  await navigate(c, origin + "/");
  await delay(400);
  if (width === 390)
    assert.equal(
      await c.evaluate(
        'getComputedStyle(document.querySelector("[class*=mobileAction] a:last-child")).color',
      ),
      "rgb(255, 255, 255)",
    );
  const shot = await c.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  fs.writeFileSync(
    `docs/qa/home-${width}.png`,
    Buffer.from(shot.data, "base64"),
  );
}
// Contact sheet for visual inspection of every original WebP photograph.
await navigate(c, origin + "/gallery");
await c.send("Emulation.setDeviceMetricsOverride", {
  width: 1200,
  height: 1200,
  deviceScaleFactor: 1,
  mobile: false,
});
await c.evaluate(
  `document.querySelector('header').style.display='none';document.querySelector('footer').style.display='none';document.querySelector('main').innerHTML='<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px;padding:10px">'+[...document.querySelectorAll('main button[aria-label^=Enlarge] img')].map((i,n)=>'<div><img src="'+i.src+'" style="height:140px;width:180px;object-fit:cover"/><p style="font-size:11px">'+(n+1)+': '+i.src.split('/').pop().split('?')[0]+'</p></div>').join('')+'</div>';Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))).then(()=>true)`,
);
await delay(200);
const sheet = await c.send("Page.captureScreenshot", { format: "png" });
fs.writeFileSync(
  "docs/qa/gallery-contact-sheet.png",
  Buffer.from(sheet.data, "base64"),
);
fs.writeFileSync(
  production
    ? "docs/qa/production-results.json"
    : "docs/qa/responsive-results.json",
  JSON.stringify(
    {
      checks: results.length,
      exceptions,
      localErrors,
      lightbox: true,
      mobileNavigation: true,
      results,
    },
    null,
    2,
  ),
);
console.log(
  `PASS ${results.length} route/viewport checks, lightbox, focus restoration and mobile navigation.`,
);
c.close();
