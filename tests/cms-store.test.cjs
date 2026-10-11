const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const city = { slug: 'hcm', country: 'vietnam', name: 'HCM', nameEn: 'HCM', summary: 'City', bestSeason: '', recommendedDays: '', audience: [], businessAngle: '', image: '/city.jpg', districts: [{ slug: 'd1', name: 'D1', summary: 'District' }] };
const business = { slug: 'cafe', name: 'Cafe', citySlug: 'hcm', districtSlug: 'd1', country: 'vietnam', category: '餐廳美食', description: 'Original', review: 'First\nSecond', image: '/photo.jpg', badges: ['Coffee'], socials: { phone: '123', instagram: 'https://instagram.com/cafe' }, plan: 'free' };
const article = { slug: 'guide', title: 'Guide', excerpt: 'Summary', content: '<h2>Heading</h2><p>Text</p>', country: 'vietnam', citySlug: 'hcm', districtSlug: 'd1', relatedBusinessSlug: 'cafe', category: '餐廳美食', intent: 'traffic', keywords: ['Coffee'], updatedAt: '2026-09-09', coverImage: '/cover.jpg', photoAlt: 'Cover' };
const fixture = () => structuredClone({ settings: {}, cities: [city], businesses: [business], articles: [article] });

function loadSanitizer() {
  const source = ts.transpileModule(fs.readFileSync('lib/sanitize-article-html.ts', 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true }
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, { exports, require }, { filename: 'sanitize-article-html.ts' });
  return exports;
}

function loadStore(initial = fixture(), guideArticles = []) {
  const backend = { document: structuredClone(initial), revisions: [], failReads: false, failUpdate: false, statements: [] };
  let tail = Promise.resolve();
  class Pool {
    async query(sql) {
      backend.statements.push(sql);
      if (sql.startsWith('select')) {
        if (backend.failReads) throw new Error('Database unavailable');
        return { rows: backend.document ? [{ value: structuredClone(backend.document) }] : [] };
      }
      return { rows: [] };
    }
    async connect() {
      let unlock;
      let nextDocument;
      let revision;
      return {
        async query(sql, values) {
          backend.statements.push(sql);
          if (sql.includes('for update')) {
            const previous = tail;
            tail = new Promise((resolve) => { unlock = resolve; });
            await previous;
            if (backend.failReads) throw new Error('Database unavailable');
            return { rows: backend.document ? [{ value: structuredClone(backend.document) }] : [] };
          }
          if (sql.startsWith('insert into cms_document_revisions')) revision = JSON.parse(values[2]);
          if (sql.startsWith('update cms_documents')) {
            if (backend.failUpdate) throw new Error('Write failed');
            nextDocument = JSON.parse(values[1]);
          }
          if (sql === 'commit') {
            backend.document = nextDocument;
            backend.revisions.push(revision);
            unlock?.();
            unlock = undefined;
          }
          if (sql === 'rollback') { unlock?.(); unlock = undefined; }
          return { rows: [] };
        },
        release() { unlock?.(); }
      };
    }
  }
  const source = ts.transpileModule(fs.readFileSync('lib/cms-store.ts', 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true }
  }).outputText;
  const exports = {};
  vm.runInNewContext(source, {
    exports,
    require(name) {
      if (name === 'server-only') return {};
      if (name === 'react') return { cache: (fn) => fn };
      if (name === 'pg') return { Pool };
      if (name === '@/data/site') return fixture();
      if (name === '@/data/travel-guides') return { travelGuideArticles: guideArticles };
      if (name === './types') return { ARTICLE_CATEGORIES: ['旅遊攻略', '旅遊須知', '餐廳美食', '景點行程', '在地生活', '台商專區', '節慶活動', '新聞快訊', '交通航線'] };
      if (name === './sanitize-article-html') return loadSanitizer();
      return require(name);
    },
    process: { env: { DATABASE_URL: 'postgres://test' }, cwd: process.cwd },
    console
  }, { filename: 'cms-store.ts' });
  return { store: exports, backend };
}

test('travel guide import refreshes only its matching article and keeps a revision snapshot', async () => {
  const guide = { ...article, slug: 'guide', title: 'Refreshed guide', excerpt: 'New summary', content: '<h2>New</h2>', coverImage: '/new-cover.webp', updatedAt: '2026-10-11' };
  const untouched = { ...article, slug: 'other', title: 'Keep this article' };
  const { store, backend } = loadStore({ ...fixture(), articles: [article, untouched] }, [guide]);
  const result = await store.mergeTravelGuideArticles();
  assert.equal(result.addedArticles, 0);
  assert.equal(result.updatedArticles, 1);
  assert.equal(result.updatedArticleImages, 1);
  assert.equal(backend.document.articles[0].title, 'Refreshed guide');
  assert.equal(backend.document.articles[1].title, 'Keep this article');
  assert.equal(backend.revisions.length, 1);
});

test('parallel edits to different collections survive and each previous document is backed up', async () => {
  const { store, backend } = loadStore();
  const before = await store.readCmsContent();
  await Promise.all([
    store.saveBusiness({ ...before.businesses[0], description: 'Updated business' }, 'cafe', store.contentRevision(before.businesses[0])),
    store.saveArticle({ ...before.articles[0], title: 'Updated article' }, 'guide', store.contentRevision(before.articles[0])),
    store.saveSiteSettings({ ...before.settings, siteName: 'Updated site' }, store.contentRevision(before.settings))
  ]);
  assert.equal(backend.document.businesses[0].description, 'Updated business');
  assert.equal(backend.document.articles[0].title, 'Updated article');
  assert.equal(backend.document.settings.siteName, 'Updated site');
  assert.equal(backend.revisions.length, 3);
  assert.equal(backend.revisions[0].businesses[0].description, 'Original');
});

test('stale edits and deletes are rejected without overwriting a newer edit', async () => {
  const { store, backend } = loadStore();
  const record = (await store.getBusinesses())[0];
  const revision = store.contentRevision(record);
  await store.saveBusiness({ ...record, review: 'Latest' }, 'cafe', revision);
  await assert.rejects(store.saveBusiness({ ...record, review: 'Stale' }, 'cafe', revision), /已變更/);
  await assert.rejects(store.deleteBusiness('cafe', revision), /已變更/);
  assert.equal(backend.document.businesses[0].review, 'Latest');
  assert.equal(backend.revisions.length, 1);
});

test('failed reads never return seeds or write replacement content', async () => {
  const { store, backend } = loadStore();
  backend.failReads = true;
  await assert.rejects(store.getBusinesses(), /unavailable/);
  await assert.rejects(store.saveBusiness(business, 'cafe', 'old'), /unavailable/);
  assert.equal(backend.document.businesses[0].description, 'Original');
  assert.equal(backend.revisions.length, 0);
  assert.ok(!backend.statements.some((sql) => sql.startsWith('update cms_documents')));
});

test('missing cloud document is never re-seeded', async () => {
  const { store, backend } = loadStore(null);
  await assert.rejects(store.readCmsContent(), /missing/);
  await assert.rejects(store.saveBusiness(business, undefined, 'new'), /missing/);
  assert.equal(backend.document, null);
});

test('write failure rolls back both content and backup', async () => {
  const { store, backend } = loadStore();
  const record = (await store.getBusinesses())[0];
  backend.failUpdate = true;
  await assert.rejects(store.saveBusiness({ ...record, description: 'Lost' }, 'cafe', store.contentRevision(record)), /Write failed/);
  assert.equal(backend.document.businesses[0].description, 'Original');
  assert.equal(backend.revisions.length, 0);
  assert.ok(backend.statements.includes('rollback'));
});

test('new entries and renamed entries cannot overwrite an existing slug', async () => {
  const { store, backend } = loadStore();
  await assert.rejects(store.saveBusiness(business, undefined, 'new'), /已被使用/);
  await store.saveBusiness({ ...business, slug: 'other' }, undefined, 'new');
  const other = (await store.getBusinesses()).find((b) => b.slug === 'other');
  await assert.rejects(store.saveBusiness({ ...other, slug: 'cafe' }, 'other', store.contentRevision(other)), /已被使用/);
  assert.equal(backend.document.businesses.length, 2);
});

test('business rename keeps article links and city rename keeps location relationships', async () => {
  const { store, backend } = loadStore();
  const record = (await store.getBusinesses())[0];
  await store.saveBusiness({ ...record, slug: 'new-cafe' }, 'cafe', store.contentRevision(record));
  assert.equal(backend.document.articles[0].relatedBusinessSlug, 'new-cafe');
  const currentCity = (await store.getCities())[0];
  await store.saveCity({ ...currentCity, slug: 'new-city' }, 'hcm', store.contentRevision(currentCity));
  assert.equal(backend.document.businesses[0].citySlug, 'new-city');
  assert.equal(backend.document.articles[0].citySlug, 'new-city');
});

test('location and deletion checks prevent invisible orphaned entries', async () => {
  const { store } = loadStore();
  const record = (await store.getBusinesses())[0];
  await assert.rejects(store.saveBusiness({ ...record, country: 'thailand' }, 'cafe', store.contentRevision(record)), /不一致/);
  await assert.rejects(store.saveBusiness({ ...record, districtSlug: 'missing' }, 'cafe', store.contentRevision(record)), /不屬於/);
  const currentCity = (await store.getCities())[0];
  await assert.rejects(store.deleteCity('hcm', store.contentRevision(currentCity)), /仍有文章或商家/);
  await assert.rejects(store.saveCity({ ...currentCity, districts: [] }, 'hcm', store.contentRevision(currentCity)), /仍有文章或商家/);
});

test('photos, contacts, tags, line breaks and HTML survive saving and reading again', async () => {
  const { store } = loadStore();
  const record = (await store.getBusinesses())[0];
  const edited = { ...record, image: 'https://res.cloudinary.com/example/image.jpg', badges: ['New tag'], description: 'Line 1\nLine 2', socials: { ...record.socials, whatsapp: '+841234', facebook: 'https://facebook.com/example' } };
  await store.saveBusiness(edited, 'cafe', store.contentRevision(record));
  assert.equal(JSON.stringify((await store.getBusinesses())[0]), JSON.stringify(edited));
  const currentArticle = (await store.getArticles())[0];
  const html = '<h2>Heading</h2><p><strong>Bold</strong></p><figure><img src="/photo.jpg" alt="Photo" /></figure>';
  await store.saveArticle({ ...currentArticle, content: html }, 'guide', store.contentRevision(currentArticle));
  assert.equal((await store.getArticles())[0].content, html);
});

test('article saving removes unsafe HTML while preserving supported formatting', async () => {
  const { store, backend } = loadStore();
  const record = (await store.getArticles())[0];
  await store.saveArticle({ ...record, content: '<h2>Safe heading</h2><p onclick="alert(1)">Text</p><script>alert(1)</script><a href="javascript:alert(1)">bad link</a>' }, record.slug, store.contentRevision(record));
  const saved = backend.document.articles[0].content;
  assert.match(saved, /<h2>Safe heading<\/h2>/);
  assert.match(saved, /<p>Text<\/p>/);
  assert.doesNotMatch(saved, /onclick|script|javascript:/i);
});

test('explicitly empty districts remain empty and legacy slugs can still be edited', async () => {
  const data = fixture();
  data.cities[0].districts = [];
  data.businesses[0].slug = 'Lacàph-Coffees-of-Việt Nam';
  data.businesses[0].districtSlug = '';
  const { store } = loadStore(data);
  assert.equal((await store.getCities())[0].districts.length, 0);
  const record = (await store.getBusinesses())[0];
  await store.saveBusiness({ ...record, review: 'Updated' }, record.slug, store.contentRevision(record));
  assert.equal((await store.getBusinesses())[0].review, 'Updated');
});

test('Hanoi and Phuket use their dedicated city photos even when CMS has stale cover URLs', async () => {
  const data = fixture();
  data.cities.push(
    { ...city, slug: 'hanoi', name: '河內', image: '/brand-assets/home-hero-vietthai-commerce.png' },
    { ...city, slug: 'phuket', name: '普吉', country: 'thailand', image: '/brand-assets/home-hero-vietthai-commerce.png' }
  );
  const { store } = loadStore(data);
  const cities = await store.getCities();
  assert.equal(cities.find((item) => item.slug === 'hanoi').image, '/cities/hanoi.webp');
  assert.equal(cities.find((item) => item.slug === 'phuket').image, '/cities/phuket.webp');
});

test('revision hashes are independent of JSONB property order', () => {
  const { store } = loadStore();
  assert.equal(store.contentRevision({ b: [{ z: 1, a: 2 }], a: 0 }), store.contentRevision({ a: 0, b: [{ a: 2, z: 1 }] }));
});
