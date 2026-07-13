-- =========================================================================
-- Accorpa Open stance base dentro Papera statica
-- Data: 2026-05-11
-- =========================================================================

DO $$
DECLARE
  old_id UUID;
  new_id UUID;
BEGIN
  SELECT id INTO old_id FROM public.skills WHERE nome = 'Open stance base';
  SELECT id INTO new_id FROM public.skills WHERE nome = 'Papera statica';

  IF old_id IS NULL OR new_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO public.progressi_allievo (
    allievo_id,
    skill_id,
    stadio,
    stadio_lato_sx,
    stadio_lato_dx,
    data_inizio,
    data_acquisizione,
    data_perfezionamento,
    note_maestro,
    aggiornato_il
  )
  SELECT
    allievo_id,
    new_id,
    stadio,
    stadio_lato_sx,
    stadio_lato_dx,
    data_inizio,
    data_acquisizione,
    data_perfezionamento,
    note_maestro,
    now()
  FROM public.progressi_allievo
  WHERE skill_id = old_id
  ON CONFLICT (allievo_id, skill_id) DO UPDATE
  SET
    stadio = GREATEST(public.progressi_allievo.stadio, EXCLUDED.stadio),
    stadio_lato_sx = GREATEST(COALESCE(public.progressi_allievo.stadio_lato_sx, 0), COALESCE(EXCLUDED.stadio_lato_sx, 0)),
    stadio_lato_dx = GREATEST(COALESCE(public.progressi_allievo.stadio_lato_dx, 0), COALESCE(EXCLUDED.stadio_lato_dx, 0)),
    data_inizio = COALESCE(public.progressi_allievo.data_inizio, EXCLUDED.data_inizio),
    data_acquisizione = COALESCE(public.progressi_allievo.data_acquisizione, EXCLUDED.data_acquisizione),
    data_perfezionamento = COALESCE(public.progressi_allievo.data_perfezionamento, EXCLUDED.data_perfezionamento),
    note_maestro = COALESCE(NULLIF(public.progressi_allievo.note_maestro, ''), EXCLUDED.note_maestro),
    aggiornato_il = now();

  DELETE FROM public.progressi_allievo WHERE skill_id = old_id;

  INSERT INTO public.lezioni_skills (
    lezione_id,
    allievo_id,
    skill_id,
    stadio_raggiunto,
    note
  )
  SELECT
    lezione_id,
    allievo_id,
    new_id,
    stadio_raggiunto,
    note
  FROM public.lezioni_skills
  WHERE skill_id = old_id
  ON CONFLICT (lezione_id, allievo_id, skill_id) DO UPDATE
  SET
    stadio_raggiunto = GREATEST(public.lezioni_skills.stadio_raggiunto, EXCLUDED.stadio_raggiunto),
    note = COALESCE(NULLIF(public.lezioni_skills.note, ''), EXCLUDED.note);

  DELETE FROM public.lezioni_skills WHERE skill_id = old_id;

  CREATE TEMP TABLE tmp_prereq_open_stance_rewritten ON COMMIT DROP AS
  SELECT DISTINCT
    CASE WHEN skill_id = old_id THEN new_id ELSE skill_id END AS skill_id,
    CASE WHEN richiede_skill_id = old_id THEN new_id ELSE richiede_skill_id END AS richiede_skill_id,
    MIN(stadio_minimo) AS stadio_minimo,
    NULLIF(string_agg(DISTINCT note, ' / '), '') AS note
  FROM public.prerequisiti_skill
  WHERE skill_id = old_id OR richiede_skill_id = old_id
  GROUP BY
    CASE WHEN skill_id = old_id THEN new_id ELSE skill_id END,
    CASE WHEN richiede_skill_id = old_id THEN new_id ELSE richiede_skill_id END;

  DELETE FROM public.prerequisiti_skill
  WHERE skill_id = old_id OR richiede_skill_id = old_id;

  INSERT INTO public.prerequisiti_skill (skill_id, richiede_skill_id, stadio_minimo, note)
  SELECT skill_id, richiede_skill_id, stadio_minimo, note
  FROM tmp_prereq_open_stance_rewritten
  WHERE skill_id <> richiede_skill_id
  ON CONFLICT (skill_id, richiede_skill_id) DO UPDATE
  SET
    stadio_minimo = LEAST(public.prerequisiti_skill.stadio_minimo, EXCLUDED.stadio_minimo),
    note = COALESCE(NULLIF(public.prerequisiti_skill.note, ''), EXCLUDED.note);

  UPDATE public.tuning_risposte SET skill_id = new_id WHERE skill_id = old_id;
  UPDATE public.tuning_risposte SET skill_ref_id = new_id WHERE skill_ref_id = old_id;

  UPDATE public.skill_definizioni
  SET
    skill_id = new_id,
    alias_nomi = (
      SELECT jsonb_agg(DISTINCT value)
      FROM jsonb_array_elements_text(alias_nomi || '["Open stance", "Open stance base"]'::jsonb) AS t(value)
    )
  WHERE skill_nome = 'Papera statica';

  DELETE FROM public.skill_definizioni WHERE skill_nome = 'Open stance base';
  DELETE FROM public.skills WHERE id = old_id;
END $$;

NOTIFY pgrst, 'reload schema';
