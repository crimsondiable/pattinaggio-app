-- One private JPEG per student, referenced separately from editable profile JSON.
alter table public.allievi add column if not exists foto_path text;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('student-photos', 'student-photos', false, 524288, array['image/jpeg'])
on conflict (id) do nothing;

-- Match the existing student read/edit scope, including shared teachers.
-- Compare text IDs rather than casting untrusted object names to UUID.
create policy student_photos_read on storage.objects for select to authenticated
using (bucket_id = 'student-photos' and exists (
  select 1 from public.allievi a where a.id::text = split_part(name, '/', 1)
  and app_private.can_access_allievo(a.id)
));
create policy student_photos_insert on storage.objects for insert to authenticated
with check (bucket_id = 'student-photos' and exists (
  select 1 from public.allievi a where a.id::text = split_part(name, '/', 1)
  and app_private.can_access_allievo(a.id)
));
create policy student_photos_delete on storage.objects for delete to authenticated
using (bucket_id = 'student-photos' and exists (
  select 1 from public.allievi a where a.id::text = split_part(name, '/', 1)
  and app_private.can_access_allievo(a.id)
));
notify pgrst, 'reload schema';
