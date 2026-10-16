/* Filter navigation and on-demand directory loading. */
const VIEW_KEYS={
  techniques:['q','chain','network','source','role','tactic','mapping','evidence','priority'],
  endpoints:['endpointOrigin','q','chain','network','source','kind','endpointEvidence','technique','endpointPage'],
  sources:['q','sourceKind','sourcePublisher','sourceTopic','sourceYear','sourceSort','sourcePage'],
  guide:[],
  methodology:[]
};
function resetView(view){for(const key of VIEW_KEYS[view]||[])state[key]=Array.isArray(DEFAULT_STATE[key])?[]:DEFAULT_STATE[key];}
function viewURL(hash=state.page){
  if(hash.startsWith('technique/')&&VIEW_KEYS.techniques.some(key=>state[key]!==DEFAULT_STATE[key]))hash='techniques/catalog';
  const params=new URLSearchParams();params.set('view',state.page);
  for(const key of VIEW_KEYS[state.page]||[]){const value=state[key];if(value!==DEFAULT_STATE[key])params.set(key,String(value));}
  return location.pathname+'?'+params.toString()+'#'+hash;
}
function readViewParams(view,params){
  resetView(view);
  for(const key of VIEW_KEYS[view]||[]){if(!params.has(key))continue;let value=params.get(key);
    if(typeof DEFAULT_STATE[key]==='boolean')value=value==='true';
    else if(typeof DEFAULT_STATE[key]==='number')value=Math.max(0,Math.floor(Number(value)||0));
    state[key]=value;
  }
  if(!['all','references','community'].includes(state.endpointOrigin))state.endpointOrigin=DEFAULT_STATE.endpointOrigin;
  if(view==='sources'&&state.sourceKind&&!RESEARCH_CATEGORIES.includes(state.sourceKind))state.sourceKind=D.sources.find(s=>s.kind===state.sourceKind)?.category||'';
  if(state.priority!=='top10')state.priority='';
}
function navigateView(view,patch={},hash=view){
  resetView(view);Object.assign(state,patch,{page:view});
  history.pushState(null,'',viewURL(hash));route();
}
function shareView(){
  copy(new URL(viewURL(location.hash.slice(1)||state.page),location.href).href);
}
function activeFilters(){
  const names={endpointOrigin:'Provenance',q:'Search',chain:'Chain',network:'Environment',source:'Source',role:'Purpose',tactic:'ATT&CK',mapping:'Mapping',evidence:'Evidence',priority:'Priority',kind:'Class',endpointEvidence:'Evidence',technique:'Technique',sourceKind:'Type',sourcePublisher:'Publisher',sourceTopic:'Topic',sourceYear:'Year'};
  const target=$('active-filters');if(!target)return;
  const keys=(VIEW_KEYS[state.page]||[]).filter(k=>names[k]&&state[k]!==DEFAULT_STATE[k]);
  target.innerHTML=keys.map(k=>`<button class="filter-chip" data-remove-filter="${k}" aria-label="Remove ${H(names[k])} filter">${H(names[k])}: ${H(k==='source'?S[state[k]]?.publisher||state[k]:k==='kind'&&!state[k]?'All classes':state[k])} <span aria-hidden="true">×</span></button>`).join('');
  document.querySelectorAll('[data-remove-filter]').forEach(b=>b.onclick=()=>{state[b.dataset.removeFilter]=DEFAULT_STATE[b.dataset.removeFilter];state.endpointPage=0;state.sourcePage=0;renderPage();});
}
function pagerHTML(prefix){return `<div class="directory-pager" aria-label="Results pages"><button class="button" id="${prefix}-prev">← Previous</button><span id="${prefix}-page" role="status"></span><button class="button" id="${prefix}-next">Next →</button></div>`;}
function pageRows(rows,key,size,prefix,render){
  const pages=Math.max(1,Math.ceil(rows.length/size));state[key]=Math.max(0,Math.min(state[key],pages-1));
  $(prefix+'-page').textContent=rows.length?`${state[key]*size+1}–${Math.min(rows.length,(state[key]+1)*size)} of ${rows.length} · Page ${state[key]+1} / ${pages}`:'0 results';
  $(prefix+'-prev').disabled=state[key]===0;$(prefix+'-next').disabled=state[key]===pages-1;
  for(const [suffix,delta] of [['prev',-1],['next',1]])$(prefix+'-'+suffix).onclick=()=>{state[key]+=delta;render();$('result-count').scrollIntoView({block:'start'});};
  return rows.slice(state[key]*size,(state[key]+1)*size);
}
function sourceSearchText(s){return [s.id,s.title,s.publisher,s.summary,s.limitation,...s.topics].join(' ');}
function referenceListHTML(ids,context={},open=false){return `<details class="reference-list"${open?' open':''}><summary>Read ${ids.length} references</summary>${ids.map(id=>{const s=S[id];return `<a href="${H(s.url)}" target="_blank" rel="noopener noreferrer"><span>${H(s.publisher)} · ${H(date(s.published))}</span><b>${H(s.title)} ↗</b><small>${H(s.kind)}${context[id]?' · RELATED CONTEXT':''}</small>${context[id]?`<p class="fine">${H(context[id])}</p>`:''}</a>`;}).join('')}</details>`;}
let directoryRequest;
function ensureDirectory(){
  if(Array.isArray(D.rpc_directory.endpoints))return Promise.resolve(D.rpc_directory);
  if(directoryRequest)return directoryRequest;
  directoryRequest=fetch('rpc-directory.json').then(r=>{if(!r.ok)throw new Error('Directory download failed');return r.json();}).then(data=>{
    if(!Array.isArray(data.endpoints)||data.endpoints.length!==D.rpc_directory.record_count)throw new Error('Directory snapshot mismatch');
    D.rpc_directory=data;return data;
  }).catch(error=>{directoryRequest=null;throw error;});return directoryRequest;
}
