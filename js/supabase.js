var SB_URL='https://oxrewbxtfpmewzofrvyo.supabase.co',SB_KEY='sb_publishable_SAI2aBqel6ttfOEwVPMnaQ_Uk7bL347',SB=null;
SBM=true;
function sbId(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function sbDB(sb){var subs={},cache={};
 function snap(c){var o=cache[c]||{};return {docs:Object.keys(o).map(function(id){return {id:id,data:function(){return o[id]}}})}}
 function note(c){(subs[c]||[]).forEach(function(f){f(snap(c))})}
 async function load(c){var all=[],a=0;while(true){var r=await sb.from('nw_docs').select('id,data').eq('col',c).order('id').range(a,a+999);if(r.error)throw r.error;all=all.concat(r.data||[]);if(!r.data||r.data.length<1000)break;a+=1000}cache[c]={};all.forEach(function(x){cache[c][x.id]=x.data});note(c)}
 sb.channel('nw-docs').on('postgres_changes',{event:'*',schema:'public',table:'nw_docs'},function(p){var n=(p.eventType==='DELETE')?p.old:p.new;if(!n||!n.col)return;var c=n.col;if(!cache[c])return;if(p.eventType==='DELETE')delete cache[c][n.id];else cache[c][n.id]=p.new.data;note(c)}).subscribe();
 return {collection:function(c){return {
   add:async function(o){var id=sbId();(cache[c]=cache[c]||{})[id]=o;note(c);var r=await sb.from('nw_docs').insert({col:c,id:id,data:o});if(r.error){delete cache[c][id];note(c);throw r.error}return {id:id}},
   onSnapshot:function(f,err){(subs[c]=subs[c]||[]).push(f);load(c).catch(function(e){if(err)err(e)})}}},
  doc:function(p){var a=p.split('/'),c=a[0],id=a[1];return {
   update:async function(o){var cur=(cache[c]||{})[id];if(cur){cache[c][id]=Object.assign({},cur,o);note(c)}var r=await sb.rpc('nw_patch',{p_col:c,p_id:id,p_patch:o});if(r.error){load(c);throw r.error}},
   delete:async function(){var had=(cache[c]||{})[id];if(had){delete cache[c][id];note(c)}var r=await sb.from('nw_docs').delete().eq('col',c).eq('id',id).select('id');if(r.error||!(r.data||[]).length){load(c);throw r.error||new Error('denied')}}}},
  reload:function(){return Promise.all(Object.keys(subs).map(load))}}}
function sbShow(m){$('login').className='ov';$('lmsg').textContent=m||''}
/* الحسابات (بتكلّم دالة nw-admin على Supabase) */
var ACC=null,ACCL=0,ACCE='';
async function sbAdmin(b,quiet){try{var r=await SB.functions.invoke('nw-admin',{body:b});if(r.error){var m='';try{var j=await r.error.context.json();m=j.error||''}catch(e){}if(!quiet)toast(m||'تعذّر الاتصال بدالة الحسابات (nw-admin)');return null}return r.data}catch(e){if(!quiet)toast('تعذّر الاتصال بدالة الحسابات (nw-admin)');return null}}
async function loadAcc(){ACCL=1;ACCE='';var r=await sbAdmin({op:'list'},true);if(r&&r.users)ACC=r.users;else{ACC=null;ACCE='تعذّر تحميل الحسابات. اتأكد إن دالة nw-admin اتنشرت على Supabase (الخطوات في 04_roles_accounts.sql).'}ACCL=2;if(V==='settings')render()}
