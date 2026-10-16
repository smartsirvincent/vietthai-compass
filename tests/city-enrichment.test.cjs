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

test('new destination guides have complete weather, season, trip length, districts and working images', () => {
  const root = path.resolve(__dirname, '..');
  const { additionalCityGuides } = loadTs(path.join(root, 'data/city-enrichment.ts'));
  const slugs = new Set();

  assert.equal(additionalCityGuides.length, 7);
  for (const city of additionalCityGuides) {
    assert.ok(!slugs.has(city.slug), `duplicate city: ${city.slug}`);
    slugs.add(city.slug);
    assert.ok(city.bestSeason.trim(), `missing best season: ${city.slug}`);
    assert.ok(city.weather.trim(), `missing weather: ${city.slug}`);
    assert.ok(city.recommendedDays.trim(), `missing trip length: ${city.slug}`);
    assert.ok(city.districts.length >= 2, `missing district guide: ${city.slug}`);
    assert.ok(fs.existsSync(path.join(root, 'public', city.image)), `missing city image: ${city.slug}`);
  }
});

test('city climate backfill fills only empty climate fields and preserves editor content', () => {
  const root = path.resolve(__dirname, '..');
  const { fillMissingCityClimate } = loadTs(path.join(root, 'lib/city-climate.ts'));
  const existing = {
    slug: 'hanoi', name: '河內', bestSeason: '', weather: '自訂天氣文字', recommendedDays: '自訂天數',
    summary: '管理者已編輯的城市介紹', image: '/custom.webp', districts: [{ slug: 'existing', name: '保留分區', summary: '保留' }]
  };
  const reference = { bestSeason: '9 月至 11 月', weather: '參考天氣', recommendedDays: '3-5 天' };
  const result = fillMissingCityClimate(existing, reference);

  assert.equal(result.bestSeason, '9 月至 11 月');
  assert.equal(result.weather, '自訂天氣文字');
  assert.equal(result.recommendedDays, '自訂天數');
  assert.equal(result.summary, existing.summary);
  assert.equal(result.image, existing.image);
  assert.deepEqual(result.districts, existing.districts);
});
