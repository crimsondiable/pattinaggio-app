DROP POLICY IF EXISTS "leggi_propri_e_condivisi" ON public.allievi;
DROP POLICY IF EXISTS "inserisci_propri" ON public.allievi;
DROP POLICY IF EXISTS "modifica_propri_e_condivisi" ON public.allievi;
DROP POLICY IF EXISTS "cancella_propri" ON public.allievi;
DROP POLICY IF EXISTS "leggi_propri_condivisi_o_super" ON public.allievi;
DROP POLICY IF EXISTS "inserisci_propri_o_super" ON public.allievi;
DROP POLICY IF EXISTS "modifica_propri_condivisi_o_super" ON public.allievi;
DROP POLICY IF EXISTS "cancella_propri_o_super" ON public.allievi;

CREATE POLICY "leggi_propri_condivisi_o_super" ON public.allievi
  FOR SELECT TO authenticated
  USING (
    public.is_super_maestro()
    OR maestro_id IS NULL
    OR maestro_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.allievi_condivisi ac
      WHERE ac.allievo_id = id AND ac.maestro_id = (select auth.uid())
    )
  );

CREATE POLICY "inserisci_propri_o_super" ON public.allievi
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_super_maestro()
    OR maestro_id = (select auth.uid())
  );

CREATE POLICY "modifica_propri_condivisi_o_super" ON public.allievi
  FOR UPDATE TO authenticated
  USING (
    public.is_super_maestro()
    OR maestro_id IS NULL
    OR maestro_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.allievi_condivisi ac
      WHERE ac.allievo_id = id AND ac.maestro_id = (select auth.uid())
    )
  )
  WITH CHECK (
    public.is_super_maestro()
    OR maestro_id IS NULL
    OR maestro_id = (select auth.uid())
  );

CREATE POLICY "cancella_propri_o_super" ON public.allievi
  FOR DELETE TO authenticated
  USING (
    public.is_super_maestro()
    OR maestro_id IS NULL
    OR maestro_id = (select auth.uid())
  );;
