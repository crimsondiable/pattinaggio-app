-- Aggiunge il ramo Air e sposta i salti fuori da Rotazione.
-- Le skill fakie vengono neutralizzate fuori dai rami senza cancellare storico lezioni/progressi.

alter table public.skills
  drop constraint if exists skills_ramo_check;

alter table public.skills
  add constraint skills_ramo_check
  check (ramo in ('Equilibrio', 'Andatura', 'Frenata', 'Rotazione', 'Air'));

alter table public.skill_definizioni
  drop constraint if exists skill_definizioni_ramo_check;

alter table public.skill_definizioni
  add constraint skill_definizioni_ramo_check
  check (ramo in ('Equilibrio', 'Andatura', 'Frenata', 'Rotazione', 'Air', 'Extra'));

update public.skills
set ramo = 'Air'
where nome in (
  'Salto base / distacco',
  'Salto piedi pari',
  'Jump 180',
  'Jump 360 segmentato',
  'Jump 360'
);

update public.skill_definizioni
set ramo = 'Air'
where skill_nome in (
  'Salto base / distacco',
  'Salto piedi pari',
  'Jump 180',
  'Jump 360 segmentato',
  'Jump 360'
);

update public.skills
set descrizione = regexp_replace(descrizione, 'fakie', 'retromarcia', 'gi')
where descrizione ~* 'fakie';

update public.skill_definizioni
set
  cosa_fa = regexp_replace(cosa_fa, 'fakie', 'retromarcia', 'gi'),
  come_si_fa = regexp_replace(come_si_fa, 'fakie', 'retromarcia', 'gi'),
  note_revisione = regexp_replace(note_revisione, 'fakie', 'retromarcia', 'gi'),
  catalog_note = regexp_replace(catalog_note, 'fakie', 'retromarcia', 'gi')
where coalesce(cosa_fa, '') ~* 'fakie'
   or coalesce(come_si_fa, '') ~* 'fakie'
   or coalesce(note_revisione, '') ~* 'fakie'
   or coalesce(catalog_note, '') ~* 'fakie';

update public.skills
set
  tipo = 'OPT',
  ramo = null,
  obbligatoria = false,
  descrizione = coalesce(descrizione, '') || case
    when coalesce(descrizione, '') ~* 'nascosta: dimensione fakie' then ''
    else ' Nascosta: dimensione fakie, non skill autonoma.'
  end
where nome ~* 'fakie';

update public.skill_definizioni
set stato = 'da_rivedere'
where skill_nome ~* 'fakie';
