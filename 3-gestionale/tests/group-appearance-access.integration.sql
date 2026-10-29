-- Read/edit permissions and forged display metadata, with complete rollback.
begin;
do $$ begin
 perform set_config('pattinaggio.target_avatar',(select id::text from public.group_appearance where group_name='Fratelli Cabisto' limit 1),true);
 perform set_config('request.jwt.claims',(select jsonb_build_object('sub',ac.maestro_id,'role','authenticated')::text
 from public.allievi_condivisi ac join public.allievi a on a.id=ac.allievo_id
 where a.gruppo='Budosan Bimbi Principianti' limit 1),true);
end $$;
set local role authenticated;
do $$
declare member_id uuid; config jsonb; denied boolean:=false;
begin
 if (select count(*) from public.group_appearance where group_name='Budosan Bimbi Principianti')<>1 then raise exception 'Shared group inaccessible';end if;
 if exists(select 1 from public.group_appearance where id=current_setting('pattinaggio.target_avatar')::uuid) then raise exception 'Unshared group accessible';end if;
 select id into member_id from public.allievi where gruppo='Budosan Bimbi Principianti' limit 1;
 update public.allievi set profilo=jsonb_set(profilo,'{gruppo_avatar,id}',to_jsonb(current_setting('pattinaggio.target_avatar'))) where id=member_id;
 if exists(select 1 from public.group_appearance where id=current_setting('pattinaggio.target_avatar')::uuid) then raise exception 'Forged display metadata granted access';end if;
 config:=public.save_group_appearance('Budosan Bimbi Principianti');
 if config->>'id'=current_setting('pattinaggio.target_avatar') then raise exception 'Canonical identity replaced by forged display JSON';end if;
 perform set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000000","role":"authenticated"}',true);
 if exists(select 1 from public.group_appearance) then raise exception 'Stranger can read group metadata';end if;
 begin perform public.save_group_appearance('Budosan Bimbi Principianti');exception when insufficient_privilege then denied:=true;end;
 if not denied then raise exception 'Stranger can edit group';end if;
 perform set_config('pattinaggio.access_test','PASS: shared collaborator allowed, unshared group denied, forged JSON ineffective, stranger denied',true);
end $$;
select current_setting('pattinaggio.access_test') as result;
rollback;
