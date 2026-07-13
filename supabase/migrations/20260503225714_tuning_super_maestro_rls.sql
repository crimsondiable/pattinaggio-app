CREATE OR REPLACE FUNCTION public.is_super_maestro()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = 'francesco.grinovero@gmail.com';
$$;

GRANT EXECUTE ON FUNCTION public.is_super_maestro TO authenticated;

CREATE TABLE IF NOT EXISTS public.tuning_risposte (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo         TEXT        NOT NULL CHECK (tipo IN ('parametri', 'requisiti', 'progressione', 'livelli')),
  skill_id     UUID        REFERENCES public.skills(id) ON DELETE SET NULL,
  skill_ref_id UUID        REFERENCES public.skills(id) ON DELETE SET NULL,
  variante     TEXT,
  parametro    TEXT,
  valore       SMALLINT    CHECK (valore BETWEEN 1 AND 5),
  esito        TEXT,
  note         TEXT,
  payload      JSONB       NOT NULL DEFAULT '{}',
  maestro_id   UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  creato_il    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tuning_risposte_tipo ON public.tuning_risposte (tipo);
CREATE INDEX IF NOT EXISTS idx_tuning_risposte_skill ON public.tuning_risposte (skill_id);
CREATE INDEX IF NOT EXISTS idx_tuning_risposte_maestro ON public.tuning_risposte (maestro_id);
CREATE INDEX IF NOT EXISTS idx_tuning_risposte_creato ON public.tuning_risposte (creato_il DESC);

ALTER TABLE public.tuning_risposte ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "autenticato_tutto" ON public.tuning_risposte;
DROP POLICY IF EXISTS "leggi_tuning_propri_o_super" ON public.tuning_risposte;
DROP POLICY IF EXISTS "inserisci_tuning_propri_o_super" ON public.tuning_risposte;
DROP POLICY IF EXISTS "modifica_tuning_propri_o_super" ON public.tuning_risposte;
DROP POLICY IF EXISTS "cancella_tuning_propri_o_super" ON public.tuning_risposte;

CREATE POLICY "leggi_tuning_propri_o_super" ON public.tuning_risposte
  FOR SELECT TO authenticated
  USING (
    public.is_super_maestro()
    OR maestro_id = (select auth.uid())
  );

CREATE POLICY "inserisci_tuning_propri_o_super" ON public.tuning_risposte
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_super_maestro()
    OR maestro_id = (select auth.uid())
  );

CREATE POLICY "modifica_tuning_propri_o_super" ON public.tuning_risposte
  FOR UPDATE TO authenticated
  USING (
    public.is_super_maestro()
    OR maestro_id = (select auth.uid())
  )
  WITH CHECK (
    public.is_super_maestro()
    OR maestro_id = (select auth.uid())
  );

CREATE POLICY "cancella_tuning_propri_o_super" ON public.tuning_risposte
  FOR DELETE TO authenticated
  USING (
    public.is_super_maestro()
    OR maestro_id = (select auth.uid())
  );

COMMENT ON TABLE public.tuning_risposte IS
  'Micro-risposte separate per maestro, usate per calibrare parametri, prerequisiti, livelli e ordine della skill tree.';;
