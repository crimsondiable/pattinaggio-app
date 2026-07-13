-- Fix security warning: funzione trigger con search_path fisso
CREATE OR REPLACE FUNCTION public.set_aggiornato_il()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.aggiornato_il = now();
  RETURN NEW;
END;
$$;;
