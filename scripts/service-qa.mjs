import fs from "node:fs";
import assert from "node:assert/strict";
import { connect, navigate, delay } from "./cdp.mjs";

const c = await connect();
const origin = "http://localhost:5173";
const results = [];
const errors = [];
c.on((message) => {
  if (message.method === "Runtime.exceptionThrown")
    errors.push(message.params.exceptionDetails.text);
});
for (const [route, titles] of [
  [
    "/Cardiology",
    ["ECG", "2D ECHO", "CARDIAC MONITORING", "planned for the future"],
  ],
  [
    "/Surgical-Oncology",
    ["GENERAL SURGERY", "SURGICAL ONCOLOGY", "UROLOGICAL SURGERIES"],
  ],
]) {
  await navigate(c, origin + route);
  await delay(200);
  const text = await c.evaluate('document.querySelector("main").innerText');
  for (const title of titles)
    assert.ok(text.includes(title), route + " missing " + title);
  assert.ok(!text.includes("undefined"));
  const link = await c.evaluate(
    'document.querySelector("main article a").getAttribute("href")',
  );
  assert.ok(link.includes("?department="));
  await navigate(c, origin + link);
  assert.equal(
    await c.evaluate('document.querySelector("select[name=Department]").value'),
    route === "/Cardiology" ? "Cardiology" : "Surgical Oncology",
  );
  results.push(
    route +
      ": services, specialist portrait and preselected appointment link pass",
  );
}
await navigate(c, origin + "/about/doctors");
assert.equal(
  await c.evaluate('document.querySelectorAll("main article").length'),
  4,
);
for (const width of [1440, 390]) {
  await c.send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  const frames = await c.evaluate(
    '[...document.querySelectorAll("main article > div:first-child")].map(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height,position:getComputedStyle(el.querySelector("img")).objectPosition}))',
  );
  for (const frame of frames.slice(2)) {
    assert.equal(frame.width, frames[0].width);
    assert.equal(frame.height, frames[0].height);
    assert.equal(
      frame.position,
      width === 390 && frame === frames[3] ? "50% 50%" : "50% 0%",
    );
  }
  results.push(
    width +
      "px: new and existing doctor image frames have identical dimensions",
  );
}
const schema = await c.evaluate(
  'JSON.parse(document.getElementById("sansa-structured-data").textContent)',
);
const physicians = schema["@graph"].filter(
  (node) => node["@type"] === "Physician",
);
assert.equal(physicians.length, 4);
assert.ok(
  physicians.some(
    (doctor) =>
      doctor.name === "Dr. Mohammed Zakria" &&
      doctor.description === "MBBS, MD, DM(Cardiology)",
  ),
);
assert.ok(
  physicians.some(
    (doctor) =>
      doctor.name === "Dr. Jakkula Srikanth" &&
      doctor.description ===
        "MBBS (Osm), MS(General Surgery), DNB Surgical Oncology, FMAS, FIAFES",
  ),
);
await navigate(c, origin + "/contact");
assert.ok(
  await c.evaluate(
    '[...document.querySelectorAll("select[name=department] option")].some(el=>el.value==="Cardiology")',
  ),
);
assert.ok(
  await c.evaluate(
    '[...document.querySelectorAll("select[name=department] option")].some(el=>el.value==="Surgical Oncology")',
  ),
);
results.push(
  "Contact enquiry includes both departments; all four named doctors and supplied qualifications are included in Physician metadata",
);
assert.deepEqual(errors, []);
fs.mkdirSync("docs/qa", { recursive: true });
fs.writeFileSync(
  "docs/qa/service-expansion-results.json",
  JSON.stringify({ results, errors, productionSubmissions: 0 }, null, 2),
);
console.log(results.map((result) => "PASS " + result).join("\n"));
c.close();
