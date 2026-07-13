ALTER TABLE public.allievi
  ADD COLUMN IF NOT EXISTS nickname TEXT,
  ADD COLUMN IF NOT EXISTS gruppo   TEXT,
  ADD COLUMN IF NOT EXISTS vip      BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.allievi.nickname IS 'Nome informale / soprannome usato in pista';
COMMENT ON COLUMN public.allievi.gruppo   IS 'Nome del gruppo di pattinatori (es. "Famiglia Rossi")';
COMMENT ON COLUMN public.allievi.vip      IS 'Allievo prioritario / VIP';;
