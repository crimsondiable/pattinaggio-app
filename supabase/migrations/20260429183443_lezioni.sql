CREATE TABLE public.lezioni (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  data        DATE        NOT NULL DEFAULT CURRENT_DATE,
  durata_min  INTEGER     CHECK (durata_min > 0),
  tipo        TEXT        NOT NULL DEFAULT 'individuale'
                          CHECK (tipo IN ('individuale', 'gruppo', 'campo_libero')),
  luogo       TEXT,
  note        TEXT,
  maestro_id  UUID        REFERENCES public.utenti(id) ON DELETE SET NULL,
  creato_il   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lezioni_data      ON public.lezioni (data);
CREATE INDEX idx_lezioni_maestro   ON public.lezioni (maestro_id) WHERE maestro_id IS NOT NULL;

COMMENT ON TABLE public.lezioni IS 'Registro delle sedute di allenamento';

CREATE TABLE public.lezioni_allievi (
  id            UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  lezione_id    UUID  NOT NULL REFERENCES public.lezioni(id)  ON DELETE CASCADE,
  allievo_id    UUID  NOT NULL REFERENCES public.allievi(id)  ON DELETE RESTRICT,
  note_presenza TEXT,
  CONSTRAINT lezioni_allievi_unique UNIQUE (lezione_id, allievo_id)
);

CREATE INDEX idx_lezioni_allievi_lezione ON public.lezioni_allievi (lezione_id);
CREATE INDEX idx_lezioni_allievi_allievo ON public.lezioni_allievi (allievo_id);

COMMENT ON TABLE public.lezioni_allievi IS 'Allievi presenti a ogni lezione';

CREATE TABLE public.lezioni_skills (
  id               UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  lezione_id       UUID      NOT NULL REFERENCES public.lezioni(id)  ON DELETE CASCADE,
  allievo_id       UUID      NOT NULL REFERENCES public.allievi(id)  ON DELETE RESTRICT,
  skill_id         UUID      NOT NULL REFERENCES public.skills(id)   ON DELETE RESTRICT,
  stadio_raggiunto SMALLINT  NOT NULL CHECK (stadio_raggiunto BETWEEN 0 AND 3),
  note             TEXT,
  CONSTRAINT lezioni_skills_unique UNIQUE (lezione_id, allievo_id, skill_id)
);

CREATE INDEX idx_lezioni_skills_lezione ON public.lezioni_skills (lezione_id);
CREATE INDEX idx_lezioni_skills_allievo ON public.lezioni_skills (allievo_id);
CREATE INDEX idx_lezioni_skills_skill   ON public.lezioni_skills (skill_id);

COMMENT ON TABLE public.lezioni_skills IS 'Skill lavorate in ogni lezione, con stadio raggiunto dal maestro';

CREATE OR REPLACE FUNCTION public.sync_progressi_da_lezione()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_data_lezione DATE;
BEGIN
  SELECT data INTO v_data_lezione
  FROM public.lezioni
  WHERE id = NEW.lezione_id;

  INSERT INTO public.progressi_allievo (
    allievo_id,
    skill_id,
    stadio,
    data_inizio,
    data_acquisizione,
    data_perfezionamento,
    aggiornato_il
  )
  VALUES (
    NEW.allievo_id,
    NEW.skill_id,
    NEW.stadio_raggiunto,
    CASE WHEN NEW.stadio_raggiunto >= 1 THEN v_data_lezione ELSE NULL END,
    CASE WHEN NEW.stadio_raggiunto >= 2 THEN v_data_lezione ELSE NULL END,
    CASE WHEN NEW.stadio_raggiunto  = 3 THEN v_data_lezione ELSE NULL END,
    now()
  )
  ON CONFLICT (allievo_id, skill_id) DO UPDATE
    SET
      stadio               = GREATEST(progressi_allievo.stadio, NEW.stadio_raggiunto),
      data_inizio          = COALESCE(progressi_allievo.data_inizio,
                               CASE WHEN NEW.stadio_raggiunto >= 1 THEN v_data_lezione ELSE NULL END),
      data_acquisizione    = COALESCE(progressi_allievo.data_acquisizione,
                               CASE WHEN NEW.stadio_raggiunto >= 2 THEN v_data_lezione ELSE NULL END),
      data_perfezionamento = COALESCE(progressi_allievo.data_perfezionamento,
                               CASE WHEN NEW.stadio_raggiunto  = 3 THEN v_data_lezione ELSE NULL END),
      aggiornato_il        = now()
  WHERE NEW.stadio_raggiunto > progressi_allievo.stadio;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_sync_progressi
  AFTER INSERT OR UPDATE OF stadio_raggiunto ON public.lezioni_skills
  FOR EACH ROW EXECUTE FUNCTION public.sync_progressi_da_lezione();;
