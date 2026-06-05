-- Gestionale: meteo lezioni, privacy location e policy dedicate.

alter table public.lezioni
  add column if not exists meteo text;

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
  nome text not null,
  tipologia text not null default 'Location',
  indirizzo text,
  note text,
  allievo_id uuid,
  maestro_id uuid references auth.users(id) on delete set null,
  latitudine double precision,
  longitudine double precision,
  condivisa boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.locations
  add column if not exists latitudine double precision,
  add column if not exists longitudine double precision,
  add column if not exists condivisa boolean not null default false;

alter table public.locations
  alter column nome set not null,
  alter column condivisa set default false,
  alter column condivisa set not null;

alter table public.locations
  drop constraint if exists locations_nome_key;

create index if not exists locations_tipologia_idx on public.locations (tipologia);
create index if not exists locations_maestro_id_idx on public.locations (maestro_id);
create index if not exists locations_coordinate_idx on public.locations (latitudine, longitudine);
create unique index if not exists locations_maestro_nome_uidx on public.locations (maestro_id, nome);

alter table public.locations enable row level security;

revoke all on table public.locations from anon;
grant select, insert, update, delete on table public.locations to authenticated;

drop policy if exists "autenticato_tutto" on public.locations;
drop policy if exists "Authenticated users read locations" on public.locations;
drop policy if exists "Users read own or shared locations" on public.locations;
create policy "Users read own or shared locations"
on public.locations
for select
to authenticated
using (
  maestro_id = auth.uid()
  or condivisa is true
  or (auth.jwt() ->> 'email') = 'francesco.grinovero@gmail.com'
);

drop policy if exists "Authenticated users insert locations" on public.locations;
drop policy if exists "Users insert own locations" on public.locations;
create policy "Users insert own locations"
on public.locations
for insert
to authenticated
with check (maestro_id = auth.uid());

drop policy if exists "Authenticated users update locations" on public.locations;
drop policy if exists "Users update own locations" on public.locations;
create policy "Users update own locations"
on public.locations
for update
to authenticated
using (
  maestro_id = auth.uid()
  or (auth.jwt() ->> 'email') = 'francesco.grinovero@gmail.com'
)
with check (
  maestro_id = auth.uid()
  or (auth.jwt() ->> 'email') = 'francesco.grinovero@gmail.com'
);

drop policy if exists "Authenticated users delete locations" on public.locations;
drop policy if exists "Users delete own locations" on public.locations;
create policy "Users delete own locations"
on public.locations
for delete
to authenticated
using (
  maestro_id = auth.uid()
  or (auth.jwt() ->> 'email') = 'francesco.grinovero@gmail.com'
);

notify pgrst, 'reload schema';
