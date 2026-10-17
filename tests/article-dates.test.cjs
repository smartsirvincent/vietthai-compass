const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const api = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/article-dates.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: api, Intl, Date, Error });
test('publication defaults to Taiwan calendar day and allows manual past dates', () => {
  const now = new Date('2026-10-17T17:00:00Z');
  assert.equal(api.articleDates('', now).publishedAt, '2026-10-18');
  assert.equal(api.articleDates('2026-09-01', now).publishedAt, '2026-09-01');
  assert.equal(api.articleDates('2026-09-01', now).updatedAt, '2026-10-18');
});
test('invalid and future publication dates are rejected', () => {
  const now = new Date('2026-10-17T01:00:00Z');
  for (const date of ['2026-02-30', 'invalid', '2026-10-18']) assert.throws(() => api.articleDates(date, now));
});
