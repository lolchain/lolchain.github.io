(function(root){
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function normalizeHost(value){
    let v=String(value).trim().replace(/\[\.\]/g,'.').replace(/^hxxps:/i,'https:').replace(/^hxxp:/i,'http:').replace(/^["']|["',;]$/g,'');
    if(!v || /\s/.test(v)) return null;
    // Bare IPv6 literals need brackets for URL parsing. Never resolve the host.
    if(!v.includes('://')&&!v.includes('/')&&(v.match(/:/g)||[]).length>1&&!v.startsWith('['))v='['+v+']';
    try {let url=new URL(v.includes('://')?v:'https://'+v);if(!['http:','https:','ws:','wss:','ftp:'].includes(url.protocol))return null;let h=url.hostname.toLowerCase().replace(/^\[|\]$/g,'').replace(/\.$/,'');if(h.includes(':'))return h; if(h.length>253||!h.includes('.')||!h.split('.').every(label=>/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label)))return null;return h;}catch{return null;}
  }
  function matchHost(host,entry){return host===entry.host || entry.match_scope==='subdomains' && host.endsWith('.'+entry.host);}
  function uniqueHosts(entries){return [...new Set(entries.filter(e=>e.type==='domain').map(e=>e.host))].sort();}
  function csv(rows,sourceMap){
    const fields=['id','inventory_origin','value','host','type','chain','chain_id','network','transport','port','kind','evidence','match_scope','resource','action','reported','reviewed','liveness','context','source_observations','sources','techniques'];
    const quote=v=>{let s=String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
    return [fields.join(','),...rows.map(row=>fields.map(k=>quote(k==='source_observations'?JSON.stringify(row[k]||[]):k==='sources'?row.sources.map(id=>sourceMap[id].url).join(' | '):Array.isArray(row[k])?row[k].join(' | '):row[k])).join(','))].join('\r\n');
  }
  const api={escapeHTML,normalizeHost,matchHost,uniqueHosts,csv};
  if(typeof module!=='undefined')module.exports=api;
  root.LOL=api;
})(typeof window!=='undefined'?window:globalThis);
