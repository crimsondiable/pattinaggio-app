CREATE OR REPLACE FUNCTION public.is_super_maestro()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) = 'francesco.grinovero@gmail.com';
$$;

REVOKE EXECUTE ON FUNCTION public.find_maestro_by_email(TEXT) FROM anon;
GRANT EXECUTE ON FUNCTION public.find_maestro_by_email(TEXT) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.set_aggiornato_il() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_progressi_da_lezione() FROM anon, authenticated;

GRANT EXECUTE ON FUNCTION public.is_super_maestro() TO authenticated;;
