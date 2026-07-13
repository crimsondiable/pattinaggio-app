-- Le skill di una lezione "Campo libero" sono una preparazione futura:
-- non appartengono ancora a un allievo e non aggiornano i suoi progressi.
alter table public.lezioni_skills
  alter column allievo_id drop not null;
