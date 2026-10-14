-- =====================================================================
-- متابعة TRONIX: إعداد Supabase (شغّله مرة واحدة في SQL Editor)
-- جداول بادئتها nw_ فمش بتتعارض مع جداولك التانية.
-- =====================================================================

-- 1) جدول المستندات (كل بيانات الأداة: ماكينات، تاسكات، أقسام...)
create table if not exists public.nw_docs (
  col        text        not null,
  id         text        not null,
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (col, id)
);
create index if not exists nw_docs_col_idx on public.nw_docs (col);

-- 2) الحسابات والصلاحيات (admin = كل شيء، manager = كل شيء ماعدا الحسابات، worker = تنفيذ التاسكات فقط)
create table if not exists public.nw_profiles (
  uid  uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'worker' check (role in ('admin','manager','worker')),
  name text
);

-- 3) دالة تجيب دور المستخدم الحالي
create or replace function public.nw_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.nw_profiles where uid = auth.uid()
$$;

-- 4) دالة تعدّل حقول داخل المستند من غير ما تمسح باقيه
create or replace function public.nw_patch(p_col text, p_id text, p_patch jsonb)
returns void language plpgsql security invoker as $$
begin
  update public.nw_docs
     set data = data || p_patch, updated_at = now()
   where col = p_col and id = p_id;
end $$;

-- 5) الأمان (RLS)
alter table public.nw_docs     enable row level security;
alter table public.nw_profiles enable row level security;

drop policy if exists nw_docs_read       on public.nw_docs;
drop policy if exists nw_docs_manage     on public.nw_docs;
drop policy if exists nw_docs_worker_ins on public.nw_docs;
drop policy if exists nw_docs_worker_upd on public.nw_docs;
drop policy if exists nw_prof_read       on public.nw_profiles;
drop policy if exists nw_prof_admin      on public.nw_profiles;

-- كل مستخدم مفعّل يقرا كل البيانات
create policy nw_docs_read on public.nw_docs
  for select to authenticated using (public.nw_role() is not null);

-- المدير والمشرف: كل العمليات
create policy nw_docs_manage on public.nw_docs
  for all to authenticated
  using (public.nw_role() in ('admin','manager'))
  with check (public.nw_role() in ('admin','manager'));

-- الموظف: يضيف ويعدّل في التاسكات والسجل فقط (مفيش حذف)
create policy nw_docs_worker_ins on public.nw_docs
  for insert to authenticated
  with check (public.nw_role() = 'worker' and col in ('tasks','log'));
create policy nw_docs_worker_upd on public.nw_docs
  for update to authenticated
  using      (public.nw_role() = 'worker' and col in ('tasks','log'))
  with check (public.nw_role() = 'worker' and col in ('tasks','log'));

-- الحسابات: الكل يشوف الأسماء، والـ admin بس يعدّل
create policy nw_prof_read on public.nw_profiles
  for select to authenticated using (public.nw_role() is not null);
create policy nw_prof_admin on public.nw_profiles
  for all to authenticated
  using (public.nw_role() = 'admin') with check (public.nw_role() = 'admin');

-- 6) التحديث اللحظي (Realtime)
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'nw_docs') then
    alter publication supabase_realtime add table public.nw_docs;
  end if;
end $$;

-- =====================================================================
-- 7) أول مدير: اعمل المستخدم من Authentication ← Users ← Add user (إيميل + باسورد)،
--    وبعدين شغّل السطر ده بإيميلك:
--
-- insert into public.nw_profiles (uid, role, name)
-- select id, 'admin', 'عمر' from auth.users where email = 'ضع-إيميلك-هنا';
--
-- باقي الموظفين: نفس الخطوات بدور 'worker' أو 'manager':
-- insert into public.nw_profiles (uid, role, name)
-- select id, 'worker', 'اسم الموظف' from auth.users where email = 'email@example.com';
-- =====================================================================
