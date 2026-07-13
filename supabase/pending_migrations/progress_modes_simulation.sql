-- SIMULAZIONE READ-ONLY: non modifica schema o dati.
-- Frontale considera soltanto lezioni_skills.fakie = false.
-- Fakie unisce lezioni Fakie e baseline JSON esistenti.

-- 1. Riepilogo della proiezione Frontale simulata.
with front_lesson as (
  select
    ls.allievo_id,
    ls.skill_id,
    max(ls.stadio_raggiunto)::smallint as stadio,
    min(l.data) filter (where ls.stadio_raggiunto >= 1) as data_inizio,
    min(l.data) filter (where ls.stadio_raggiunto >= 2) as data_acquisizione,
    min(l.data) filter (where ls.stadio_raggiunto = 3) as data_perfezionamento
  from public.lezioni_skills ls
  join public.lezioni l on l.id = ls.lezione_id
  where ls.allievo_id is not null
    and coalesce(ls.fakie, false) = false
  group by ls.allievo_id, ls.skill_id
),
manual_front as (
  select
    p.allievo_id,
    p.skill_id,
    p.stadio,
    p.data_inizio,
    p.data_acquisizione,
    p.data_perfezionamento
  from public.progressi_allievo p
  left join front_lesson f using (allievo_id, skill_id)
  where f.allievo_id is null
     or p.stadio > f.stadio
     or (p.data_inizio is not null
         and (f.data_inizio is null or p.data_inizio < f.data_inizio))
     or (p.data_acquisizione is not null
         and (f.data_acquisizione is null
              or p.data_acquisizione < f.data_acquisizione))
     or (p.data_perfezionamento is not null
         and (f.data_perfezionamento is null
              or p.data_perfezionamento < f.data_perfezionamento))
),
front_sources as (
  select * from front_lesson
  union all
  select * from manual_front
),
final_front as (
  select
    allievo_id,
    skill_id,
    max(stadio)::smallint as stadio,
    min(data_inizio) as data_inizio,
    min(data_acquisizione) as data_acquisizione,
    min(data_perfezionamento) as data_perfezionamento
  from front_sources
  group by allievo_id, skill_id
),
comparison as (
  select
    case
      when p.id is null then 'nuovo'
      when f.allievo_id is null then 'rimosso'
      when p.stadio = f.stadio
       and p.data_inizio is not distinct from f.data_inizio
       and p.data_acquisizione is not distinct from f.data_acquisizione
       and p.data_perfezionamento is not distinct from f.data_perfezionamento
        then 'invariato'
      else 'corretto'
    end as esito
  from public.progressi_allievo p
  full join final_front f using (allievo_id, skill_id)
)
select
  (select count(*) from public.progressi_allievo) as progressi_attuali,
  (select count(*) from front_lesson) as coppie_frontale_da_lezioni,
  (select count(*) from manual_front) as baseline_manual_legacy,
  (select count(*) from final_front) as progressi_frontale_finali,
  count(*) filter (where esito = 'invariato') as invariati,
  count(*) filter (where esito = 'corretto') as corretti,
  count(*) filter (where esito = 'nuovo') as nuovi,
  count(*) filter (where esito = 'rimosso') as rimossi
from comparison;

-- 2. Proiezione Fakie simulata, con nomi per revisione umana.
with lesson_fakie as (
  select
    ls.allievo_id,
    ls.skill_id,
    max(ls.stadio_raggiunto)::smallint as stadio,
    min(l.data) filter (where ls.stadio_raggiunto >= 1) as data_inizio,
    min(l.data) filter (where ls.stadio_raggiunto >= 2) as data_acquisizione,
    min(l.data) filter (where ls.stadio_raggiunto = 3) as data_perfezionamento
  from public.lezioni_skills ls
  join public.lezioni l on l.id = ls.lezione_id
  where ls.allievo_id is not null
    and ls.fakie = true
  group by ls.allievo_id, ls.skill_id
),
manual_fakie as (
  select
    a.id as allievo_id,
    s.id as skill_id,
    (j.value ->> 'stadio')::smallint as stadio,
    nullif(j.value ->> 'data_inizio', '')::date as data_inizio,
    nullif(j.value ->> 'data_acquisizione', '')::date as data_acquisizione,
    nullif(j.value ->> 'data_perfezionamento', '')::date
      as data_perfezionamento
  from public.allievi a
  cross join lateral jsonb_each(
    coalesce(a.profilo -> 'fakie_progress', '{}'::jsonb)
  ) j
  join public.skills s on s.id::text = j.key
),
fakie_sources as (
  select * from lesson_fakie
  union all
  select * from manual_fakie
),
final_fakie as (
  select
    allievo_id,
    skill_id,
    max(stadio)::smallint as stadio,
    min(data_inizio) as data_inizio,
    min(data_acquisizione) as data_acquisizione,
    min(data_perfezionamento) as data_perfezionamento
  from fakie_sources
  group by allievo_id, skill_id
)
select
  concat_ws(' ', a.nome, a.cognome) as allievo,
  s.nome as skill,
  f.stadio,
  f.data_inizio,
  f.data_acquisizione,
  f.data_perfezionamento,
  (l.allievo_id is not null) as ha_lezione_fakie,
  (m.allievo_id is not null) as ha_baseline_manuale
from final_fakie f
join public.allievi a on a.id = f.allievo_id
join public.skills s on s.id = f.skill_id
left join lesson_fakie l using (allievo_id, skill_id)
left join manual_fakie m using (allievo_id, skill_id)
order by allievo, skill;

-- 3. Record potenzialmente duplicato fra Frontale e Fakie.
with front_pairs as (
  select distinct ls.allievo_id, ls.skill_id
  from public.lezioni_skills ls
  where ls.allievo_id is not null
    and coalesce(ls.fakie, false) = false
),
fakie_pairs as (
  select distinct ls.allievo_id, ls.skill_id
  from public.lezioni_skills ls
  where ls.allievo_id is not null
    and ls.fakie = true
)
select
  concat_ws(' ', a.nome, a.cognome) as allievo,
  s.nome as skill,
  p.stadio,
  p.data_inizio
from public.progressi_allievo p
join public.allievi a on a.id = p.allievo_id
join public.skills s on s.id = p.skill_id
left join front_pairs fr using (allievo_id, skill_id)
join fakie_pairs fk using (allievo_id, skill_id)
where fr.allievo_id is null
order by allievo, skill;
