-- =========================================================================
-- Migration 0022 — Famiglie skill, alias e stadi qualitativi
-- Data: 2026-05-11
-- =========================================================================
--
-- Nota metodologica:
-- il progetto ha gia una scala di padronanza 0-3:
--   0 = non affrontata
--   1 = in lavorazione
--   2 = acquisita / usabile come base per sbloccare
--   3 = perfezionata
--
-- Questa migration non elimina duplicati dal catalogo operativo, per non
-- rompere progressi_allievo e lezioni_skills. Aggiunge invece una mappa
-- esplicita: skill vecchie, alias e varianti qualitative possono essere
-- ricondotte a una famiglia canonica.
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.skill_famiglie (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT        NOT NULL UNIQUE,
  descrizione TEXT,
  creato_il   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skill_accorpamenti (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  famiglia_id           UUID        NOT NULL REFERENCES public.skill_famiglie(id) ON DELETE CASCADE,
  skill_id              UUID        REFERENCES public.skills(id) ON DELETE SET NULL,
  skill_nome            TEXT        NOT NULL,
  ruolo                 TEXT        NOT NULL
                                      CHECK (ruolo IN ('canonica', 'alias', 'stadio', 'variante', 'categoria')),
  stadio_equivalente    SMALLINT    CHECK (stadio_equivalente BETWEEN 0 AND 3),
  soglia_sblocco_stadio SMALLINT    NOT NULL DEFAULT 2
                                      CHECK (soglia_sblocco_stadio BETWEEN 0 AND 3),
  note                  TEXT,
  creato_il             TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT skill_accorpamenti_unique UNIQUE (famiglia_id, skill_nome)
);

CREATE INDEX IF NOT EXISTS idx_skill_accorpamenti_famiglia ON public.skill_accorpamenti (famiglia_id);
CREATE INDEX IF NOT EXISTS idx_skill_accorpamenti_skill ON public.skill_accorpamenti (skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_accorpamenti_ruolo ON public.skill_accorpamenti (ruolo);

ALTER TABLE public.skill_famiglie ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_accorpamenti ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leggi_skill_famiglie_autenticato" ON public.skill_famiglie;
DROP POLICY IF EXISTS "scrivi_skill_famiglie_autenticato" ON public.skill_famiglie;
DROP POLICY IF EXISTS "leggi_skill_accorpamenti_autenticato" ON public.skill_accorpamenti;
DROP POLICY IF EXISTS "scrivi_skill_accorpamenti_autenticato" ON public.skill_accorpamenti;

CREATE POLICY "leggi_skill_famiglie_autenticato" ON public.skill_famiglie
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "scrivi_skill_famiglie_autenticato" ON public.skill_famiglie
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "leggi_skill_accorpamenti_autenticato" ON public.skill_accorpamenti
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "scrivi_skill_accorpamenti_autenticato" ON public.skill_accorpamenti
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_famiglie TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.skill_accorpamenti TO authenticated;

ALTER TABLE public.skill_definizioni
  ADD COLUMN IF NOT EXISTS famiglia_nome TEXT,
  ADD COLUMN IF NOT EXISTS ruolo_progressione TEXT
    CHECK (ruolo_progressione IS NULL OR ruolo_progressione IN ('skill', 'alias', 'stadio', 'variante', 'categoria')),
  ADD COLUMN IF NOT EXISTS soglia_sblocco_stadio SMALLINT NOT NULL DEFAULT 2
    CHECK (soglia_sblocco_stadio BETWEEN 0 AND 3);

COMMENT ON TABLE public.skill_famiglie IS
  'Famiglie canoniche usate per raggruppare skill, alias e stadi qualitativi della stessa competenza.';

COMMENT ON TABLE public.skill_accorpamenti IS
  'Mappa tra skill operative, alias vecchi e stadi qualitativi collegati a una famiglia canonica.';

COMMENT ON COLUMN public.skill_accorpamenti.stadio_equivalente IS
  'Stadio didattico equivalente: 2 indica skill sufficiente a sbloccare, 3 indica padronanza piena.';

COMMENT ON COLUMN public.skill_definizioni.soglia_sblocco_stadio IS
  'Soglia minima di padronanza richiesta per usare questa skill come prerequisito; di norma 2.';

WITH famiglie(nome, descrizione) AS (
  VALUES
    ('Caduta controllata', 'Famiglia sicurezza/caduta; assorbe il vecchio nome Cadute.'),
    ('T-stop', 'Famiglia frenata T-stop; assorbe variante ortografica T stop.'),
    ('Stroke', 'Famiglia della spinta base: base e continuo sono stadi della stessa competenza.'),
    ('Stride', 'Famiglia della pattinata completa: base, fluido, potente e veloce.'),
    ('Telemark', 'Famiglia assetto longitudinale; tacco e punta sono varianti tecniche.'),
    ('Monopedale', 'Famiglia controllo su un piede: assistito, glide, curva, fakie.'),
    ('Salti / distacco', 'Categoria/famiglia del distacco: salto base, Jump 180, Jump 360.'),
    ('Fakie', 'Dimensione trasversale/famiglia di retromarcia e varianti fakie.'),
    ('Curva carrellata', 'Famiglia curva carrellata: base, standard, avanzata.'),
    ('Double push', 'Famiglia double push: segmentato, bilaterale, master.'),
    ('Parallel slide', 'Famiglia parallel slide: segmentata e master.'),
    ('Passo incrociato', 'Famiglia passo incrociato: segmentato e master.'),
    ('Jump 360', 'Famiglia Jump 360: segmentato e master.')
)
INSERT INTO public.skill_famiglie (nome, descrizione)
SELECT nome, descrizione FROM famiglie
ON CONFLICT (nome) DO UPDATE
SET descrizione = EXCLUDED.descrizione;

WITH seed(famiglia_nome, skill_nome, ruolo, stadio_equivalente, soglia_sblocco_stadio, note) AS (
  VALUES
    ('Caduta controllata', 'Cadute', 'alias', 2, 2, 'Nome vecchio/generico da accorpare.'),
    ('Caduta controllata', 'Caduta controllata', 'canonica', 2, 2, 'Skill canonica di sicurezza.'),

    ('T-stop', 'T stop', 'alias', 2, 2, 'Duplicato ortografico senza trattino.'),
    ('T-stop', 'T-stop', 'canonica', 2, 2, 'Skill canonica.'),

    ('Stroke', 'Stroke', 'alias', 2, 2, 'Nome vecchio/generico.'),
    ('Stroke', 'Stroke base', 'stadio', 2, 2, 'Soglia minima utile per progredire.'),
    ('Stroke', 'Stroke continuo', 'stadio', 3, 2, 'Qualita superiore: continuita e ritmo.'),

    ('Stride', 'Stride', 'alias', 2, 2, 'Nome vecchio/generico.'),
    ('Stride', 'Stride base', 'stadio', 1, 2, 'Primo possesso tecnico.'),
    ('Stride', 'Stride fluido', 'stadio', 2, 2, 'Soglia OK per usare Stride come base di progressione.'),
    ('Stride', 'Stride potente', 'stadio', 3, 2, 'Affinamento richiesto per spinte avanzate.'),
    ('Stride', 'Stride veloce', 'stadio', 3, 2, 'Affinamento richiesto per velocita e double push.'),

    ('Telemark', 'Telemark', 'alias', 2, 2, 'Nome famiglia vecchio/generico.'),
    ('Telemark', 'Telemark tacco', 'variante', 2, 2, 'Variante tacco.'),
    ('Telemark', 'Telemark punta', 'variante', 2, 2, 'Variante punta.'),

    ('Monopedale', '1 piede', 'alias', 2, 2, 'Nome vecchio/generico.'),
    ('Monopedale', 'Monopedale assistito', 'stadio', 1, 2, 'Primo possesso tecnico.'),
    ('Monopedale', 'Monopedale glide', 'stadio', 2, 2, 'Soglia OK per sbloccare competenze successive.'),
    ('Monopedale', 'Monopedale in curva', 'stadio', 3, 2, 'Affinamento dinamico.'),
    ('Monopedale', 'Monopedale fakie', 'variante', 3, 2, 'Variante in retromarcia.'),

    ('Salti / distacco', 'Salti', 'categoria', 2, 2, 'Categoria vecchia/non valutabile singolarmente.'),
    ('Salti / distacco', 'Salto base / distacco', 'canonica', 2, 2, 'Prima soglia controllata di distacco.'),
    ('Salti / distacco', 'Jump 180', 'stadio', 2, 2, 'Applicazione rotativa base.'),
    ('Salti / distacco', 'Jump 360', 'stadio', 3, 2, 'Skill master.'),

    ('Fakie', 'Fakie', 'categoria', 2, 2, 'Dimensione trasversale.'),
    ('Fakie', 'Fakie glide', 'canonica', 2, 2, 'Prima soglia retromarcia.'),
    ('Fakie', 'Fakie stride base', 'stadio', 2, 2, 'Propulsione fakie base.'),
    ('Fakie', 'Fakie stride fluido', 'stadio', 3, 2, 'Propulsione fakie fluida.'),

    ('Curva carrellata', 'Curva carrellata base', 'stadio', 1, 2, 'Primo possesso tecnico.'),
    ('Curva carrellata', 'Curva carrellata', 'canonica', 2, 2, 'Soglia OK.'),
    ('Curva carrellata', 'Curva carrellata avanzata', 'stadio', 3, 2, 'Affinamento richiesto per slide e double push.'),

    ('Double push', 'Double push segmentato', 'stadio', 2, 2, 'Soglia di accesso al gesto avanzato.'),
    ('Double push', 'Double push bilaterale', 'stadio', 3, 2, 'Simmetria.'),
    ('Double push', 'Double push', 'canonica', 3, 2, 'Padronanza piena.'),

    ('Parallel slide', 'Parallel slide segmentata', 'stadio', 2, 2, 'Soglia di accesso.'),
    ('Parallel slide', 'Parallel slide', 'canonica', 3, 2, 'Padronanza piena.'),

    ('Passo incrociato', 'Passo incrociato segmentato', 'stadio', 2, 2, 'Soglia di accesso.'),
    ('Passo incrociato', 'Passo incrociato', 'canonica', 3, 2, 'Padronanza piena.'),

    ('Jump 360', 'Jump 360 segmentato', 'stadio', 2, 2, 'Soglia di accesso.'),
    ('Jump 360', 'Jump 360', 'canonica', 3, 2, 'Padronanza piena.')
)
INSERT INTO public.skill_accorpamenti (
  famiglia_id,
  skill_id,
  skill_nome,
  ruolo,
  stadio_equivalente,
  soglia_sblocco_stadio,
  note
)
SELECT
  f.id,
  s.id,
  seed.skill_nome,
  seed.ruolo,
  seed.stadio_equivalente,
  seed.soglia_sblocco_stadio,
  seed.note
FROM seed
JOIN public.skill_famiglie f ON f.nome = seed.famiglia_nome
LEFT JOIN public.skills s ON lower(s.nome) = lower(seed.skill_nome)
ON CONFLICT (famiglia_id, skill_nome) DO UPDATE
SET
  skill_id = EXCLUDED.skill_id,
  ruolo = EXCLUDED.ruolo,
  stadio_equivalente = EXCLUDED.stadio_equivalente,
  soglia_sblocco_stadio = EXCLUDED.soglia_sblocco_stadio,
  note = EXCLUDED.note;

UPDATE public.skill_definizioni d
SET
  famiglia_nome = f.nome,
  ruolo_progressione = CASE a.ruolo
    WHEN 'canonica' THEN 'skill'
    ELSE a.ruolo
  END,
  soglia_sblocco_stadio = a.soglia_sblocco_stadio
FROM public.skill_accorpamenti a
JOIN public.skill_famiglie f ON f.id = a.famiglia_id
WHERE lower(a.skill_nome) = lower(d.skill_nome);

NOTIFY pgrst, 'reload schema';
