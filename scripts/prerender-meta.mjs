import fs from "node:fs";
import path from "node:path";
const routes = JSON.parse(fs.readFileSync("src/data/routes.json", "utf8"));
const base = fs.readFileSync("dist/index.html", "utf8");
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
for (const [route, meta] of Object.entries(routes)) {
  let html = base.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escape(meta.title)}</title>`,
  );
  for (const [name, content] of Object.entries({
    description: meta.description,
    robots: meta.noindex ? "noindex, follow" : "index, follow",
    "og:title": meta.title,
    "og:description": meta.description,
    "og:url": "https://www.sansahospital.com" + route,
    "twitter:title": meta.title,
    "twitter:description": meta.description,
  })) {
    const expression = new RegExp(
      `(<meta\\s+(?:name|property)="${name}"\\s+content=")[^"]*("\\s*\\/?>)`,
    );
    if (!expression.test(html)) throw new Error(`Missing ${name} metadata in the HTML template`);
    html = html.replace(expression, (_, start, end) => start + escape(content) + end);
  }
  html = html.replace(
    /(<link\s+rel="canonical"\s+href=")[^"]*/,
    `$1https://www.sansahospital.com${route}`,
  );
  const target = path.join("dist", route, "index.html");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, html);
}
console.log(
  `Generated initial SEO metadata for ${Object.keys(routes).length} route documents.`,
);
