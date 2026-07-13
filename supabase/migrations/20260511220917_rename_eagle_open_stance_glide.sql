-- =========================================================================
-- Rinomina Eagle / open stance glide in Eagle glide
-- Data: 2026-05-12
-- =========================================================================

UPDATE public.skills
SET nome = 'Eagle glide'
WHERE nome = 'Eagle / open stance glide';

UPDATE public.skill_definizioni
SET
  skill_nome = 'Eagle glide',
  alias_nomi = (
    SELECT jsonb_agg(DISTINCT value)
    FROM jsonb_array_elements_text(alias_nomi || '["Open stance glide", "Eagle / open stance glide"]'::jsonb) AS t(value)
  )
WHERE skill_nome = 'Eagle / open stance glide';

UPDATE public.skill_definizioni
SET prerequisiti = replace(prerequisiti::text, '"Eagle / open stance glide"', '"Eagle glide"')::jsonb
WHERE prerequisiti::text LIKE '%Eagle / open stance glide%';

UPDATE public.skill_definizioni
SET sblocca = replace(sblocca::text, '"Eagle / open stance glide"', '"Eagle glide"')::jsonb
WHERE sblocca::text LIKE '%Eagle / open stance glide%';

UPDATE public.skill_definizioni
SET prerequisiti_match = replace(prerequisiti_match::text, '"Eagle / open stance glide"', '"Eagle glide"')::jsonb
WHERE prerequisiti_match::text LIKE '%Eagle / open stance glide%';

UPDATE public.skill_definizioni
SET sblocca_match = replace(sblocca_match::text, '"Eagle / open stance glide"', '"Eagle glide"')::jsonb
WHERE sblocca_match::text LIKE '%Eagle / open stance glide%';

UPDATE public.tuning_risposte
SET payload = replace(payload::text, '"Eagle / open stance glide"', '"Eagle glide"')::jsonb
WHERE payload::text LIKE '%Eagle / open stance glide%';

NOTIFY pgrst, 'reload schema';
