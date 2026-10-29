# Foto allievi

Implementazione del 29 ottobre 2026.

Dalla scheda di un allievo salvato, **Aggiungi foto / Modifica foto** apre
selezione file, anteprima quadrata e controlli per ingrandimento e posizione.
Il salvataggio produce un JPEG 512 × 512; l'originale non viene caricato.
È possibile annullare prima di salvare oppure rimuovere una foto esistente.
Le miniature compaiono in elenco desktop/mobile, dashboard, membri del gruppo
e presenze della lezione. Senza foto o senza rete restano le iniziali.

## Persistenza e permessi

- Migrazione canonica: `supabase/migrations/20261029141650_student_photos_private_storage.sql`.
- Migrazione applicata al progetto `mhioneawefsvagbccsum`.
- Bucket privato `student-photos`, soli JPEG fino a 512 KiB.
- `allievi.foto_path` contiene il percorso, separato dal JSON del profilo.
- SELECT, INSERT e DELETE dei file usano il perimetro esistente
  `app_private.can_access_allievo`: proprietario, maestro condiviso, super maestro.
- Upload con nome nuovo e senza sovrascrittura. Aggiornamento del riferimento
  solo se quello precedente coincide ancora, poi cancellazione del vecchio file.
- Nessuna policy UPDATE Storage necessaria: non viene usato upsert.
- Gli URL firmati durano 10 minuti, vengono rinnovati dopo 4 minuti e conservati
  solo in memoria per account. Non vengono salvati nello storage del browser.
- Se la risposta all'aggiornamento si perde per rete, il nuovo file non viene
  cancellato alla cieca: potrebbe essere già il riferimento salvato nel DB.
  Possono quindi restare file orfani dopo un errore di rete/cleanup. Nessuna
  pulizia automatica è stata attivata.

I backup PostgreSQL esistenti **non contengono i file Storage**, come già
indicato in `scripts/BACKUP.md`. Un export JSON allievo conserva il percorso,
non incorpora l'immagine. Non sono state cambiate routine di backup.

## Compatibilità e verifiche

Il loader moderno carica `student-photos.js`; la build legacy lo include prima
di `app.js`. Per riusare esbuild 0.25.5 già installato senza accesso alla rete:

```sh
GESTIONALE_ESBUILD_BINARY=/percorso/esbuild node 3-gestionale/scripts/build-legacy.mjs
```

Verifiche: test Node, sintassi moderna/legacy, browser isolato con immagini e
allievo fittizi; verifica transazionale dei permessi del database per Viola
(21 Budosan accessibili) e un utente estraneo (0). Non sono state caricate foto
reali o usate credenziali di collaboratori. Il caricamento nel browser è provato
con risposte Storage/database simulate, non con un login reale in produzione.

Il database è predisposto. La pubblicazione di queste modifiche su GitHub Pages
è stata autorizzata il 29 ottobre 2026 e comprende foto e modalità solo gruppo.
