(async function(){
 if(!window.supabase){sbShow('تعذّر تحميل مكتبة Supabase. اتأكد من الإنترنت.');return}
 if(SB_KEY.indexOf('PASTE')===0){sbShow('لازم تحط الـ anon key في أول سطر SB_KEY جوه الملف.');return}
 SB=window.supabase.createClient(SB_URL,SB_KEY);
 async function start(user){uid=user.id;
  var r=await SB.from('nw_profiles').select('role,name').eq('uid',uid).maybeSingle();
  if(r.error||!r.data){await SB.auth.signOut();sbShow('حسابك لسه مش مفعّل. كلّم المدير يضيفك.');return}
  ROLE=r.data.role;$('login').className='ov hide';
  var pr=await SB.from('nw_profiles').select('uid,name,role');(pr.data||[]).forEach(function(x){PROF[x.uid]=x.name||'';PROFR[x.uid]={name:x.name||'',role:x.role}});
  db=sbDB(SB);
  COL.forEach(function(c){db.collection(c).onSnapshot(function(s){S[c]=s.docs.map(function(d){return Object.assign({id:d.id},d.data())}).sort(byO);if($('modal').className.indexOf('hide')>-1)render()},function(){toast('تعذّر تحميل البيانات')})});
  document.querySelector('.nav').insertAdjacentHTML('beforeend','<a data-a="logout">خروج ('+esc(r.data.name||'')+')</a>');
  if(ROLE==='worker'){['settings','arch'].forEach(function(v){var a=document.querySelector('.nav a[data-v='+v+']');if(a)a.style.display='none'})}
  render()}
 $('lgo').onclick=async function(){var em=$('lem').value.trim(),pw=$('lpw').value;if(!em||!pw){$('lmsg').textContent='اكتب الإيميل وكلمة المرور';return}$('lmsg').textContent='جاري الدخول...';var q=await SB.auth.signInWithPassword({email:em,password:pw});if(q.error){$('lmsg').textContent='بيانات الدخول غلط';return}await start(q.data.user)};
 document.addEventListener('keydown',function(ev){if(ev.key==='Enter'&&ev.target.closest&&ev.target.closest('#login')){ev.preventDefault();$('lgo').click()}});
 var s=await SB.auth.getSession();
 if(s.data&&s.data.session)await start(s.data.session.user);else sbShow('');
})();
