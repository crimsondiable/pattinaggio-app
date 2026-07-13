-- =========================================================================
-- Alias / nomi alternativi per le skill
-- Data: 2026-05-11
-- =========================================================================

ALTER TABLE public.skill_definizioni
  ADD COLUMN IF NOT EXISTS alias_nomi JSONB NOT NULL DEFAULT '[]';

COMMENT ON COLUMN public.skill_definizioni.alias_nomi IS
  'Nomi alternativi, inglesi o sinonimi tecnici della skill.';

INSERT INTO public.skill_definizioni (
  skill_id,
  skill_nome,
  ramo,
  fascia_livello,
  livello_num,
  prerequisiti,
  prerequisiti_match,
  sblocca,
  sblocca_match,
  e_variante,
  cosa_fa,
  come_si_fa,
  varianti,
  catalog_note,
  alias_nomi,
  stato
)
SELECT
  s.id,
  'Papera statica',
  'Equilibrio',
  'Base',
  1,
  '["Posizione base"]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  false,
  '',
  '',
  '["apertura punte", "chiusura talloni"]'::jsonb,
  'prepara limone e transizioni',
  '["Open stance"]'::jsonb,
  'bozza'
FROM public.skills s
WHERE s.nome = 'Papera statica'
ON CONFLICT (skill_nome) DO UPDATE
SET alias_nomi = (
  SELECT jsonb_agg(DISTINCT value)
  FROM jsonb_array_elements_text(public.skill_definizioni.alias_nomi || EXCLUDED.alias_nomi) AS t(value)
);

NOTIFY pgrst, 'reload schema';
