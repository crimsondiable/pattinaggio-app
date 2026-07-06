# PROJECT.md

Fotografia del progetto al 2026-07-04, basata sui file presenti nel repository
e nel workspace locale. Questo documento descrive cio' che esiste oggi, non
cio' che il progetto dovrebbe diventare.

## Sintesi

Il progetto e' un gestionale statico per pattinaggio inline, orientato a
insegnanti/allievi. Combina:

- una web app statica pubblicabile su GitHub Pages;
- un backend Supabase usato direttamente dal browser;
- un catalogo skill tree didattico;
- documentazione metodologica su biomeccanica, manovre e progressioni;
- migrazioni database;
- prototipi, report, backup e output generati.

La sorgente pubblicabile dell'app e' `3-gestionale/src`. Il deploy ufficiale
pubblica solo quella cartella.

## Struttura del repository/workspace

```text
.
|-- README.md
|-- index.html
|-- .github/workflows/deploy-pages.yml
|-- 1-progetto/
|-- 2-metodologia/
|-- 3-gestionale/
|   |-- db/migrations/
|   |-- scripts/
|   `-- src/
|       |-- index.html
|       |-- app.js
|       |-- app-legacy.js
|       |-- skill-questionario.html
|       |-- skilltree-catalog.js
|       `-- route-builder/
|-- supabase/
|   |-- config.toml
|   |-- migrations/
|   `-- pending_questionario/
|-- gestionale-tabs-public/
|-- output/
|-- tmp/
|-- backups/
`-- .codex-pet-runs/
```

Le cartelle `1-progetto`, `2-metodologia`, `supabase`, `output`, `tmp`,
`backups`, `.codex-pet-runs`, `.worktrees` e `3-gestionale/db` sono ignorate
da `.gitignore`, ma contengono materiale rilevante nel workspace locale.

## File canonici

- App pubblicabile: `3-gestionale/src`.
- Entry point pubblicato: `3-gestionale/src/index.html`.
- Logica app moderna: `3-gestionale/src/app.js`.
- Fallback legacy: `3-gestionale/src/app-legacy.js`.
- Questionario skill: `3-gestionale/src/skill-questionario.html`.
- Catalogo skill frontend: `3-gestionale/src/skilltree-catalog.js`.
- Route builder: `3-gestionale/src/route-builder/`.
- Database: `supabase/migrations`.
- Workflow Pages: `.github/workflows/deploy-pages.yml`.
- Stato/pulizia locale: `1-progetto/`.
- Metodologia: `2-metodologia/`.

`gestionale-tabs-public` e' una copia/repo parallelo non allineata alla
sorgente canonica.

## Tecnologie

Frontend:

- HTML statico.
- CSS scritto direttamente in pagina/file dedicato.
- JavaScript vanilla non modulare per il gestionale principale.
- Classi JS globali per il route builder.
- Supabase JS UMD da CDN.
- `anime.js` da CDN.
- Polyfill `promise-polyfill` e `whatwg-fetch`.

Backend:

- Supabase/Postgres.
- Auth Supabase.
- Row Level Security e policy SQL.
- Migrazioni SQL locali.

Hosting e tooling:

- GitHub Pages.
- GitHub Actions.
- Python `http.server` per sviluppo locale.
- Node `.mjs` per generare build legacy e icone.
- `npx esbuild@0.25.5` per `app-legacy.js`.

Non sono presenti `package.json`, framework frontend, bundler di sviluppo o
test automatici configurati.

## Architettura frontend attuale

L'app principale e' una single page app statica.

`3-gestionale/src/index.html` contiene:

- CSS globale;
- markup della schermata login;
- header/nav;
- sezioni `view-*` per tutte le viste;
- modali;
- loader script moderno/legacy;
- fallback login legacy via REST Supabase.

`3-gestionale/src/app.js` contiene:

- configurazione Supabase;
- stato globale dell'app;
- compatibilita Supabase v1/v2;
- routing interno basato su viste e hash/history;
- caricamento dati;
- rendering HTML via template string;
- handler CRUD;
- logica calendario/appuntamenti;
- logica skill tree;
- logica lezioni;
- mappa/location;
- tuning;
- utilita di formattazione e escaping.

Il file e' molto grande e centralizzato. Il titolo dell'app lo dichiara come
`Big Ball of Mud` / `BBoM`; questa e' una descrizione coerente con lo stato del
codice.

Il route builder e' l'unica area separata in moduli dedicati, ma usa comunque
namespace globali su `window` e script non modulari.

## Viste e aree funzionali

Viste nel gestionale principale:

- `allievi`: dashboard/elenco, filtri, gruppi, import/export.
- `scheda`: dettaglio allievo, profilo, skill tree, lezioni.
- `gruppo`: dettaglio gruppo e membri.
- `lezioni`: elenco lezioni, filtri, dettagli comprimibili.
- `calendario`: calendario settimanale operativo.
- `appuntamenti`: pianificazione automatica su disponibilita.
- `location`: dettaglio/gestione singola location.
- `mappa`: mappa location su immagine Milano.
- `lezione`: lettura dettaglio lezione.
- `percorsi`: editor percorsi/campo esercizi.
- `nuova-lezione`: creazione/modifica lezione.
- `nuovo-allievo`: creazione/modifica allievo.
- `nuovo-gruppo`: creazione/modifica gruppo.
- `skills`: catalogo skill.
- `tuning`: revisione/tuning parametri skill.
- `app-notes`: note operative.

Pagina separata:

- `skill-questionario.html`: questionario di definizione skill e vista skill
  tree del questionario.

## Dati caricati dal gestionale

All'avvio autenticato, il gestionale carica almeno:

- `allievi`
- `skills`
- `prerequisiti_skill`
- `progressi_allievo`
- `skill_definizioni`

Durante l'uso legge/scrive anche:

- `allievi_condivisi`
- `app_notes`
- `lezioni`
- `lezioni_allievi`
- `lezioni_skills`
- `locations`
- `tuning_risposte`

Molte preferenze e bozze sono salvate in `localStorage`, fra cui:

- draft lezione;
- note app fallback;
- coordinate mappa location locali;
- calendario settimanale;
- disponibilita maestro/allievi/gruppi;
- preferenze appuntamenti;
- percorsi del route builder;
- bozze questionario skill.

## Database Supabase

Le migrazioni definiscono e modificano queste aree:

- utenti;
- allievi;
- skills;
- prerequisiti skill;
- progressi allievo;
- capacita allievo;
- lezioni;
- presenze lezione;
- skill lavorate in lezione;
- multi-maestro e condivisione allievi;
- RLS e hardening permessi;
- questionario `skill_definizioni`;
- famiglie/accorpamenti skill;
- tuning risposte;
- sync locale `skating_tricks_sync`;
- metadati lezioni/skill (`dimensioni`, `fakie`, esercizi);
- lezioni operative, note speciali, stato aperta/chiusa;
- locations;
- storico modifiche;
- app notes;
- meteo lezioni;
- privacy/condivisione location;
- normalizzazione location e collegamento `lezioni.location_id`.

La cartella `supabase/migrations` contiene una sequenza non perfettamente
uniforme: ci sono migrazioni timestampate e migrazioni numerate `0018-0022`.
Le copie in `3-gestionale/db/migrations` e `supabase/pending_questionario`
sembrano staging/storico, non fonte primaria.

## Skill tree e metodologia

`skilltree-catalog.js` espone `window.SKILLTREE_NODES` con nodi definiti come:

- nome;
- branch (`stance`, `gait`, `break`, `rotation`, `air`);
- livello 1-10;
- flag chiave;
- prerequisiti testuali;
- varianti;
- nota catalogo.

Il catalogo osservato contiene 92 nodi:

- `stance`: 33;
- `gait`: 21;
- `break`: 16;
- `rotation`: 18;
- `air`: 4.

La metodologia in `2-metodologia` contiene:

- skill base dei rami principali;
- confronto fra modelli manovre ChatGPT/Claude;
- sistema parametri e scoring biomeccanico;
- varianti/prototipi HTML di skill tree;
- preset/design note.

Le fonti metodologiche non sono tutte perfettamente allineate col catalogo
frontend. Esempi:

- alcuni documenti parlano di quattro rami, mentre il catalogo attuale include
  `air`;
- il ramo interno `break` viene presentato in UI/documenti come `Frenata`;
- `fakie`, `bilaterale` e `distacco` oscillano fra skill, dimensioni
  trasversali e metadati.

## Questionario skill

`skill-questionario.html`:

- carica Supabase v2 da CDN;
- carica `skilltree-catalog.js`;
- parte dal catalogo locale;
- esclude skill con nome fakie;
- idrata definizioni remote da `skill_definizioni`;
- legge gli id da `skills`;
- salva bozze in `localStorage`;
- salva/sincronizza su `skill_definizioni`;
- crea varianti manuali come nuove definizioni;
- mantiene collegamenti reciproci prerequisiti/sblocchi;
- mostra una skill tree interna con connessioni e problemi logici.

La pagina e' separata dall'app principale, ma usa la stessa URL/key Supabase e
lo stesso storage auth `blading-manager-auth`.

## Route builder

Il route builder consente di progettare percorsi/campi esercizi.

Elementi supportati:

- conetti;
- cinesini;
- aste;
- ostacoli;
- rampa;
- materassone;
- linee partenza/arrivo;
- area libera;
- freccia;
- punto stop;
- curva obbligata;
- slalom;
- elemento personalizzato.

Persistenza:

- `localStorage` chiave `bladingManagerRoutes:v1`;
- fallback in memoria se `localStorage` non e' disponibile;
- import/export JSON.

Non ha persistenza Supabase.

## Deploy e sviluppo locale

Deploy:

- workflow `.github/workflows/deploy-pages.yml`;
- pubblica `3-gestionale/src`;
- trigger su push `main` e manuale.

Sviluppo locale:

- `3-gestionale/scripts/serve-local.sh`;
- serve `3-gestionale/src` con `python3 -m http.server`;
- porta default `8027`;
- `index.html` redirige da `file://` a `http://localhost:8027/`.

Build legacy:

- `3-gestionale/scripts/build-legacy.mjs`;
- usa `npx esbuild@0.25.5`;
- genera `3-gestionale/src/app-legacy.js`;
- concatena anche route builder e catalogo.

## Asset e output

Asset usati dall'app:

- `logo.png`;
- `icon-ramo-*.png`;
- `mappa-milano-quartieri-dark.png`;
- `mappa-milano-quartieri-dark@2x.png`;
- `.nojekyll`.

Output locali:

- `output/diagrams`: prototipi skill tree;
- `output/mobile-app-bozze`: bozze immagini app mobile;
- `output/ordine`: CSV, SQL e report import lezioni;
- `output/pdf`: PDF derivati;
- `output/playwright`: screenshot QA;
- `tmp`: render temporanei;
- `backups`: archivio `.tar.gz`;
- `.codex-pet-runs`: output generati non legati all'app core.

## Incongruenze e ambiguita osservate

- La documentazione `1-progetto/stato-lavori.md` aggiornata al 2026-06-02 dice
  che `index.html` contiene molte funzioni JS; oggi la logica principale e' in
  `app.js`, mentre `index.html` contiene soprattutto CSS, markup e loader.
- `app.js` e' modificato nel working tree al momento dell'analisi.
- `3-gestionale/scripts/serve-local.sh` e' presente ma non tracciato.
- `.gitignore` ignora `supabase/`, anche se il database e' una parte centrale
  del progetto locale.
- `supabase/migrations` contiene file numerati e timestampati insieme.
- Esistono duplicazioni fra `supabase/migrations`,
  `3-gestionale/db/migrations` e `supabase/pending_questionario`.
- `gestionale-tabs-public` ha una `.git` interna e file non allineati con
  `3-gestionale/src`.
- Il naming `Break`/`Frenata` non e' uniforme.
- Il ramo `Air` e la dimensione `Distacco` non sono rappresentati nello stesso
  modo in tutti i documenti e nel DB.
- Il frontend contiene fallback per colonne DB mancanti, segno che codice e
  schema remoto possono non essere sempre sincronizzati.
- Non risultano test automatici, lint o CI di validazione codice oltre al
  deploy Pages.
- Alcune aree sembrano prototipali o incomplete: route builder non sincronizza
  col DB; note app hanno fallback locale; calendario/appuntamenti salvano molte
  informazioni in metadata/localStorage; output e report non sono consolidati
  come sorgenti.

## Stato architetturale attuale

L'architettura reale e' un prototipo operativo evoluto:

- frontend statico e deploy semplice;
- backend Supabase usato direttamente dal browser;
- logica applicativa molto concentrata in `app.js`;
- route builder parzialmente modularizzato;
- metodologia e DB sviluppati insieme ma non sempre allineati;
- molte compatibilita e fallback gestiti in client;
- documentazione locale utile ma in parte precedente allo stato attuale del
  codice.

Il progetto e' utilizzabile come gestionale statico, ma il confine fra fonte
metodologica, catalogo frontend e dati Supabase non e' ancora definitivo.
