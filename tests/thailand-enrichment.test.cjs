const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const baseline = require('../data/thailand-business-baseline.json');
const copy = require('../data/thailand-business-copy.json');
const additions = require('../data/thailand-transit-additions.json');
const pictures = require('../data/thailand-business-images.json');
function load(file) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  vm.runInNewContext(source, { exports, Date, require: name => {
    if (name.startsWith('@/')) return require(path.resolve(name.slice(2)));
    if (name.startsWith('./')) return load(path.join('lib', name + '.ts'));
    return require(name);
  } });
  return exports;
}
const apply = load('lib/thailand-enrichment.ts').applyThailandEnrichment;
function fixture() {
  return {
    articles: [{ slug: 'original', country: 'vietnam', content: 'unchanged' }],
    settings: { logoImage: 'existing-logo', custom: 'keep' },
    cities: [{ slug: 'bangkok', country: 'thailand', districts: ['sukhumvit', 'silom-sathorn', 'talat-noi', 'yaowarat', 'nana-old-town'].map(slug => ({ slug, name: slug, summary: 'original' })) }, { slug: 'hanoi', country: 'vietnam', image: 'custom-hanoi.jpg', districts: [] }],
    businesses: [{ slug: 'viet-cafe', country: 'vietnam', description: 'do not normalize', unknown: true }, ...Object.entries(baseline).map(([slug,b]) => ({ slug, country: 'thailand', ...b, socials: { phone: 'keep' }, review: 'keep review', badges: ['keep tag'] }))]
  };
}
test('65 introductions exceed 500 characters; all 20 additions have licensed local photos and valid stations', () => {
  assert.equal(Object.keys(copy).length, 65);
  assert.equal(additions.length, 20);
  for (const text of Object.values(copy)) assert.ok(Array.from(text.replace(/\s/g, '')).length >= 500);
  const { isBangkokTransitStationId } = load('lib/bangkok-transit.ts');
  for (const entry of additions) {
    assert.ok(pictures[entry.slug]);
    assert.ok(entry.transitStationIds.every(isBangkokTransitStationId));
  }
  for (const p of Object.values(pictures)) {
    assert.ok(fs.existsSync('public' + p.image));
    assert.match(p.imageCredit, /CC/);
    assert.match(p.imageSource, /^https:\/\/commons.wikimedia.org\/wiki\/File:/);
  }
});
test('Thailand import preserves Vietnam byte-for-byte, articles, settings, contacts, reviews and tags', () => {
  const content = fixture();
  const before = structuredClone(content);
  const result = apply(content);
  assert.equal(result.updated, 45);
  assert.equal(result.added, 20);
  assert.equal(result.images, 36);
  assert.equal(result.conflicts.length, 0);
  assert.equal(JSON.stringify(content.businesses[0]), JSON.stringify(before.businesses[0]));
  assert.equal(JSON.stringify(content.cities[1]), JSON.stringify(before.cities[1]));
  assert.deepEqual(content.settings, before.settings);
  assert.deepEqual(content.articles, before.articles);
  assert.deepEqual(content.businesses[1].socials, before.businesses[1].socials);
  assert.equal(content.businesses[1].review, before.businesses[1].review);
  assert.deepEqual(content.businesses[1].badges, before.businesses[1].badges);
  for (const b of content.businesses.filter(b=>b.country==='thailand')) assert.ok(b.description.replace(/\s/g,'').length>=500);
});
test('repeating the batch does not overwrite later edits or add duplicate businesses', () => {
  const content = fixture(); apply(content);
  const first = content.businesses[1]; first.description = 'editor update'; first.image = 'https://editor/photo.jpg';
  const before = JSON.stringify(content);
  const result = apply(content);
  assert.equal(result.updated, 0); assert.equal(result.added, 0);
  assert.equal(JSON.stringify(content), before);
  assert.ok(result.conflicts.includes(first.slug + ':description'));
});
test('concurrent photo and introduction changes are retained independently', () => {
  const content=fixture(); const b=content.businesses.find(b=>b.slug==='terminal-21-asok');
  b.image='https://editor/new.jpg'; b.description='New manual copy';
  const result=apply(content);
  assert.equal(b.image,'https://editor/new.jpg'); assert.equal(b.description,'New manual copy');
  assert.ok(result.conflicts.includes(b.slug+':image')); assert.ok(result.conflicts.includes(b.slug+':description'));
});
