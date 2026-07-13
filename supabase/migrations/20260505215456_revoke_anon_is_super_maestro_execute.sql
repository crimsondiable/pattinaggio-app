REVOKE EXECUTE ON FUNCTION public.is_super_maestro() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_super_maestro() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_maestro() TO authenticated;;
