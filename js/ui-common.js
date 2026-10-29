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
function printDoc(h){var p=$('pr');p.className=(PC.bw?'bw':'')+(PC.or?' ls':'');p.innerHTML=h;var sy=$('pgs');if(!sy){sy=document.createElement('style');sy.id='pgs';document.head.appendChild(sy)}sy.textContent='@page{size:A4 '+(PC.or?'landscape':'portrait')+';margin:0}';document.body.classList.add('pm');try{window.print()}catch(e){toast('استخدم طباعة المتصفح (Ctrl+P) واحفظ PDF')}}
window.addEventListener('afterprint',function(){document.body.classList.remove('pm')});
var SIG='<span>توقيع المسؤول</span><span>تاريخ الاستلام</span>';
function pg(title,sub,boxes,body,sig){return '<section class="pg"><div class="hb"><span class="lg">متابعة TRONIX</span><span class="dt">'+new Date().toLocaleDateString('ar-EG')+'</span></div><div class="pbd"><h1 class="ti">'+title+'</h1><div class="su">'+sub+'</div>'+(boxes?'<div class="bx">'+boxes.map(function(b){return '<div><small>'+b[0]+'</small><b>'+b[1]+'</b></div>'}).join('')+'</div>':'')+body+'</div><div class="ft">'+(sig||SIG)+'</div></section>'}
function chip(s){return s==='done'?'<span class="cp c-done">● تم</span>':s==='go'?'<span class="cp c-go">◐ جاري</span>':s==='block'?'<span class="cp c-blk">✖ معطّل</span>':s==='rev'?'<span class="cp c-go">◔ بانتظار المراجعة</span>':'<span class="cp">○ لم يبدأ</span>'}
function ichip(i,k){return i.dn?chip('done'):(k==='c'&&i.av)?'<span class="cp c-go">◐ متوفر</span>':chip('new')}
function compRows(a){var o=[];a.forEach(function(t){CL(t).forEach(function(c){if(c.k==='c')c.it.forEach(function(i){o.push([t,i])})})});return o}
function chkRows(a){var o=[];a.forEach(function(t){CL(t).forEach(function(c){if(c.k!=='c')c.it.forEach(function(i){o.push([t,i,c.n])})})});return o}
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
function mTasksDoc(m){var a=mtF(m.id),ds=[];a.forEach(function(t){if(ds.indexOf(t.dp||'')<0)ds.push(t.dp||'')});
 return ds.map(function(d){var x=a.filter(function(t){return (t.dp||'')===d}),u=UA(x);return pg('تاسكات '+esc(dn(d)),'ماكينة '+esc(m.n)+(m.dl?' — تسليم: '+esc(m.dl):''),[['عدد التاسكات',x.length],['العناصر الناقصة',u.filter(function(y){return !y.d}).length],['المتأخر',u.filter(lateU).length],['نسبة الإنجاز',pct(x)+'%']],ttab(x))}).join('')}
function deptGroups(){
 var ms=D.ms.length?CT().filter(function(m){return D.ms.indexOf(m.id)>-1}):CT(),ids=ms.map(function(m){return m.id});
 var a=S.tasks.filter(function(t){return !t.dr&&ids.indexOf(t.m)>-1&&(!D.dp||t.dp===D.dp)&&(D.st==='all'||(D.st==='open'?ts(t)!=='done':ts(t)===D.st))});
 var gs=S.depts.filter(function(d){return !D.dp||d.id===D.dp}).map(function(d){return {d:d,t:a.filter(function(t){return t.dp===d.id})}});
 if(!D.dp){var un=a.filter(function(t){return !g('depts',t.dp)});if(un.length)gs.push({d:{n:'بدون قسم'},t:un})}
 return {gs:gs.filter(function(x){return x.t.length}),ms:ms}}
function mhead(m){return '<div class="gh'+(m.fac?' gh2':'')+'"><b>'+(m.fac?'مشروع مصنع: ':'')+esc(m.n)+'</b><span>'+(m.dl?(m.fac?'الهدف: ':'تسليم: ')+esc(m.dl)+' — '+dtxt(m):'')+'</span></div>'}
function deptBody(pr){var r=deptGroups(),out=[];
 r.gs.forEach(function(x){var hd=x.d.head&&g('emps',x.d.head)?nm('emps',x.d.head):'-',ms=r.ms.filter(function(m){return x.t.some(function(t){return t.m===m.id})});
  function bx(t){var u=UA(t);return [['عدد التاسكات',t.length],['العناصر الناقصة',u.filter(function(y){return !y.d}).length],['المتأخر',u.filter(lateU).length],['مسؤول القسم',esc(hd)]]}
  if(pr&&PC.brk){ms.forEach(function(m){var t=x.t.filter(function(y){return y.m===m.id}).sort(byCr);out.push(pg('تاسكات '+esc(x.d.n),(m.fac?'مشروع مصنع ':'ماكينة ')+esc(m.n)+(m.dl?' — '+(m.fac?'الهدف':'تسليم')+': '+esc(m.dl)+' — '+dtxt(m):''),bx(t),ttab(t)))})}
  else{var spj=0,inner=ms.map(function(m){var t=x.t.filter(function(y){return y.m===m.id}).sort(byCr);var sepH=(m.fac&&!spj)?(spj=1,pr?'':'<div class="sep2h">مشاريع المصنع</div>'):'';return sepH+(pr?mband(m)+ttab(t)+'<div class="mgap"></div>':mhead(m)+'<div class="gp">'+ttab(t)+'</div><div class="mgap"></div>')}).join('');
   out.push(pr?pg('تاسكات '+esc(x.d.n),'مرتبة بتاريخ تسليم الماكينة (الأقرب أولًا)',bx(x.t),inner):'<div class="dg"><h2>'+esc(x.d.n)+' <small>— المسؤول: '+esc(hd)+'</small></h2>'+inner+'</div>')}});
 return out.join('')}
function empDoc(){var gs=S.depts.map(function(d){return {n:d.n,h:d.head,e:S.emps.filter(function(e){return e.dp===d.id})}}),un=S.emps.filter(function(e){return !g('depts',e.dp)});if(un.length)gs.push({n:'بدون قسم',h:'',e:un});
 return gs.filter(function(x){return x.e.length}).map(function(x){return pg('موظفين قسم '+esc(x.n),'قائمة الأسماء',[['عدد الموظفين',x.e.length],['مسؤول القسم',esc(x.h&&g('emps',x.h)?nm('emps',x.h):'-')]],'<table><tr><th style="width:34px">م</th><th>الاسم</th><th>الوظيفة</th><th>ملاحظات</th></tr>'+x.e.map(function(e,i){return '<tr><td class="nw">'+(i+1)+'</td><td>'+(x.h===e.id?'★ ':'')+esc(e.n)+'</td><td>'+esc(e.role||'')+'</td><td></td></tr>'}).join('')+'</table>',"<span>اعتماد مدير القسم</span><span>اعتماد الإدارة</span>")}).join('')}
