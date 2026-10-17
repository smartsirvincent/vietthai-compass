const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync('lib/feed.ts', 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
const exportsFeed = {};
vm.runInNewContext(code, { exports: exportsFeed, require: () => ({ absoluteUrl: path => new URL(path, 'https://vietthaiguide.com').href }) });

test('RSS escapes editorial content and does not invent publication dates', () => {
  const feed = exportsFeed.articleFeed([{ slug: 'a', title: 'A & B <test>', excerpt: '</description>', updatedAt: '2026-10-17' }], { siteName: 'Test' });
  assert.ok(feed.includes('A &amp; B &lt;test&gt;'));
  assert.ok(feed.includes('&lt;/description&gt;'));
  assert.ok(!feed.includes('<pubDate>'));
  assert.ok(feed.includes('https://vietthaiguide.com/articles/a'));
});

test('RSS advertises itself and uses the actual provided publication date', () => {
  const feed = exportsFeed.articleFeed([{ slug: 'a', title: 'A', excerpt: 'B', updatedAt: '2026-10-17', publishedAt: '2026-10-01' }], {});
  assert.ok(feed.includes('<pubDate>Thu, 01 Oct 2026 00:00:00 GMT</pubDate>'));
  assert.ok(feed.includes('rel="self"'));
});
