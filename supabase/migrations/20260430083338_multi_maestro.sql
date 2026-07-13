
ALTER TABLE public.allievi
  ADD COLUMN IF NOT EXISTS maestro_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS stato      TEXT NOT NULL DEFAULT 'attivo'
    CHECK (stato IN ('attivo', 'archiviato'));

CREATE TABLE IF NOT EXISTS public.allievi_condivisi (
  allievo_id   UUID NOT NULL REFERENCES public.allievi(id)  ON DELETE CASCADE,
  maestro_id   UUID NOT NULL REFERENCES auth.users(id)       ON DELETE CASCADE,
  condiviso_da UUID REFERENCES auth.users(id),
  condiviso_il TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (allievo_id, maestro_id)
);

ALTER TABLE public.allievi_condivisi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "autenticato_tutto" ON public.allievi_condivisi
  FOR ALL USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION public.find_maestro_by_email(email_input TEXT)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM auth.users WHERE email = lower(trim(email_input)) LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.find_maestro_by_email TO authenticated;

DROP POLICY IF EXISTS "autenticato_tutto" ON public.allievi;

CREATE POLICY "leggi_propri_e_condivisi" ON public.allievi
  FOR SELECT USING (
    maestro_id IS NULL
    OR maestro_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.allievi_condivisi ac
      WHERE ac.allievo_id = id AND ac.maestro_id = auth.uid()
    )
  );

CREATE POLICY "inserisci_propri" ON public.allievi
  FOR INSERT WITH CHECK (maestro_id = auth.uid());

CREATE POLICY "modifica_propri_e_condivisi" ON public.allievi
  FOR UPDATE USING (
    maestro_id IS NULL
    OR maestro_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.allievi_condivisi ac
      WHERE ac.allievo_id = id AND ac.maestro_id = auth.uid()
    )
  );

CREATE POLICY "cancella_propri" ON public.allievi
  FOR DELETE USING (maestro_id IS NULL OR maestro_id = auth.uid());
;
