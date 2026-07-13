drop policy if exists lezioni_select_scope on public.lezioni;
create policy lezioni_select_scope on public.lezioni
for select to authenticated
using (
  app_private.is_super_maestro()
  or maestro_id = (select auth.uid())
  or app_private.can_access_lezione(id)
);

drop policy if exists locations_select_scope on public.locations;
create policy locations_select_scope on public.locations
for select to authenticated
using (
  app_private.is_super_maestro()
  or maestro_id = (select auth.uid())
  or (maestro_id is null and allievo_id is null)
  or app_private.can_access_location(id)
);
