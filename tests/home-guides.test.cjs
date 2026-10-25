const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");

const moduleExports = {};
const source = ts.transpileModule(fs.readFileSync("lib/home-guides.ts", "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
}).outputText;
vm.runInNewContext(source, { exports: moduleExports });

const articles = [
  { slug: "older-pick", publishedAt: "2026-09-01", updatedAt: "2026-10-20", editorPick: true },
  { slug: "newer-pick", publishedAt: "2026-10-22", updatedAt: "2026-10-22", editorPick: true },
  { slug: "recent", publishedAt: "2026-10-23", updatedAt: "2026-10-23" },
  { slug: "third-pick", publishedAt: "2026-10-21", updatedAt: "2026-10-21", editorPick: true },
  { slug: "fourth-pick", publishedAt: "2026-08-01", updatedAt: "2026-10-24", editorPick: true }
];

test("editor picks show only three checked guides, newest publication first", () => {
  assert.deepEqual(Array.from(moduleExports.homeEditorPicks(articles), article => article.slug),
    ["newer-pick", "third-pick", "older-pick"]);
  assert.deepEqual(Array.from(articles, article => article.slug),
    ["older-pick", "newer-pick", "recent", "third-pick", "fourth-pick"]);
});

test("until an editor selects guides, the latest three fill the homepage", () => {
  const unselected = articles.map(article => ({ ...article, editorPick: false }));
  assert.deepEqual(Array.from(moduleExports.homeEditorPicks(unselected), article => article.slug),
    ["recent", "newer-pick", "third-pick"]);
});

test("popular guides use real view counts, with publication date breaking ties", () => {
  const counts = new Map([["older-pick", 7], ["newer-pick", 21], ["recent", 0], ["third-pick", 21], ["fourth-pick", 2]]);
  assert.deepEqual(Array.from(moduleExports.homePopularGuides(articles, counts), article => article.slug),
    ["newer-pick", "third-pick", "older-pick"]);
  assert.deepEqual(Array.from(moduleExports.homePopularGuides(articles, new Map()), article => article.slug),
    ["recent", "newer-pick", "third-pick"]);
});

test("article form persists the editor-pick checkbox", () => {
  const form = fs.readFileSync("app/admin/articles/page.tsx", "utf8");
  assert.match(form, /name="editorPick" defaultChecked=\{editing\?\.editorPick === true\}/);
  assert.match(form, /editorPick: formData\.get\("editorPick"\) === "on"/);
});
