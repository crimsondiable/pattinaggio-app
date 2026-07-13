-- Migration 0001 — Schema iniziale Skating Manager

-- 1. utenti
CREATE TABLE public.utenti (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       TEXT        NOT NULL,
  email      TEXT        NOT NULL UNIQUE,
  ruolo      TEXT        NOT NULL DEFAULT 'maestro'
                         CHECK (ruolo IN ('maestro', 'admin')),
  creato_il  TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.utenti IS 'Maestri e admin che usano il gestionale';

-- 2. allievi
CREATE TABLE public.allievi (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome               TEXT        NOT NULL,
  cognome            TEXT        NOT NULL,
  data_nascita       DATE,
  data_iscrizione    DATE        NOT NULL DEFAULT CURRENT_DATE,
  email              TEXT,
  telefono           TEXT,
  contatto_genitore  TEXT,
  livello_attuale    INTEGER     NOT NULL DEFAULT 1
                                 CHECK (livello_attuale BETWEEN 1 AND 10),
  blocco_attuale     TEXT        NOT NULL DEFAULT 'Base'
                                 CHECK (blocco_attuale IN ('Base', 'Intermedio', 'Avanzato', 'Master')),
  note_generali      TEXT,
  creato_il          TIMESTAMPTZ NOT NULL DEFAULT now(),
  aggiornato_il      TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.allievi IS 'Anagrafica e stato didattico generale degli allievi';

-- 3. skills
CREATE TABLE public.skills (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome                  TEXT        NOT NULL,
  descrizione           TEXT,
  tipo                  TEXT        NOT NULL
                                    CHECK (tipo IN ('RAMO', 'NEUTRA', 'OPT')),
  ramo                  TEXT        CHECK (ramo IN ('Equilibrio', 'Andatura', 'Frenata', 'Rotazione')),
  livello               INTEGER     NOT NULL
                                    CHECK (livello BETWEEN 1 AND 10),
  blocco                TEXT        NOT NULL
                                    CHECK (blocco IN ('Base', 'Intermedio', 'Avanzato', 'Master')),
  open_closed           TEXT        NOT NULL DEFAULT 'CLOSED'
                                    CHECK (open_closed IN ('OPEN', 'CLOSED')),
  obbligatoria          BOOLEAN     NOT NULL DEFAULT true,
  e_bilaterale          BOOLEAN     NOT NULL DEFAULT false,
  lato_sx_nome          TEXT,
  lato_dx_nome          TEXT,
  attr_baricentro       SMALLINT    NOT NULL DEFAULT 0 CHECK (attr_baricentro BETWEEN 0 AND 2),
  attr_forze            SMALLINT    NOT NULL DEFAULT 0 CHECK (attr_forze BETWEEN 0 AND 2),
  attr_assi             SMALLINT    NOT NULL DEFAULT 0 CHECK (attr_assi BETWEEN 0 AND 2),
  attr_tempo            SMALLINT    NOT NULL DEFAULT 0 CHECK (attr_tempo BETWEEN 0 AND 2),
  attivazione_dinamica  BOOLEAN     NOT NULL DEFAULT false,
  fasi_tempo            JSONB,
  sottotipo_tempo       TEXT        CHECK (sottotipo_tempo IN ('statico', 'attivo', 'passivo')),
  attr_propriocezione   TEXT,
  creato_il             TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT skills_ramo_coerenza CHECK (
    (tipo = 'RAMO' AND ramo IS NOT NULL) OR
    (tipo IN ('NEUTRA', 'OPT') AND ramo IS NULL)
  ),
  CONSTRAINT skills_bilaterale_coerenza CHECK (
    (e_bilaterale = false) OR
    (e_bilaterale = true AND lato_sx_nome IS NOT NULL AND lato_dx_nome IS NOT NULL)
  )
);
CREATE INDEX idx_skills_tipo   ON public.skills (tipo);
CREATE INDEX idx_skills_ramo   ON public.skills (ramo) WHERE ramo IS NOT NULL;
CREATE INDEX idx_skills_livello ON public.skills (livello);
CREATE INDEX idx_skills_blocco ON public.skills (blocco);
COMMENT ON TABLE public.skills IS 'Catalogo delle abilità del sistema (RAMO, NEUTRA, OPT)';

-- 4. prerequisiti_skill
CREATE TABLE public.prerequisiti_skill (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id            UUID        NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  richiede_skill_id   UUID        NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  stadio_minimo       SMALLINT    NOT NULL DEFAULT 2
                                  CHECK (stadio_minimo BETWEEN 0 AND 3),
  note                TEXT,
  CONSTRAINT prereq_no_self CHECK (skill_id <> richiede_skill_id),
  CONSTRAINT prereq_unique  UNIQUE (skill_id, richiede_skill_id)
);
CREATE INDEX idx_prereq_skill    ON public.prerequisiti_skill (skill_id);
CREATE INDEX idx_prereq_richiede ON public.prerequisiti_skill (richiede_skill_id);
COMMENT ON TABLE public.prerequisiti_skill IS 'Grafo dei prerequisiti: skill_id richiede richiede_skill_id a stadio_minimo';

-- 5. progressi_allievo
CREATE TABLE public.progressi_allievo (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  allievo_id            UUID        NOT NULL REFERENCES public.allievi(id) ON DELETE CASCADE,
  skill_id              UUID        NOT NULL REFERENCES public.skills(id)  ON DELETE RESTRICT,
  stadio                SMALLINT    NOT NULL DEFAULT 0
                                    CHECK (stadio BETWEEN 0 AND 3),
  stadio_lato_sx        SMALLINT    CHECK (stadio_lato_sx BETWEEN 0 AND 3),
  stadio_lato_dx        SMALLINT    CHECK (stadio_lato_dx BETWEEN 0 AND 3),
  data_inizio           DATE,
  data_acquisizione     DATE,
  data_perfezionamento  DATE,
  note_maestro          TEXT,
  aggiornato_il         TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT progressi_unique UNIQUE (allievo_id, skill_id)
);
CREATE INDEX idx_progressi_allievo ON public.progressi_allievo (allievo_id);
CREATE INDEX idx_progressi_skill   ON public.progressi_allievo (skill_id);
CREATE INDEX idx_progressi_stadio  ON public.progressi_allievo (stadio);
COMMENT ON TABLE public.progressi_allievo IS 'Stato di una skill per un allievo (stadio 0-3, eventualmente per lato sx/dx)';

-- 6. capacita_allievo
CREATE TABLE public.capacita_allievo (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  allievo_id        UUID        NOT NULL REFERENCES public.allievi(id) ON DELETE CASCADE,
  capacita          TEXT        NOT NULL
                                CHECK (capacita IN (
                                  'baricentro', 'forze', 'assi',
                                  'propriocezione', 'bilateralita_sx', 'bilateralita_dx'
                                )),
  voto_manuale      SMALLINT,
  note              TEXT,
  data_valutazione  DATE        NOT NULL DEFAULT CURRENT_DATE,
  maestro_id        UUID        REFERENCES public.utenti(id) ON DELETE SET NULL
);
CREATE INDEX idx_capacita_allievo ON public.capacita_allievo (allievo_id);
CREATE INDEX idx_capacita_maestro ON public.capacita_allievo (maestro_id) WHERE maestro_id IS NOT NULL;
COMMENT ON TABLE public.capacita_allievo IS 'Valutazioni manuali del maestro sugli attributi dell allievo (storico)';

-- Trigger aggiornato_il
CREATE OR REPLACE FUNCTION public.set_aggiornato_il()
RETURNS TRIGGER AS $$
BEGIN
  NEW.aggiornato_il = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_allievi_aggiornato_il
  BEFORE UPDATE ON public.allievi
  FOR EACH ROW EXECUTE FUNCTION public.set_aggiornato_il();

CREATE TRIGGER trg_progressi_aggiornato_il
  BEFORE UPDATE ON public.progressi_allievo
  FOR EACH ROW EXECUTE FUNCTION public.set_aggiornato_il();;
