begin;
do $$ begin
 perform set_config('request.jwt.claims',(select jsonb_build_object('sub',maestro_id,'role','authenticated')::text from public.allievi where maestro_id is not null limit 1),true);
end $$;
set local role authenticated;
do $$
declare group_name text := '__avatar_fixture_'||gen_random_uuid(); a uuid:=gen_random_uuid(); b uuid:=gen_random_uuid(); config jsonb; next_config jsonb; rejected boolean:=false;
begin
 insert into public.allievi(id,nome,cognome,gruppo,maestro_id,profilo) values
 (a,'Avatar','Fixture',group_name,auth.uid(),'{"other":"keep-a"}'),
 (b,'Avatar','Fixture',group_name,auth.uid(),'{"other":"keep-b"}');
 config:=public.save_group_appearance(group_name,p_sigla=>'BB');
 if config->>'sigla'<>'BB' or config->>'id' is null then raise exception 'Bad initials/id'; end if;
 if (select count(distinct profilo->'gruppo_avatar') from public.allievi where gruppo=group_name)<>1 then raise exception 'Group not synchronized';end if;
 if (select profilo->>'other' from public.allievi where id=a)<>'keep-a' then raise exception 'Unrelated profile overwritten';end if;
 next_config:=public.save_group_appearance(group_name,'save','FC',config->>'id'||'/fixture.jpg',null,'BB');
 if next_config->>'sigla'<>'FC' then raise exception 'Initials not updated';end if;
 begin
  perform public.save_group_appearance(group_name,'save','XX',null,null,'BB');
 exception when serialization_failure then rejected:=true;
 end;
 if not rejected then raise exception 'Stale change accepted';end if;
 next_config:=public.save_group_appearance(group_name,'save','FC',null,next_config->>'foto_path','FC');
 if next_config->>'foto_path' is not null then raise exception 'Removal failed';end if;
 perform set_config('request.jwt.claims','{"sub":"00000000-0000-4000-8000-000000000000","role":"authenticated"}',true);
 rejected:=false;
 begin perform public.save_group_appearance(group_name,p_sigla=>'XX');
 exception when insufficient_privilege then rejected:=true; end;
 if not rejected then raise exception 'Unauthorized account changed group';end if;
 perform set_config('pattinaggio.avatar_test','PASS: shared metadata, JSON preservation, image path, initials, concurrent-edit rejection, removal, access scope',true);
end $$;
select current_setting('pattinaggio.avatar_test') as result;
rollback;
