/* files */
function fsz(b){return b>1048576?(b/1048576).toFixed(1)+'MB':Math.max(1,Math.round(b/1024))+'KB'}
function filesOf(sc,tid){return S.files.filter(function(f){return f.s===sc&&(!tid||f.t===tid)}).sort(function(a,b){return (b.at||0)-(a.at||0)})}
function filesCard(sc,tid){var a=filesOf(sc,tid);return '<div class="card"><h3>الملفات ('+a.length+') <button class="btn ghost sm" data-a="upf" data-id="'+sc+'" data-t="'+(tid||'')+'">+ إرفاق ملف</button></h3>'+(a.map(function(f){return '<div class="file">📎 <a style="cursor:pointer;font-weight:600" data-a="dlf" data-id="'+f.id+'">'+esc(f.n)+'</a><small>'+fsz(f.z||0)+(f.at?' | '+dstr(f.at):'')+(who(f.u)?' | '+esc(who(f.u)):'')+'</small><button class="btn ghost sm" data-a="delf" data-id="'+f.id+'">حذف</button></div>'}).join('')||'<div class="mut">'+(SBM?'لا توجد ملفات':'المرفقات بتشتغل مع نسخة Supabase (التخزين).')+'</div>')+'</div>'}
/* modal */
function fld(f){var v=f.v==null?'':f.v,i='f_'+f.k;
 if(f.t==='select')return '<select id="'+i+'">'+f.o.map(function(o){return '<option value="'+esc(o[0])+'"'+(String(o[0])===String(v)?' selected':'')+'>'+esc(o[1])+'</option>'}).join('')+'</select>';
 if(f.t==='chk')return '<div class="mlist" id="'+i+'">'+f.o.map(function(o){return '<label><input type="checkbox" value="'+esc(o[0])+'"'+((f.v||[]).indexOf(o[0])>-1?' checked':'')+'> '+esc(o[1])+'</label>'}).join('')+'</div>';
 if(f.t==='textarea')return '<textarea id="'+i+'" rows="4">'+esc(v)+'</textarea>';
 return '<input id="'+i+'" type="'+(f.t||'text')+'" value="'+esc(v)+'">'}
function modal(title,fields,save,o){o=o||{};
 $('modal').innerHTML='<div class="mb"><h3>'+title+'</h3>'+(o.msg?'<p>'+o.msg+'</p>':'')+fields.map(function(f){return '<label>'+f.l+'</label>'+fld(f)}).join('')+'<div class="acts"><button class="btn" id="ms">'+(o.ok||'حفظ')+'</button>'+(o.again?'<button class="btn ghost" id="ma">حفظ وإضافة آخر</button>':'')+(o.del?'<button class="btn ghost" id="md">حذف</button>':'')+'<button class="btn ghost" id="mc">إلغاء</button></div></div>';
 $('modal').className='ov';$('mc').onclick=closeM;
 function collect(){var v={};fields.forEach(function(f){v[f.k]=f.t==='chk'?[].slice.call($('f_'+f.k).querySelectorAll('input:checked')).map(function(x){return x.value}):$('f_'+f.k).value});return v}
 $('ms').onclick=function(){if(save(collect())!==false)closeM()};
 if(o.again)$('ma').onclick=function(){if(save(collect())!==false){var ck=o.clear||[fields[0].k];ck.forEach(function(k){var el=$('f_'+k);if(el)el.value=''});var f0=$('f_'+ck[0]);if(f0)f0.focus();toast('اتحفظ. كمّل بيانات الجديد')}};
 if(o.del)$('md').onclick=function(){closeM();ask('تأكيد الحذف؟ لا يمكن التراجع.',o.del)};
 if(o.init)o.init()}
function closeM(){$('modal').className='ov hide';$('modal').innerHTML='';render()}
function ask(msg,fn){modal('تأكيد',[],function(){fn()},{msg:msg,ok:'تأكيد'})}
function opts(c,blank){var a=blank?[['','—']]:[];S[c].forEach(function(x){a.push([x.id,x.n])});return a}
function empsOf(dp){return S.emps.filter(function(e){return !dp||e.dp===dp})}
function eoptsD(dp,cur){var a=[['','—']].concat(empsOf(dp).map(function(e){return [e.id,e.n]}));if(cur&&!empsOf(dp).some(function(e){return e.id===cur})){var c=g('emps',cur);if(c)a.push([c.id,c.n+' ('+dn(c.dp)+')'])}return a}
function eopts(){var a=[['','—']];S.emps.forEach(function(e){a.push([e.id,e.n+' ('+dn(e.dp)+')'])});return a}
/* print */
function svPC(){try{localStorage.setItem('tronix_pc',JSON.stringify(PC))}catch(e){}}
function pset(x){return '<select data-a="pcor"><option value="0"'+(!PC.or?' selected':'')+'>ورقة طولي</option><option value="1"'+(PC.or?' selected':'')+'>ورقة عرضي</option></select><select data-a="pcbw"><option value="0"'+(!PC.bw?' selected':'')+'>طباعة: ألوان</option><option value="1"'+(PC.bw?' selected':'')+'>طباعة: أبيض وأسود</option></select><select data-a="pcdet"><option value="1"'+(PC.det?' selected':'')+'>بالتفصيل (مكونات + فحص)</option><option value="0"'+(!PC.det?' selected':'')+'>التاسكات فقط</option></select>'+(x?'<select data-a="pcbrk"><option value="1"'+(PC.brk?' selected':'')+'>كل ماكينة في صفحة</option><option value="0"'+(!PC.brk?' selected':'')+'>الماكينات متتالية بفاصل</option></select>':'')}
var PT0='',PO=0;
function pname(){return Array.prototype.slice.call(arguments).concat([ymd(new Date())]).filter(Boolean).join(' - ').replace(/[\\/:*?"<>|]+/g,' ').replace(/\s+/g,' ').trim()}
function printDoc(h,nm){var p=$('pr');p.className=(PC.bw?'bw':'')+(PC.or?' ls':'');p.innerHTML=h;var sy=$('pgs');if(!sy){sy=document.createElement('style');sy.id='pgs';document.head.appendChild(sy)}sy.textContent='@page{size:A4 '+(PC.or?'landscape':'portrait')+';margin:0}';document.body.classList.add('pm');if(nm){PT0=document.title;document.title=nm}try{window.print()}catch(e){if(PT0){document.title=PT0;PT0=''}toast('استخدم طباعة المتصفح (Ctrl+P) واحفظ PDF')}}
window.addEventListener('afterprint',function(){document.body.classList.remove('pm');if(PT0){document.title=PT0;PT0=''}});
var SIG='<span>توقيع المسؤول</span><span>تاريخ الاستلام</span>';
function pg(title,sub,boxes,body,sig){return '<section class="pg"><div class="hb"><span class="lg">متابعة TRONIX</span><span class="dt">'+new Date().toLocaleDateString('ar-EG-u-nu-latn')+'</span></div><div class="pbd"><h1 class="ti">'+title+'</h1><div class="su">'+sub+'</div>'+(boxes?'<div class="bx">'+boxes.map(function(b){return '<div><small>'+b[0]+'</small><b>'+b[1]+'</b></div>'}).join('')+'</div>':'')+body+'</div><div class="ft">'+(sig||SIG)+'</div></section>'}
function chip(s){return s==='done'?'<span class="cp c-done">● تم</span>':s==='go'?'<span class="cp c-go">◐ جاري</span>':s==='block'?'<span class="cp c-blk">✖ معطّل</span>':s==='rev'?'<span class="cp c-go">◔ بانتظار المراجعة</span>':'<span class="cp">○ لم يبدأ</span>'}
function ichip(i,k){return i.dn?chip('done'):(k==='c'&&i.av)?'<span class="cp c-go">◐ متوفر</span>':chip('new')}
function compRows(a){var o=[];a.forEach(function(t){CL(t).forEach(function(c){if(c.k==='c')c.it.forEach(function(i){if(!(PO&&i.dn))o.push([t,i])})})});return o}
function chkRows(a){var o=[];a.forEach(function(t){CL(t).forEach(function(c){if(c.k!=='c')c.it.forEach(function(i){if(!(PO&&i.dn))o.push([t,i,c.n])})})});return o}
function frame(t,b){return '<div class="fr"><h4>'+t+'</h4>'+b+'</div>'}
function tnm(t){return (t.pa?'<small>'+esc(crumb(t))+' ‹ </small>':'')+esc(t.d)}
function ttab(a){var h='',cr=PC.det?compRows(a):[],kr=PC.det?chkRows(a):[];
 if(cr.length)h+=frame('المكونات','<table><tr><th>المكوّن</th><th style="width:44px">الكمية</th><th>التاسك</th><th style="width:44px">متوفر</th><th style="width:44px">مركّب</th><th>المسؤول</th><th>المسؤول الفعلي</th><th>ملاحظات</th></tr>'+cr.map(function(x){var t=x[0],i=x[1];return '<tr><td>'+(i.im?'★ ':'')+esc(i.n)+'</td><td class="nw"><span class="qty">'+(i.q||1)+'</span></td><td>'+tnm(t)+'</td><td class="nw">'+(i.av||i.dn?'☑':'☐')+'</td><td class="nw">'+(i.dn?'☑':'☐')+'</td><td class="nw">'+esc(nm('emps',i.r||t.w))+'</td><td class="nw"></td><td>'+(i.pb?'⚠ '+esc(i.pb):'')+'</td></tr>'}).join('')+'</table>');
 h+=frame('التاسكات','<table><tr><th style="width:26px">✓</th><th>التاسك</th><th>المسؤول</th><th>المسؤول الفعلي</th><th>الاستحقاق</th><th>الحالة</th><th>ملاحظات</th></tr>'+a.map(function(t){var s=ts(t),pa=isP(t),pg=prog(t);return '<tr'+(pa?' class="p"':'')+'><td>'+(s==='done'?'☑':'☐')+'</td><td>'+tnm(t)+(pa?' ('+pg[0]+'/'+pg[1]+')':'')+'</td><td class="nw">'+esc(nm('emps',t.w))+'</td><td class="nw"></td><td class="nw">'+esc(t.due||'')+(late(t)?' <b class="late">متأخر</b>':'')+'</td><td class="nw">'+chip(s)+'</td><td>'+esc(t.n||(s==='block'&&t.why?t.why:''))+'</td></tr>'}).join('')+'</table>');
 if(kr.length)h+=frame('قائمة الفحص (Check) بعد الانتهاء','<table><tr><th style="width:26px">✓</th><th>البند</th><th>التاسك</th><th>المسؤول</th><th>المسؤول الفعلي</th><th>ملاحظات</th></tr>'+kr.map(function(x){var t=x[0],i=x[1];return '<tr><td>'+(i.dn?'☑':'☐')+'</td><td>'+(i.im?'★ ':'')+esc(i.n)+'</td><td>'+tnm(t)+'</td><td class="nw">'+esc(nm('emps',i.r||t.w))+'</td><td class="nw"></td><td>'+(i.pb?'⚠ '+esc(i.pb):'')+'</td></tr>'}).join('')+'</table>');
 return h}
function mband(m){return '<div class="sb"><b>'+(m.fac?'مشروع مصنع: ':'')+esc(m.n)+'</b><span>'+(m.dl?(m.fac?'الهدف: ':'تسليم: ')+esc(m.dl)+' — '+dtxt(m):'')+'</span></div>'}
function specRows(m){if(m.fac)return [['النوع',m.cat],['المسؤول',nm('emps',m.own)],['الأولوية',PRI[m.pri||'m']],['تاريخ الهدف',m.dl],['الحالة',MST[mstat(m)]]];return [['النوع',m.typ],['القدرة',m.pw],['الأبعاد',m.dim],['سنة التصنيع',m.yr],['تاريخ التسليم',m.dl]].concat(specs().map(function(x){return [x.n,(m.sp||{})[x.id]]})).concat((m.extra||'').split('\n').filter(Boolean).map(function(l){return [l.split(':')[0],l.split(':').slice(1).join(':')]}))}
function specDoc(m){var r=specRows(m);return pg('المواصفات الفنية',esc(m.n),null,'<div class="kc">'+r.slice(0,3).concat([r[4]]).map(function(x){return '<div><small>'+esc(x[0])+'</small><b>'+esc(x[1]||'-')+'</b></div>'}).join('')+'</div><div class="sec">تفاصيل الماكينة</div><div class="sp">'+r.slice(3,4).concat(r.slice(5)).map(function(x){return '<div><small>'+esc(x[0])+'</small><b>'+esc(x[1]||'-')+'</b></div>'}).join('')+'</div><div class="sec">ملاحظات</div><div class="lines"></div>',"<span>اعتماد الإنتاج</span><span>اعتماد الجودة</span>")}
function mtF(id){return mt(id).filter(function(t){return (F.st==='all'||ts(t)===F.st)&&(!F.dp||t.dp===F.dp)&&(!F.ms||t.ms===F.ms)}).sort(byCr)}
function mTasksDoc(m){var a=mtF(m.id).filter(function(t){return !PO||ts(t)!=='done'}),ds=[];a.forEach(function(t){if(ds.indexOf(t.dp||'')<0)ds.push(t.dp||'')});
 var okm=function(k){return a.indexOf(k)>-1},inc={};ds.forEach(function(d){if(d)withKids(a.filter(function(t){return t.dp===d}),okm).forEach(function(t){inc[t.id]=1})});
 return ds.map(function(d){var x=tord(d?withKids(a.filter(function(t){return t.dp===d}),okm):a.filter(function(t){return !t.dp&&!inc[t.id]})),u=UA(x);return pg('تاسكات '+esc(dn(d)),'ماكينة '+esc(m.n)+(m.dl?' — تسليم: '+esc(m.dl):'')+(PO?' — الناقص فقط':''),[['عدد التاسكات',x.length],['العناصر الناقصة',u.filter(function(y){return !y.d}).length],['المتأخر',u.filter(lateU).length],['نسبة الإنجاز',pct(x)+'%']],ttab(x))}).join('')}
function deptGroups(){
 var ms=D.ms.length?CT().filter(function(m){return D.ms.indexOf(m.id)>-1}):CT(),ids=ms.map(function(m){return m.id});
 var ok=function(t){return !t.dr&&ids.indexOf(t.m)>-1&&(D.st==='all'||(D.st==='open'?ts(t)!=='done':ts(t)===D.st))},a=S.tasks.filter(function(t){return ok(t)&&(!D.dp||t.dp===D.dp)});
 var gs=S.depts.filter(function(d){return !D.dp||d.id===D.dp}).map(function(d){return {d:d,t:withKids(a.filter(function(t){return t.dp===d.id}),ok)}});
 if(!D.dp){var inG={};gs.forEach(function(x){x.t.forEach(function(t){inG[t.id]=1})});var un=a.filter(function(t){return !g('depts',t.dp)&&!inG[t.id]});if(un.length)gs.push({d:{n:'بدون قسم'},t:un})}
 return {gs:gs.filter(function(x){return x.t.length}),ms:ms}}
function mhead(m){return '<div class="gh'+(m.fac?' gh2':'')+'"><b>'+(m.fac?'مشروع مصنع: ':'')+esc(m.n)+'</b><span>'+(m.dl?(m.fac?'الهدف: ':'تسليم: ')+esc(m.dl)+' — '+dtxt(m):'')+'</span></div>'}
function deptBody(pr){var r=deptGroups(),out=[];
 r.gs.forEach(function(x){var hd=x.d.head&&g('emps',x.d.head)?nm('emps',x.d.head):'-',ms=r.ms.filter(function(m){return x.t.some(function(t){return t.m===m.id})});
  function bx(t){var u=UA(t);return [['عدد التاسكات',t.length],['العناصر الناقصة',u.filter(function(y){return !y.d}).length],['المتأخر',u.filter(lateU).length],['مسؤول القسم',esc(hd)]]}
  if(pr&&PC.brk){ms.forEach(function(m){var t=tord(x.t.filter(function(y){return y.m===m.id}));out.push(pg('تاسكات '+esc(x.d.n),(m.fac?'مشروع مصنع ':'ماكينة ')+esc(m.n)+(m.dl?' — '+(m.fac?'الهدف':'تسليم')+': '+esc(m.dl)+' — '+dtxt(m):''),bx(t),ttab(t)))})}
  else{var spj=0,inner=ms.map(function(m){var t=tord(x.t.filter(function(y){return y.m===m.id}));var sepH=(m.fac&&!spj)?(spj=1,pr?'':'<div class="sep2h">مشاريع المصنع</div>'):'';return sepH+(pr?mband(m)+ttab(t)+'<div class="mgap"></div>':mhead(m)+'<div class="gp">'+ttab(t)+'</div><div class="mgap"></div>')}).join('');
   out.push(pr?pg('تاسكات '+esc(x.d.n),'مرتبة بتاريخ تسليم الماكينة (الأقرب أولًا)',bx(x.t),inner):'<div class="dg"><h2>'+esc(x.d.n)+' <small>— المسؤول: '+esc(hd)+'</small></h2>'+inner+'</div>')}});
 return out.join('')}
function empDoc(){var gs=S.depts.map(function(d){return {n:d.n,h:d.head,e:S.emps.filter(function(e){return e.dp===d.id})}}),un=S.emps.filter(function(e){return !g('depts',e.dp)});if(un.length)gs.push({n:'بدون قسم',h:'',e:un});
 return gs.filter(function(x){return x.e.length}).map(function(x){return pg('موظفين قسم '+esc(x.n),'قائمة الأسماء',[['عدد الموظفين',x.e.length],['مسؤول القسم',esc(x.h&&g('emps',x.h)?nm('emps',x.h):'-')]],'<table><tr><th style="width:34px">م</th><th>الاسم</th><th>الوظيفة</th><th>ملاحظات</th></tr>'+x.e.map(function(e,i){return '<tr><td class="nw">'+(i+1)+'</td><td>'+(x.h===e.id?'★ ':'')+esc(e.n)+'</td><td>'+esc(e.role||'')+'</td><td></td></tr>'}).join('')+'</table>',"<span>اعتماد مدير القسم</span><span>اعتماد الإدارة</span>")}).join('')}
function lateDoc(dp){return lateGroups(dp).map(function(x){var hd=x.d.head&&g('emps',x.d.head)?nm('emps',x.d.head):'-';return pg('المتأخر — '+esc(x.d.n),'حتى '+TODAY+' — مرتّب بالأقدم أولًا',[['عدد البنود المتأخرة',x.r.length],['أقدم تأخير',x.r[0].dl+' يوم'],['مسؤول القسم',esc(hd)]],'<table><tr><th style="width:30px">م</th><th>الماكينة</th><th>التاسك</th><th>البند</th><th>المسؤول</th><th>المسؤول الفعلي</th><th>الاستحقاق</th><th>التأخير</th><th>ملاحظات</th></tr>'+x.r.map(function(r,i){return '<tr><td class="nw">'+(i+1)+'</td><td>'+esc(nm('machines',r.t.m))+'</td><td>'+tnm(r.t)+'</td><td>'+esc(r.u.i?r.u.i.n:'')+'</td><td class="nw">'+esc(nm('emps',r.u.r))+'</td><td class="nw"></td><td class="nw">'+esc(r.u.due)+'</td><td class="nw"><b class="late">'+r.dl+' يوم</b></td><td>'+(r.u.i&&r.u.i.pb?'⚠ '+esc(r.u.i.pb):'')+'</td></tr>'}).join('')+'</table>')}).join('')}
function xlsxBook(kind){var X=window.XLSX;if(!X){toast('مكتبة Excel مش متحمّلة. اتأكد من الإنترنت وجرّب تاني');return}
 var wb=X.utils.book_new();
 function sh(name,head,rows,w){var ws=X.utils.aoa_to_sheet([head].concat(rows));ws['!cols']=w.map(function(x){return {wch:x}});X.utils.book_append_sheet(wb,ws,name)}
 function nz(c,id){var x=id?g(c,id):null;return x?x.n:''}
 var lr=[];lateGroups('').forEach(function(x){x.r.forEach(function(r){lr.push([x.d.n,nm('machines',r.t.m),(r.t.pa?crumb(r.t)+' ‹ ':'')+r.t.d,r.u.i?r.u.i.n:'',nz('emps',r.u.r),r.u.due,r.dl])})});
 var lh=['القسم','الماكينة','التاسك','البند','المسؤول','الاستحقاق','أيام التأخير'],lw=[16,22,36,28,18,14,12];
 if(kind==='late'){sh('المتأخر',lh,lr,lw)}
 else{
  sh('الماكينات',['الماكينة / المشروع','النوع','الحالة','تاريخ التسليم','الإنجاز %','عدد العناصر','المتبقي','تنبيه'],CT().map(function(m){return [m.n,m.fac?'مشروع مصنع':(m.typ||''),MST[mstat(m)],m.dl||'',pct(mt(m.id)),UA(mt(m.id)).length,m.dl?dtxt(m):'',risk(m)]}),[26,16,16,14,12,12,16,18]);
  var tr=[],br=[];
  AT().forEach(function(t){var p=prog(t),s=ts(t);tr.push([nm('machines',t.m),(t.pa?crumb(t)+' ‹ ':'')+t.d,lv(t),dn(t.dp),nz('cats',t.cat),nz('emps',t.w),t.due||'',ST[s][0],p[1]?Math.round(p[0]/p[1]*100):0,p[0],p[1],late(t)?'نعم':'لا',s==='block'?(t.why||''):(t.n||'')]);
   CL(t).forEach(function(c){c.it.forEach(function(i){br.push([nm('machines',t.m),(t.pa?crumb(t)+' ‹ ':'')+t.d,c.n,i.n,c.k==='c'?'مكوّن':'مرحلة',i.q||1,c.k==='c'?(i.av||i.dn?'نعم':'لا'):'',i.dn?'نعم':'لا',nz('emps',i.r||t.w),i.pb||''])})})});
  sh('التاسكات',['الماكينة','التاسك','المستوى','القسم','التصنيف','المسؤول','الاستحقاق','الحالة','الإنجاز %','خلص','الإجمالي','متأخر','ملاحظات / سبب التعطيل'],tr,[22,38,9,16,16,18,14,16,11,8,10,9,30]);
  sh('البنود',['الماكينة','التاسك','الـ Checklist','البند','النوع','الكمية','متوفر','تم / مركّب','المسؤول','مشكلة'],br,[22,36,18,30,10,9,9,11,18,26]);
  sh('المتأخر',lh,lr,lw)}
 wb.Workbook={Views:[{RTL:true}]};X.writeFile(wb,'tronix-tracker-'+(kind==='late'?'late-':'')+TODAY+'.xlsx')}
function withKids(own,ok){var seen={},ex=[];own.forEach(function(t){seen[t.id]=1});own.forEach(function(t){desc(t.id).forEach(function(k){if(!seen[k.id]&&ok(k)){seen[k.id]=1;ex.push(k)}})});return own.concat(ex)}
function tord(a){var ids={},o=[];a.forEach(function(t){ids[t.id]=1});function add(t){o.push(t);a.filter(function(k){return k.pa===t.id}).sort(byCr).forEach(add)}a.filter(function(t){return !t.pa||!ids[t.pa]}).sort(byCr).forEach(add);return o}

/* تقرير تسليم الماكينة (للطباعة وتتملي يدوي) */
var HC='☐';
var HRCSS='<style>#pr .hrp{min-height:0}#pr .hrs{break-inside:avoid;page-break-inside:avoid}#pr .hrt td,#pr .hrt th{padding:3px 5px}#pr .hrt .tk{text-align:center;font-size:14px;width:44px}#pr .hrt tr{height:7mm}#pr .hrf{border-top:1px solid var(--ln);padding:6px 12mm 8mm;color:var(--mt);font-size:10px;display:flex;justify-content:space-between}</style>';
function hrNo(m){return 'TR-'+ymd(new Date()).replace(/-/g,'')+'-'+(m?String(m.id).replace(/[^a-z0-9]/gi,'').slice(-4).toUpperCase():'BLANK')}
function hrPg(title,sub,boxes,body,foot){return '<section class="pg hrp"><div class="hb"><span class="lg">متابعة TRONIX</span><span class="dt">'+new Date().toLocaleDateString('ar-EG-u-nu-latn')+'</span></div><div class="pbd"><h1 class="ti">'+title+'</h1><div class="su">'+sub+'</div>'+(boxes?'<div class="bx">'+boxes.map(function(b){return '<div><small>'+b[0]+'</small><b>'+b[1]+'</b></div>'}).join('')+'</div>':'')+body+'</div><div class="hrf">'+foot+'</div></section>'}
function hrWho(){return '<div style="margin:2px 0 10px;font-size:11px">الفاحص: ______________________ &nbsp;&nbsp; التاريخ: ____ / ____ / ________</div>'}
function hrRows(items,n){var a=(items||[]).concat(['','']);return a.map(function(x,i){return '<tr><td class="nw">'+(i+1)+'</td><td>'+esc(x)+'</td><td class="tk">'+HC+'</td><td class="tk">'+HC+'</td><td class="tk" style="width:54px">'+HC+'</td><td></td></tr>'}).join('')}
function hrTest(title,items,who,extra){return '<div class="hrs"><div class="sec">'+title+'</div><table class="hrt"><tr><th style="width:26px">م</th><th>البند</th><th style="width:44px">سليم</th><th style="width:44px">ملاحظة</th><th style="width:54px">لا ينطبق</th><th style="width:26%">ملاحظات</th></tr>'+hrRows(items)+'</table>'+(extra||'')+(who===false?'':hrWho())+'</div>'}
function hrAcc(l){var m=String(l).match(/^(.*?)\s*[×xX*]\s*(\d+)\s*$/);return m?[m[1],m[2]]:[l,'']}
function hrSpecs(m,sp){var r=sp||(m?specRows(m).filter(function(x){return x[0]!=='تاريخ التسليم'}):[['النوع'],['القدرة'],['الأبعاد'],['سنة التصنيع']].concat(specs().map(function(x){return [x.n]})));r=r.concat([['',''],['','']]);
 return '<div class="hrs"><div class="sec">1) مطابقة المواصفات</div><table class="hrt"><tr><th>البند</th><th style="width:27%">المطلوب (من النظام)</th><th style="width:44px">مطابق</th><th style="width:44px">مختلف</th><th style="width:27%">المركّب فعليًا (لو مختلف)</th></tr>'+r.map(function(x){return '<tr><td>'+esc(x[0])+'</td><td><b>'+esc(x[1]||'')+'</b></td><td class="tk">'+HC+'</td><td class="tk">'+HC+'</td><td></td></tr>'}).join('')+'</table></div>'}
function hrInfo(){var f=['الرقم التسلسلي للماكينة','اسم العميل','موقع التركيب','تاريخ التسليم الفعلي','اسم المستلم'];
 return '<div class="hrs"><div class="sec">بيانات التسليم</div><table class="hrt">'+f.map(function(x){return '<tr><th style="width:32%;text-align:start">'+x+'</th><td></td></tr>'}).join('')+'</table></div>'}
function hrSummary(m){var all=mt(m.id),u=UA(all),op=u.filter(function(x){return !x.d}),ms=mscalc(m),st={done:'تمت',rev:'بانتظار الاعتماد',go:'جارية',new:'لم تبدأ'},by={};
 u.forEach(function(x){var k=dn(x.t.dp),o=by[k]=by[k]||{n:k,t:0,d:0};o.t++;if(x.d)o.d++});
 var rows=Object.keys(by).map(function(k){return by[k]}).sort(function(a,b){return (b.t-b.d)-(a.t-a.d)});
 var h='<div class="hrs"><div class="sec">8) حالة الماكينة في النظام <small style="font-weight:400">(لقطة وقت الطباعة: '+dstr(Date.now())+')</small></div><div class="kc"><div><small>نسبة الإنجاز</small><b>'+pct(all)+'%</b></div><div><small>العناصر الناقصة</small><b>'+op.length+'</b></div><div><small>المتأخر</small><b>'+op.filter(lateU).length+'</b></div>'
  +(ms.length?'<div><small>المراحل المكتملة</small><b>'+ms.filter(function(s){return s.st==='done'}).length+' / '+ms.length+'</b></div>':'<div><small>مهام معطّلة</small><b>'+all.filter(function(t){return ts(t)==='block'}).length+'</b></div>')+'</div>';
 h+='<table class="hrt"><tr><th>القسم</th><th style="width:70px">الإجمالي</th><th style="width:70px">تم</th><th style="width:70px">ناقص</th><th style="width:60px">%</th></tr>'+(rows.length?rows.map(function(o){return '<tr><td>'+esc(o.n)+'</td><td class="nw" style="text-align:center">'+o.t+'</td><td class="nw" style="text-align:center">'+o.d+'</td><td class="nw" style="text-align:center"><b>'+(o.t-o.d)+'</b></td><td class="nw" style="text-align:center">'+Math.round(o.d/o.t*100)+'%</td></tr>'}).join(''):'<tr><td colspan="5" style="text-align:center">لا توجد بنود</td></tr>')+'</table>';
 if(ms.length)h+='<table class="hrt"><tr><th>المرحلة</th><th style="width:90px">تمت / الكل</th><th style="width:110px">الحالة</th></tr>'+ms.map(function(s){return '<tr><td>'+esc(s.x.n)+'</td><td class="nw" style="text-align:center">'+s.d+' / '+s.n+'</td><td>'+(st[s.st]||'')+'</td></tr>'}).join('')+'</table>';
 return h+'</div>'}
function hrAnnex(m,an){var u=UA(mt(m.id)).filter(function(x){return !x.d&&(an==='all'||x.t.dp===an)}),by={},ks=[];
 u.forEach(function(x){var k=dn(x.t.dp);if(!by[k]){by[k]=[];ks.push(k)}by[k].push(x)});
 if(!u.length)return '<div class="sec">لا يوجد ناقص مفتوح</div>';
 return ks.map(function(k){return '<div class="sec">'+esc(k)+' <small style="font-weight:400">('+by[k].length+' عنصر ناقص)</small></div><table class="hrt"><tr><th style="width:30px">م</th><th>التاسك / العنصر الناقص</th><th style="width:95px">المسؤول</th><th style="width:75px">الاستحقاق</th><th style="width:80px">قبل الخروج</th></tr>'
  +by[k].map(function(x,i){return '<tr><td class="nw">'+(i+1)+'</td><td>'+esc(x.t.d)+(x.i?' — '+esc(x.i.n):'')+'</td><td>'+esc(nm('emps',x.r))+'</td><td class="nw">'+esc(x.due||'')+'</td><td class="nw">'+HC+' اتنفذ</td></tr>'}).join('')+'</table>'}).join('')}
function handoverDoc(m,tp,o){o=o||{};var no=hrNo(m),sub=(m?esc(m.n):'نموذج فاضي')+' — قالب الفحص: '+esc(tp.n),foot='<span>تقرير تسليم · '+(m?esc(m.n):'نموذج فاضي')+'</span><span dir="ltr">'+no+'</span>',
 boxes=[['الماكينة',m?esc(m.n):'—'],['النوع / الموديل',m?esc(m.typ||'-'):'—'],['تاريخ التسليم المخطط',m?esc(m.dl||'-'):'—'],['رقم التقرير','<span dir="ltr">'+no+'</span>']];
 var p1=hrPg('تقرير تسليم ماكينة',sub,boxes,hrInfo()+hrSpecs(m,o.sp),foot);
 var p2=hrPg('اختبارات الميكانيكا والكهرباء',sub,null,hrTest('2) اختبار الميكانيكا',tp.mech)+hrTest('3) اختبار الكهرباء',tp.elec),foot);
 var draw='<div style="display:flex;gap:8px;margin:4px 0 4px"><div style="flex:1;border:1px solid var(--ln);border-radius:6px;height:42mm;padding:4px;font-size:10px;color:var(--mt)">منظر علوي: علّم أماكن الخدوش أو العيوب</div><div style="flex:1;border:1px solid var(--ln);border-radius:6px;height:42mm;padding:4px;font-size:10px;color:var(--mt)">منظر جانبي: علّم أماكن الخدوش أو العيوب</div></div>';
 var ac=(tp.acc||[]).map(hrAcc).concat([['',''],['','']]);
 var acT='<div class="hrs"><div class="sec">5) مستلزمات التركيب اللي بتخرج مع الماكينة</div><table class="hrt"><tr><th style="width:26px">م</th><th>المستلزم</th><th style="width:60px">الكمية</th><th style="width:70px">اتسلّم</th><th style="width:28%">ملاحظات</th></tr>'+ac.map(function(x,i){return '<tr><td class="nw">'+(i+1)+'</td><td>'+esc(x[0])+'</td><td class="nw" style="text-align:center">'+esc(x[1])+'</td><td class="nw" style="text-align:center">'+HC+' تم</td><td></td></tr>'}).join('')+'</table></div>';
 var p3=hrPg('حالة الشاسيه ومستلزمات التركيب',sub,null,hrTest('4) حالة الشاسيه',tp.chas,true,draw)+acT,foot);
 var sr=(tp.ser||[]).concat(['','']),rd=(tp.rd||[]).concat(['','']);
 var p4=hrPg('الأرقام التسلسلية وقراءات التشغيل',sub,null,'<div class="hrs"><div class="sec">6) الأرقام التسلسلية للمكونات الرئيسية</div><table class="hrt"><tr><th style="width:26px">م</th><th style="width:32%">المكوّن</th><th>الموديل / الماركة</th><th style="width:34%">الرقم التسلسلي</th></tr>'+sr.map(function(x,i){return '<tr><td class="nw">'+(i+1)+'</td><td>'+esc(x)+'</td><td></td><td></td></tr>'}).join('')+'</table></div>'
  +'<div class="hrs"><div class="sec">7) قراءات التشغيل التجريبي</div><table class="hrt"><tr><th style="width:26px">م</th><th style="width:45%">القراءة</th><th>القيمة المقاسة</th></tr>'+rd.map(function(x,i){return '<tr><td class="nw">'+(i+1)+'</td><td>'+esc(x)+'</td><td></td></tr>'}).join('')+'</table></div>',foot);
 var sg=(tp.sg&&tp.sg.length?tp.sg:['فاحص الميكانيكا','فاحص الكهرباء','مراقب الجودة','مدير الإنتاج','المستلم']),n0=m?9:8;
 var p5=hrPg('الحالة عند الخروج والاعتماد',sub,null,(m?hrSummary(m):'')
  +'<div class="hrs"><div class="sec">'+n0+') حالة الخروج</div><div style="font-size:13px;margin:4px 0 8px">'+HC+' جاهزة بالكامل &nbsp;&nbsp;&nbsp; '+HC+' تسليم بنواقص متفق عليها &nbsp;&nbsp;&nbsp; '+HC+' مؤجلة</div><div style="font-size:11px;margin-bottom:3px">ملاحظات عامة:</div><div class="lines" style="height:26mm"></div></div>'
  +'<div class="hrs"><div class="sec">'+(n0+1)+') التوقيعات والاعتماد</div><table class="hrt"><tr><th style="width:26%">الدور</th><th>الاسم</th><th style="width:28%">التوقيع</th><th style="width:16%">التاريخ</th></tr>'+sg.map(function(x){return '<tr style="height:11mm"><td><b>'+esc(x)+'</b></td><td></td><td></td><td></td></tr>'}).join('')+'</table></div>',foot);
 var an=(m&&o.an)?hrPg('ملحق: الناقص المفتوح'+(o.an==='all'?'':' — '+esc(dn(o.an))),sub,null,hrAnnex(m,o.an),foot):'';
 return HRCSS+p1+p2+p3+p4+p5+an}
