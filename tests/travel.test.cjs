const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(code, { exports, require, URLSearchParams });
  return exports;
}
const { cleanExploreQuery, resolveDestination, inDestination, destinationHref } = load('lib/explore.ts');
const { matchesSearch, locationTerms, resultPage } = load('lib/search.ts');
const { articleOutline } = load('lib/article-outline.ts');
const cities = [
  { slug: 'hcm', name: '胡志明市', nameEn: 'Ho Chi Minh City', country: 'vietnam', districts: [{ slug: 'd1', name: '第一郡', nameEn: 'District 1' }] },
  { slug: 'bangkok', name: '曼谷', nameEn: 'Bangkok', country: 'thailand', districts: [] }
];
test('country filters reject unrelated cities and districts', () => {
  const result = resolveDestination({ country: 'thailand', city: 'hcm', district: 'd1' }, cities);
  assert.equal(result.country, 'thailand'); assert.equal(result.city, undefined); assert.equal(result.district, undefined);
});
test('repeated query parameters cannot crash public search pages', () => {
  assert.equal(cleanExploreQuery({ q: [' cafe ', 'other'] }).q, 'cafe');
  assert.equal(cleanExploreQuery({ q: 'a'.repeat(500) }).q.length, 200);
});
test('city selection infers country and excludes unknown-location articles', () => {
  const result = resolveDestination({ city: 'hcm', district: 'd1' }, cities);
  assert.equal(result.country, 'vietnam');
  assert.equal(inDestination({ citySlug: 'hcm', districtSlug: 'd1' }, result, cities), true);
  assert.equal(inDestination({}, result, cities), false);
  assert.equal(inDestination({ citySlug: 'bangkok' }, result, cities), false);
});
test('destination links preserve country, city and district', () => {
  assert.equal(destinationHref('/restaurants', cities[0], 'd1'), '/restaurants?country=vietnam&city=hcm&district=d1');
});
test('search ignores Vietnamese accents, case and fullwidth text', () => {
  assert.equal(matchesSearch(['Lacàph Coffees of Việt Nam'], 'LACAPH viet nam'), true);
  assert.equal(matchesSearch(['Đà Nẵng'], 'Da Nang'), true);
  assert.equal(matchesSearch(['臺灣 cafe'], '台灣 ＣＡＦＥ'), true);
  assert.equal(matchesSearch(['Lacàph'], 'unrelated'), false);
});
test('search combines Chinese location names and business names', () => {
  const terms = locationTerms({ citySlug: 'hcm', districtSlug: 'd1' }, cities);
  assert.equal(matchesSearch(['Lacàph', ...terms], '胡志明市 lacaph'), true);
  assert.equal(matchesSearch(terms, '第一郡'), true);
});
test('pagination clamps invalid requests and empty result sets', () => {
  assert.equal(resultPage('-1', 36).page, 1);
  assert.equal(resultPage('1000', 36).page, 3);
  assert.equal(resultPage('abc', 36).page, 1);
  assert.equal(resultPage('2', 0).page, 1);
  assert.equal(resultPage('2', 36).start, 12);
});
test('HTML and Markdown outlines provide unique stable anchors', () => {
  const html = articleOutline('<h1>介紹</h1><h2>特色 <strong>餐點</strong></h2><h3>特色</h3>');
  assert.equal(html.length, 3); assert.equal(html[0].level, 2); assert.equal(html[1].text, '特色 餐點');
  assert.equal(new Set(html.map(item => item.id)).size, 3);
  const md = articleOutline('# 介紹\n文字\n## 特色\n### 餐點');
  assert.equal(md[2].id, 'article-section-3'); assert.equal(md[2].level, 3);
});
test('legacy paragraph-sized headings and empty headings do not clutter the outline', () => {
  const outline = articleOutline(`<h2>介紹</h2><h1>${'長段落'.repeat(60)}</h1><h3> </h3><h2>交通</h2>`);
  assert.equal(outline.length, 2);
  assert.equal(outline[1].id, 'article-section-4');
});
