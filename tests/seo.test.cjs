const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const compiled = ts.transpileModule(fs.readFileSync('lib/seo.ts', 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
}).outputText;
function seo(env = {}) {
  const exports = {};
  vm.runInNewContext(compiled, { exports, process: { env }, URL });
  return exports;
}
test('canonical origin defaults to the live site and supports a custom domain', () => {
  assert.equal(seo().absoluteUrl('/cities/bangkok'), 'https://vietthaiguide.com/cities/bangkok');
  assert.equal(seo({ NEXT_PUBLIC_SITE_URL: 'https://example.com/' }).absoluteUrl('/'), 'https://example.com/');
});
test('Vietnamese paths are encoded and external images remain absolute', () => {
  assert.equal(seo().absoluteUrl('/directory/Lacàph Nam'), 'https://vietthaiguide.com/directory/Lac%C3%A0ph%20Nam');
  assert.equal(seo().absoluteUrl('https://res.cloudinary.com/photo.jpg'), 'https://res.cloudinary.com/photo.jpg');
});
test('article schema does not fabricate a publication date from the modification date', () => {
  const value = seo().articleJsonLd({ slug: 'test', title: 'Title', excerpt: 'Summary', coverImage: '/test.jpg', updatedAt: '2026-10-10', keywords: [] });
  assert.equal(value.datePublished, undefined);
  assert.equal(value.dateModified, '2026-10-10');
});

test('publisher uses only confirmed identity and safely encodes script content', () => {
  const identity = seo().organizationJsonLd({ siteName: 'Custom', officialProfiles: ['https://facebook.com/real', 'javascript:alert(1)'], contactEmail: 'owner@example.com' });
  assert.equal(identity.name, 'Custom');
  assert.equal(identity['@id'], 'https://vietthaiguide.com/#organization');
  assert.equal(identity.sameAs.length, 1);
  assert.ok(identity.description);
  assert.equal(identity.contactPoint.email, 'owner@example.com');
  assert.ok(!seo().jsonLd({ title: '</script><script>alert(1)</script>' }).includes('<'));
  assert.equal(seo().organizationJsonLd({ officialProfiles: [] }).sameAs.length, 0);
});

test('article schema includes only provided dates, sources and the configured publisher', () => {
  const value = seo().articleJsonLd({ slug: 'sample', title: 'Sample', excerpt: 'Summary', coverImage: '/sample.jpg', updatedAt: '2026-10-17', publishedAt: '2026-10-01', sources: ['https://example.com/source'], keywords: [] }, { siteName: 'Brand' });
  assert.equal(value.datePublished, '2026-10-01');
  assert.equal(value.publisher.name, 'Brand');
  assert.equal(value.author['@type'], 'Organization');
  assert.equal(value.author.url, 'https://vietthaiguide.com/about');
  assert.equal(value.citation[0], 'https://example.com/source');
});
