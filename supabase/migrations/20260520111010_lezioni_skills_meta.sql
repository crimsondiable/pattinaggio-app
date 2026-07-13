-- Metadata per la lavorazione di una skill dentro una lezione.
-- Serve a salvare:
-- - fakie
-- - dimensioni della lavorazione
-- - esercizi associati, dentro dimensioni.esercizi

alter table public.lezioni_skills
  add column if not exists fakie boolean not null default false;

alter table public.lezioni_skills
  add column if not exists dimensioni jsonb not null default '{}'::jsonb;
