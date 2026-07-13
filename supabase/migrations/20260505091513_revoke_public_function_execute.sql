REVOKE EXECUTE ON FUNCTION public.find_maestro_by_email(TEXT) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_aggiornato_il() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_progressi_da_lezione() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_super_maestro() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.find_maestro_by_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_maestro() TO authenticated;;
