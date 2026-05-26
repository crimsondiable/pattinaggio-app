-- Migrazione per lezioni operative, note speciali, location e storico modifiche.

alter table public.lezioni
  add column if not exists note_speciali text,
  add column if not exists stato text not null default 'aperta',
  add column if not exists check_bene text,
  add column if not exists check_non_fatto text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.lezioni
  drop constraint if exists lezioni_stato_check;

alter table public.lezioni
  add constraint lezioni_stato_check check (stato in ('aperta', 'chiusa'));

alter table public.allievi
  add column if not exists aggiornato_il timestamptz not null default now();

alter table public.lezioni_skills
  add column if not exists dimensioni jsonb not null default '{}'::jsonb,
  add column if not exists fakie boolean not null default false;

-- Se esistono vincoli unici troppo stretti su lezione/allievo/skill,
-- li rimuoviamo: la stessa skill puo comparire con dimensioni diverse.
do $$
declare
  c record;
begin
  for c in
    select conname
    from pg_constraint
    where conrelid = 'public.lezioni_skills'::regclass
      and contype = 'u'
      and pg_get_constraintdef(oid) ~ 'lezione_id'
      and pg_get_constraintdef(oid) ~ 'allievo_id'
      and pg_get_constraintdef(oid) ~ 'skill_id'
  loop
    execute format('alter table public.lezioni_skills drop constraint %I', c.conname);
  end loop;
end $$;

create index if not exists lezioni_skills_lookup_idx
  on public.lezioni_skills (lezione_id, allievo_id, skill_id);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  indirizzo text,
  tipologia text not null default 'Location',
  note text,
  allievo_id uuid,
  maestro_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modifiche_storico (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,
  entity_id text not null,
  descrizione text,
  maestro_id uuid,
  created_at timestamptz not null default now()
);

alter table public.locations enable row level security;
alter table public.modifiche_storico enable row level security;

drop policy if exists "autenticato_tutto" on public.locations;
create policy "autenticato_tutto" on public.locations
  for all to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "autenticato_tutto" on public.modifiche_storico;
create policy "autenticato_tutto" on public.modifiche_storico
  for all to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

revoke all on table public.locations from anon;
revoke all on table public.modifiche_storico from anon;
grant select, insert, update, delete on table public.locations to authenticated;
grant select, insert, update, delete on table public.modifiche_storico to authenticated;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function public.set_aggiornato_il()
returns trigger as $$
begin
  new.aggiornato_il = now();
  return new;
end;
$$ language plpgsql;

revoke execute on function public.set_updated_at() from anon, authenticated;
revoke execute on function public.set_aggiornato_il() from anon, authenticated;

drop trigger if exists trg_lezioni_updated_at on public.lezioni;
create trigger trg_lezioni_updated_at
before update on public.lezioni
for each row execute function public.set_updated_at();

drop trigger if exists trg_locations_updated_at on public.locations;
create trigger trg_locations_updated_at
before update on public.locations
for each row execute function public.set_updated_at();

drop trigger if exists trg_allievi_aggiornato_il on public.allievi;
create trigger trg_allievi_aggiornato_il
before update on public.allievi
for each row execute function public.set_aggiornato_il();

create index if not exists modifiche_storico_entity_idx
  on public.modifiche_storico (tipo, entity_id, created_at desc);

create index if not exists lezioni_stato_data_idx
  on public.lezioni (stato, data desc);
