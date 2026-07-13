ALTER TABLE public.allievi
  ADD COLUMN IF NOT EXISTS vip BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.allievi.vip IS 'Allievo VIP — evidenziato nella lista';;
