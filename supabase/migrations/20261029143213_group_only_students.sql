-- Explicit membership constraint, separate from appointment preferences.
alter table public.allievi add column solo_gruppo boolean not null default false;
alter table public.allievi add constraint allievi_solo_gruppo_requires_group
  check (not solo_gruppo or nullif(btrim(gruppo), '') is not null);

create function app_private.normalize_group_only_membership()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if nullif(btrim(new.gruppo), '') is null then
    new.solo_gruppo := false;
  elsif tg_op = 'INSERT' or new.gruppo is distinct from old.gruppo then
    -- New arrivals inherit a class rule from another member of the same owner.
    new.solo_gruppo := new.solo_gruppo or exists (
      select 1 from public.allievi a where a.gruppo = new.gruppo
        and a.maestro_id is not distinct from new.maestro_id
        and a.id <> new.id and a.solo_gruppo
    );
  end if;
  return new;
end;
$$;
revoke all on function app_private.normalize_group_only_membership() from public, anon;
create trigger trg_normalize_group_only_membership
before insert or update of gruppo, solo_gruppo on public.allievi
for each row execute function app_private.normalize_group_only_membership();

create function app_private.enforce_group_only_participant()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if exists (select 1 from public.allievi a where a.id = new.allievo_id and a.solo_gruppo)
     and exists (select 1 from public.lezioni l where l.id = new.lezione_id and l.tipo is distinct from 'gruppo') then
    raise exception 'Questo allievo è solo di gruppo: seleziona una lezione di gruppo.' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function app_private.enforce_group_only_participant() from public, anon;
create trigger trg_enforce_group_only_participant
before insert or update of allievo_id, lezione_id on public.lezioni_allievi
for each row execute function app_private.enforce_group_only_participant();

create function app_private.enforce_group_only_lesson_type()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if new.tipo is distinct from 'gruppo' and old.tipo is distinct from new.tipo
     and exists (select 1 from public.lezioni_allievi la
       join public.allievi a on a.id = la.allievo_id
       where la.lezione_id = new.id and a.solo_gruppo) then
    raise exception 'La lezione include allievi solo di gruppo e deve restare di gruppo.' using errcode = '23514';
  end if;
  return new;
end;
$$;
revoke all on function app_private.enforce_group_only_lesson_type() from public, anon;
create trigger trg_enforce_group_only_lesson_type
before update of tipo on public.lezioni
for each row execute function app_private.enforce_group_only_lesson_type();
notify pgrst, 'reload schema';
