(() => {
  'use strict';
  const data = Array.isArray(window.ATLAS_DATA) ? window.ATLAS_DATA : [];
  const byId = new Map(data.map((d, i) => [d.id, { ...d, index: i }]));
  const CATS = [
    ['all', '全部资源', '◈'], ['robot', '机器人数据', '⌁'],
    ['ego', '第一视角视频', '◎'], ['video', '视频 × 文本', '▧'],
    ['image', '图文 × 空间', '◇'], ['tool', '工具与目录', '⛭']
  ];
  const CAT_LABEL = Object.fromEntries(CATS.map(([key, val]) => [key, val]));
  const GRAIN = [['frame','逐帧 / 每秒'],['stage','Subtask / Stage'],['clip','Clip / Narration'],['task','Task / Episode'],['other','其他 / 索引']];
  const ACCESS = [['open','公开 / 可访问'],['gated','申请 / 门控'],['index','索引 / 待核验 / 分期']];
  const PRIORITY = ['S','A','B'];
  const $ = id => document.getElementById(id);
  const el = (tag, props={}) => Object.assign(document.createElement(tag), props);
  const safe = value => String(value ?? '').replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const clean = text => String(text||'').toLocaleLowerCase().replace(/\s+/g,' ').trim();
  const safeURL = url => /^https:\/\/[\w-]+(?:\.[\w-]+)+(?:[^\s]*)$/i.test(url||'') ? url : '#';
  const storeGet=(k,backup)=>{try{return JSON.parse(localStorage.getItem(k))??backup}catch{return backup}};
  const storeSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
  let favorites = new Set(storeGet('atlas:favorites',[]));
  let compare = new Set();
  let renderedCount = 18;
  let view = storeGet('atlas:view','grid')==='list'?'list':'grid';
  const params = new URLSearchParams(location.search);
  const initial=(k,v)=>params.get(k)??v;
  const state = {
    q: initial('q',''), category: initial('cat','all'),
    priority: new Set(initial('p','').split(',').filter(Boolean)),
    grain:new Set(initial('g','').split(',').filter(Boolean)),
    access:new Set(initial('a','').split(',').filter(Boolean)),
    favorites:initial('fav','')==='1', sort:initial('sort','priority')
  };
  if(!CATS.some(x=>x[0]===state.category) && state.category!=='vl') state.category='all';
  const priorityRank = { S:0, A:1, B:2 };
  const grainRank={frame:0,stage:1,clip:2,task:3,other:4};
  const grainLabel=Object.fromEntries(GRAIN);
  function accessKind(d){
    const s=clean(d.access);
    if(/门控|申请|审核|注册|需许可|授权|受限|审查|request|gated/.test(s))return 'gated';
    if(/索引|分期|逐步|部分|开放计划|未完全|分阶段|入口|需核|核验|候选|待确认|待核|待查|不确定|未明/.test(s))return 'index';
    if(/公开|开源|可用|可下载|开放数据|下载就绪|released|public|open/.test(s))return 'open';
    return 'index';
  }
  function countCategory(cat){if(cat==='all')return data.length;if(cat==='vl')return data.filter(d=>d.category==='image'||d.category==='video').length;return data.filter(d=>d.category===cat).length;}
  function categoryClass(key){return ['ego','video','image','tool'].includes(key)?'cat-'+key:''}
  function maybeShort(text,max=100){const s=String(text??'');return s.length>max?s.slice(0,max-1).trim()+'…':s;}
  function notify(msg){const box=$('toast');box.textContent=msg;box.classList.add('show');clearTimeout(notify._t);notify._t=setTimeout(()=>box.classList.remove('show'),2300)}
  function setFilterURL(){const p=new URLSearchParams();if(state.q)p.set('q',state.q);if(state.category!=='all')p.set('cat',state.category);if(state.priority.size)p.set('p',[...state.priority].join(','));if(state.grain.size)p.set('g',[...state.grain].join(','));if(state.access.size)p.set('a',[...state.access].join(','));if(state.favorites)p.set('fav','1');if(state.sort!=='priority')p.set('sort',state.sort);try{history.replaceState(null,'',location.pathname+(p.size?'?'+p.toString():'')+location.hash)}catch{/* Preview origins (file:, about:blank) may disallow History API. */}}
  function reset(){state.q='';state.category='all';state.priority.clear();state.grain.clear();state.access.clear();state.favorites=false;state.sort='priority';renderControls();update();}
  function renderControls(){
    $('search-input').value=state.q;$('sort-select').value=state.sort;$('only-favorites').checked=state.favorites;
    $('category-options').innerHTML=CATS.map(([k,label,icon])=>`<button type="button" class="category-btn ${state.category===k?'active':''}" data-cat="${k}" aria-pressed="${state.category===k}"><span class="category-icon">${icon}</span><span>${label}</span><span class="cat-count">${countCategory(k)}</span></button>`).join('');
    $('priority-options').innerHTML=PRIORITY.map(p=>`<label class="check-option"><input type="checkbox" data-priority="${p}" ${state.priority.has(p)?'checked':''}/><span>${p} 级${p==='S'?' · 优先':p==='A'?' · 建议':' · 扩展'}</span><small>${data.filter(x=>x.priority===p).length}</small></label>`).join('');
    $('grain-options').innerHTML=GRAIN.map(([k,label])=>`<label class="check-option"><input type="checkbox" data-grain="${k}" ${state.grain.has(k)?'checked':''}/><span>${label}</span><small>${data.filter(x=>x.grain===k).length}</small></label>`).join('');
    $('access-options').innerHTML=ACCESS.map(([k,label])=>`<label class="check-option"><input type="checkbox" data-access="${k}" ${state.access.has(k)?'checked':''}/><span>${label}</span><small>${data.filter(x=>accessKind(x)===k).length}</small></label>`).join('');
  }
  function filtered(){
    const q=clean(state.q);
    let result=data.filter(d=>{
      if(state.category!=='all' && !(state.category==='vl'?(d.category==='video'||d.category==='image'):d.category===state.category))return false;
      if(state.priority.size && !state.priority.has(d.priority))return false;
      if(state.grain.size && !state.grain.has(d.grain))return false;
      if(state.access.size && !state.access.has(accessKind(d)))return false;
      if(state.favorites && !favorites.has(d.id))return false;
      if(q){const haystack=clean([d.name,d.size,d.signals,d.granularity,d.use,d.access,d.license,d.overlap,d.caveat,d.category,d.originalCategory].join(' '));if(!haystack.includes(q))return false;}
      return true;
    });
    result.sort((a,b)=>{
      if(state.sort==='name')return a.name.localeCompare(b.name,'en');
      if(state.sort==='category')return a.category.localeCompare(b.category)||a.name.localeCompare(b.name,'en');
      if(state.sort==='grain')return (grainRank[a.grain]-grainRank[b.grain])||(priorityRank[a.priority]-priorityRank[b.priority]);
      return (priorityRank[a.priority]-priorityRank[b.priority])||(data.indexOf(a)-data.indexOf(b));
    });
    return result;
  }
  function primaryLink(d){return d.links.find(x=>x.type==='项目页') || d.links.find(x=>x.type==='数据集')|| d.links[0];}
  function linkButtons(d,highlight=false){const shown=d.links.slice(0,6);return shown.map((l,i)=>`<a class="detail-link ${highlight&&i===0?'highlight':''}" href="${safeURL(l.url)}" target="_blank" rel="noopener noreferrer">${safe(l.type)} <span aria-hidden="true">↗</span></a>`).join('')}
  function tags(d){return `<div class="data-tags">${d.tags.map(t=>`<span class="tag-${t.toLowerCase()}">${safe(t)}</span>`).join('')}</div>`;}
  function cardHTML(d){
    const link=primaryLink(d);
    return `<article class="dataset-card" data-id="${safe(d.id)}">
      <div class="card-top"><div class="card-top-left"><span class="cat-badge ${categoryClass(d.category)}">${safe(CAT_LABEL[d.category])}</span><span class="tier tier-${safe(d.priority)}">${safe(d.priority)} 级</span></div><div class="card-actions"><button type="button" class="mini-btn ${favorites.has(d.id)?'is-on':''}" data-favorite="${safe(d.id)}" aria-label="${favorites.has(d.id)?'取消收藏':'收藏'} ${safe(d.name)}" title="收藏">${favorites.has(d.id)?'♥':'♡'}</button><button type="button" class="mini-btn ${compare.has(d.id)?'is-on':''}" data-compare="${safe(d.id)}" title="添加到对比" aria-label="${compare.has(d.id)?'取消对比':'添加到对比'} ${safe(d.name)}">${compare.has(d.id)?'▣':'▢'}</button></div></div>
      <h3 class="dataset-title"><button type="button" data-open="${safe(d.id)}">${safe(d.name)}</button></h3>
      <div class="dataset-summary">${tags(d)}<span class="dataset-size" title="${safe(d.size)}">${safe(maybeShort(d.size,75))}</span></div>
      <div class="dataset-detail-line"><span class="line-icon">◷</span><span>${safe(maybeShort(d.granularity,95))}</span></div>
      <p class="card-use">${safe(d.use)}</p>
      <div class="card-bottom"><span class="source-meta" title="${safe(d.access)}"><span class="link-glyph">◈</span>${safe(maybeShort(d.access,19))}</span><a class="source-link" href="${safeURL(link?.url)}" rel="noopener noreferrer" target="_blank">${safe(link?.type||'查看来源')} <span aria-hidden="true">↗</span></a><button class="read-more" type="button" data-open="${safe(d.id)}">详情 ···</button></div>
    </article>`;
  }
  function drawChips(){
    const chips=[];
    if(state.category!=='all')chips.push(['cat',`类别：${CAT_LABEL[state.category]||'视频与图文'}`]);
    if(state.q)chips.push(['q',`搜索：${state.q}`]);
    state.priority.forEach(x=>chips.push(['p:'+x,`优先级 ${x}`]));
    state.grain.forEach(x=>chips.push(['g:'+x,grainLabel[x]]));
    state.access.forEach(x=>chips.push(['a:'+x,(Object.fromEntries(ACCESS))[x]]));
    if(state.favorites)chips.push(['fav','仅收藏']);
    $('active-chips').innerHTML=chips.map(([key,label])=>`<button type="button" class="active-chip" data-chip="${safe(key)}">${safe(label)} ×</button>`).join('');
    $('active-filter-summary').textContent=chips.length?`${chips.length} 项筛选已启用`:'按推荐优先级排序';
  }
  function drawList(){
    const result=filtered();
    $('result-count').textContent=result.length;
    const shown=result.slice(0,renderedCount);
    $('dataset-grid').innerHTML=shown.map(cardHTML).join('');
    $('dataset-grid').classList.toggle('view-list',view==='list');
    $('grid-view').classList.toggle('switch-active',view==='grid');
    $('list-view').classList.toggle('switch-active',view==='list');
    $('empty-state').hidden=result.length!==0;
    $('load-more-wrap').hidden=result.length<=renderedCount;
    $('load-progress').textContent=`(${shown.length} / ${result.length})`;
    drawChips();
  }
  function update(){renderedCount=view==='grid'?18:30;setFilterURL();renderControls();drawList();drawDock();}
  function drawDock(){const n=compare.size;$('compare-dock').hidden=n===0;$('compare-count').textContent=`${n} 项待对比`;}
  function detailHTML(d){
    const pairs=[['公开规模',d.size],['训练可用信号',d.signals],['标注 / 时间粒度',d.granularity],['建议用途',d.use],['下载状态',d.access],['许可 / 使用约束',d.license]];
    return `<div class="detail-inner"><div class="detail-meta"><span class="cat-badge ${categoryClass(d.category)}">${safe(CAT_LABEL[d.category])}</span><span class="tier tier-${safe(d.priority)}">Priority ${safe(d.priority)}</span><span class="grain-badge">${safe(grainLabel[d.grain])}</span></div><h2>${safe(d.name)}</h2><p class="detail-sub">源头记录与数据获取 · 每个字段均来源于研究目录，使用前请复核官方描述。</p><div class="detail-links">${linkButtons(d,true)}</div><div class="detail-section-title">DATASET SPECIFICATION</div><div class="detail-grid">${pairs.map(([k,v])=>`<div class="detail-cell"><small>${safe(k)}</small><p>${safe(v||'暂无信息')}</p></div>`).join('')}</div>${d.overlap?`<div class="detail-section-title">SOURCE OVERLAP / 重叠关系</div><div class="detail-alert">${safe(d.overlap)}</div>`:''}<div class="detail-section-title">RESEARCH NOTES / 注意事项</div><div class="detail-alert"><strong>使用提示 · </strong>${safe(d.caveat||'请在训练前复核数据格式、许可证与实际可下载数量。')}</div><div class="detail-actions"><button type="button" class="secondary-btn" data-detail-fav="${safe(d.id)}">${favorites.has(d.id)?'♥ 已收藏':'♡ 收藏此数据'}</button><button type="button" class="secondary-btn" data-copy="${safe(d.id)}">↗ 复制条目链接</button></div></div>`;
  }
  function openDetail(id){const d=byId.get(id);if(!d)return;$('detail-content').innerHTML=detailHTML(d);const dialog=$('detail-dialog');if(!dialog.open)dialog.showModal();try{history.replaceState(null,'',location.pathname+location.search+'#dataset/'+encodeURIComponent(d.id))}catch{/* Offline preview origin */}}
  function closeDetail(){const dialog=$('detail-dialog');if(dialog.open)dialog.close();if(location.hash.startsWith('#dataset/')){try{history.replaceState(null,'',location.pathname+location.search+'#datasets')}catch{}}}
  function setFavorite(id){favorites.has(id)?favorites.delete(id):favorites.add(id);storeSet('atlas:favorites',[...favorites]);drawList();if($('detail-dialog').open&&byId.has(id))$('detail-content').innerHTML=detailHTML(byId.get(id));notify(favorites.has(id)?'已加入收藏':'已取消收藏');}
  function setCompare(id){if(compare.has(id))compare.delete(id);else if(compare.size>=4){notify('一次最多对比 4 项');return;}else compare.add(id);drawDock();drawList();}
  function showCompare(){const ds=[...compare].map(id=>byId.get(id)).filter(Boolean);if(!ds.length)return;const fields=[['数据类型',d=>CAT_LABEL[d.category]],['优先级',d=>d.priority],['规模',d=>d.size],['可用信号',d=>d.signals],['标注粒度',d=>d.granularity],['用途',d=>d.use],['开放状态',d=>d.access],['许可限制',d=>d.license],['来源重叠',d=>d.overlap||'未注明'],['项目链接',d=>{const p=primaryLink(d);return p?`<a href="${safeURL(p.url)}" target="_blank" rel="noopener noreferrer">${safe(p.type)} ↗</a>`:'—';}]];
    $('compare-content').innerHTML=`<table class="compare-table"><thead><tr><th>字段 / 数据集</th>${ds.map(d=>`<th>${safe(d.name)}</th>`).join('')}</tr></thead><tbody>${fields.map(([label,fn])=>`<tr><td>${safe(label)}</td>${ds.map(d=>`<td>${label==='项目链接'?fn(d):safe(fn(d))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    if(!$('compare-dialog').open)$('compare-dialog').showModal();
  }
  function exportCSV(){const dataRows=filtered();const headers=['数据集','类别','优先级','规模','训练可用信号','标注粒度','建议用途','下载状态','许可','重叠关系','注意事项','主入口','其他链接'];const escapeCSV=x=>'"'+String(x??'').replaceAll('"','""')+'"';const rows=dataRows.map(d=>[d.name,CAT_LABEL[d.category],d.priority,d.size,d.signals,d.granularity,d.use,d.access,d.license,d.overlap,d.caveat,d.source,d.links.map(x=>x.type+': '+x.url).join(' | ')]);
    const csv='\ufeff'+[headers,...rows].map(x=>x.map(escapeCSV).join(',')).join('\r\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=el('a',{href:url,download:'embodied-atlas-filtered.csv'});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify(`已导出 ${dataRows.length} 条记录`);
  }
  function setupEvents(){
    $('search-input').addEventListener('input',e=>{state.q=e.target.value;update()});
    $('search-clear').addEventListener('click',()=>{state.q='';update();$('search-input').focus()});
    $('sort-select').addEventListener('change',e=>{state.sort=e.target.value;update()});
    $('reset-filters').addEventListener('click',reset);
    $('empty-reset').addEventListener('click',reset);
    $('only-favorites').addEventListener('change',e=>{state.favorites=e.target.checked;update()});
    $('grid-view').addEventListener('click',()=>{view='grid';storeSet('atlas:view',view);update()});
    $('list-view').addEventListener('click',()=>{view='list';storeSet('atlas:view',view);update()});
    $('load-more').addEventListener('click',()=>{renderedCount+=view==='grid'?18:30;drawList()});
    $('export-csv').addEventListener('click',exportCSV);
    $('detail-close').addEventListener('click',closeDetail);
    $('detail-dialog').addEventListener('close',()=>{if(location.hash.startsWith('#dataset/')){try{history.replaceState(null,'',location.pathname+location.search+'#datasets')}catch{}}});
    $('compare-close').addEventListener('click',()=>$('compare-dialog').close());
    $('show-compare').addEventListener('click',showCompare);
    $('clear-compare').addEventListener('click',()=>{compare.clear();drawDock();drawList()});
    $('theme-toggle').addEventListener('click',()=>{const night=document.documentElement.dataset.theme==='dark';document.documentElement.dataset.theme=night?'light':'dark';storeSet('atlas:theme',night?'light':'dark');$('theme-toggle').textContent=night?'☾':'☀'});
    $('filter-sidebar').addEventListener('click',e=>{const btn=e.target.closest('[data-cat]');if(btn){state.category=btn.dataset.cat;update()}});
    $('filter-sidebar').addEventListener('change',e=>{const inp=e.target;for(const [k,key] of [['priority','priority'],['grain','grain'],['access','access']]){if(inp.dataset[k]){inp.checked?state[key].add(inp.dataset[k]):state[key].delete(inp.dataset[k]);update();return;}}});
    $('active-chips').addEventListener('click',e=>{const b=e.target.closest('[data-chip]');if(!b)return;const key=b.dataset.chip;if(key==='cat')state.category='all';else if(key==='q')state.q='';else if(key==='fav')state.favorites=false;else{const [f,value]=key.split(':');if(f==='p')state.priority.delete(value);if(f==='g')state.grain.delete(value);if(f==='a')state.access.delete(value);}update()});
    $('dataset-grid').addEventListener('click',e=>{let b=e.target.closest('[data-favorite]');if(b){setFavorite(b.dataset.favorite);return;}b=e.target.closest('[data-compare]');if(b){setCompare(b.dataset.compare);return;}b=e.target.closest('[data-open]');if(b)openDetail(b.dataset.open)});
    $('detail-content').addEventListener('click',e=>{const fav=e.target.closest('[data-detail-fav]');if(fav){setFavorite(fav.dataset.detailFav);return;}const copy=e.target.closest('[data-copy]');if(copy){const loc=location.origin+location.pathname+location.search+'#dataset/'+encodeURIComponent(copy.dataset.copy);navigator.clipboard?.writeText(loc).then(()=>notify('已复制当前条目的链接'),()=>notify('复制失败，请手动复制地址栏链接'))||notify('请复制浏览器地址栏链接');}});
    document.querySelectorAll('[data-collection]').forEach(b=>b.addEventListener('click',()=>{reset();if(b.dataset.collection==='dense'){state.grain=new Set(['frame','stage']);state.priority=new Set(['S','A'])}else if(b.dataset.collection==='robot'){state.category='robot'}else if(b.dataset.collection==='vl'){state.category='vl'}update();$('datasets').scrollIntoView({behavior:'smooth'})}));
    document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)&&!$('detail-dialog').open&&!$('compare-dialog').open){e.preventDefault();$('search-input').focus()}});
    window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#dataset/'))openDetail(decodeURIComponent(location.hash.slice('#dataset/'.length)))});
  }
  function init(){
    if(!data.length){$('dataset-grid').innerHTML='<p>数据文件未加载。请检查 data/datasets.js。</p>';return;}
    $('stat-total').textContent=data.length;
    $('stat-top').textContent=data.filter(x=>x.priority==='S').length;
    $('stat-robot').textContent=countCategory('robot');
    $('stat-vl').textContent=countCategory('vl');
    const theme=storeGet('atlas:theme','light');document.documentElement.dataset.theme=theme;$('theme-toggle').textContent=theme==='dark'?'☀':'☾';
    renderControls();drawList();drawDock();setupEvents();
    if(location.hash.startsWith('#dataset/')){const id=decodeURIComponent(location.hash.slice('#dataset/'.length));if(byId.has(id))openDetail(id)}
  }
  init();
})();
