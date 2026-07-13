-- =========================================================================
-- Hardening accesso questionario pubblico
-- Data: 2026-05-11
-- =========================================================================
--
-- Obiettivo:
-- - una pagina statica pubblica puo esistere, ma il DB non deve accettare
--   letture/scritture anonime;
-- - le revisioni skill sono accessibili solo al super maestro.
-- =========================================================================

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM anon;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON TABLE public.skills TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.skill_definizioni TO authenticated;

ALTER TABLE public.skill_definizioni ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leggi_skill_definizioni_autenticato" ON public.skill_definizioni;
DROP POLICY IF EXISTS "scrivi_skill_definizioni_autenticato" ON public.skill_definizioni;
DROP POLICY IF EXISTS "leggi_skill_definizioni_super_maestro" ON public.skill_definizioni;
DROP POLICY IF EXISTS "inserisci_skill_definizioni_super_maestro" ON public.skill_definizioni;
DROP POLICY IF EXISTS "modifica_skill_definizioni_super_maestro" ON public.skill_definizioni;
DROP POLICY IF EXISTS "cancella_skill_definizioni_super_maestro" ON public.skill_definizioni;

CREATE POLICY "leggi_skill_definizioni_super_maestro" ON public.skill_definizioni
  FOR SELECT TO authenticated
  USING (public.is_super_maestro());

CREATE POLICY "inserisci_skill_definizioni_super_maestro" ON public.skill_definizioni
  FOR INSERT TO authenticated
  WITH CHECK (public.is_super_maestro());

CREATE POLICY "modifica_skill_definizioni_super_maestro" ON public.skill_definizioni
  FOR UPDATE TO authenticated
  USING (public.is_super_maestro())
  WITH CHECK (public.is_super_maestro());

CREATE POLICY "cancella_skill_definizioni_super_maestro" ON public.skill_definizioni
  FOR DELETE TO authenticated
  USING (public.is_super_maestro());

NOTIFY pgrst, 'reload schema';
