-- =========================================================================
-- Migration 0018 — Questionario definizione skill
-- Data: 2026-05-11
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.skill_definizioni (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id        UUID        REFERENCES public.skills(id) ON DELETE SET NULL,
  skill_nome      TEXT        NOT NULL,
  ramo            TEXT        NOT NULL CHECK (ramo IN ('Equilibrio', 'Andatura', 'Frenata', 'Rotazione', 'Extra')),
  fascia_livello  TEXT        NOT NULL CHECK (fascia_livello IN ('Base', 'Intermedio', 'Avanzato')),
  livello_num     INTEGER     CHECK (livello_num BETWEEN 1 AND 10),
  prerequisiti    JSONB       NOT NULL DEFAULT '[]',
  prerequisiti_match JSONB    NOT NULL DEFAULT '[]',
  sblocca         JSONB       NOT NULL DEFAULT '[]',
  sblocca_match   JSONB       NOT NULL DEFAULT '[]',
  e_variante      BOOLEAN     NOT NULL DEFAULT false,
  variante_di     TEXT,
  variante_match  JSONB,
  cosa_fa         TEXT        NOT NULL DEFAULT '',
  come_si_fa      TEXT        NOT NULL DEFAULT '',
  varianti        JSONB       NOT NULL DEFAULT '[]',
  note_revisione  TEXT,
  stato           TEXT        NOT NULL DEFAULT 'bozza'
                              CHECK (stato IN ('bozza', 'revisionata', 'da_rivedere', 'approvata')),
  maestro_id      UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  revisionato_il  TIMESTAMPTZ,
  creato_il       TIMESTAMPTZ NOT NULL DEFAULT now(),
  aggiornato_il   TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT skill_definizioni_nome_unique UNIQUE (skill_nome)
);

CREATE INDEX IF NOT EXISTS idx_skill_definizioni_skill ON public.skill_definizioni (skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_definizioni_ramo ON public.skill_definizioni (ramo);
CREATE INDEX IF NOT EXISTS idx_skill_definizioni_stato ON public.skill_definizioni (stato);
CREATE INDEX IF NOT EXISTS idx_skill_definizioni_aggiornato ON public.skill_definizioni (aggiornato_il DESC);

ALTER TABLE public.skill_definizioni ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leggi_skill_definizioni_autenticato" ON public.skill_definizioni;
DROP POLICY IF EXISTS "scrivi_skill_definizioni_autenticato" ON public.skill_definizioni;

CREATE POLICY "leggi_skill_definizioni_autenticato" ON public.skill_definizioni
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "scrivi_skill_definizioni_autenticato" ON public.skill_definizioni
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_definizioni TO authenticated;

CREATE OR REPLACE FUNCTION public.set_skill_definizioni_aggiornato_il()
RETURNS TRIGGER AS $$
BEGIN
  NEW.aggiornato_il = now();
  IF NEW.stato IN ('revisionata', 'approvata') AND NEW.revisionato_il IS NULL THEN
    NEW.revisionato_il = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_skill_definizioni_aggiornato_il ON public.skill_definizioni;
CREATE TRIGGER trg_skill_definizioni_aggiornato_il
  BEFORE UPDATE ON public.skill_definizioni
  FOR EACH ROW EXECUTE FUNCTION public.set_skill_definizioni_aggiornato_il();

COMMENT ON TABLE public.skill_definizioni IS
  'Definizioni revisionabili delle skill: ramo, fascia, prerequisiti, cosa fa e come si fa.';

NOTIFY pgrst, 'reload schema';
