-- =====================================================================
-- متابعة TRONIX: الجزء 2 (المرفقات). شغّله في SQL Editor بعد الجزء الأول.
-- =====================================================================

-- 1) مخزن الملفات (خاص، مش عام)
insert into storage.buckets (id, name, public)
values ('nw-files', 'nw-files', false)
on conflict (id) do nothing;

-- 2) صلاحيات الملفات
drop policy if exists nw_files_read on storage.objects;
drop policy if exists nw_files_ins  on storage.objects;
drop policy if exists nw_files_del  on storage.objects;

create policy nw_files_read on storage.objects
  for select to authenticated
  using (bucket_id = 'nw-files' and public.nw_role() is not null);

create policy nw_files_ins on storage.objects
  for insert to authenticated
  with check (bucket_id = 'nw-files' and public.nw_role() is not null);

create policy nw_files_del on storage.objects
  for delete to authenticated
  using (bucket_id = 'nw-files' and public.nw_role() in ('admin','manager'));

-- 3) السماح للموظف بتسجيل بيانات الملف (مع التاسكات والسجل)
drop policy if exists nw_docs_worker_ins on public.nw_docs;
drop policy if exists nw_docs_worker_upd on public.nw_docs;

create policy nw_docs_worker_ins on public.nw_docs
  for insert to authenticated
  with check (public.nw_role() = 'worker' and col in ('tasks','log','files'));

create policy nw_docs_worker_upd on public.nw_docs
  for update to authenticated
  using      (public.nw_role() = 'worker' and col in ('tasks','log'))
  with check (public.nw_role() = 'worker' and col in ('tasks','log'));
