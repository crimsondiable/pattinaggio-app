ALTER TABLE public.allievi
  ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'individuale'
    CHECK (tipo IN ('individuale', 'associazione'));

COMMENT ON COLUMN public.allievi.tipo IS 'individuale = allievo privato; associazione = gruppo gestito da ente/scuola';;
