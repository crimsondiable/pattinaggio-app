ALTER TABLE public.allievi
  ADD COLUMN IF NOT EXISTS nickname TEXT,
  ADD COLUMN IF NOT EXISTS gruppo   TEXT;

CREATE INDEX idx_allievi_gruppo ON public.allievi (gruppo) WHERE gruppo IS NOT NULL;

COMMENT ON COLUMN public.allievi.nickname IS 'Nome breve o soprannome';
COMMENT ON COLUMN public.allievi.gruppo   IS 'Gruppo di allenamento (per lezioni collettive)';;
