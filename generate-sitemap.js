import { SitemapStream, streamToPromise } from "sitemap";
import { readFile, writeFile } from "node:fs/promises";
const routes = JSON.parse(
  await readFile(new URL("./src/data/routes.json", import.meta.url), "utf8"),
);
const sitemap = new SitemapStream({
  hostname: "https://www.sansahospital.com",
});
for (const [url, meta] of Object.entries(routes))
  if (!meta.noindex)
    sitemap.write({
      url,
      changefreq: "monthly",
      priority: url === "/" ? 1 : 0.7,
    });
sitemap.end();
await writeFile(
  new URL("./public/sitemap.xml", import.meta.url),
  await streamToPromise(sitemap),
);
console.log("Sitemap generated for all indexable existing routes.");
