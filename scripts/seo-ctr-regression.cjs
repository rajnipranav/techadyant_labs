const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const repo = require('node:path').resolve(__dirname, '..');
function fixture(slug, vertical, type, route) {
  return {tier:'B',vertical,path:route,filename:slug+'.json',dossier:{slug,entity_type:type,vertical,parent_hub_path:route,header:{},seo:{canonical_path:route},cta:{track_ecosystem:route}}};
}
const legacy=fixture('cemilac','military-aerospace','company','/research/military-aerospace/cemilac/');
const modern=fixture('modern','military-aerospace','company','/research/military-aerospace/company/modern/');
const platform=fixture('platform','military-aerospace','platform','/research/military-aerospace/platform/');
const maritime=fixture('matangi-usv','defence','system','/research/pillars/defence/entity/matangi-usv/');
const pointer=fixture('pointer','military-aerospace','company','/research/military-aerospace/pointer/'); pointer.isPointer=true;
const map={cemilac:[legacy],modern:[modern],platform:[platform],'matangi-usv':[maritime],pointer:[pointer]};
const original=JSON.stringify(map);
const code=ts.transpileModule(fs.readFileSync(repo+'/lib/companyDossier.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const sandbox={exports:{}, require:()=>({COMPANY_DOSSIER_MAP:map})};
vm.runInNewContext(code,sandbox);
const load=sandbox.exports.loadCompanyDossier;
const fixed=load('cemilac','military-aerospace');
assert.equal(fixed.path,'/research/military-aerospace/company/cemilac/');
assert.equal(fixed.dossier.seo.canonical_path,fixed.path);
assert.equal(fixed.dossier.header.entity_path,fixed.path);
assert.equal(fixed.dossier.parent_hub_path,'/research/military-aerospace/');
assert.equal(fixed.dossier.cta.track_ecosystem,'/research/military-aerospace/');
for(const [slug,entry] of [['modern',modern],['platform',platform],['matangi-usv',maritime],['pointer',pointer]]) {
  const result=load(slug,entry.vertical);
  assert.equal(result.path,entry.path);
  assert.equal(result.dossier.seo.canonical_path,entry.dossier.seo.canonical_path);
}
assert.equal(load('cemilac','defence'),null);
assert.equal(load('absent'),null);
assert.equal(JSON.stringify(map),original,'loader must not mutate imported dossier data');
console.log('Canonical loader regression checks passed: legacy correction, modern/platform/other-vertical preservation, missing entries and source immutability.');
const schemaCode=ts.transpileModule(fs.readFileSync(repo+'/react-dossier/jsonLd.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const schema={exports:{}}; vm.runInNewContext(schemaCode,schema);
for(const filename of ['cemilac.json','matangi-usv.json']) {
  const dossier=JSON.parse(fs.readFileSync(repo+'/data/company-dossiers/'+filename,'utf8'));
  dossier.seo.title+=' </script><script>example</script>';
  const payloads=schema.exports.renderJsonLdScripts(dossier);
  assert.ok(payloads.length>=3);
  for(const payload of payloads) {
    const value=JSON.parse(payload);
    assert.ok(value['@context']);
    assert.equal(payload.includes('<'),false,'payload must not embed script markup');
  }
}
assert.equal(schema.exports.robotsForTier('C').index,false);
assert.equal(schema.exports.robotsForTier('B').index,true);
console.log('JSON-LD regression checks passed: parseable company/system payloads, HTML escaping and unchanged indexing tiers.');
