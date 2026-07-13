-- =========================================================================
-- Migration 0020 — Varianti skill e aggancio skill madre
-- Data: 2026-05-11
-- =========================================================================

ALTER TABLE public.skill_definizioni
  ADD COLUMN IF NOT EXISTS e_variante BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS variante_di TEXT,
  ADD COLUMN IF NOT EXISTS variante_match JSONB;

COMMENT ON COLUMN public.skill_definizioni.e_variante IS
  'Indica se la definizione descrive una variante di una skill madre.';

COMMENT ON COLUMN public.skill_definizioni.variante_di IS
  'Nome scritto o confermato della skill madre.';

COMMENT ON COLUMN public.skill_definizioni.variante_match IS
  'Match suggerito dal questionario tra skill madre scritta a mano e skill del catalogo.';

NOTIFY pgrst, 'reload schema';
