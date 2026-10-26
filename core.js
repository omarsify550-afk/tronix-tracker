var ST={new:['لم يبدأ','s-new'],go:['جاري','s-go'],block:['معطّل','s-block'],rev:['بانتظار المراجعة','s-rev'],done:['تم','s-done']};
var COL=['depts','emps','cats','machines','tasks','tpls','log','specs','groups','mstones','files'];
var S={},V='dash',MID=null,TID=null,FOCUS=null,DL=1,F={st:'all',dp:''},D={dp:'',ms:[],open:0,st:'open'},X={},PC={bw:0,det:1,brk:1},ME='',PR,db=null,U=null,uid=null;
COL.forEach(function(c){S[c]=[]});
try{var _p=JSON.parse(localStorage.getItem('tronix_pc')||'{}');PC.bw=_p.bw?1:0;PC.det=_p.det===0?0:1;PC.brk=_p.brk===0?0:1;ME=localStorage.getItem('tronix_me')||''}catch(e){}
var PROF={},ROLE='local',SBM=false;
function can(){return ROLE==='admin'||ROLE==='manager'||ROLE==='local'}
var NEEDS=',newm,copym,editm,delm,restm,savetpl,newt,pub,dcn,dt,dsub,ak,ap,fromgrp,savegrp,cpt,newd,editd,newe,ede,newc,editc,newsp,editsp,editg,deltpl,mvup,mvdn,unl,parc,auc,rvc,catc,dpc,rsc,duc,dcl,nc,edi,sbimp,sbexp,newms,editms,newp,editp,mse,msap,msapp,delf,arch1,ss,msman,';
function $(i){return document.getElementById(i)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function g(c,id){return S[c].filter(function(x){return x.id===id})[0]}
function nm(c,id){var x=g(c,id);return x?x.n:'-'}
function dn(id){var d=g('depts',id);return d?d.n:'بدون قسم'}
function toast(m){var t=$('toast');t.textContent=m;t.className='';setTimeout(function(){t.className='hide'},2800)}
async function add(c,o){if(!db){toast('قاعدة البيانات غير متاحة');return null}try{return await db.collection(c).add(o)}catch(e){toast('مفيش صلاحية تعديل أو حصل خطأ');return null}}
async function upd(c,id,o){if(!db)return;try{await db.doc(c+'/'+id).update(o)}catch(e){toast('مفيش صلاحية تعديل أو حصل خطأ')}}
async function del(c,id){if(!db)return;try{await db.doc(c+'/'+id).delete()}catch(e){toast('مفيش صلاحية تعديل أو حصل خطأ')}}
function lg(m){add('log',{t:Date.now(),m:m,u:uid||''})}
function dstr(ms){var d=new Date(ms);return d.getDate()+'/'+(d.getMonth()+1)+' '+d.getHours()+':'+('0'+d.getMinutes()).slice(-2)}
function ymd(d){return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
var TODAY=ymd(new Date());
PR={from:ymd(new Date(Date.now()-13*864e5)),to:TODAY,g:'day',dp:''};
function pdate(x){var q=x.split('-');return new Date(+q[0],q[1]-1,+q[2])}
function daysTo(x){return Math.round((pdate(x)-pdate(TODAY))/864e5)}
function byCr(a,b){return (a.cr||0)-(b.cr||0)}
function byO(a,b){var x=a.o==null?1e9:a.o,y=b.o==null?1e9:b.o;return (x-y)||((a.cr||0)-(b.cr||0))}
function reidx(c,a){a.forEach(function(x,i){if(x.o!==i){x.o=i;upd(c,x.id,{o:i})}});S[c]=a;render()}
function mv(c,id,d){if(!can()){toast('مفيش صلاحية لهذا الإجراء');return}var a=S[c].slice(),i=a.map(function(x){return x.id}).indexOf(id),j=i+d;if(i<0||j<0||j>=a.length)return;var x=a[i];a[i]=a[j];a[j]=x;reidx(c,a)}
function moveTo(c,id,tid){if(!can()){toast('مفيش صلاحية لهذا الإجراء');return}var a=S[c].slice(),ids=a.map(function(x){return x.id}),i=ids.indexOf(id),j=ids.indexOf(tid);if(i<0||j<0||i===j)return;var x=a.splice(i,1)[0];a.splice(j,0,x);reidx(c,a)}
var MST={new:'لم يتم البدء',go:'جاري',hold:'مؤجلة',ready:'جاهزة للتسليم',del:'تم التسليم'},MSTC={new:'s-new',go:'s-go',hold:'s-new',ready:'s-rev',del:'s-done'},PRI={h:'عالية',m:'متوسطة',l:'منخفضة'},MF='all';
function mstat(m){return m.st||'go'}
function AM(){return S.machines.filter(function(m){return !m.ar&&!m.fac})}
function byDl(a,b){var x=a.dl||'9999',y=b.dl||'9999';return x<y?-1:x>y?1:String(a.n).localeCompare(String(b.n))}
function PJ(){return S.machines.filter(function(m){return !m.ar&&m.fac}).sort(byDl)}
function CT(){return mSorted().concat(PJ())}
function addDays(x,n){var d=pdate(x);d.setDate(d.getDate()+n);return ymd(d)}
function mSorted(){return AM().sort(function(a,b){var x=a.dl||'9999',y=b.dl||'9999';return x<y?-1:x>y?1:String(a.n).localeCompare(String(b.n))})}
function specs(){return S.specs.slice()}
function mt(id){return S.tasks.filter(function(t){return t.m===id&&!t.dr})}
function AT(){var ar={};S.machines.forEach(function(m){if(m.ar)ar[m.id]=1});return S.tasks.filter(function(t){return !ar[t.m]&&!t.dr})}
/* tasks model */
function CL(t){if(Array.isArray(t.cl))return t.cl;var it=t.it||[],o=[],c=it.filter(function(i){return i.k==='c'}),q=it.filter(function(i){return i.k!=='c'});
 function m(i){return {n:i.n,q:i.q||1,av:i.av?1:0,dn:i.dn||0,r:i.r||'',im:0,pb:i.pb||'',pbt:i.pbt||0,cr:i.cr||0}}
 if(c.length)o.push({n:'المكونات',k:'c',it:c.map(m)});if(q.length)o.push({n:'المراحل',k:'s',it:q.map(m)});return o}
function hasCl(t){return CL(t).some(function(c){return c.it.length})}
function kids(id){return S.tasks.filter(function(x){return x.pa===id}).sort(byCr)}
function par(t){return t.pa?g('tasks',t.pa):null}
function lv(t){var n=1,p=par(t),k=0;while(p&&k++<5){n++;p=par(p)}return n}
function isP(t){return kids(t.id).length>0||hasCl(t)}
function OU(t){var o=[];CL(t).forEach(function(c,ci){c.it.forEach(function(i,ii){o.push({t:t,ci:ci,ii:ii,i:i,k:c.k,d:!!i.dn,dn:i.dn||0,cr:i.cr||t.cr||0,r:i.r||t.w,due:t.due})})});
 if(!o.length&&!kids(t.id).length)o.push({t:t,ci:-1,ii:-1,i:null,k:'',d:t.s==='done',dn:t.dn||0,cr:t.cr||0,r:t.w,due:t.due});return o}
function RU(t){var o=OU(t);kids(t.id).forEach(function(k){o=o.concat(RU(k))});return o}
function UA(a){var o=[];a.forEach(function(t){o=o.concat(OU(t))});return o}
function pct(a){var u=UA(a);return u.length?Math.round(u.filter(function(x){return x.d}).length/u.length*100):0}
function prog(t){var u=RU(t);return [u.filter(function(x){return x.d}).length,u.length]}
function ts(t){if(isP(t)&&t.au!==0){var u=RU(t),n=u.filter(function(x){return x.d}).length;if(u.length&&n===u.length)return 'done';if(t.blk)return 'block';
  if(n||u.some(function(x){return x.i&&x.i.av})||kids(t.id).some(function(k){return ts(k)!=='new'}))return 'go';return t.s==='go'?'go':'new'}
 if(t.s==='done')return 'done';if(t.blk||t.s==='block')return 'block';return t.s||'new'}
function tdone(t){return Math.max.apply(null,[0].concat(RU(t).map(function(x){return x.dn||0})))}
function lateU(u){return !u.d&&u.due&&u.due<TODAY}
function late(t){return ts(t)!=='done'&&t.due&&t.due<TODAY}
function risk(m){if(m.fac||!m.dl)return '';var sx=mstat(m);if(sx==='hold'||sx==='del'||sx==='ready')return '';var d=daysTo(m.dl),p=pct(mt(m.id));if(p>=100)return '';if(d<0)return 'متأخر '+(-d)+' يوم';if(d<=14&&p<60)return 'خطر تسليم';return ''}
function dtxt(m){if(!m.dl)return '';var d=daysTo(m.dl);return d>=0?'باقي '+d+' يوم':'تأخر '+(-d)+' يوم'}
function parseLines(txt,k){return txt.split('\n').map(function(l){return l.trim()}).filter(Boolean).map(function(l){var m=l.match(/^(.*?)\s*[×xX*]\s*(\d+)\s*$/);return k==='c'?{k:'c',n:(m?m[1]:l),q:m?+m[2]:1}:{k:'s',n:l,q:1}})}
function mkIt(x){return {n:x.n,q:x.q||1,av:0,dn:0,r:'',im:0,pb:'',pbt:0,cr:Date.now()}}
function cloneCl(t){return JSON.parse(JSON.stringify(CL(t)))}
function who(u){var e=S.emps.filter(function(x){return u&&x.uid===u})[0];return e?e.n:(PROF[u]||'')}
function tupd(t,o,msg){var mm=g('machines',t.m);if(mm&&mm.st==='new'&&!t.dr&&(o.s||o.cl||o.dn))upd('machines',mm.id,{st:'go'});if(!Array.isArray(t.cl)&&!('cl' in o)){o.cl=CL(t);o.it=[]}if(msg)o.hs=[{t:Date.now(),u:uid||'',m:msg}].concat(t.hs||[]).slice(0,40);return upd('tasks',t.id,o)}
function mutCl(t,fn,msg){var c=cloneCl(t);fn(c);return tupd(t,{cl:c,it:[]},msg)}
function desc(id){var o=[];kids(id).forEach(function(k){o.push(k);o=o.concat(desc(k.id))});return o}
function roots(mid){var a=mt(mid),ids={};a.forEach(function(t){ids[t.id]=1});return a.filter(function(t){return !t.pa||!ids[t.pa]}).sort(byCr)}
function crumb(t){var a=[],p=par(t),k=0;while(p&&k++<4){a.unshift(p.d);p=par(p)}return a.join(' ‹ ')}
function nodeCl(x){if(x.cl)return x.cl;var it=x.it||[],o=[],c=it.filter(function(i){return i.k==='c'}),q=it.filter(function(i){return i.k!=='c'});if(c.length)o.push({n:'المكونات',k:'c',it:c});if(q.length)o.push({n:'المراحل',k:'s',it:q});return o}
function nodeOf(t){return {d:t.d,ms:t.ms||'',cat:t.cat||'',dp:t.dp||'',w:t.w||'',rv:t.rv||0,cl:CL(t).map(function(c){return {n:c.n,k:c.k,it:c.it.map(function(i){return {n:i.n,q:i.q||1,r:i.r||'',im:i.im||0}})}}),ch:kids(t.id).map(nodeOf)}}
function gcount(x){var n=0;nodeCl(x).forEach(function(c){n+=c.it.length});(x.ch||[]).forEach(function(k){n+=1+gcount(k)});return n}
function parseTree(txt,max){var root=[],st=[];txt.split('\n').forEach(function(l){var m=l.match(/^\s*([-–—]*)\s*(.*?)\s*$/);if(!m||!m[2])return;var d=Math.min(m[1].length,max-1,st.length),n={d:m[2],ch:[]};if(d===0)root.push(n);else st[d-1].ch.push(n);st[d]=n;st.length=d+1});return root}
function inherit(a,p){a.forEach(function(n){n.cat=p.cat;n.dp=p.dp;n.w=p.w;n.due=p.due;n.ms=p.ms;inherit(n.ch,p)})}
async function mkTree(mid,nodes,pid,dr){var ids=[];for(var i=0;i<nodes.length;i++){var x=nodes[i],ct=g('cats',x.cat);
 var r=await add('tasks',{m:mid,pa:pid||'',d:x.d,cat:x.cat||'',dp:x.dp||(ct?ct.dp:'')||'',w:x.w||'',s:'new',due:x.due||'',n:'',cr:Date.now()+i,dn:0,blk:0,why:'',rv:x.rv||0,ms:msKeep(mid,x.ms),dr:dr||0,cl:nodeCl(x).map(function(c){return {n:c.n,k:c.k,it:c.it.map(function(y){return {n:y.n,q:y.q||1,av:0,dn:0,r:y.r||'',im:y.im||0,pb:'',pbt:0,cr:Date.now()}})}}),it:[],cm:[],hs:[]});
 if(r){ids.push(r.id);if(x.ch&&x.ch.length)await mkTree(mid,x.ch,r.id,dr)}}return ids}
async function closeT(t,force){
 if(!force&&!isP(t)&&t.rv&&t.s!=='done'){await tupd(t,{s:'rev'},'اتبعتت للمراجعة');toast('اتبعتت لمدير القسم للمراجعة');return}
 if(t.au===0){await tupd(t,{s:'done',dn:Date.now(),blk:0,why:''},'اتقفلت');return}
 var all=[t].concat(desc(t.id)),now=Date.now(),n=0;
 for(var k=0;k<all.length;k++){var x=all[k];if(x!==t&&ts(x)!=='done')n++;var c=cloneCl(x);c.forEach(function(cc){cc.it.forEach(function(i){if(!i.dn){i.dn=now;if(cc.k==='c')i.av=1}})});
  await tupd(x,{s:'done',dn:(x.s==='done'&&x.dn)?x.dn:now,blk:0,why:'',cl:c,it:[]},x===t?'اتقفلت':'اتقفلت مع الرئيسية')}
 if(n)toast('اتقفلت التاسك واتقفل معاها '+n+' فرعية')}
async function reopen(t){if(t.au===0){await tupd(t,{s:'new',dn:0,blk:0,why:''},'اتفتحت تاني');return}var c=cloneCl(t);c.forEach(function(cc){cc.it.forEach(function(i){i.dn=0})});await tupd(t,{s:'new',dn:0,blk:0,why:'',cl:c,it:[]},'اتفتحت تاني');if(isP(t)&&ts(t)==='done')toast('افتح الفرعية اللي عايز تعيد فتحها')}
/* milestones */
function msTpl(){return S.mstones.map(function(x){return {id:x.id,n:x.n,off:x.off==null?0:+x.off,gate:x.gate?1:0,cats:(x.cats||[]).slice(),ap:0,man:0}})}
function mscalc(m){return (m.ms||[]).map(function(x){var ts2=mt(m.id).filter(function(t){return t.ms===x.id}),u=UA(ts2),d=u.filter(function(y){return y.d}).length,n=u.length,full=n>0&&d===n;
 var st=n?(full?((x.gate&&!x.ap)?'rev':'done'):(d?'go':'new')):(x.man?'done':'new');var tg=m.dl&&x.off!=null?addDays(m.dl,-(+x.off||0)):'',dd=tg?daysTo(tg):null;
 var rag=st==='done'?'done':(dd==null?'ok':(dd<0?'late':(dd<=3?'risk':'ok')));return {x:x,n:n,d:d,p:n?Math.round(d/n*100):0,st:st,tg:tg,dd:dd,rag:rag,manual:!n}})}
function msByCat(m,cat){if(!m||!cat)return '';var r=(m.ms||[]).filter(function(x){return (x.cats||[]).indexOf(cat)>-1})[0];return r?r.id:''}
function msKeep(mid,id){var mm=g('machines',mid);return id&&mm&&(mm.ms||[]).some(function(z){return z.id===id})?id:''}
function msName(t){var m=g('machines',t.m),x=m&&(m.ms||[]).filter(function(z){return z.id===t.ms})[0];return x?x.n:''}
function setMs(m,fn){var a=JSON.parse(JSON.stringify(m.ms||[]));fn(a);return upd('machines',m.id,{ms:a})}
function mtag(s){return s.st==='done'?'<span class="mtg t-done">تم</span>':s.st==='rev'?'<span class="mtg t-gate">بانتظار الاعتماد</span>':s.rag==='late'?'<span class="mtg t-late">متأخرة '+(-s.dd)+' يوم</span>':s.rag==='risk'?'<span class="mtg t-risk">خطر: '+s.dd+' يوم</span>':'<span class="mtg t-ok">في الميعاد</span>'}
function msOpts(t){var m=g('machines',t.m);return '<option value="">—</option>'+((m&&m.ms)||[]).map(function(x){return '<option value="'+esc(x.id)+'"'+(x.id===t.ms?' selected':'')+'>'+esc(x.n)+'</option>'}).join('')}
