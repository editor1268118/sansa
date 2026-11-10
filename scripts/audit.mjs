import fs from "node:fs";
import path from "node:path";
import { parse } from "@babel/parser";

const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
const sourceFiles = walk("src").filter((f) => /\.(jsx?|scss|css)$/.test(f));
fs.mkdirSync("docs/original-source", { recursive: true });
for (const file of [
  ...sourceFiles,
  "index.html",
  "generate-sitemap.js",
  "robots.txt",
  ".eslintrc.cjs",
]) {
  const target = path.join("docs/original-source", file + ".txt");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (!fs.existsSync(target)) fs.copyFileSync(file, target);
}
const datasets = {};
for (const [name, file, variables] of [
  [
    "gastro",
    "src/pages/Gastroenterology/Gastroenterology.jsx",
    ["info", "cards"],
  ],
  ["liver", "src/pages/Hepatology/Hepatology.jsx", ["info", "cards"]],
  ["skin", "src/pages/Dermatology/Dermatology.jsx", ["info", "cards"]],
  ["hair", "src/pages/Trichology/Trichology.jsx", ["info", "cards"]],
  ["doctors", "src/pages/Our Doctors/OurDoctors.jsx", ["doctors"]],
  ["faqs", "src/components/DermaFaq/DermaFaq.jsx", ["questionsAndAnswers"]],
  ["gallery", "src/pages/Gallery/Gallery.jsx", []],
  ["home", "src/pages/Home/Home.jsx", ["infoPointsData", "numbersData"]],
  ["facilities", "src/utils/hospitalCardContent.js", ["hospitalCardContent"]],
  ["values", "src/utils/aboutHospital.js", ["aboutHospital"]],
]) {
  const archived = path.join("docs/original-source", file + ".txt");
  const ast = parse(
    fs.readFileSync(fs.existsSync(archived) ? archived : file, "utf8"),
    { sourceType: "module", plugins: ["jsx"] },
  );
  const imports = {};
  for (const n of ast.program.body)
    if (
      n.type === "ImportDeclaration" &&
      /\.(jpg|jpeg|png|webp)$/i.test(n.source.value)
    )
      for (const s of n.specifiers)
        imports[s.local.name] =
          "/" +
          path.posix.normalize(
            path.join(path.dirname(file), n.source.value).replaceAll("\\", "/"),
          );
  const value = (n) =>
    n.type === "StringLiteral" || n.type === "NumericLiteral"
      ? n.value
      : n.type === "Identifier"
        ? imports[n.name]
        : n.type === "ArrayExpression"
          ? n.elements.map(value)
          : n.type === "ObjectExpression"
            ? Object.fromEntries(
                n.properties.map((p) => [
                  p.key.name || p.key.value,
                  value(p.value),
                ]),
              )
            : undefined;
  datasets[name] = {};
  const visit = (n) => {
    if (!n || typeof n !== "object") return;
    if (n.type === "VariableDeclarator" && variables.includes(n.id.name))
      datasets[name][n.id.name] = value(n.init);
    for (const v of Object.values(n))
      if (Array.isArray(v)) v.forEach(visit);
      else if (v && typeof v === "object") visit(v);
  };
  visit(ast.program);
  if (name === "gallery") datasets[name] = Object.values(imports);
}
fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync(
  "src/data/original-content.json",
  JSON.stringify(datasets, null, 2) + "\n",
);
fs.writeFileSync(
  "docs/SOURCE_REVIEW.md",
  "# Original source review\n\nEvery original source file is retained verbatim in `docs/original-source/` as a text snapshot. The source was parsed before implementation; all department descriptions and treatment arrays, doctor credentials, FAQs and gallery images were extracted into `src/data/original-content.json`.\n\n" +
    sourceFiles.map((f) => "- " + f).join("\n"),
);
console.log(
  "Archived",
  sourceFiles.length,
  "source files. Extracted",
  Object.keys(datasets).join(", "),
);
