# Classi con membri solo di gruppo

Implementazione del 29 ottobre 2026.

In **Modifica gruppo**, l'opzione **Solo lezioni di gruppo** distingue una
classe da un gruppo misto. Un gruppo misto mantiene il comportamento esistente:
i membri possono avere lezioni comuni o individuali.

Con l'opzione attiva:

- l'elenco Allievi mostra la classe come un'unica voce, anche nel filtro
  “Tutti gli allievi”; non espande i singoli iscritti con “Espandi tutti”;
- la scheda gruppo mantiene la lista completa dei membri, le foto, le schede,
  le note, i progressi e lo storico;
- i membri non sono proposti come destinatari individuali delle lezioni o
  degli appuntamenti, né come ospiti fuori da una lezione di gruppo;
- la scorciatoia “Prepara lezione” di un membro apre il suo gruppo;
- i controlli di salvataggio e il database rifiutano nuovi collegamenti a
  lezioni individuali o campo libero e impediscono di convertire una lezione
  di gruppo che li contiene in un'altra tipologia.

Non sono stati eliminati allievi, lezioni, presenze o progressi. Le vecchie
lezioni individuali eventualmente presenti restano nello storico. Se un membro
ora solo di gruppo aveva lezioni individuali, ricrearne le relazioni durante
una modifica è soggetto al nuovo vincolo: occorre prima rendere misto il gruppo.
Il gruppo Budosan verificato non aveva lezioni individuali.

## Persistenza

La colonna canonica `allievi.solo_gruppo` è booleana e predefinita a `false`.
La modalità è applicata in un singolo aggiornamento a tutti i membri visibili
del gruppo, compresi gli archiviati. La modalità di gruppo è derivata dai
membri: il progetto continua a non avere una tabella autonoma per i gruppi.
Le modifiche anagrafiche del form gruppo restano nella precedente procedura di
salvataggio; non è stata introdotta una transazione per l'intero form.

I nuovi membri ereditano il vincolo da una classe esistente dello stesso
maestro anche a livello DB. Il form individuale eredita la modalità del gruppo
di destinazione. Togliendo l'appartenenza al gruppo si azzera il vincolo.
Disattivando l'opzione il gruppo torna misto; le preferenze del planner già
salvate restano preferenze separate e non vengono riscritte.

La modalità segue il record condiviso, non il dispositivo o l'account che lo
visualizza. Restano le policy RLS esistenti. Le nuove funzioni di controllo sono
`SECURITY INVOKER`, con `search_path` vuoto, nello schema non esposto
`app_private`; nessun nuovo RPC pubblico o permesso di bypass.

Migrazione applicata e salvata in
`supabase/migrations/20261029143213_group_only_students.sql`.
L'attivazione richiesta sui dati correnti è separata dalla migrazione:

- Budosan Bimbi Principianti: 21/21 membri `solo_gruppo=true`;
- Fratelli Cabisto: 2/2 membri ancora misti;
- condivisioni Budosan con Viola: 21, invariate.

## Verifica

- 72 test Node passati, incluse 14 verifiche del vincolo su sorgente moderna
  e build legacy.
- `tests/group-only-students.integration.sql`: test nel database remoto con
  ruolo authenticated e dati fittizi, integralmente annullati con ROLLBACK.
  Provati ereditarietà, default misto, presenze di gruppo, rifiuto di presenze
  individuali/campo libero, cambio partecipante/tipo lezione, disattivazione e
  uscita dal gruppo. Nessuna riga di prova rimasta.
- Browser Chromium isolato a 1280 × 900 e 390 × 844, componenti reali con
  servizi simulati: elenco classe, modalità reversibile, selezioni individuali,
  espansione dei gruppi misti, nessun overflow orizzontale.
- Build legacy rigenerata; sintassi JavaScript e 28 riferimenti asset verificati.
- Gli advisor di sicurezza non hanno aggiunto segnalazioni rispetto alla prova
  foto precedente. Restano gli avvisi preesistenti documentati in
  `output/playwright/student-photos/VERIFICA.md`.

Il vincolo è attivo nel database. La pubblicazione dell'interfaccia, insieme
alle foto, è stata autorizzata il 29 ottobre 2026 su GitHub Pages.
