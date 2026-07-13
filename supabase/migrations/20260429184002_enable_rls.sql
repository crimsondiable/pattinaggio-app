-- Abilita RLS su tutte le tabelle
ALTER TABLE public.utenti             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allievi            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prerequisiti_skill ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progressi_allievo  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capacita_allievo   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lezioni            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lezioni_allievi    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lezioni_skills     ENABLE ROW LEVEL SECURITY;

-- Nessuna policy pubblica: solo il service_role (backend) può accedere
-- Quando aggiungeremo l'auth, creeremo policy specifiche per utenti autenticati;
