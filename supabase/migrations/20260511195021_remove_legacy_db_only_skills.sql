-- =========================================================================
-- Rimuove record legacy non presenti nel questionario
-- Data: 2026-05-11
-- =========================================================================
--
-- Questi record erano alias/categorie storiche senza dati collegati:
-- Telemark, 1 piede, Salti, Fakie.
-- Il catalogo operativo resta allineato al questionario; dimensioni/extra
-- verranno modellate in seguito fuori dalla tabella public.skills.
-- =========================================================================

DELETE FROM public.skill_definizioni
WHERE skill_nome IN ('Telemark', '1 piede', 'Salti', 'Fakie');

DELETE FROM public.skills
WHERE nome IN ('Telemark', '1 piede', 'Salti', 'Fakie');

NOTIFY pgrst, 'reload schema';
