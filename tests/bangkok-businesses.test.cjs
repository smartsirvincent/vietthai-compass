const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

function loadTs(file) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  }).outputText;
  vm.runInNewContext(source, { exports, require }, { filename: file });
  return exports;
}

test('Bangkok business additions are unique, categorized and attached to selectable transit stations', () => {
  const root = path.resolve(__dirname, '..');
  const { bangkokBusinessAdditions } = loadTs(path.join(root, 'data/bangkok-businesses.ts'));
  const { BANGKOK_TRANSIT_STATIONS, BANGKOK_TRANSIT_LINES } = loadTs(path.join(root, 'lib/bangkok-transit.ts'));
  const { BUSINESS_SUBCATEGORIES } = loadTs(path.join(root, 'lib/business-taxonomy.ts'));
  const slugs = new Set();
  const stationIds = new Set(BANGKOK_TRANSIT_STATIONS.map((station) => station.id));
  const lineStationIds = new Set(BANGKOK_TRANSIT_LINES.flatMap((line) => line.stations));

  assert.equal(bangkokBusinessAdditions.length, 30);
  for (const business of bangkokBusinessAdditions) {
    assert.ok(!slugs.has(business.slug), `duplicate slug: ${business.slug}`);
    slugs.add(business.slug);
    assert.equal(business.country, 'thailand');
    assert.equal(business.citySlug, 'bangkok');
    assert.ok(BUSINESS_SUBCATEGORIES[business.category]?.includes(business.subcategory), `invalid category for ${business.slug}`);
    assert.ok(business.transitStationIds?.length, `missing station for ${business.slug}`);
    for (const id of business.transitStationIds) {
      assert.ok(stationIds.has(id), `unknown station ${id} on ${business.slug}`);
      assert.ok(lineStationIds.has(id), `station ${id} is not selectable in the explorer`);
    }
  }
});
