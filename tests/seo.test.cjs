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
