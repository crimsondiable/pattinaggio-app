-- =========================================================================
-- Cleanup catalogo skill: accorpamenti approvati e rimozione modello famiglie
-- Data: 2026-05-11
-- =========================================================================
--
-- Decisione metodologica:
-- "fluido", "potente", "veloce", "continuo" non sono skill logiche
-- autonome. Restano al massimo parole/etichette didattiche future, non nodi
-- della progressione.
-- =========================================================================

DROP TABLE IF EXISTS public.skill_accorpamenti CASCADE;
DROP TABLE IF EXISTS public.skill_famiglie CASCADE;

ALTER TABLE public.skill_definizioni
  DROP COLUMN IF EXISTS famiglia_nome,
  DROP COLUMN IF EXISTS ruolo_progressione,
  DROP COLUMN IF EXISTS soglia_sblocco_stadio;

CREATE TEMP TABLE tmp_skill_merge_map (
  old_nome TEXT PRIMARY KEY,
  new_nome TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO tmp_skill_merge_map (old_nome, new_nome)
VALUES
  ('Cadute', 'Caduta controllata'),
  ('T stop', 'T-stop'),
  ('Stroke base', 'Stroke'),
  ('Stroke continuo', 'Stroke'),
  ('Stride base', 'Stride'),
  ('Stride fluido', 'Stride'),
  ('Stride potente', 'Stride'),
  ('Stride veloce', 'Stride');

CREATE TEMP TABLE tmp_skill_merge_ids AS
SELECT
  m.old_nome,
  m.new_nome,
  old_s.id AS old_id,
  new_s.id AS new_id
FROM tmp_skill_merge_map m
JOIN public.skills old_s ON old_s.nome = m.old_nome
JOIN public.skills new_s ON new_s.nome = m.new_nome;

-- Porta eventuali progressi allievo dalla skill vecchia alla canonica.
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
  p.allievo_id,
  m.new_id,
  p.stadio,
  p.stadio_lato_sx,
  p.stadio_lato_dx,
  p.data_inizio,
  p.data_acquisizione,
  p.data_perfezionamento,
  p.note_maestro,
  now()
FROM public.progressi_allievo p
JOIN tmp_skill_merge_ids m ON m.old_id = p.skill_id
ON CONFLICT (allievo_id, skill_id) DO UPDATE
SET
  stadio = GREATEST(public.progressi_allievo.stadio, EXCLUDED.stadio),
  stadio_lato_sx = GREATEST(
    COALESCE(public.progressi_allievo.stadio_lato_sx, 0),
    COALESCE(EXCLUDED.stadio_lato_sx, 0)
  ),
  stadio_lato_dx = GREATEST(
    COALESCE(public.progressi_allievo.stadio_lato_dx, 0),
    COALESCE(EXCLUDED.stadio_lato_dx, 0)
  ),
  data_inizio = COALESCE(public.progressi_allievo.data_inizio, EXCLUDED.data_inizio),
  data_acquisizione = COALESCE(public.progressi_allievo.data_acquisizione, EXCLUDED.data_acquisizione),
  data_perfezionamento = COALESCE(public.progressi_allievo.data_perfezionamento, EXCLUDED.data_perfezionamento),
  note_maestro = COALESCE(NULLIF(public.progressi_allievo.note_maestro, ''), EXCLUDED.note_maestro),
  aggiornato_il = now();

DELETE FROM public.progressi_allievo p
USING tmp_skill_merge_ids m
WHERE p.skill_id = m.old_id;

-- Porta eventuali lezioni dalla skill vecchia alla canonica.
INSERT INTO public.lezioni_skills (
  lezione_id,
  allievo_id,
  skill_id,
  stadio_raggiunto,
  note
)
SELECT
  l.lezione_id,
  l.allievo_id,
  m.new_id,
  l.stadio_raggiunto,
  l.note
FROM public.lezioni_skills l
JOIN tmp_skill_merge_ids m ON m.old_id = l.skill_id
ON CONFLICT (lezione_id, allievo_id, skill_id) DO UPDATE
SET
  stadio_raggiunto = GREATEST(public.lezioni_skills.stadio_raggiunto, EXCLUDED.stadio_raggiunto),
  note = COALESCE(NULLIF(public.lezioni_skills.note, ''), EXCLUDED.note);

DELETE FROM public.lezioni_skills l
USING tmp_skill_merge_ids m
WHERE l.skill_id = m.old_id;

-- Riscrive i prerequisiti coinvolti, evitando duplicati e autorequisiti.
CREATE TEMP TABLE tmp_prereq_rewritten AS
SELECT DISTINCT
  COALESCE(ms.new_id, p.skill_id) AS skill_id,
  COALESCE(mr.new_id, p.richiede_skill_id) AS richiede_skill_id,
  MIN(p.stadio_minimo) AS stadio_minimo,
  NULLIF(string_agg(DISTINCT p.note, ' / '), '') AS note
FROM public.prerequisiti_skill p
LEFT JOIN tmp_skill_merge_ids ms ON ms.old_id = p.skill_id
LEFT JOIN tmp_skill_merge_ids mr ON mr.old_id = p.richiede_skill_id
WHERE ms.old_id IS NOT NULL OR mr.old_id IS NOT NULL
GROUP BY COALESCE(ms.new_id, p.skill_id), COALESCE(mr.new_id, p.richiede_skill_id);

DELETE FROM public.prerequisiti_skill p
USING tmp_skill_merge_ids m
WHERE p.skill_id = m.old_id OR p.richiede_skill_id = m.old_id;

INSERT INTO public.prerequisiti_skill (
  skill_id,
  richiede_skill_id,
  stadio_minimo,
  note
)
SELECT
  skill_id,
  richiede_skill_id,
  stadio_minimo,
  note
FROM tmp_prereq_rewritten
WHERE skill_id <> richiede_skill_id
ON CONFLICT (skill_id, richiede_skill_id) DO UPDATE
SET
  stadio_minimo = LEAST(public.prerequisiti_skill.stadio_minimo, EXCLUDED.stadio_minimo),
  note = COALESCE(NULLIF(public.prerequisiti_skill.note, ''), EXCLUDED.note);

-- Aggiorna eventuali risposte di tuning.
UPDATE public.tuning_risposte t
SET skill_id = m.new_id
FROM tmp_skill_merge_ids m
WHERE t.skill_id = m.old_id;

UPDATE public.tuning_risposte t
SET skill_ref_id = m.new_id
FROM tmp_skill_merge_ids m
WHERE t.skill_ref_id = m.old_id;

-- Aggiorna questionario/definizioni: prima i riferimenti, poi i nomi.
UPDATE public.skill_definizioni d
SET skill_id = m.new_id
FROM tmp_skill_merge_ids m
WHERE d.skill_id = m.old_id;

DELETE FROM public.skill_definizioni d
USING tmp_skill_merge_ids m
WHERE d.skill_nome = m.old_nome
  AND EXISTS (
    SELECT 1
    FROM public.skill_definizioni canonical
    WHERE canonical.skill_nome = m.new_nome
  );

UPDATE public.skill_definizioni d
SET skill_nome = m.new_nome
FROM tmp_skill_merge_ids m
WHERE d.skill_nome = m.old_nome;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT old_nome, new_nome FROM tmp_skill_merge_ids LOOP
    UPDATE public.skill_definizioni
    SET
      prerequisiti = replace(prerequisiti::text, to_jsonb(r.old_nome)::text, to_jsonb(r.new_nome)::text)::jsonb,
      prerequisiti_match = replace(prerequisiti_match::text, to_jsonb(r.old_nome)::text, to_jsonb(r.new_nome)::text)::jsonb,
      sblocca = replace(sblocca::text, to_jsonb(r.old_nome)::text, to_jsonb(r.new_nome)::text)::jsonb,
      sblocca_match = replace(sblocca_match::text, to_jsonb(r.old_nome)::text, to_jsonb(r.new_nome)::text)::jsonb,
      varianti = replace(varianti::text, to_jsonb(r.old_nome)::text, to_jsonb(r.new_nome)::text)::jsonb,
      variante_di = CASE WHEN variante_di = r.old_nome THEN r.new_nome ELSE variante_di END,
      variante_match = CASE
        WHEN variante_match IS NULL THEN NULL
        ELSE replace(variante_match::text, to_jsonb(r.old_nome)::text, to_jsonb(r.new_nome)::text)::jsonb
      END;
  END LOOP;
END $$;

-- Allineamenti puntuali richiesti rispetto al questionario.
UPDATE public.skills
SET livello = 4, blocco = 'Intermedio'
WHERE nome = 'Curva carrellata';

UPDATE public.skills
SET livello = 10, blocco = 'Master'
WHERE nome = 'Passo incrociato';

-- Elimina i nodi logici non piu canonici.
DELETE FROM public.skills s
USING tmp_skill_merge_ids m
WHERE s.id = m.old_id;

NOTIFY pgrst, 'reload schema';
