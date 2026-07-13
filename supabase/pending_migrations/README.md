# Migrazioni in attesa

Questa cartella conserva proposte SQL non applicate al database remoto. I file
qui presenti non fanno parte della cronologia attiva letta da
`supabase migration list` e non devono essere spostati in `migrations/` senza
revisione, test e decisione esplicita.

## `20260611120000_locations_normalized_lesson_links.sql`

- Stato: non applicata al remoto al 2026-07-13.
- Provenienza: era in `supabase/migrations/`, fra migrazioni remote già
  applicate con timestamp successivo.
- Motivo dell'isolamento: lasciarla nella cartella attiva impediva una
  corrispondenza univoca fra file locali e history table remota e rendeva
  pericoloso un futuro `supabase db push`.
- Contenuto da revisionare: modifica e backfill di `locations`, aggiunta di
  `lezioni.location_id`, indici, trigger, RLS e vista aggregata.
- Condizioni per riattivarla: confronto con lo schema remoto corrente, test su
  database locale o branch isolato, verifica dei consumer web/mobile/watch e
  nuova migrazione con timestamp successivo alla cronologia corrente. Non
  riutilizzare automaticamente il vecchio timestamp.

Decisione di riferimento: TDR-004 nel Tourach Vault.

## Progressi per modalità e provenienza

- Specifica: `progress_modes_and_sources.md`.
- Simulazione read-only: `progress_modes_simulation.sql`.
- Stato: progettazione; nessuna migrazione SQL applicabile è stata generata.
- Ambito: separazione Frontale/Fakie, data evento uguale a `lezioni.data`,
  conservazione delle evidenze manuali/legacy e ricalcolo atomico.
- Vincolo: la simulazione contiene soltanto `SELECT`; la futura migrazione deve
  essere creata con `supabase migration new` solo dopo revisione e test su una
  copia isolata.

Decisioni di riferimento: TDR-003, TDR-010 e TDR-011 nel Tourach Vault.
