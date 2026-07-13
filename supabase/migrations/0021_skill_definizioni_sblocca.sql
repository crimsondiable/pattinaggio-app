-- =========================================================================
-- Migration 0021 — Cosa sblocca / requisito per cosa
-- Data: 2026-05-11
-- =========================================================================

ALTER TABLE public.skill_definizioni
  ADD COLUMN IF NOT EXISTS sblocca JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS sblocca_match JSONB NOT NULL DEFAULT '[]';

COMMENT ON COLUMN public.skill_definizioni.sblocca IS
  'Skill o competenze che questa skill abilita nella progressione didattica.';

COMMENT ON COLUMN public.skill_definizioni.sblocca_match IS
  'Match suggeriti dal questionario tra sblocchi scritti a mano e skill del catalogo.';

NOTIFY pgrst, 'reload schema';
