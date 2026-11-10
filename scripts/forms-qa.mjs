import fs from "node:fs";
import assert from "node:assert/strict";
import { connect, delay, navigate } from "./cdp.mjs";
const c = await connect();
const requests = [];
const results = [];
let mode = "success";
const interceptionErrors = [];
await c.send("Network.setBlockedURLs", {
  urls: [
    "*google-analytics.com*",
    "*googletagmanager.com*",
    "*facebook.com/tr*",
    "*connect.facebook.net*",
    "*clarity.ms*",
  ],
});
c.on(async (m) => {
  if (m.method !== "Fetch.requestPaused") return;
  const { requestId, request } = m.params;
  try {
    const headers = [
      { name: "Access-Control-Allow-Origin", value: "*" },
      { name: "Access-Control-Allow-Headers", value: "Content-Type" },
      { name: "Access-Control-Allow-Methods", value: "POST, OPTIONS" },
    ];
    let body = "",
      status = 200,
      type = "application/json";
    if (request.url.includes("/recaptcha/api.js")) {
      type = "text/javascript";
      const callback = new URL(request.url).searchParams.get("onload");
      body = `window.grecaptcha={render:(node,options)=>{window.__qaCaptcha=options;node.textContent='Test-only security check';setTimeout(()=>options.callback('qa-captcha-token'),0);return 0;},reset:()=>{},getResponse:()=>'qa-captcha-token'};setTimeout(()=>window[${JSON.stringify(callback)}]?.(),0);`;
    } else if (request.method !== "OPTIONS") {
      requests.push({
        url: request.url,
        method: request.method,
        body: request.postData,
        mode,
      });
      if (request.url.includes("formsubmit.co")) {
        type = "text/html";
        body = "<h1>Intercepted form service response</h1>";
      } else {
        if (mode === "slow") await delay(500);
        if (mode === "failure") {
          status = 500;
          body = JSON.stringify({ error: "QA simulated server error" });
        } else body = JSON.stringify({ message: "QA simulated acceptance" });
      }
    }
    console.log("INTERCEPT", request.method, request.url.split("?")[0]);
    await c.send("Fetch.fulfillRequest", {
      requestId,
      responseCode: status,
      responseHeaders: [...headers, { name: "Content-Type", value: type }],
      body: Buffer.from(body).toString("base64"),
    });
  } catch (e) {
    interceptionErrors.push(String(e));
  }
});
await c.send("Fetch.enable", {
  patterns: [
    { urlPattern: "*recaptcha/api.js*" },
    { urlPattern: "https://api.sansahospital.com/*" },
    { urlPattern: "https://formsubmit.co/*" },
  ],
});
const fill = async (values) =>
  c.evaluate(
    `(()=>{for(const [name,value]of Object.entries(${JSON.stringify(values)})){const el=document.querySelector('form').elements.namedItem(name);const proto=el.tagName==='SELECT'?HTMLSelectElement.prototype:el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));}const consent=document.querySelector('form input[type=checkbox]');if(consent&&!consent.checked)consent.click();return true;})()`,
  );
const submit = () =>
  c.evaluate('document.querySelector("form").requestSubmit()');
const waitFor = async (expression) => {
  for (let i = 0; i < 300; i++) {
    if (await c.evaluate(expression)) return;
    await delay(100);
  }
  throw new Error("Timed out: " + expression);
};
await c.send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 950,
  deviceScaleFactor: 1,
  mobile: true,
});
await navigate(c, "http://127.0.0.1:5174/");
await waitFor("!!window.__qaCaptcha");
await fill({
  name: "QA Test",
  mobile: "1234567890",
  email: "qa@example.com",
  department: "gastroenterology",
});
await submit();
await delay(100);
assert.match(
  await c.evaluate("document.body.innerText"),
  /requires a Gmail address/,
);
assert.equal(requests.length, 0);
results.push("Home Gmail validation blocks invalid payload.");
await fill({ email: "qa@gmail.com" });
mode = "failure";
await submit();
await waitFor('!!document.querySelector("form [role=alert]")');
assert.match(
  await c.evaluate('document.querySelector("form [role=alert]").innerText'),
  /could not be sent/,
);
assert.equal(await c.evaluate("location.pathname"), "/");
results.push("API failure displays an error and does not show success.");
await c.evaluate('window.__qaCaptcha.callback("qa-captcha-token")');
await delay(50);
mode = "slow";
const before = requests.length;
await c.evaluate(
  'document.querySelector("form").requestSubmit();document.querySelector("form").requestSubmit()',
);
await waitFor('location.pathname==="/thank-you"');
assert.equal(requests.length, before + 1);
const payload = JSON.parse(requests.at(-1).body);
assert.deepEqual(Object.keys(payload).sort(), [
  "department",
  "email",
  "mobile",
  "name",
  "recaptchaToken",
]);
assert.equal(payload.department, "gastroenterology");
assert.match(
  await c.evaluate("document.body.innerText"),
  /Your request has been sent/,
);
results.push(
  "API exact contract, duplicate prevention and acknowledged success redirect pass.",
);
await navigate(c, "http://127.0.0.1:5174/derma-laser");
await waitFor("!!window.__qaCaptcha");
await fill({ name: "QA123", mobile: "1234567890", email: "qa@example.com" });
await submit();
await delay(50);
assert.match(await c.evaluate("document.body.innerText"), /letters and spaces/);
await fill({ name: "QA Test" });
mode = "success";
await submit();
await waitFor('location.pathname==="/thank-you"');
assert.equal(JSON.parse(requests.at(-1).body).department, "");
results.push(
  "Laser name validation and original empty-department payload preserved.",
);
await navigate(c, "http://127.0.0.1:5174/page");
await waitFor("!!window.__qaCaptcha");
await fill({
  name: "QA Test",
  mobile: "1234567890",
  email: "qa@example.com",
  department: "dermatology",
});
await submit();
await waitFor('location.pathname==="/thank-you"');
results.push("Legacy /page accepts non-Gmail email and keeps API integration.");
await navigate(c, "http://127.0.0.1:5174/Book-An-Appointment");
await fill({
  "First Name": "QA",
  "Last Name": "Test",
  Mobile: "1234567890",
  Email: "qa@example.com",
  Gender: "Others",
  Department: "Dermatology",
  "Preferred Date": "2027-12-01",
  "Preferred Time": "Morning",
});
await submit();
await waitFor('location.hostname==="formsubmit.co"');
const native = new URLSearchParams(requests.at(-1).body);
assert.deepEqual(
  [...native.keys()].sort(),
  [
    "First Name",
    "Last Name",
    "Mobile",
    "Email",
    "Gender",
    "Department",
    "Preferred Date",
    "Preferred Time",
    "_captcha",
    "_template",
    "_next",
  ].sort(),
);
assert.equal(native.get("_next"), "http://127.0.0.1:5174/thank-you");
results.push(
  "Native appointment exact field names, destination and thank-you redirect preserved.",
);
await navigate(c, "http://127.0.0.1:5174/contact");
await fill({
  name: "QA Test",
  email: "qa@example.com",
  department: "Gastroenterology",
  message: "Intercepted test only",
});
await submit();
await waitFor('location.hostname==="formsubmit.co"');
const enquiry = new URLSearchParams(requests.at(-1).body);
assert.deepEqual(
  [...enquiry.keys()].sort(),
  [
    "name",
    "email",
    "department",
    "message",
    "_captcha",
    "_template",
    "_next",
  ].sort(),
);
results.push(
  "Native contact field names and FormSubmit destination preserved.",
);
assert.deepEqual(interceptionErrors, []);
fs.writeFileSync(
  "docs/qa/form-results.json",
  JSON.stringify(
    {
      productionSubmissions: 0,
      captcha: "intercepted test stub; not live verification",
      results,
      requests,
    },
    null,
    2,
  ),
);
console.log(results.map((r) => "PASS " + r).join("\n"));
console.log("All requests intercepted; no appointments sent to production.");
c.close();
