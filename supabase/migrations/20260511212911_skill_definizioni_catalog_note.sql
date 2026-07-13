-- =========================================================================
-- Campo editabile per nota catalogo nel questionario skill
-- Data: 2026-05-11
-- =========================================================================

ALTER TABLE public.skill_definizioni
  ADD COLUMN IF NOT EXISTS catalog_note TEXT NOT NULL DEFAULT '';

COMMENT ON COLUMN public.skill_definizioni.catalog_note IS
  'Nota breve editabile mostrata nel box Catalogo del questionario skill.';

NOTIFY pgrst, 'reload schema';
