# Foto e sigle dei gruppi

In elenco desktop/mobile e nella scheda gruppo compare una foto o, in sua
assenza, una sigla. Dalla scheda gruppo il pulsante **Foto e sigla** apre
selezione immagine, ritaglio quadrato e sigla personalizzabile (1–4 lettere o
numeri). Si può cambiare la sola sigla, sostituire o rimuovere la foto.
Il JPEG caricato è 512 × 512, massimo 512 KiB. Nessun originale viene caricato.

Sigle impostate: Budosan Bimbi Principianti **BB**, Fratelli Cabisto **FC**.
Non è stato cambiato il nome dei gruppi.

## Persistenza e accesso

La fonte canonica è public.group_appearance (id stabile, proprietario,
nome gruppo, sigla e percorso foto). Il JSON gruppo_avatar nei profili dei
membri è una copia per la visualizzazione, aggiornata dal RPC senza
sovrascrivere gli altri dati. Non determina l'autorizzazione alle immagini.

Bucket group-photos privato: accesso basato sul gruppo canonico e sulle
appartenenze/condivisioni reali. I maestri autorizzati al gruppo possono
vedere e modificare foto e sigla. Gli URL firmati durano 10 minuti e restano
in memoria, separati per bucket/account. I permessi non si basano su campi
modificabili del profilo. Nessuna funzione nuova usa SECURITY DEFINER.

Gli aggiornamenti confrontano foto e sigla precedenti: un salvataggio obsoleto
viene rifiutato. La nuova foto viene referenziata prima della pulizia della
precedente. Una risposta di rete incerta non provoca la cancellazione alla
cieca del nuovo file. La rinomina dell'identità canonica dopo una rinomina
completa del gruppo è riservata a proprietario/super maestro.

Migrazioni applicate:
- 20261029163252_group_appearance: prima predisposizione e RPC iniziale.
- 20261029170127_canonical_group_appearance: tabella canonica, RLS, RPC
  aggiornato e ALTER POLICY sulle tre regole Storage esistenti. Nessuna
  rimozione di regole, tabelle, allievi o foto; ogni UPDATE ha un WHERE.

Il secondo aggiornamento era stato rifiutato dall'utente davanti all'avviso
SQL. Dopo la spiegazione, l'utente ha autorizzato la ripresa; il testo è stato
modificato per aggiornare le regole in posto, senza DROP POLICY, ed è stato
applicato con successo.

## Verifica e rilascio

- 95 test Node PASS, inclusi foto individuali e gruppi.
- group-appearance.integration.sql: PASS sul modello canonico, con dati
  fittizi e ROLLBACK; conservazione JSON, foto/sigla, conflitti, rimozione,
  accesso estraneo rifiutato.
- group-appearance-access.integration.sql: PASS con collaboratore condiviso,
  gruppo non condiviso negato, identificativo contraffatto nel JSON inefficace,
  account estraneo senza lettura né scrittura. Tutto annullato con ROLLBACK.
- Browser isolato 390 × 844 con dati fittizi: editor, ritaglio, foto, modifica
  sigla senza perdere immagine, rimozione/fallback, nessun overflow.
- Sintassi moderna/legacy, asset e advisor verificati. Gli advisor riportano
  solo gli avvisi preesistenti su set_aggiornato_il/set_updated_at,
  find_maestro_by_email e password compromesse, senza nuovi rilievi.

Riferimenti agli avvisi preesistenti:
https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable
https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable
https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

La pubblicazione su GitHub Pages è autorizzata in questa attività.
Il backup PostgreSQL non comprende i file Storage, come già documentato
per le foto degli allievi. Nessuna foto reale caricata durante le verifiche.
