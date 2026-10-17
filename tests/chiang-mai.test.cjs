const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const batch=require('../data/chiang-mai-businesses.json');
function load(file,imports={}) {
 const exports={};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,{exports,URLSearchParams,structuredClone,require:name=>{if(!(name in imports))throw new Error(name);return imports[name];}});
 return exports;
}
const areas=load('lib/chiang-mai-areas.ts');
const importer=load('lib/chiang-mai-import.ts',{'@/data/chiang-mai-businesses.json':batch,'./chiang-mai-areas':areas});
test('30 unique sourced Chiang Mai businesses each have 500 Chinese characters and a real photo',()=>{
 assert.equal(batch.length,30);
 assert.equal(new Set(batch.map(b=>b.slug)).size,30);
 assert.equal(new Set(batch.map(b=>b.image)).size,30);
 assert.equal(batch.filter(b=>b.subcategory==='咖啡廳').length,5);
 for(const b of batch){
  assert.equal(b.country,'thailand');assert.equal(b.citySlug,'chiang-mai');
  assert.ok((b.description.match(/\p{Script=Han}/gu)||[]).length>=500,b.slug);
  assert.ok(areas.chiangMaiAreas.some(a=>a.slug===b.districtSlug),b.slug);
  assert.ok(b.image.startsWith('https://'));assert.ok(b.imageSource.startsWith('https://'));assert.ok(b.imageCredit);
  assert.ok(b.googleMapUrl.startsWith('https://www.google.com/maps/'));
 }
});
test('batch preserves existing edits, inactive records, Vietnam, settings and article data',()=>{
 const previous={...batch[0],isActive:false,description:'Manual edit'};
 const vietnam={slug:'vn',country:'vietnam',description:'Do not touch'};
 const content={cities:[{slug:'chiang-mai',country:'thailand',districts:[{slug:'old-city',name:'Custom old city'}]},{slug:'hanoi',country:'vietnam',districts:[]}],businesses:[previous,vietnam],articles:[{slug:'manual'}],settings:{siteName:'Custom'}};
 const originals=JSON.stringify([content.businesses,content.cities[1],content.articles,content.settings]);
 const result=importer.applyChiangMaiImport(content);
 assert.equal(result.added.length,29);assert.equal(result.skipped.length,1);
 assert.equal(content.cities[0].districts[0].name,'Custom old city');
 assert.equal(JSON.stringify([content.businesses.slice(0,2),content.cities[1],content.articles,content.settings]),originals);
 const stable=JSON.stringify(content);const again=importer.applyChiangMaiImport(content);
 assert.equal(again.added.length,0);assert.equal(again.districts,0);assert.equal(JSON.stringify(content),stable);
});
test('name variants do not duplicate existing stores under a different slug',()=>{
 const content={cities:[{slug:'chiang-mai',country:'thailand',districts:[]}],businesses:[{...batch[25],slug:'existing',name:'Graph café'}]};
 const result=importer.applyChiangMaiImport(content);assert.equal(result.skipped.length,1);
});
test('district and cuisine filters exclude inactive and other cities; other districts remain discoverable',()=>{
 const all=[...batch,{...batch[0],isActive:false},{...batch[0],citySlug:'bangkok'},{...batch[0],districtSlug:'custom'}];
 assert.equal(areas.filterChiangMaiBusinesses(all).length,31);
 assert.equal(areas.filterChiangMaiBusinesses(all,'other').length,1);
 assert.equal(areas.filterChiangMaiBusinesses(all,'nimman','咖啡廳').length,2);
 assert.equal(areas.filterChiangMaiBusinesses(all,'wua-lai','咖啡廳').length,0);
 assert.equal(areas.chiangMaiHref('old-city','咖啡廳'),'/cities/chiang-mai?area=old-city&merchantType=%E5%92%96%E5%95%A1%E5%BB%B3#chiang-mai-neighborhoods');
});
test('import uses admin auth and existing transactional backup without global normalization',()=>{
 const store=fs.readFileSync('lib/cms-store.ts','utf8');
 assert.match(store,/export async function importChiangMaiBusinesses\(\)[\s\S]*?mutateCmsContent[\s\S]*?false, false/);
 const page=fs.readFileSync('app/admin/thailand-update/page.tsx','utf8');
 assert.match(page,/async function addChiangMai\(\)[\s\S]*?await requireAdminRole\(\)/);
});
