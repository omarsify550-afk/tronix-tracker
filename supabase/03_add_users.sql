-- =====================================================================
-- إضافة الموظفين وتحديد أدوارهم (شغّله بعد ما تعمل الحسابات من Authentication)
-- 1) Authentication ← Users ← Add user ← Create new user
--    اكتب إيميل وباسورد لكل موظف، وعلّم Auto Confirm User.
--    ممكن تستخدم إيميل شكلي زي: ahmed@tronix.local
-- 2) عدّل القايمة تحت (الإيميل، الدور، الاسم) وشغّل الأمر.
--    الأدوار: admin (مدير كامل) / manager (مشرف) / worker (موظف تنفيذ)
-- =====================================================================
insert into public.nw_profiles (uid, role, name)
select u.id, v.role, v.name
from (values
  ('omar.sify550@gmail.com', 'admin',   'عمر'),
  ('ahmed@tronix.local',     'worker',  'أحمد'),
  ('khaled@tronix.local',    'manager', 'خالد')
) as v(email, role, name)
join auth.users u on u.email = v.email
on conflict (uid) do update set role = excluded.role, name = excluded.name;

-- للتأكد: لازم يظهر كل الناس اللي ضفتهم
select p.name, p.role, u.email
from public.nw_profiles p join auth.users u on u.id = p.uid
order by p.role, p.name;
