
-- Rimuove il bypass maestro_id IS NULL dalla SELECT policy
DROP POLICY IF EXISTS "leggi_propri_e_condivisi" ON public.allievi;

CREATE POLICY "leggi_propri_e_condivisi" ON public.allievi
  FOR SELECT USING (
    maestro_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.allievi_condivisi ac
      WHERE ac.allievo_id = id AND ac.maestro_id = auth.uid()
    )
  );

-- Stesso fix per UPDATE e DELETE
DROP POLICY IF EXISTS "modifica_propri_e_condivisi" ON public.allievi;
DROP POLICY IF EXISTS "cancella_propri" ON public.allievi;

CREATE POLICY "modifica_propri_e_condivisi" ON public.allievi
  FOR UPDATE USING (
    maestro_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.allievi_condivisi ac
      WHERE ac.allievo_id = id AND ac.maestro_id = auth.uid()
    )
  );

CREATE POLICY "cancella_propri" ON public.allievi
  FOR DELETE USING (maestro_id = auth.uid());
;
