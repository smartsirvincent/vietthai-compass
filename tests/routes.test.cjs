const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const compiled = ts.transpileModule(fs.readFileSync('lib/routes.ts', 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
}).outputText;
const moduleExports = {};
vm.runInNewContext(compiled, { exports: moduleExports });
const { findByRouteSlug } = moduleExports;

test('Vietnamese accents and legacy spaces resolve without changing stored URLs', () => {
  for (const slug of ['Lacàph-Coffees-of-Việt Nam', 'Lacàph-Coffees-of-Việt-Nam', 'Bui-Vien-Walking- Street', '胡志明市']) {
    const item = { slug };
    assert.equal(findByRouteSlug([item], encodeURIComponent(slug)), item);
    assert.equal(findByRouteSlug([item], slug), item);
  }
});

test('exact slugs win and invalid escape sequences return not found', () => {
  const exact = { slug: 'a%20b' };
  assert.equal(findByRouteSlug([exact, { slug: 'a b' }], 'a%20b'), exact);
  assert.equal(findByRouteSlug([], '%E0%A4'), undefined);
  assert.equal(findByRouteSlug([{ slug: 'present' }], 'missing'), undefined);
});
