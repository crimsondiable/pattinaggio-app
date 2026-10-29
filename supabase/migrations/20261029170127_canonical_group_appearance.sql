-- Storage authorization must use canonical group ownership, never editable profile JSON.
create table public.group_appearance (
 id uuid primary key default gen_random_uuid(), maestro_id uuid not null,
 group_name text not null, sigla text not null check(sigla ~ '^[[:alnum:]]{1,4}$'),
 foto_path text, unique(maestro_id,group_name)
);
alter table public.group_appearance enable row level security;
create function app_private.can_access_group(p_owner uuid,p_name text)
returns boolean language sql stable security invoker set search_path='' as $$
 select exists(select 1 from public.allievi a where a.maestro_id=p_owner
 and a.gruppo=p_name and app_private.can_access_allievo(a.id));
$$;
revoke all on function app_private.can_access_group(uuid,text) from public,anon;
grant execute on function app_private.can_access_group(uuid,text) to authenticated;
create policy group_appearance_read on public.group_appearance for select to authenticated
 using(maestro_id=auth.uid() or app_private.is_super_maestro() or app_private.can_access_group(maestro_id,group_name));
create policy group_appearance_insert on public.group_appearance for insert to authenticated
 with check(app_private.can_access_group(maestro_id,group_name));
create policy group_appearance_update on public.group_appearance for update to authenticated
 using(maestro_id=auth.uid() or app_private.is_super_maestro() or app_private.can_access_group(maestro_id,group_name))
 with check(maestro_id=auth.uid() or app_private.is_super_maestro() or app_private.can_access_group(maestro_id,group_name));
revoke all on public.group_appearance from public,anon,authenticated;
grant select,insert on public.group_appearance to authenticated;
grant update(group_name,sigla,foto_path) on public.group_appearance to authenticated;
-- Existing initials seeded by the preceding, unpublished implementation.
insert into public.group_appearance(id,maestro_id,group_name,sigla,foto_path)
select distinct on(maestro_id,gruppo) (profilo#>>'{gruppo_avatar,id}')::uuid,
 maestro_id,gruppo,profilo#>>'{gruppo_avatar,sigla}',profilo#>>'{gruppo_avatar,foto_path}'
from public.allievi where maestro_id is not null and gruppo is not null
 and (profilo#>>'{gruppo_avatar,id}') ~ '^[a-f0-9-]{36}$' order by maestro_id,gruppo,id;

create or replace function public.save_group_appearance(
 p_group text,p_action text default 'ensure',p_sigla text default null,
 p_photo_path text default null,p_expected_photo_path text default null,p_expected_sigla text default null
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare config jsonb; record public.group_appearance; owner_id uuid; owner_count integer;
begin
 if auth.uid() is null or p_action not in ('ensure','save') then
  raise exception 'Operazione non autorizzata' using errcode='42501'; end if;
 perform id from public.allievi where gruppo=p_group order by id for update;
 if not found then raise exception 'Gruppo non disponibile' using errcode='42501';end if;
 select count(distinct maestro_id) into owner_count from public.allievi where gruppo=p_group;
 if owner_count<>1 then raise exception 'Gruppo con proprietari diversi: verifica le appartenenze.' using errcode='22023';end if;
 select maestro_id into owner_id from public.allievi where gruppo=p_group limit 1;
 select * into record from public.group_appearance where maestro_id=owner_id and group_name=p_group for update;
 if not found then
  insert into public.group_appearance(maestro_id,group_name,sigla)
  values(owner_id,p_group,coalesce(nullif(upper(btrim(p_sigla)),''),upper(left(btrim(p_group),2))))
  returning * into record;
 end if;
 if p_action='save' then
  if p_expected_photo_path is distinct from record.foto_path or p_expected_sigla is distinct from record.sigla then
   raise exception 'Foto o sigla modificate altrove. Ricarica il gruppo e riprova.' using errcode='40001';end if;
  if p_sigla is null or upper(btrim(p_sigla)) !~ '^[[:alnum:]]{1,4}$' then
   raise exception 'Usa da 1 a 4 lettere o numeri per la sigla.' using errcode='22023';end if;
  if p_photo_path is not null and (split_part(p_photo_path,'/',1)<>record.id::text or p_photo_path !~ '^[a-zA-Z0-9/-]+\.jpg$') then
   raise exception 'Percorso foto non valido' using errcode='22023';end if;
  update public.group_appearance set sigla=upper(btrim(p_sigla)),foto_path=p_photo_path
   where id=record.id returning * into record;
 end if;
 config:=jsonb_build_object('id',record.id,'sigla',record.sigla,'foto_path',record.foto_path);
 update public.allievi set profilo=jsonb_set(coalesce(profilo,'{}'::jsonb),'{gruppo_avatar}',config)
 where gruppo=p_group and maestro_id=owner_id and profilo->'gruppo_avatar' is distinct from config;
 return config;
end;
$$;

-- Tighten the three existing rules in place, without removing them.
alter policy group_photos_read on storage.objects
using(bucket_id='group-photos' and exists(select 1 from public.group_appearance g
 where g.id::text=split_part(name,'/',1) and app_private.can_access_group(g.maestro_id,g.group_name)));
alter policy group_photos_insert on storage.objects
with check(bucket_id='group-photos' and exists(select 1 from public.group_appearance g
 where g.id::text=split_part(name,'/',1) and app_private.can_access_group(g.maestro_id,g.group_name)));
alter policy group_photos_delete on storage.objects
using(bucket_id='group-photos' and exists(select 1 from public.group_appearance g
 where g.id::text=split_part(name,'/',1) and app_private.can_access_group(g.maestro_id,g.group_name)));

-- Owner-only metadata rename after a complete group rename. The normal group editor
-- already writes members individually; keep that existing workflow without widening access.
create function public.rename_group_appearance(p_old_group text,p_new_group text)
returns void language plpgsql security invoker set search_path='' as $$
begin
 if auth.uid() is null then raise exception 'Accesso richiesto' using errcode='42501';end if;
 update public.group_appearance g set group_name=p_new_group
 where g.group_name=p_old_group and (g.maestro_id=auth.uid() or app_private.is_super_maestro())
 and exists(select 1 from public.allievi a where a.maestro_id=g.maestro_id and a.gruppo=p_new_group)
 and not exists(select 1 from public.allievi a where a.maestro_id=g.maestro_id and a.gruppo=p_old_group)
 and not exists(select 1 from public.group_appearance target where target.maestro_id=g.maestro_id and target.group_name=p_new_group);
end;
$$;
revoke all on function public.rename_group_appearance(text,text) from public,anon;
grant execute on function public.rename_group_appearance(text,text) to authenticated;
notify pgrst,'reload schema';
