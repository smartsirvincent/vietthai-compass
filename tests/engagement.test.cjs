const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, dependencies = {}, env = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  vm.runInNewContext(code, { exports, process: { env }, require: name => dependencies[name] || {}, Error, Buffer, URL, Response, AbortSignal, ...globals });
  return exports;
}
const policy = load('lib/engagement-policy.ts');
test('resource validation accepts Unicode slugs and rejects arbitrary targets', () => {
  assert.equal(policy.parseResource({kind:'business',slug:'Lacàph-Coffees-of-Việt Nam'}).kind,'business');
  for (const value of [null,{}, {kind:'other',slug:'x'}, {kind:'article',slug:'../admin'}, {kind:'article',slug:'x?foo'}]) assert.throws(() => policy.parseResource(value));
});
test('comments are bounded plain text, normalize fullwidth URLs and reject honeypot', () => {
  const good = {name:'旅人',body:'這間店很適合午後坐坐。\n謝謝分享！',token:'proof',website:''};
  assert.match(policy.parseComment(good).body,/\n/);
  for (const value of [{...good,website:'spam'}, {...good,body:'short'}, {...good,name:'a'.repeat(41)}, {...good,body:'x'.repeat(2001)}, {...good,body:'<script>alert(1)</script>'}, {...good,body:'優惠 ｈｔｔｐｓ：//example.com'}, {...good,token:'x'.repeat(2049)}]) assert.throws(() => policy.parseComment(value));
});
test('known crawlers are excluded from counts', () => {
  for (const agent of ['', 'Googlebot', 'curl/8.0', 'facebookexternalhit bot', 'HeadlessChrome']) assert.equal(policy.isAutomatedAgent(agent),true);
  assert.equal(policy.isAutomatedAgent('Mozilla/5.0 Chrome/130'),false);
});
function http(overrides={}) {
  return load('lib/engagement-http.ts', {'./engagement-policy':policy,'./seo':{siteUrl:'https://vietthaiguide.com'},crypto:require('node:crypto'),net:require('node:net'),'./cms-store':{getArticles:async()=>[{slug:'known'}],getBusinesses:async()=>[]}}, {NODE_ENV:'production',VERCEL:'1',AUTH_SECRET:'test-secret',TURNSTILE_SECRET_KEY:'test-only'}, overrides);
}
test('public writes require exact origin and trusted platform address', () => {
  const api=http();
  assert.throws(()=>api.checkOrigin(new Request('https://vietthaiguide.com/api/comments',{headers:{origin:'https://evil.example'}})));
  api.checkOrigin(new Request('https://vietthaiguide.com/api/comments',{headers:{origin:'https://vietthaiguide.com'}}));
  assert.throws(()=>api.visitorKey(new Request('https://vietthaiguide.com',{headers:{'x-forwarded-for':'1.2.3.4'}}),'comment'));
  const req=new Request('https://vietthaiguide.com',{headers:{'x-vercel-forwarded-for':'1.2.3.4'}});
  assert.equal(api.visitorKey(req,'comment').length,64);
  assert.notEqual(api.visitorKey(req,'comment'),api.visitorKey(req,'view'));
});
test('nonexistent and inactive resources cannot accept interactions', async () => {
  const api=http();
  await api.requireResource({kind:'article',slug:'known'});
  await assert.rejects(api.requireResource({kind:'article',slug:'missing'}));
  await assert.rejects(api.requireResource({kind:'business',slug:'inactive'}));
});
test('verification rejects wrong hostname/action, replay failure, and outages', async () => {
  for (const result of [{success:false},{success:true,hostname:'evil.example',action:'comment'},{success:true,hostname:'vietthaiguide.com',action:'login'}]) {
    await assert.rejects(http({fetch:async()=>({ok:true,json:async()=>result})}).verifyTurnstile('token'));
  }
  await assert.rejects(http({fetch:async()=>{throw new Error('offline')}}).verifyTurnstile('token'));
  await http({fetch:async()=>({ok:true,json:async()=>({success:true,hostname:'vietthaiguide.com',action:'comment'})})}).verifyTurnstile('token');
});
test('stream size bounded even without Content-Length', async () => {
  const api=http();
  await assert.rejects(api.boundedJson(new Request('https://example.com',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({body:'x'.repeat(17000)})})));
  assert.equal((await api.boundedJson(new Request('https://example.com',{method:'POST',headers:{'content-type':'application/json'},body:'{"ok":true}'}))).ok,true);
});
test('SQL isolates data, uses atomic counts and durable limits; admin actions enforce role', () => {
  const store=fs.readFileSync('lib/engagement-store.ts','utf8');
  assert.match(store,/revoke all on schema vt_engagement from public/);
  assert.equal((store.match(/enable row level security/g)||[]).length,5);
  assert.match(store,/primary key\(kind,slug,visitor,day\)/);
  assert.match(store,/on conflict do nothing returning 1/);
  assert.match(store,/views=vt_engagement.pages.views\+1/);
  assert.match(store,/where kind=\$1 and slug=\$2 and status='approved'/);
  assert.match(store,/default 'pending'/);
  assert.match(store,/pg_advisory_xact_lock\(hashtextextended/);
  const actions=fs.readFileSync('app/admin/engagement/actions.ts','utf8');
  assert.match(actions,/const session = await requireAdminRole\(\)/);
  assert.match(actions,/where id=\$3 and status=\$4/);
});
