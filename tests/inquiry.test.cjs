const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, dependencies = {}, env = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { exports, process: { env }, require: name => dependencies[name] || {}, Error });
  return exports;
}
const inquiry = load('lib/inquiry.ts');
function form() {
  const data = new FormData();
  for (const [key, value] of Object.entries({ name: 'Test', company: 'Shop', location: 'Bangkok', email: 'visitor@example.com', service: '商家介紹頁', message: 'First\nSecond' })) data.set(key, value);
  return data;
}
test('inquiry preserves multiline message and optional fields', () => {
  const result = inquiry.parseInquiry(form());
  assert.equal(result.line, '');
  assert.match(inquiry.inquiryText(result), /First\nSecond/);
});
test('inquiry rejects missing, oversized, invalid service and injected email', () => {
  for (const [key, value] of [['name', ''], ['message', 'x'.repeat(5001)], ['service', 'unknown'], ['email', 'x@example.com\r\nBcc:other@example.com']]) {
    const data = form(); data.set(key, value);
    assert.throws(() => inquiry.parseInquiry(data));
  }
});
test('mail recipient is fixed and visitor email is reply-to, never sender', async () => {
  let sent;
  const api = load('lib/inquiry-mail.ts', { './inquiry': inquiry, nodemailer: { createTransport: () => ({ sendMail: async message => { sent = message; return { accepted: ['goodviet.service@gmail.com'], rejected: [] }; } }) } }, { GMAIL_SMTP_USER: 'goodviet.service@gmail.com', GMAIL_APP_PASSWORD: 'test-only' });
  await api.sendInquiryMail(inquiry.parseInquiry(form()));
  assert.equal(sent.to, 'goodviet.service@gmail.com');
  assert.equal(sent.replyTo, 'visitor@example.com');
  assert.equal(sent.from.address, 'goodviet.service@gmail.com');
  assert.equal(sent.html, undefined);
});
test('unconfigured or rejected mail does not report success', async () => {
  const missing = load('lib/inquiry-mail.ts', { './inquiry': inquiry });
  assert.equal(missing.inquiryMailConfigured(), false);
  await assert.rejects(missing.sendInquiryMail(inquiry.parseInquiry(form())));
  const rejected = load('lib/inquiry-mail.ts', { './inquiry': inquiry, nodemailer: { createTransport: () => ({ sendMail: async () => ({ accepted: [], rejected: ['recipient'] }) }) } }, { GMAIL_SMTP_USER: 'sender@example.com', GMAIL_APP_PASSWORD: 'test-only' });
  await assert.rejects(rejected.sendInquiryMail(inquiry.parseInquiry(form())));
});
