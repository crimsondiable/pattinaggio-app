ALTER TABLE public.allievi
  ADD COLUMN IF NOT EXISTS profilo JSONB NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.allievi.profilo IS
  'Campi extra della scheda allievo: logistica, profilo psicomotorio, rating, ecc.';

INSERT INTO public.skills (nome, tipo, ramo, livello, blocco, open_closed, obbligatoria) VALUES
  ('Posizione base',    'RAMO', 'Equilibrio', 1, 'Base', 'CLOSED', true),
  ('Peso laterale',     'RAMO', 'Equilibrio', 1, 'Base', 'CLOSED', true),
  ('Telemark',          'RAMO', 'Equilibrio', 2, 'Base', 'CLOSED', true),
  ('1 piede',           'RAMO', 'Equilibrio', 3, 'Base', 'CLOSED', true),
  ('Primi passi',       'RAMO', 'Andatura',   1, 'Base', 'CLOSED', true),
  ('Glide',             'RAMO', 'Andatura',   1, 'Base', 'CLOSED', true),
  ('Stroke',            'RAMO', 'Andatura',   2, 'Base', 'CLOSED', true),
  ('Stride',            'RAMO', 'Andatura',   3, 'Base', 'CLOSED', true),
  ('Frenata limone',    'RAMO', 'Frenata',    1, 'Base', 'CLOSED', true),
  ('Spazzaneve',        'RAMO', 'Frenata',    2, 'Base', 'CLOSED', true),
  ('T stop',            'RAMO', 'Frenata',    3, 'Base', 'CLOSED', true),
  ('Powerstop',         'RAMO', 'Frenata',    4, 'Intermedio', 'CLOSED', true),
  ('Curva compasso',    'RAMO', 'Rotazione',  1, 'Base', 'CLOSED', true),
  ('Curva spinta',      'RAMO', 'Rotazione',  2, 'Base', 'CLOSED', true),
  ('Curva carrellata',  'RAMO', 'Rotazione',  3, 'Base', 'CLOSED', true),
  ('Passo incrociato',  'RAMO', 'Rotazione',  4, 'Intermedio', 'CLOSED', true),
  ('Cadute',            'NEUTRA', NULL, 1, 'Base', 'OPEN', false),
  ('Salti',             'NEUTRA', NULL, 3, 'Base', 'OPEN', false),
  ('Fakie',             'OPT',    NULL, 4, 'Intermedio', 'OPEN', false)
ON CONFLICT DO NOTHING;;
