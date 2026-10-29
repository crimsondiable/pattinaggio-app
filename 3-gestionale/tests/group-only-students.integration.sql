-- Linked-database integration check. All fixtures roll back; no real roster edits.
-- Requires an administrative connection to set the existing owner's test context.
begin;
select set_config('request.jwt.claims', (
  select jsonb_build_object('sub', maestro_id, 'role', 'authenticated',
    'email', 'group-only-fixture@example.invalid')::text
  from public.allievi where maestro_id is not null limit 1
), true);
set local role authenticated;
do $$
declare
  owner_id uuid := auth.uid();
  class_name text := '__group_only_fixture_' || gen_random_uuid()::text;
  student_a uuid := gen_random_uuid(); student_b uuid := gen_random_uuid(); student_c uuid := gen_random_uuid();
  lesson_group uuid := gen_random_uuid(); lesson_individual uuid := gen_random_uuid(); lesson_free uuid := gen_random_uuid();
  relation_id uuid := gen_random_uuid();
  flag boolean;
begin
  insert into public.allievi(id,nome,cognome,gruppo,solo_gruppo,maestro_id)
    values (student_a,'Fixture','Class',class_name,true,owner_id);
  insert into public.allievi(id,nome,cognome,gruppo,maestro_id)
    values (student_b,'Fixture','New arrival',class_name,owner_id);
  select solo_gruppo into flag from public.allievi where id=student_b;
  if flag is distinct from true then raise exception 'New class member did not inherit group-only'; end if;
  insert into public.allievi(id,nome,cognome,gruppo,maestro_id)
    values (student_c,'Fixture','Mixed',class_name || '_mixed',owner_id);
  select solo_gruppo into flag from public.allievi where id=student_c;
  if flag is distinct from false then raise exception 'Mixed group default changed'; end if;
  insert into public.lezioni(id,tipo,maestro_id) values (lesson_group,'gruppo',owner_id);
  insert into public.lezioni(id,tipo,maestro_id) values (lesson_individual,'individuale',owner_id);
  insert into public.lezioni(id,tipo,maestro_id) values (lesson_free,'campo_libero',owner_id);
  insert into public.lezioni_allievi(lezione_id,allievo_id) values (lesson_group,student_a);
  insert into public.lezioni_allievi(id,lezione_id,allievo_id) values (relation_id,lesson_individual,student_c);
  begin
    insert into public.lezioni_allievi(lezione_id,allievo_id) values (lesson_individual,student_b);
    raise exception 'Individual lesson incorrectly accepted class-only member';
  exception when check_violation then null;
  end;
  begin
    insert into public.lezioni_allievi(lezione_id,allievo_id) values (lesson_free,student_b);
    raise exception 'Free lesson incorrectly accepted class-only member';
  exception when check_violation then null;
  end;
  begin
    update public.lezioni_allievi set allievo_id=student_b where id=relation_id;
    raise exception 'Participant replacement bypassed the rule';
  exception when check_violation then null;
  end;
  begin
    update public.lezioni set tipo='individuale' where id=lesson_group;
    raise exception 'Lesson type change bypassed the rule';
  exception when check_violation then null;
  end;
  update public.allievi set solo_gruppo=false where gruppo=class_name;
  if exists(select 1 from public.allievi where gruppo=class_name and solo_gruppo) then
    raise exception 'Disabling group-only failed';
  end if;
  insert into public.lezioni_allievi(lezione_id,allievo_id) values (lesson_individual,student_b);
  update public.allievi set solo_gruppo=true where id=student_a;
  update public.allievi set gruppo=null where id=student_a returning solo_gruppo into flag;
  if flag is distinct from false then raise exception 'Detached student retained group-only'; end if;
  perform set_config('pattinaggio.group_only_test_result', 'PASS: authenticated RLS, inheritance, mixed default, group attendance, individual/free block, participant/type bypass block, reversible flag, detach', true);
end;
$$;
select current_setting('pattinaggio.group_only_test_result') as integration_result;
rollback;
