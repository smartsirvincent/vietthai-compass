const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const photoCatalog = require("../data/thailand-20-photo-catalog.json");

function load(file, imports = {}) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true }
  }).outputText;
  vm.runInNewContext(source, { exports, structuredClone, require: name => {
    if (!(name in imports)) throw new Error(`Unexpected import ${name}`);
    return imports[name];
  } });
  return exports;
}

const data = load("data/thailand-20-businesses.ts", { "./thailand-20-photo-catalog.json": photoCatalog });
const transit = load("lib/bangkok-transit.ts");
const taxonomy = load("lib/business-taxonomy.ts");
const importer = load("lib/thailand-20-import.ts", {
  "@/data/thailand-20-businesses": data,
  "./bangkok-transit": transit,
  "./business-taxonomy": taxonomy
});

test("all 20 new Thailand listings have distinct licensed photos and 500 Chinese characters", () => {
  const batch = data.thailandTwentyBusinesses;
  assert.equal(batch.length, 20);
  assert.equal(new Set(batch.map(item => item.slug)).size, 20);
  assert.equal(batch.filter(item => item.category === "餐廳美食").length, 15);
  assert.equal(batch.filter(item => item.category === "景點行程").length, 5);
  assert.equal(new Set(batch.map(item => item.imageSource)).size, 20);
  for (const item of batch) {
    assert.equal(item.country, "thailand");
    assert.ok((item.description.match(/\p{Script=Han}/gu) || []).length >= 500, item.slug);
    assert.ok(taxonomy.isBusinessSubcategory(item.category, item.subcategory), item.slug);
    assert.ok(item.imageSource.startsWith("https://commons.wikimedia.org/wiki/File:"), item.slug);
    assert.match(item.imageCredit, /CC/);
    assert.ok(fs.statSync(path.join("public", item.image)).size > 10000, item.slug);
    assert.ok(item.googleMapUrl.startsWith("https://www.google.com/maps/search/"));
    assert.ok(data.thailandTwentyResearchSources[item.slug].startsWith("https://"));
    assert.ok((item.transitStationIds || []).every(transit.isBangkokTransitStationId));
    assert.ok(["CC0", "CC BY 4.0", "CC BY-SA 3.0", "CC BY-SA 4.0"].includes(photoCatalog[item.slug].license));
  }
});

test("import adds 20 once while preserving existing merchants, Vietnam and site content", () => {
  const existing = { slug: "existing-thai", name: "Edited shop", country: "thailand", description: "Manual text", isActive: false };
  const vietnam = { slug: "existing-vietnam", name: "Vietnam shop", country: "vietnam", description: "Keep" };
  const content = {
    cities: [
      { slug: "bangkok", country: "thailand", districts: [{ slug: "yaowarat", name: "Custom district" }] },
      { slug: "chiang-mai", country: "thailand", districts: [{ slug: "nimman", name: "Custom Nimman" }] },
      { slug: "hanoi", country: "vietnam", districts: [] }
    ],
    businesses: [existing, vietnam],
    articles: [{ slug: "original" }],
    settings: { siteName: "Existing brand" }
  };
  const before = JSON.stringify([existing, vietnam, content.cities[2], content.articles, content.settings]);
  const result = importer.applyThailandTwentyImport(content);
  assert.equal(result.added.length, 20);
  assert.equal(content.businesses.length, 22);
  assert.equal(content.cities[0].districts[0].name, "Custom district");
  assert.equal(content.cities[1].districts[0].name, "Custom Nimman");
  assert.equal(JSON.stringify([existing, vietnam, content.cities[2], content.articles, content.settings]), before);
  const once = JSON.stringify(content);
  const again = importer.applyThailandTwentyImport(content);
  assert.equal(again.added.length, 0);
  assert.equal(again.skipped.length, 20);
  assert.equal(again.districts, 0);
  assert.equal(JSON.stringify(content), once);
});

test("admin import uses existing authenticated transactional edit flow", () => {
  const store = fs.readFileSync("lib/cms-store.ts", "utf8");
  const page = fs.readFileSync("app/admin/thailand-update/page.tsx", "utf8");
  assert.match(store, /export async function importThailandTwentyBusinesses\(\)[\s\S]*?mutateCmsContent[\s\S]*?false, false/);
  assert.match(page, /async function addThailandTwenty\(\)[\s\S]*?await requireAdminRole\(\)/);
});
