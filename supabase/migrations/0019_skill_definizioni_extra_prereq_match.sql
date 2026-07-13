-- =========================================================================
-- Migration 0019 — Ramo Extra e match prerequisiti
-- Data: 2026-05-11
-- =========================================================================

ALTER TABLE public.skill_definizioni
  ADD COLUMN IF NOT EXISTS prerequisiti_match JSONB NOT NULL DEFAULT '[]';

ALTER TABLE public.skill_definizioni
  DROP CONSTRAINT IF EXISTS skill_definizioni_ramo_check;

ALTER TABLE public.skill_definizioni
  ADD CONSTRAINT skill_definizioni_ramo_check
  CHECK (ramo IN ('Equilibrio', 'Andatura', 'Frenata', 'Rotazione', 'Extra'));

COMMENT ON COLUMN public.skill_definizioni.prerequisiti_match IS
  'Match suggeriti dal questionario tra prerequisiti scritti a mano e skill del catalogo.';

NOTIFY pgrst, 'reload schema';
