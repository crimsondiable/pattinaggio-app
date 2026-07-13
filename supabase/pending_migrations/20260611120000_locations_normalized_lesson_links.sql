-- Location normalizzate e collegamento opzionale dalle lezioni.
-- Mantiene public.lezioni.luogo come fallback compatibile.

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  nome_normalizzato text unique,
  indirizzo text,
  lat double precision,
  lng double precision,
  google_maps_url text,
  preview_url text,
  tipo text,
  tags text[] default '{}',
  note text,
  attiva boolean default true,
  creato_il timestamptz default now(),
  aggiornata_il timestamptz default now()
);

alter table public.locations
  add column if not exists nome_normalizzato text,
  add column if not exists lat double precision,
  add column if not exists lng double precision,
  add column if not exists google_maps_url text,
  add column if not exists preview_url text,
  add column if not exists tipo text,
  add column if not exists tags text[] default '{}',
  add column if not exists attiva boolean default true,
  add column if not exists creato_il timestamptz default now(),
  add column if not exists aggiornata_il timestamptz default now();

alter table public.locations
  add column if not exists tipologia text not null default 'Location',
  add column if not exists latitudine double precision,
  add column if not exists longitudine double precision,
  add column if not exists condivisa boolean not null default false,
  add column if not exists maestro_id uuid references auth.users(id) on delete set null,
  add column if not exists allievo_id uuid,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.locations
set
  nome_normalizzato = coalesce(nome_normalizzato, lower(regexp_replace(trim(nome), '\s+', ' ', 'g'))),
  tipo = coalesce(tipo, lower(tipologia)),
  lat = coalesce(lat, latitudine),
  lng = coalesce(lng, longitudine),
  creato_il = coalesce(creato_il, created_at),
  aggiornata_il = coalesce(aggiornata_il, updated_at)
where nome is not null;

with aliases(alias, nome_normalizzato) as (
  values
    ('Sant''Agostino', 'sant agostino'),
    ('S.Agostino', 'sant agostino'),
    ('S. Agostino', 'sant agostino'),
    ('Piazza Sant''Agostino', 'sant agostino'),
    ('Piazza Sant''Agostino, 20123 Milano MI, Italia', 'sant agostino'),
    ('Sant''Agostino - casa', 'sant agostino'),
    ('Tolstoj / Skatepark Tolstoj', 'tolstoj skatepark tolstoj'),
    ('Giardini di via Tolstoj Savona', 'tolstoj skatepark tolstoj'),
    ('Giardini di via Tolstoj Savona, 20144 Milano MI, Italia', 'tolstoj skatepark tolstoj'),
    ('Casa - skatepark Tolstoj', 'tolstoj skatepark tolstoj'),
    ('Barrio''s / Parco Barona', 'barrios parco barona'),
    ('Casa - Barrio''s', 'barrios parco barona'),
    ('Barrio''s - parco Barona', 'barrios parco barona'),
    ('Naviglio Pavese', 'naviglio pavese'),
    ('Casa - naviglio Pavese', 'naviglio pavese'),
    ('Ciclabile naviglio pavese', 'naviglio pavese'),
    ('Castelletto / Robecco', 'castelletto robecco'),
    ('parco castelletto', 'castelletto robecco'),
    ('cimitero castelletto', 'castelletto robecco'),
    ('Casa', 'casa'),
    ('Istituto Leopardi', 'istituto leopardi'),
    ('Area Pozzi', 'area pozzi'),
    ('Robecco sul naviglio', 'robecco sul naviglio')
)
update public.locations l
set nome_normalizzato = a.nome_normalizzato
from aliases a
where lower(trim(l.nome)) = lower(trim(a.alias));

with ranked as (
  select
    id,
    row_number() over (
      partition by nome_normalizzato
      order by coalesce(updated_at, created_at, now()) desc, id
    ) as rn
  from public.locations
  where nome_normalizzato is not null
)
update public.locations l
set nome_normalizzato = null
from ranked r
where l.id = r.id
  and r.rn > 1;

create unique index if not exists locations_nome_normalizzato_uidx
  on public.locations (nome_normalizzato)
  where nome_normalizzato is not null;

alter table public.lezioni
  add column if not exists location_id uuid references public.locations(id);

create index if not exists lezioni_location_id_idx on public.lezioni (location_id);

with canonical(nome, nome_normalizzato, indirizzo, tipo, tipologia, tags, note) as (
  values
    ('Sant''Agostino', 'sant agostino', 'Piazza Sant''Agostino, Milano', 'street', 'Piazza', array['spot','street'], 'Raggruppa S.Agostino, S. Agostino, Piazza Sant''Agostino e varianti casa.'),
    ('Tolstoj / Skatepark Tolstoj', 'tolstoj skatepark tolstoj', 'Via Tolstoj / zona Savona, Milano', 'skatepark', 'Skatepark', array['spot','skatepark'], 'Coordinate da verificare prima dell''uso operativo.'),
    ('Barrio''s / Parco Barona', 'barrios parco barona', 'Barona, Milano', 'spot', 'Parco', array['spot','street'], 'Coordinate da verificare prima dell''uso operativo.'),
    ('Naviglio Pavese', 'naviglio pavese', 'Naviglio Pavese, Milano', 'street', 'Ciclabile', array['spot','street','ciclabile'], 'Coordinate da verificare prima dell''uso operativo.'),
    ('Castelletto / Robecco', 'castelletto robecco', 'Robecco sul Naviglio', 'spot', 'Location', array['spot','da-verificare'], 'Raggruppa parco/cimitero Castelletto. GPS da verificare.'),
    ('Casa', 'casa', null, 'privato', 'Casa allievo', array['privato','da-verificare'], 'Location privata o ambigua: non geocodificare pubblicamente senza conferma.'),
    ('Istituto Leopardi', 'istituto leopardi', null, 'spot', 'Location', array['spot','da-verificare'], 'GPS da verificare.'),
    ('Area Pozzi', 'area pozzi', null, 'spot', 'Parco', array['spot','da-verificare'], 'GPS da verificare.'),
    ('Robecco sul Naviglio', 'robecco sul naviglio', 'Robecco sul Naviglio', 'spot', 'Location', array['spot','da-verificare'], 'GPS da verificare.')
)
insert into public.locations (nome, nome_normalizzato, indirizzo, tipo, tipologia, tags, note, attiva, condivisa)
select c.nome, c.nome_normalizzato, c.indirizzo, c.tipo, c.tipologia, c.tags, c.note, true, false
from canonical c
where not exists (
  select 1 from public.locations l
  where l.nome_normalizzato = c.nome_normalizzato
     or lower(trim(l.nome)) = lower(trim(c.nome))
);

with aliases(alias, nome_normalizzato) as (
  values
    ('S.Agostino', 'sant agostino'),
    ('S. Agostino', 'sant agostino'),
    ('Piazza Sant''Agostino', 'sant agostino'),
    ('Piazza Sant''Agostino, 20123 Milano MI, Italia', 'sant agostino'),
    ('Sant''Agostino - casa', 'sant agostino'),
    ('Giardini di via Tolstoj Savona', 'tolstoj skatepark tolstoj'),
    ('Giardini di via Tolstoj Savona, 20144 Milano MI, Italia', 'tolstoj skatepark tolstoj'),
    ('Casa - skatepark Tolstoj', 'tolstoj skatepark tolstoj'),
    ('Casa - Barrio''s', 'barrios parco barona'),
    ('Barrio''s - parco Barona', 'barrios parco barona'),
    ('Casa - naviglio Pavese', 'naviglio pavese'),
    ('Ciclabile naviglio pavese', 'naviglio pavese'),
    ('parco castelletto', 'castelletto robecco'),
    ('cimitero castelletto', 'castelletto robecco'),
    ('Casa', 'casa'),
    ('Istituto Leopardi', 'istituto leopardi'),
    ('Area Pozzi', 'area pozzi'),
    ('Robecco sul naviglio', 'robecco sul naviglio')
)
update public.lezioni le
set location_id = l.id
from aliases a
join public.locations l on l.nome_normalizzato = a.nome_normalizzato
where le.location_id is null
  and lower(trim(le.luogo)) = lower(trim(a.alias));

update public.locations
set
  latitudine = coalesce(latitudine, lat),
  longitudine = coalesce(longitudine, lng),
  tipologia = coalesce(nullif(tipologia, ''), coalesce(tipo, 'Location')),
  updated_at = now(),
  aggiornata_il = now()
where lat is not null or lng is not null or tipo is not null;

create or replace view public.locations_with_lezioni_stats as
select
  l.id,
  l.nome,
  l.nome_normalizzato,
  l.indirizzo,
  coalesce(l.lat, l.latitudine) as lat,
  coalesce(l.lng, l.longitudine) as lng,
  l.google_maps_url,
  l.preview_url,
  coalesce(l.tipo, lower(l.tipologia)) as tipo,
  l.tags,
  l.note,
  l.attiva,
  count(le.id) as lezioni_count,
  max(le.data) as ultimo_uso
from public.locations l
left join public.lezioni le
  on le.location_id = l.id
  or lower(trim(le.luogo)) = lower(trim(l.nome))
group by l.id
order by lezioni_count desc, l.nome asc;

notify pgrst, 'reload schema';
