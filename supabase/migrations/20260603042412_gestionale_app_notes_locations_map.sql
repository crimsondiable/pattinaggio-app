-- Gestionale: note operative condivise e coordinate per la mappa location.

create table if not exists public.app_notes (
  key text primary key,
  content text not null default '',
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.app_notes enable row level security;

revoke all on table public.app_notes from anon;
grant select, insert, update, delete on table public.app_notes to authenticated;

drop policy if exists "Super maestro reads app notes" on public.app_notes;
create policy "Super maestro reads app notes"
on public.app_notes
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'francesco.grinovero@gmail.com');

drop policy if exists "Super maestro inserts app notes" on public.app_notes;
create policy "Super maestro inserts app notes"
on public.app_notes
for insert
to authenticated
with check ((auth.jwt() ->> 'email') = 'francesco.grinovero@gmail.com');

drop policy if exists "Super maestro updates app notes" on public.app_notes;
create policy "Super maestro updates app notes"
on public.app_notes
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'francesco.grinovero@gmail.com')
with check ((auth.jwt() ->> 'email') = 'francesco.grinovero@gmail.com');

drop policy if exists "Super maestro deletes app notes" on public.app_notes;
create policy "Super maestro deletes app notes"
on public.app_notes
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'francesco.grinovero@gmail.com');

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  indirizzo text,
  tipologia text not null default 'Location',
  note text,
  allievo_id uuid,
  maestro_id uuid references auth.users(id) on delete set null,
  latitudine double precision,
  longitudine double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.locations
  add column if not exists latitudine double precision,
  add column if not exists longitudine double precision;

create index if not exists locations_tipologia_idx on public.locations (tipologia);
create index if not exists locations_maestro_id_idx on public.locations (maestro_id);
create index if not exists locations_coordinate_idx on public.locations (latitudine, longitudine);

alter table public.locations enable row level security;

revoke all on table public.locations from anon;
grant select, insert, update, delete on table public.locations to authenticated;

drop policy if exists "Authenticated users read locations" on public.locations;
create policy "Authenticated users read locations"
on public.locations
for select
to authenticated
using (true);

drop policy if exists "Authenticated users insert locations" on public.locations;
create policy "Authenticated users insert locations"
on public.locations
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users update locations" on public.locations;
create policy "Authenticated users update locations"
on public.locations
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users delete locations" on public.locations;
create policy "Authenticated users delete locations"
on public.locations
for delete
to authenticated
using (true);
