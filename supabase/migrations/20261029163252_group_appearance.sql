-- Group appearance follows the app's existing group metadata on member profiles.
-- Invoker privileges keep the same student-sharing scope; JSON keys are merged atomically.
create function public.save_group_appearance(
  p_group text, p_action text default 'ensure', p_sigla text default null,
  p_photo_path text default null, p_expected_photo_path text default null,
  p_expected_sigla text default null
) returns jsonb language plpgsql security invoker set search_path = '' as $$
declare config jsonb; avatar_id text; initials text;
begin
  if auth.uid() is null or p_action not in ('ensure', 'save') then
    raise exception 'Operazione non autorizzata' using errcode='42501';
  end if;
  perform id from public.allievi where gruppo=p_group order by id for update;
  if not found then raise exception 'Gruppo non disponibile' using errcode='42501'; end if;
  select profilo->'gruppo_avatar' into config from public.allievi
    where gruppo=p_group and (profilo#>>'{gruppo_avatar,id}') ~ '^[a-f0-9-]{36}$'
    order by id limit 1;
  avatar_id := coalesce(config->>'id',gen_random_uuid()::text);
  initials := coalesce(nullif(config->>'sigla',''),nullif(upper(btrim(p_sigla)),''),upper(left(btrim(p_group),2)));
  if p_action='save' then
    if p_expected_photo_path is distinct from (config->>'foto_path')
       or p_expected_sigla is distinct from (config->>'sigla') then
      raise exception 'Foto o sigla modificate altrove. Ricarica il gruppo e riprova.' using errcode='40001';
    end if;
    initials := upper(btrim(p_sigla));
    if p_photo_path is not null and (split_part(p_photo_path,'/',1)<>avatar_id
      or p_photo_path !~ '^[a-zA-Z0-9/-]+\.jpg$') then
      raise exception 'Percorso foto non valido' using errcode='22023';
    end if;
  end if;
  if initials is null or initials !~ '^[[:alnum:]]{1,4}$' then
    raise exception 'Usa da 1 a 4 lettere o numeri per la sigla.' using errcode='22023';
  end if;
  config := jsonb_build_object('id',avatar_id,'sigla',initials,
    'foto_path',case when p_action='save' then p_photo_path else config->>'foto_path' end);
  update public.allievi set profilo=jsonb_set(coalesce(profilo,'{}'::jsonb),'{gruppo_avatar}',config)
    where gruppo=p_group and (profilo->'gruppo_avatar') is distinct from config;
  return config;
end;
$$;
revoke all on function public.save_group_appearance(text,text,text,text,text,text) from public,anon;
grant execute on function public.save_group_appearance(text,text,text,text,text,text) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('group-photos','group-photos',false,524288,array['image/jpeg']);
create policy group_photos_read on storage.objects for select to authenticated
using(bucket_id='group-photos' and exists(select 1 from public.allievi a
  where a.gruppo is not null and a.profilo#>>'{gruppo_avatar,id}'=split_part(name,'/',1)
    and app_private.can_access_allievo(a.id)));
create policy group_photos_insert on storage.objects for insert to authenticated
with check(bucket_id='group-photos' and exists(select 1 from public.allievi a
  where a.gruppo is not null and a.profilo#>>'{gruppo_avatar,id}'=split_part(name,'/',1)
    and app_private.can_access_allievo(a.id)));
create policy group_photos_delete on storage.objects for delete to authenticated
using(bucket_id='group-photos' and exists(select 1 from public.allievi a
  where a.gruppo is not null and a.profilo#>>'{gruppo_avatar,id}'=split_part(name,'/',1)
    and app_private.can_access_allievo(a.id)));
notify pgrst,'reload schema';
