var A={
 go:function(e){V=e.dataset.v;MID=null;render()},
 open:function(e){MID=e.dataset.id;V='machine';F={st:'all',dp:''};render()},
 cell:function(e){MID=e.dataset.id;V='machine';F={st:'all',dp:e.dataset.dp};render()},
 newm:function(e,pre){modal('ماكينة جديدة',fMachine({src:pre},'new'),function(v){if(!v.n.trim()){toast('اكتب اسم الماكينة');return false}
  (async function(){var sm=g('machines',v.src),mm=(sm&&sm.ms&&sm.ms.length)?sm.ms.map(function(x){return Object.assign({},x,{ap:0,man:0})}):msTpl();var r=await add('machines',{n:v.n.trim(),typ:v.typ,pw:v.pw,dim:v.dim,yr:v.yr,dl:v.dl,sp:spOf(v),ar:0,st:'new',ms:mm});if(!r)return;lg('إضافة ماكينة: '+v.n);
  var src=g('machines',v.src),nodes=[];
  if(src&&v.ct==='1')nodes=roots(src.id).map(nodeOf);else{var tp=g('tpls',v.tpl);if(tp)nodes=tp.items||[]}
  await mkTree(r.id,nodes,'');MID=r.id;V='machine';F={st:'all',dp:''};render()})()},{init:function(){var s=$('f_src');s.onchange=function(){var m=g('machines',s.value);if(!m)return;$('f_n').value=m.n+' (نسخة)';['typ','pw','dim','yr'].forEach(function(k){$('f_'+k).value=m[k]||''});$('f_dl').value='';specs().forEach(function(x){$('f_sp_'+x.id).value=(m.sp||{})[x.id]||''})};if(pre)s.onchange()}})},
 copym:function(e){A.newm(e,e.dataset.id)},
 editm:function(e){var m=g('machines',e.dataset.id);modal('تعديل الماكينة',fMachine(m,'edit'),function(v){if(!v.n.trim())return false;upd('machines',m.id,{n:v.n.trim(),typ:v.typ,pw:v.pw,dim:v.dim,yr:v.yr,dl:v.dl,sp:spOf(v)});lg('تعديل ماكينة: '+v.n)})},
 delm:function(e){if(ev0)ev0.stopPropagation();var m=g('machines',e.dataset.id);modal('أرشفة / حذف: '+esc(m.n),[{k:'mode',l:'الإجراء',t:'select',o:[['a','أرشفة (موصى بها): تختفي من القوائم وتظهر في «المؤرشفة»'],['d','حذف نهائي مع كل تاسكاتها ('+mt(m.id).length+' تاسك)']]},{k:'cf',l:'للحذف النهائي فقط: اكتب اسم الماكينة للتأكيد'}],function(v){
  if(v.mode==='a'){upd('machines',m.id,{ar:1});lg('أرشفة ماكينة: '+m.n);if(V==='machine'||V==='task'){V='machines';MID=null}}
  else{if(v.cf.trim()!==m.n){toast('اسم الماكينة غير مطابق');return false}S.tasks.filter(function(x){return x.m===m.id}).forEach(function(t){del('tasks',t.id)});del('machines',m.id);lg('حذف ماكينة: '+m.n);V=(V==='machine'||V==='task')?'arch':V;MID=null}})},
 restm:function(e){if(ev0)ev0.stopPropagation();var m=g('machines',e.dataset.id);upd('machines',m.id,{ar:0});lg('استرجاع ماكينة: '+m.n);toast('اتسترجعت')},
 savetpl:function(e){var m=g('machines',e.dataset.id);modal('حفظ التاسكات كقالب',[{k:'n',l:'اسم القالب (مثلًا الموديل)',v:m.typ||m.n}],function(v){if(!v.n.trim())return false;add('tpls',{n:v.n.trim(),items:roots(m.id).map(nodeOf)});lg('حفظ قالب: '+v.n)})},
 printspecs:function(e){printDoc(specDoc(g('machines',e.dataset.id)))},
 printtasks:function(e){var m=g('machines',e.dataset.id);if(!mtF(m.id).length){toast('لا توجد تاسكات للطباعة');return}printDoc(mTasksDoc(m))},
 newt:async function(e){var mid=e.dataset.id,r=await add('tasks',{m:mid,pa:'',d:'',cat:'',dp:'',w:'',s:'new',due:'',n:'',cr:Date.now(),dn:0,blk:0,why:'',rv:0,au:1,dr:1,cl:[],it:[],cm:[],hs:[]});if(!r)return;TID=r.id;MID=mid;V='task';FOCUS='title';render()},
 pub:async function(){var t=g('tasks',TID),v=((document.querySelector('.tin')||{}).value||'').trim();if(!v){toast('اكتب عنوان التاسك الأول');return}var all=[t].concat(desc(t.id));for(var i=0;i<all.length;i++){await tupd(all[i],i?{dr:0}:{dr:0,d:v},i?'':'اتعملت')}lg('إضافة تاسك: '+v);toast('اتعمل التاسك');render()},
 dcn:function(){var t=g('tasks',TID);desc(t.id).forEach(function(x){del('tasks',x.id)});del('tasks',t.id);V='machine';MID=t.m;TID=null;render()},
 catc:function(e){var t=g('tasks',TID),x=g('cats',e.value),o={cat:e.value};if(x&&x.dp){o.dp=x.dp;var dd=g('depts',x.dp),h=dd&&dd.head?g('emps',dd.head):null;o.w=(h&&h.dp===x.dp)?h.id:''}var mm0=g('machines',t.m),z0=msByCat(mm0,e.value);if(z0)o.ms=z0;tupd(t,o,'غيّر التصنيف')},
 od:function(e){var t=g('tasks',e.dataset.id);if(!t)return;DL=1;TID=t.id;MID=t.m;V='task';render()},
 chk:function(e){var t=g('tasks',e.dataset.id);if(e.checked)closeT(t);else reopen(t)},
 sot:function(e){var t=g('tasks',e.dataset.id),v=e.value.trim();if(!t)return;if(v&&v!==t.d)tupd(t,{d:v},'غيّر العنوان');else if(!v)render()},
 dsub:function(e){var t=g('tasks',e.dataset.id),d=desc(t.id);var go=function(){d.forEach(function(x){del('tasks',x.id)});del('tasks',t.id);lg('حذف تاسك فرعية: '+t.d)};if(d.length||hasCl(t))ask('هيتحذف «'+esc(t.d)+'»'+(d.length?' و'+d.length+' تاسك تحتها':'')+'. متأكد؟',go);else go()},
 tg:function(e){X[e.dataset.id]=X[e.dataset.id]!==true;render()},
 auc:function(e){tupd(g('tasks',TID),{au:e.checked?1:0},e.checked?'فعّل الإقفال التلقائي':'طفّى الإقفال التلقائي');toast(e.checked?'الإقفال التلقائي شغال':'الإقفال التلقائي مقفول: حالة الأم بتتغير يدوي')},
 parc:function(e){if(!e.value)return;tupd(g('tasks',TID),{pa:e.value,cr:Date.now()},'غيّر المهمة الأم');toast('اتغيّرت المهمة الأم')},
 unl:function(){tupd(g('tasks',TID),{pa:'',cr:Date.now()},'اتفصلت عن الأم');toast('اتفصلت. بقت تاسك رئيسية')},
 ak:function(e){var p=g('tasks',e.dataset.id),room=3-lv(p);if(room<1){toast('وصلت لأقصى مستوى (3)');return}
  modal('تاسكات فرعية تحت: '+esc(p.d),[{k:'d',l:'سطر لكل تاسك فرعية (Shift+Enter لسطر جديد). ضع - قبل السطر للمستوى التاني و-- للتالت'+(room<3?' (متاح '+room+' مستوى)':''),t:'textarea'}],function(v){var nodes=parseTree(v.d,room);if(!nodes.length){toast('اكتب عنوان واحد على الأقل');return false}inherit(nodes,p);
  (async function(){var ids=await mkTree(p.m,nodes,p.id,p.dr||0);await tupd(p,{},'أضاف '+nodes.length+' تاسك فرعية');X[p.id]=true;MID=p.m;if(ids.length===1&&!nodes[0].ch.length){TID=ids[0];V='task'}render()})()},{ok:'إضافة'})},
 ap:function(e){var t=g('tasks',e.dataset.id);tupd(t,{s:'done',dn:Date.now()},'اعتمدها مدير القسم');toast('اتعتمدت واتقفلت')},
 cl:function(){var t=g('tasks',TID),n=t.au===0?0:desc(t.id).filter(function(x){return ts(x)!=='done'}).length;if(n)ask('هيتقفل التاسك و'+n+' تاسك فرعية معاها. متأكد؟',function(){closeT(t,1)});else closeT(t,isP(t))},
 ro:function(){reopen(g('tasks',TID))},
 go:function(e){if(e.dataset.v){V=e.dataset.v;MID=null;TID=null;render();return}tupd(g('tasks',TID),{s:'go'},'بدأت')},
 bk:function(){var t=g('tasks',TID);modal('تعطيل التاسك',[{k:'w',l:'السبب (مستني إيه / مين)',t:'textarea'}],function(v){tupd(t,{blk:1,why:v.w.trim()},'اتعطّلت: '+v.w.trim())})},
 ub:function(){var t=g('tasks',TID);tupd(t,{blk:0,why:'',s:t.s==='block'?'new':t.s},'اتلغى التعطيل')},
 dt:function(e){var id=(e&&e.dataset&&e.dataset.id)||TID,t=g('tasks',id),d=desc(t.id);ask('هيتحذف «'+esc(t.d)+'»'+(d.length?' و'+d.length+' تاسك فرعية':'')+'. لا يمكن التراجع.',function(){d.forEach(function(x){del('tasks',x.id)});del('tasks',t.id);lg('حذف تاسك: '+t.d);if(V==='task'&&TID===t.id){V='machine';MID=t.m;TID=null}render()})},
 ti:function(e){var t=g('tasks',TID),v=e.value.trim();if(v&&v!==t.d)tupd(t,{d:v},'غيّر العنوان')},
 dpc:function(e){var t=g('tasks',TID),o={dp:e.value},emp=g('emps',t.w);if(t.w&&(!emp||emp.dp!==e.value)){var dd=g('depts',e.value),h=dd&&dd.head?g('emps',dd.head):null;o.w=(h&&h.dp===e.value)?h.id:''}tupd(t,o,'غيّر القسم: '+dn(e.value))},
 rsc:function(e){tupd(g('tasks',TID),{w:e.value},'غيّر المسؤول: '+nm('emps',e.value))},
 duc:function(e){tupd(g('tasks',TID),{due:e.value},'غيّر الاستحقاق')},
 ntc:function(e){tupd(g('tasks',TID),{n:e.value})},
 rvc:function(e){tupd(g('tasks',TID),{rv:e.checked?1:0},e.checked?'فعّل المراجعة':'ألغى المراجعة')},
 cm:function(){var t=g('tasks',TID),x=$('cmi').value.trim();if(x)tupd(t,{cm:(t.cm||[]).concat([{t:Date.now(),u:uid||'',x:x}])},'أضاف تعليق')},
 idn:function(e){var t=g('tasks',e.dataset.id),c=+e.dataset.c,i=+e.dataset.i,on=e.checked,nmx=CL(t)[c].it[i].n;mutCl(t,function(cl){var it=cl[c].it[i];it.dn=on?Date.now():0;if(on&&cl[c].k==='c')it.av=1},(on?'أنجز: ':'أعاد فتح: ')+nmx)},
 iav:function(e){var t=g('tasks',e.dataset.id);mutCl(t,function(cl){var it=cl[+e.dataset.c].it[+e.dataset.i];it.av=e.checked?1:0;if(!e.checked)it.dn=0})},
 iq:function(e){var t=g('tasks',e.dataset.id);mutCl(t,function(cl){cl[+e.dataset.c].it[+e.dataset.i].q=Math.max(1,parseInt(e.value)||1)})},
 ir:function(e){var t=g('tasks',e.dataset.id);mutCl(t,function(cl){cl[+e.dataset.c].it[+e.dataset.i].r=e.value})},
 im:function(e){var t=g('tasks',e.dataset.id);mutCl(t,function(cl){var it=cl[+e.dataset.c].it[+e.dataset.i];it.im=it.im?0:1})},
 prob:function(e){var t=g('tasks',e.dataset.id),c=+e.dataset.c,i=+e.dataset.i,it=CL(t)[c].it[i];modal('إبلاغ عن مشكلة',[{k:'p',l:'وصف المشكلة في: '+esc(it.n),t:'textarea'}],function(v){if(!v.p.trim()){toast('اكتب المشكلة');return false}mutCl(t,function(cl){var x=cl[c].it[i];x.pb=v.p.trim();x.pbt=Date.now();x.pbu=uid||''},'مشكلة في «'+it.n+'»: '+v.p.trim());lg('مشكلة: '+t.d+' ← '+it.n+' — '+v.p.trim())},{ok:'إبلاغ'})},
 pres:function(e){var t=g('tasks',e.dataset.id),c=+e.dataset.c,i=+e.dataset.i;mutCl(t,function(cl){cl[c].it[i].pb='';cl[c].it[i].pbt=0},'حل مشكلة «'+CL(t)[c].it[i].n+'»')},
 edi:function(e){var t=g('tasks',e.dataset.id),c=+e.dataset.c,j=+e.dataset.i,i=CL(t)[c].it[j];modal('تعديل البند',[{k:'n',l:'الاسم',v:i.n},{k:'q',l:'الكمية (للمكونات)',t:'number',v:i.q||1},{k:'r',l:'المسؤول',t:'select',o:[['','نفس مسؤول التاسك']].concat(eoptsD(t.dp,i.r).slice(1)),v:i.r}],function(v){if(!v.n.trim())return false;mutCl(t,function(cl){var x=cl[c].it[j];x.n=v.n.trim();x.q=+v.q||1;x.r=v.r})},{del:function(){mutCl(t,function(cl){cl[c].it.splice(j,1)},'حذف بند: '+i.n)}})},
 ai:function(e){var t=g('tasks',e.dataset.id),c=+e.dataset.c,v=($('ni'+c).value||'').trim();if(!v)return;var k=CL(t)[c].k,x=k==='c'?parseLines(v,'c')[0]:{n:v};if(k==='c'&&!/[×xX*]\s*\d+\s*$/.test(v))x.q=Math.max(1,parseInt(($('nq'+c)||{}).value)||1);FOCUS='ni'+c;mutCl(t,function(cl){cl[c].it.push(mkIt(x))},'أضاف بند: '+x.n)},
 nc:function(){var t=g('tasks',TID);modal('Checklist جديدة',[{k:'n',l:'الاسم',v:'Checklist'},{k:'k',l:'النوع',t:'select',o:[['s','مراحل / خطوات'],['c','مكونات (متوفر ← مركّب)']]}],function(v){if(!v.n.trim())return false;mutCl(t,function(cl){cl.push({n:v.n.trim(),k:v.k,it:[]})},'أضاف Checklist: '+v.n.trim())})},
 dcl:function(e){var t=g('tasks',e.dataset.id),c=+e.dataset.c;ask('حذف الـ Checklist «'+esc(CL(t)[c].n)+'» بكل بنودها؟',function(){mutCl(t,function(cl){cl.splice(c,1)},'حذف Checklist')})},
 savegrp:function(e){var t=g('tasks',e.dataset.id);modal('حفظ في مكتبة المجموعات',[{k:'n',l:'اسم المجموعة',v:t.d}],function(v){if(!v.n.trim())return false;var nd=nodeOf(t);nd.n=v.n.trim();add('groups',nd);lg('حفظ مجموعة: '+v.n)})},
 fromgrp:function(e){if(!S.groups.length){toast('المكتبة فاضية: احفظ مجموعة من أي تاسك');return}var mid=e.dataset.id;modal('إضافة مجموعة من المكتبة',[{k:'g',l:'المجموعة',t:'select',o:opts('groups')}],function(v){var x=g('groups',v.g);if(!x)return false;var nd=Object.assign({},x,{d:x.n}),ct=g('cats',x.cat),dp=x.dp||(ct?ct.dp:''),d=g('depts',dp);nd.dp=dp;nd.w=nd.w||(d&&d.head?d.head:'');mkTree(mid,[nd],'').then(function(){lg('إضافة مجموعة: '+x.n)})},{ok:'إضافة'})},
 editg:function(e){var x=g('groups',e.dataset.id);modal('تعديل المجموعة',[{k:'n',l:'الاسم',v:x.n}],function(v){if(!v.n.trim())return false;upd('groups',x.id,{n:v.n.trim()})},{del:function(){del('groups',x.id)}})},
 fst:function(e){F.st=e.dataset.v;render()},fdp:function(e){F.dp=e.value;render()},
 ddp:function(e){D.dp=e.value;render()},dst:function(e){D.st=e.value;render()},
 pcbrk:function(e){PC.brk=+e.value;svPC();render()},
 cpt:function(e){var id=(e&&e.dataset&&e.dataset.id)||TID,t=g('tasks',id);if(!t)return;var ml=CT().map(function(m){return [m.id,(m.fac?'[مشروع] ':'')+m.n+(m.id===t.m?' (نفس الماكينة)':'')+(m.dl?' — '+m.dl:'')]});
  modal('نسخ «'+esc(t.d)+'» لماكينة أخرى',[{k:'ms',l:'اختار ماكينة أو أكتر (بتتنسخ بالفرعيات والـ Checklists من غير تقدم)',t:'chk',o:ml}],function(v){var sel=v.ms||[];if(!sel.length){toast('اختار ماكينة');return false}
   (async function(){for(var i=0;i<sel.length;i++){var nd=nodeOf(t);if(sel[i]===t.m)nd.d+=' (نسخة)';await mkTree(sel[i],[nd],'')}toast('اتنسخت لـ '+sel.length+' ماكينة');lg('نسخ تاسك: '+t.d)})()},{ok:'نسخ'})},
 pcbw:function(e){PC.bw=+e.value;svPC();render()},pcdet:function(e){PC.det=+e.value;svPC();render()},
 print:function(){var b=deptBody(1);if(!b){toast('لا توجد تاسكات للطباعة');return}printDoc(b)},
 mtog:function(){D.open=!D.open;render()},mall:function(){D.ms=[];render()},
 mchk:function(e){var i=D.ms.indexOf(e.dataset.id);if(e.checked&&i<0)D.ms.push(e.dataset.id);if(!e.checked&&i>-1)D.ms.splice(i,1);render()},
 pf:function(e){if(e.value){PR.from=e.value;render()}},pt:function(e){if(e.value){PR.to=e.value;render()}},pg:function(e){PR.g=e.value;render()},pd:function(e){PR.dp=e.value;render()},
 me:function(e){ME=e.value;try{localStorage.setItem('tronix_me',ME)}catch(x){}render()},
 linkme:function(){var id=myEmp();if(id&&uid){upd('emps',id,{uid:uid});toast('اتربط حسابك')}},
 mf:function(e){MF=e.dataset.v;render()},
 ss:function(e){var m=g('machines',MID),k=e.dataset.k;if(k==='del'){modal('تسليم '+(m.fac?'المشروع':'الماكينة'),[{k:'act',l:'تاريخ التسليم الفعلي',t:'date',v:TODAY}],function(v){upd('machines',m.id,{st:'del',act:v.act||TODAY});lg('تسليم: '+m.n)},{ok:'تأكيد التسليم'})}else{upd('machines',m.id,{st:k,act:''});lg('حالة '+m.n+': '+MST[k])}},
 arch1:function(){var m=g('machines',MID);upd('machines',m.id,{ar:1});lg('أرشفة: '+m.n);V=m.fac?'fac':'machines';MID=null;render()},
 fm:function(e){F.ms=(!e.dataset.id||F.ms===e.dataset.id)?'':e.dataset.id;render()},
 cellm:function(e){MID=e.dataset.id;V='machine';F={st:'all',dp:'',ms:e.dataset.ms};render()},
 msman:function(e){var m=g('machines',MID),i=+e.dataset.i;setMs(m,function(a){a[i].man=a[i].man?0:1})},
 msap:function(e){var m=g('machines',MID),i=+e.dataset.i;setMs(m,function(a){a[i].ap=1});lg('اعتماد مرحلة: '+m.n)},
 msapp:function(){var m=g('machines',MID);upd('machines',m.id,{ms:msTpl()});toast('اتطبّقت قايمة المراحل')},
 msc:function(e){tupd(g('tasks',TID),{ms:e.value},'غيّر المرحلة')},
 mse:function(e){var m=g('machines',MID);if(m.fac){modal('مراحل المشروع',[{k:'x',l:'اسم كل مرحلة في سطر (Shift+Enter لسطر جديد)',t:'textarea',v:(m.ms||[]).map(function(x){return x.n}).join('\n')}],function(v){var cur=m.ms||[],lines=v.x.split('\n').map(function(l){return l.trim()}).filter(Boolean);var nw=lines.map(function(n,i){var o=cur.filter(function(x){return x.n===n})[0];return o||{id:'p'+Date.now().toString(36)+i,n:n,off:0,gate:0,cats:[],ap:0,man:0}});upd('machines',m.id,{ms:nw});lg('تعديل مراحل: '+m.n)})}
  else{modal('مراحل الماكينة',[{k:'sel',l:'اختار المراحل (من قايمة الإعدادات)',t:'chk',o:S.mstones.map(function(x){return [x.id,x.n]}),v:(m.ms||[]).map(function(x){return x.id})}],function(v){var cur=m.ms||[],ch=v.sel||[],nw=[];S.mstones.forEach(function(t){if(ch.indexOf(t.id)>-1){nw.push(cur.filter(function(x){return x.id===t.id})[0]||{id:t.id,n:t.n,off:+t.off||0,gate:t.gate?1:0,cats:(t.cats||[]).slice(),ap:0,man:0})}});cur.forEach(function(x){if(!S.mstones.some(function(t){return t.id===x.id}))nw.push(x)});upd('machines',m.id,{ms:nw});lg('تعديل مراحل: '+m.n)})}},
 newms:function(){modal('مرحلة جديدة',fMs(),function(v){return saveMs(null,v)},{again:true,clear:['n']})},
 editms:function(e){var x=g('mstones',e.dataset.id);modal('تعديل المرحلة',fMs(x),function(v){return saveMs(x.id,v)},{del:function(){del('mstones',x.id)}})},
 newp:function(){modal('مشروع مصنع جديد',fPj(),function(v){if(!v.n.trim()){toast('اكتب اسم المشروع');return false}(async function(){var r=await add('machines',{n:v.n.trim(),fac:1,cat:v.cat,own:v.own,pri:v.pri,dl:v.dl,st:'new',ar:0,ms:[],sp:{}});if(r){lg('إضافة مشروع: '+v.n);MID=r.id;V='machine';F={st:'all',dp:''};render()}})()},{ok:'إنشاء'})},
 editp:function(e){var p=g('machines',e.dataset.id);modal('تعديل المشروع',fPj(p),function(v){if(!v.n.trim())return false;upd('machines',p.id,{n:v.n.trim(),cat:v.cat,own:v.own,pri:v.pri,dl:v.dl});lg('تعديل مشروع: '+v.n)})},
 upf:function(e){if(!SBM){toast('المرفقات بتشتغل مع نسخة Supabase');return}var sc=e.dataset.id,tid=e.dataset.t||'',i=document.createElement('input');i.type='file';i.onchange=async function(){var f=i.files[0];if(!f)return;if(f.size>10485760){toast('الملف أكبر من 10 ميجا');return}var ext=(f.name.split('.').pop()||'bin').replace(/[^A-Za-z0-9]/g,'').slice(0,8)||'bin',path=sc+'/'+Date.now()+'-'+Math.random().toString(36).slice(2,6)+'.'+ext;toast('جاري الرفع...');var q=await SB.storage.from('nw-files').upload(path,f,{contentType:f.type||'application/octet-stream'});if(q.error){toast('فشل الرفع: '+q.error.message);return}await add('files',{s:sc,t:tid,n:f.name,p:path,z:f.size,u:uid||'',at:Date.now()});lg('إرفاق ملف: '+f.name);toast('اترفع الملف')};i.click()},
 dlf:async function(e){var f=g('files',e.dataset.id);if(!f||!SBM)return;var q=await SB.storage.from('nw-files').createSignedUrl(f.p,120);if(q.error){toast('تعذّر فتح الملف');return}window.open(q.data.signedUrl,'_blank')},
 delf:function(e){var f=g('files',e.dataset.id);ask('حذف الملف «'+esc(f.n)+'»؟',async function(){if(SBM)await SB.storage.from('nw-files').remove([f.p]);del('files',f.id)})},
 newd:function(){modal('قسم جديد',[{k:'n',l:'اسم القسم'},{k:'head',l:'مسؤول القسم',t:'select',o:eopts()}],function(v){if(!v.n.trim())return false;add('depts',{n:v.n.trim(),head:v.head});lg('إضافة قسم: '+v.n)},{again:true,clear:['n']})},
 editd:function(e){var d=g('depts',e.dataset.id);modal('تعديل القسم',[{k:'n',l:'اسم القسم',v:d.n},{k:'head',l:'مسؤول القسم',t:'select',o:eopts(),v:d.head}],function(v){if(!v.n.trim())return false;upd('depts',d.id,{n:v.n.trim(),head:v.head});lg('تعديل قسم: '+v.n)},{del:function(){del('depts',d.id);lg('حذف قسم: '+d.n)}})},
 newe:function(){modal('موظف جديد',[{k:'n',l:'الاسم'},{k:'dp',l:'القسم',t:'select',o:opts('depts',1)},{k:'role',l:'الوظيفة'}],function(v){if(!v.n.trim())return false;add('emps',{n:v.n.trim(),dp:v.dp,role:v.role});lg('إضافة موظف: '+v.n)},{again:true,clear:['n']})},
 ede:function(e){var x=g('emps',e.dataset.id);modal('تعديل الموظف',[{k:'n',l:'الاسم',v:x.n},{k:'dp',l:'القسم',t:'select',o:opts('depts',1),v:x.dp},{k:'role',l:'الوظيفة',v:x.role}].concat(SBM?[{k:'pf',l:'ربط بحساب دخول',t:'select',o:[['','(بدون تغيير)'],['-','فك الربط']].concat(Object.keys(PROF).map(function(u){return [u,PROF[u]||u]}))}]:(x.uid?[{k:'ul',l:'ربط الحساب',t:'select',o:[['1','مرتبط بحساب (اتركه كما هو)'],['0','فك الربط']]}]:[])),function(v){if(!v.n.trim())return false;var o={n:v.n.trim(),dp:v.dp,role:v.role};if(v.ul==='0')o.uid='';if(v.pf==='-')o.uid='';else if(v.pf)o.uid=v.pf;upd('emps',x.id,o);lg('تعديل موظف: '+v.n)},{del:function(){del('emps',x.id);lg('حذف موظف: '+x.n)}})},
 newc:function(){modal('تصنيف جديد',[{k:'n',l:'اسم التصنيف (كهرباء، ميكانيكا...)'},{k:'dp',l:'القسم المسؤول',t:'select',o:opts('depts',1)}],function(v){if(!v.n.trim())return false;add('cats',{n:v.n.trim(),dp:v.dp});lg('إضافة تصنيف: '+v.n)},{again:true,clear:['n']})},
 editc:function(e){var x=g('cats',e.dataset.id);modal('تعديل التصنيف',[{k:'n',l:'الاسم',v:x.n},{k:'dp',l:'القسم المسؤول',t:'select',o:opts('depts',1),v:x.dp}],function(v){if(!v.n.trim())return false;upd('cats',x.id,{n:v.n.trim(),dp:v.dp});lg('تعديل تصنيف: '+v.n)},{del:function(){del('cats',x.id)}})},
 newsp:function(){modal('خانة مواصفات جديدة',[{k:'n',l:'اسم الخانة (مثلًا Laser Head)'}],function(v){if(!v.n.trim())return false;add('specs',{n:v.n.trim(),cr:Date.now()});lg('إضافة خانة مواصفات: '+v.n)},{again:true,clear:['n']})},
 editsp:function(e){var x=g('specs',e.dataset.id);modal('تعديل الخانة',[{k:'n',l:'الاسم',v:x.n}],function(v){if(!v.n.trim())return false;upd('specs',x.id,{n:v.n.trim()});lg('تعديل خانة مواصفات: '+v.n)},{del:function(){del('specs',x.id);lg('حذف خانة مواصفات: '+x.n)}})},
 mvup:function(e){mv(e.dataset.c,e.dataset.id,-1)},mvdn:function(e){mv(e.dataset.c,e.dataset.id,1)},
 logout:async function(){await SB.auth.signOut();location.reload()},
 sbexp:function(){var o={};COL.forEach(function(c){o[c]={};S[c].forEach(function(x){var d=Object.assign({},x);delete d.id;o[c][x.id]=d})});var b=new Blob([JSON.stringify(o)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='tronix-tracker-backup-'+TODAY+'.json';a.click();try{localStorage.setItem('tronix_bk',TODAY)}catch(x){}render()},
 sbimp:function(){var i=document.createElement('input');i.type='file';i.accept='.json';i.onchange=function(){var r=new FileReader();r.onload=async function(){try{var o=JSON.parse(r.result),rows=[];COL.forEach(function(c){var m=o[c]||{};Object.keys(m).forEach(function(id){rows.push({col:c,id:id,data:m[id]})})});if(!rows.length){toast('الملف فاضي');return}for(var k=0;k<rows.length;k+=200){var q=await SB.from('nw_docs').upsert(rows.slice(k,k+200));if(q.error)throw q.error}await db.reload();toast('اتستورد '+rows.length+' عنصر')}catch(e){toast('فشل الاستيراد: '+(e.message||'ملف غير صالح'))}};r.readAsText(i.files[0])};i.click()},
 cin:function(e){var t=g('tasks',e.dataset.id),c=+e.dataset.c,i=+e.dataset.i,v=e.value.trim();if(!t||!CL(t)[c])return;var it=CL(t)[c].it[i];if(!it)return;if(!v){toast('اسم البند مينفعش يبقى فاضي');render();return}if(v!==it.n)mutCl(t,function(cl){cl[c].it[i].n=v},'عدّل بند: '+v)},
mvm:function(e){var t=g('tasks',TID),to=e.value,m2=g('machines',to);if(!t||!m2||to===t.m)return;var all=[t].concat(desc(t.id)),fromN=nm('machines',t.m);
 ask('نقل «'+esc(t.d)+'»'+(all.length>1?' مع '+(all.length-1)+' فرعية':'')+' من «'+esc(fromN)+'» إلى «'+esc(m2.n)+'»؟ (بتنتقل مش بتتنسخ'+(t.pa?'، وهتتفصل عن الأم':'')+')',function(){
  all.forEach(function(x,i){var o={m:to,ms:msByCat(m2,x.cat)};if(i===0&&x.pa)o.pa='';tupd(x,o,i?'':'اتنقلت من «'+fromN+'» إلى «'+m2.n+'»')});
  MID=to;lg('نقل تاسك: '+t.d+' ← '+m2.n);toast('اتنقلت التاسك')})},
newacc:function(){if(ROLE!=='admin')return;
 modal('حساب جديد',[{k:'n',l:'الاسم'},{k:'em',l:'الإيميل (ممكن شكلي زي ahmed@tronix.local)'},{k:'pw',l:'كلمة المرور (6 حروف/أرقام على الأقل)'},{k:'role',l:'البوزيشن',t:'select',o:Object.keys(RL).map(function(k){return [k,RL[k]]}),v:'worker'},{k:'emp',l:'ربط بموظف (اختياري، ومهم للمشرف عشان قسمه يتحدد)',t:'select',o:[['','بدون ربط']].concat(S.emps.filter(function(x){return !x.uid}).map(function(x){return [x.id,x.n+' ('+dn(x.dp)+')']}))}],function(v){
  var em=v.em.trim().toLowerCase(),nmv=v.n.trim();if(!nmv||!em||v.pw.length<6){toast('اكتب الاسم والإيميل وكلمة مرور 6 على الأقل');return false}
  (async function(){var r=await sbAdmin({op:'create',email:em,password:v.pw,name:nmv,role:v.role});if(!r)return;PROF[r.uid]=nmv;if(v.emp)await upd('emps',v.emp,{uid:r.uid});lg('إنشاء حساب: '+nmv+' ('+RL[v.role]+')');toast('اتعمل الحساب: '+em);loadAcc()})()},{ok:'إنشاء'})},
eacc:function(e){if(ROLE!=='admin'||!ACC)return;var a=ACC.filter(function(x){return x.uid===e.dataset.id})[0];if(!a)return;var me=a.uid===uid;
 modal('تعديل حساب: '+esc(a.email),[{k:'n',l:'الاسم',v:a.name},{k:'role',l:'البوزيشن'+(me?' (مينفعش تغيّر بوزيشن حسابك)':''),t:'select',o:Object.keys(RL).map(function(k){return [k,RL[k]]}),v:a.role||'worker'},{k:'pw',l:'كلمة مرور جديدة (سيبها فاضية لو مش عايز تغيّرها)'}],function(v){
  var nmv=v.n.trim();if(!nmv){toast('اكتب الاسم');return false}if(v.pw&&v.pw.length<6){toast('كلمة المرور 6 على الأقل');return false}
  (async function(){var r=await sbAdmin({op:'update',uid:a.uid,name:nmv,role:me?'admin':v.role,password:v.pw||''});if(!r)return;PROF[a.uid]=nmv;lg('تعديل حساب: '+nmv);toast('اتحدّث الحساب');loadAcc()})()},
  me?{ok:'حفظ'}:{ok:'حفظ',del:function(){(async function(){var r=await sbAdmin({op:'delete',uid:a.uid});if(!r)return;S.emps.filter(function(x){return x.uid===a.uid}).forEach(function(x){upd('emps',x.id,{uid:''})});lg('حذف حساب: '+(a.name||a.email));toast('اتحذف الحساب');loadAcc()})()}})},
racc:function(){loadAcc()},
mlay:function(e){ML=e.dataset.v==='l'?'l':'g';try{localStorage.setItem('tronix_ml',ML)}catch(x){}render()},
pcor:function(e){PC.or=+e.value;svPC();render()},
pemps:function(){if(!S.emps.length){toast('لا يوجد موظفين');return}printDoc(empDoc())},
ltdp:function(e){LT.dp=e.value;render()},
printlate:function(){if(!lateGroups(LT.dp).length){toast('مفيش متأخر للطباعة');return}printDoc(lateDoc(LT.dp))},
xlsx:function(e){xlsxBook(e.dataset.k||'all')},
deltpl:function(e){var x=g('tpls',e.dataset.id);ask('حذف القالب «'+esc(x.n)+'»؟',function(){del('tpls',x.id)})}
};
var ev0=null,DR=null;
document.addEventListener('input',function(ev){var el=ev.target;if(!el||el.id!=='msq')return;MQ=el.value;mfilt()});
function cenx(el){var t=g('tasks',el.dataset.id),c=+el.dataset.c,i=+el.dataset.i,v=el.value.trim();if(!t||!CL(t)[c])return;
 if(el.id==='cd'){if(!v){CD=null;FOCUS='ni'+c;render();return}
  var x=CL(t)[c].k==='c'?parseLines(v,'c')[0]:{n:v};CD={t:t.id,c:c,i:i+1};FOCUS='cd';
  mutCl(t,function(cl){cl[c].it.splice(i,0,mkIt(x))},'أضاف بند: '+x.n);return}
 var it=CL(t)[c].it[i];if(!it)return;if(!v){toast('اكتب اسم البند الأول');return}
 CD={t:t.id,c:c,i:i+1};FOCUS='cd';
 if(v!==it.n)mutCl(t,function(cl){cl[c].it[i].n=v},'عدّل بند: '+v);else render()}
document.addEventListener('click',function(ev){var e=ev.target.closest('[data-a]');if(!e||/^(SELECT|INPUT|TEXTAREA)$/.test(e.tagName))return;if(NEEDS.indexOf(','+e.dataset.a+',')>-1&&!can(e.dataset.a)){toast('مفيش صلاحية لهذا الإجراء');return}ev0=ev;if(A[e.dataset.a])A[e.dataset.a](e);ev0=null});
document.addEventListener('change',function(ev){var e=ev.target;if(/^(SELECT|INPUT|TEXTAREA)$/.test(e.tagName)&&e.dataset&&A[e.dataset.a]){if(NEEDS.indexOf(','+e.dataset.a+',')>-1&&!can(e.dataset.a)){toast('مفيش صلاحية لهذا الإجراء');render();return}A[e.dataset.a](e)}});
document.addEventListener('dragstart',function(e){var r=e.target.closest&&e.target.closest('tr[data-did]');if(!r)return;DR={c:r.dataset.dc,id:r.dataset.did};try{e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',DR.id)}catch(x){}});
document.addEventListener('dragover',function(e){if(!DR)return;var r=e.target.closest&&e.target.closest('tr[data-did]');if(r&&r.dataset.dc===DR.c)e.preventDefault()});
document.addEventListener('drop',function(e){if(!DR)return;var r=e.target.closest&&e.target.closest('tr[data-did]');if(r&&r.dataset.dc===DR.c){e.preventDefault();moveTo(DR.c,DR.id,r.dataset.did)}DR=null});
document.addEventListener('dragend',function(){DR=null});
async function addSub(t,title){var dl=Math.min(DL,maxDL(t)),pp=t;for(var i=1;i<dl;i++){var k=kids(pp.id);if(!k.length)break;pp=k[k.length-1]}
 FOCUS='draft';var r=await add('tasks',{m:t.m,pa:pp.id,d:title,cat:pp.cat||'',dp:pp.dp||'',w:pp.w||'',s:'new',due:pp.due||'',n:'',cr:Date.now(),dn:0,blk:0,why:'',rv:0,ms:pp.ms||'',dr:pp.dr||0,cl:[],it:[],cm:[],hs:[{t:Date.now(),u:uid||'',m:'اتعملت كتاسك فرعية'}]});X[pp.id]=true}
async function indentRow(x,out){
 if(!out){var sib=kids(x.pa),i=sib.map(function(y){return y.id}).indexOf(x.id);if(i<1){toast('لازم يكون فيه تاسك قبلها عشان تبقى فرعية منها');return}var prev=sib[i-1];
  if(lv(prev)+sdepth(x)>3){toast('وصلت لأقصى مستوى (3)');return}FOCUS=x.id;X[prev.id]=true;await tupd(x,{pa:prev.id,cr:Date.now()},'بقت فرعية من: '+prev.d)}
 else{var p=g('tasks',x.pa);if(!p||p.id===TID){toast('دي أول مستوى');return}var sb=kids(p.pa),k=sb.map(function(y){return y.id}).indexOf(p.id),nx=sb[k+1];FOCUS=x.id;await tupd(x,{pa:p.pa,cr:nx?((p.cr||0)+(nx.cr||0))/2:Date.now()},'رجعت لمستوى أعلى')}}
document.addEventListener('keydown',function(ev){var el=ev.target;if(ev.key==='Escape'&&el.id==='cd'){CD=null;render();return}
 if((ev.key==='ArrowRight'||ev.key==='ArrowLeft')&&V==='machine'&&MID&&!ev.ctrlKey&&!ev.altKey&&!ev.metaKey&&!ev.shiftKey&&el&&!el.isContentEditable&&el.tagName!=='TEXTAREA'&&el.tagName!=='SELECT'&&!(el.tagName==='INPUT'&&!/^(checkbox|radio|button)$/.test(el.type))&&$('modal').className.indexOf('hide')>-1){var cm=g('machines',MID);if(cm){var ml=cm.ar?[]:(cm.fac?PJ():mSorted()),mi=ml.map(function(x){return x.id}).indexOf(cm.id),mj=mi+(ev.key==='ArrowLeft'?1:-1);if(mi>-1&&mj>=0&&mj<ml.length){ev.preventDefault();A.open({dataset:{id:ml[mj].id}})}return}}
 if(ev.key==='Enter'&&!ev.isComposing&&(el.tagName==='INPUT'||el.tagName==='TEXTAREA')&&!(el.classList&&el.classList.contains('sot'))&&el.type!=='date'){
  if(el.tagName==='TEXTAREA'&&ev.shiftKey)return;
  var inM=el.closest&&el.closest('#modal');
  if(inM){ev.preventDefault();var mb=$('ms');if(mb)mb.click();return}
  if(el.classList&&el.classList.contains('cit')){ev.preventDefault();cenx(el);return}
 if(/^n[iq]\d+$/.test(el.id)){ev.preventDefault();var cc=el.id.replace(/^n[iq]/,''),bt=document.querySelector('[data-a=ai][data-c="'+cc+'"]');if(bt)bt.click();return}
  if(el.id==='cmi'){ev.preventDefault();A.cm();return}
  if(el.dataset&&el.dataset.a){ev.preventDefault();el.blur();return}}
 if(el.tagName==='TEXTAREA'&&(el.id==='f_sb'||el.id==='f_d')&&(ev.key==='Tab'||ev.key==='Escape')){ev.preventDefault();var v=el.value,a=el.selectionStart,ls=v.lastIndexOf('\n',a-1)+1;
  if(ev.shiftKey||ev.key==='Escape'){if(/^[-–—]/.test(v.slice(ls))){el.value=v.slice(0,ls)+v.slice(ls+1);el.setSelectionRange(Math.max(ls,a-1),Math.max(ls,a-1))}}else{el.value=v.slice(0,ls)+'-'+v.slice(ls);el.setSelectionRange(a+1,a+1)}return}
 if(!el.classList||!el.classList.contains('sot'))return;var id=el.dataset.id,t=g('tasks',TID);if(!t)return;
 if(ev.key==='Enter'){ev.preventDefault();if(id==='draft'){var v2=el.value.trim();if(!v2)return;el.value='';addSub(t,v2)}else{var x=g('tasks',id),nv=el.value.trim();if(x&&nv&&nv!==x.d)tupd(x,{d:nv},'غيّر العنوان');var dr=document.querySelector('.sot[data-id="draft"]');if(dr)dr.focus()}}
 else if(ev.key==='Tab'||ev.key==='Escape'){ev.preventDefault();var back=ev.shiftKey||ev.key==='Escape';if(id==='draft'){DL=back?Math.max(1,DL-1):Math.min(maxDL(t),DL+1);render()}else indentRow(g('tasks',id),back)}
 else if(ev.key==='Backspace'&&id!=='draft'&&el.value===''){ev.preventDefault();var y=g('tasks',id);if(y){if(kids(y.id).length||hasCl(y))A.dsub({dataset:{id:id}});else{FOCUS='draft';del('tasks',id)}}}
 else if(ev.key==='ArrowDown'||ev.key==='ArrowUp'){var all=[].slice.call(document.querySelectorAll('.sot')),i2=all.indexOf(el),n=all[i2+(ev.key==='ArrowDown'?1:-1)];if(n){ev.preventDefault();n.focus()}}});
render();
