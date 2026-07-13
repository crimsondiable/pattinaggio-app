-- Le righe pianificate di una lezione Campo libero hanno allievo_id nullo e
-- non devono produrre avanzamenti in progressi_allievo.
create or replace function public.sync_progressi_da_lezione()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_data_lezione date;
begin
  if new.allievo_id is null then
    return new;
  end if;

  select data into v_data_lezione
  from public.lezioni
  where id = new.lezione_id;

  insert into public.progressi_allievo (
    allievo_id,
    skill_id,
    stadio,
    data_inizio,
    data_acquisizione,
    data_perfezionamento,
    aggiornato_il
  )
  values (
    new.allievo_id,
    new.skill_id,
    new.stadio_raggiunto,
    case when new.stadio_raggiunto >= 1 then v_data_lezione else null end,
    case when new.stadio_raggiunto >= 2 then v_data_lezione else null end,
    case when new.stadio_raggiunto  = 3 then v_data_lezione else null end,
    now()
  )
  on conflict (allievo_id, skill_id) do update
    set
      stadio = greatest(progressi_allievo.stadio, new.stadio_raggiunto),
      data_inizio = coalesce(
        progressi_allievo.data_inizio,
        case when new.stadio_raggiunto >= 1 then v_data_lezione else null end
      ),
      data_acquisizione = coalesce(
        progressi_allievo.data_acquisizione,
        case when new.stadio_raggiunto >= 2 then v_data_lezione else null end
      ),
      data_perfezionamento = coalesce(
        progressi_allievo.data_perfezionamento,
        case when new.stadio_raggiunto = 3 then v_data_lezione else null end
      ),
      aggiornato_il = now()
  where new.stadio_raggiunto > progressi_allievo.stadio;

  return new;
end;
$$;
