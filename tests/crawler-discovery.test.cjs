const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function loadRoute(file, dependencies) {
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require: (name) => {
      if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    Date
  });
  return exports;
}

const absoluteUrl = (path) => new URL(path || '/', 'https://vietthaiguide.com/').href;

test('robots permits public discovery for search and AI while excluding admin and API', () => {
  const route = loadRoute('app/robots.ts', { '@/lib/seo': { siteUrl: 'https://vietthaiguide.com' } });
  const robots = route.default();
  assert.equal(robots.sitemap, 'https://vietthaiguide.com/sitemap.xml');
  for (const agent of ['*', 'OAI-SearchBot']) {
    const rule = robots.rules.find((entry) => entry.userAgent === agent);
    assert.equal(rule.allow, '/');
    assert.deepEqual(Array.from(rule.disallow), ['/admin', '/api']);
  }
});

test('sitemap reads CMS on every request so newly published articles appear without deployment', async () => {
  const articles = [{ slug: 'first-guide', updatedAt: '2026-11-01T00:00:00Z', intent: 'traffic' }];
  const route = loadRoute('app/sitemap.ts', {
    '@/lib/cms-store': {
      getArticles: async () => articles,
      getBusinesses: async () => [],
      getCities: async () => []
    },
    '@/lib/seo': { absoluteUrl }
  });
  assert.equal(route.dynamic, 'force-dynamic');
  const first = await route.default();
  assert.ok(first.some((entry) => entry.url.endsWith('/articles/first-guide')));
  articles.push({ slug: 'new-guide', updatedAt: '2026-11-03T00:00:00Z', intent: 'traffic' });
  const second = await route.default();
  const newEntry = second.find((entry) => entry.url.endsWith('/articles/new-guide'));
  assert.ok(newEntry);
  assert.equal(newEntry.lastModified.toISOString(), '2026-11-03T00:00:00.000Z');
});
