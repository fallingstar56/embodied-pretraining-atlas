/* No external dependencies: execute actual page scripts and exercise UI event handlers. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script defer src="([^"]+)"><\/script>/g)].map(x=>x[1]);
function page(search='', hash='') {
  const nodes = new Map();
  function node() {
    return {innerHTML:'',textContent:'',dataset:{},listeners:{},open:false,
      classList:{add(){},remove(){},toggle(){}},
      addEventListener(type, fn){this.listeners[type]=fn},
      showModal(){this.open=true},close(){this.open=false},append(){},click(){},remove(){},focus(){}};
  }
  for (const [,id] of html.matchAll(/\bid="([^"]+)"/g)) nodes.set(id,node());
  const document={getElementById(id){assert(nodes.has(id),`Missing DOM ID ${id}`);return nodes.get(id)},createElement:node,
    body:node(),documentElement:node(),querySelectorAll(){return []},addEventListener(){}};
  let blob;
  const ctx=vm.createContext({document,location:{search,hash,pathname:'/index.html'},history:{replaceState(){}},
    URLSearchParams,URL:{createObjectURL(b){blob=b;return 'blob:test'},revokeObjectURL(){}},Blob,
    localStorage:{getItem(){return null},setItem(){}},setTimeout(){},clearTimeout(){},navigator:{},console});
  ctx.window=ctx;ctx.addEventListener=()=>{};
  for (const src of scripts) vm.runInContext(fs.readFileSync(path.join(root,src),'utf8'),ctx,{filename:src});
  return {ctx,nodes,blob:()=>blob};
}
function parseCSV(s) {
  const rows=[];let row=[],field='',quoted=false;
  s=s.replace(/^\ufeff/,'');
  for(let i=0;i<s.length;i++){
    const c=s[i];
    if(c==='"'){if(quoted&&s[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}
    else if(c===','&&!quoted){row.push(field);field='';}
    else if(c==='\n'&&!quoted){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field='';}
    else field+=c;
  }
  row.push(field);rows.push(row);return rows;
}
(async()=>{
  const all=page();
  assert.equal(Number(all.nodes.get('result-count').textContent),117);
  assert.equal(scripts.length,5);
  const ds=all.ctx.ATLAS_DATA;
  const get=name=>ds.find(d=>d.name===name);
  assert.equal(ds.filter(d=>d.facets.evidence==='not_applicable').length,12);
  for(const d of ds){
    assert(d.facets.sources.length>0);
    if(d.isResource) assert.equal(d.facets.pairs.length,0,d.name);
  }
  assert(get('FineART').facets.pairs.some(([a,t])=>a==='stage_text'&&t==='segment'));
  assert(!get('FineART').facets.pairs.some(([a,t])=>a==='stage_text'&&t==='frame'));
  assert(!get('Ego4D Goal-Step').facets.pairs.some(([a])=>a==='progress_failure'));
  assert(!get('EgoDex').tags.includes('A'));
  assert(!get('FastUMI-100K').tags.includes('A'));
  assert.equal(get('ProcVLM / ProcCorpus-60M').category,'robot');
  assert.equal(get('50 Salads').category,'video');
  assert.equal(get('LAION-BVD-I-300M').category,'image');
  assert.equal(Number(page('?q=FineART&t=frame&ann=stage_text').nodes.get('result-count').textContent),0);
  assert.equal(Number(page('?q=FineART&t=segment&ann=stage_text').nodes.get('result-count').textContent),1);
  assert.equal(Number(page('?t=second').nodes.get('result-count').textContent),0);
  assert.equal(Number(page('?ann=next_step').nodes.get('result-count').textContent),0);
  assert.equal(Number(page('?ev=partial').nodes.get('result-count').textContent),10);
  const detail=page('', '#dataset/'+get('RoboMIND v1.2 / v2').id);
  assert(detail.nodes.get('detail-dialog').open);
  assert(detail.nodes.get('detail-content').innerHTML.includes('待确认字段'));
  assert(detail.nodes.get('detail-content').innerHTML.includes('核查依据 1'));
  all.nodes.get('export-csv').listeners.click();
  const rows=parseCSV(await all.blob().text());
  assert.equal(rows.length,118);
  assert(rows.every(r=>r.length===22),'Export columns must match header');
  const fine=rows.find(r=>r[0]==='FineART');
  assert(fine[6].includes('阶段 / 步骤语言 @ 事件 / 阶段区间'));
  assert.equal(fine[7],'公开资料支持');
  assert(fine[8].startsWith('https://'));
  const subset=page('?ann=asr');subset.nodes.get('export-csv').listeners.click();
  const filtered=parseCSV(await subset.blob().text());
  assert(filtered.length>1&&filtered.length<118);
  assert(filtered.slice(1).every(r=>r[6].includes('语音字幕 / 对话转写')));
  console.log('PASS: 117 reviews; paired filters; categories; modality distinctions; details; full and filtered CSV exports.');
})().catch(e=>{console.error(e);process.exitCode=1});
