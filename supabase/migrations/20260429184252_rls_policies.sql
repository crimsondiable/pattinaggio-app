CREATE POLICY "autenticato_tutto" ON public.utenti
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "autenticato_tutto" ON public.allievi
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "autenticato_tutto" ON public.skills
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "autenticato_tutto" ON public.prerequisiti_skill
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "autenticato_tutto" ON public.progressi_allievo
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "autenticato_tutto" ON public.capacita_allievo
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "autenticato_tutto" ON public.lezioni
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "autenticato_tutto" ON public.lezioni_allievi
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "autenticato_tutto" ON public.lezioni_skills
  FOR ALL USING (auth.role() = 'authenticated');;
