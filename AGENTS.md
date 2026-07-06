# AGENTS.md

Guida operativa per agenti e manutentori che lavorano in questo repository.
Descrive lo stato osservato del progetto al 2026-07-04, non una architettura
desiderata.

## Prima di modificare

- Leggere `PROJECT.md` per il quadro generale.
- Considerare `3-gestionale/src` la sorgente pubblicabile dell'app statica.
- Considerare `supabase/migrations` la sorgente canonica del database, anche se
  oggi e' ignorata da Git.
- Non usare `gestionale-tabs-public` come sorgente: e' una copia/repo parallelo
  non allineato.
- Non trattare `output`, `tmp`, `backups`, `.codex-pet-runs` o `.worktrees`
  come codice primario. Sono output, temporanei, backup o aree di lavoro.
- Il repository puo' essere sporco. Prima di cambiare file, controllare
  `git status --short --branch` e non sovrascrivere modifiche esistenti.

## Stato Git osservato

Al momento dell'analisi:

- branch: `main`, tracciato su `origin/main`;
- modificato: `3-gestionale/src/app.js`;
- non tracciato: `3-gestionale/scripts/serve-local.sh`;
- `AGENTS.md` e `PROJECT.md` vengono aggiunti come documentazione.

## Struttura da conoscere

- `README.md`: nota minima sul deploy GitHub Pages.
- `index.html`: redirect statico verso `3-gestionale/src/`.
- `.github/workflows/deploy-pages.yml`: pubblica `3-gestionale/src` su GitHub
  Pages.
- `1-progetto/`: documentazione locale di inventario, stato lavori e piano di
  pulizia. E' ignorata da Git.
- `2-metodologia/`: fonti metodologiche, biomeccanica, skill tree, manovre,
  prototipi HTML. E' ignorata da Git.
- `3-gestionale/src/`: app web statica pubblicabile.
- `3-gestionale/src/route-builder/`: unico sottosistema realmente separato in
  file JS dedicati.
- `3-gestionale/db/migrations/`: copie/staging di migrazioni, non fonte
  primaria.
- `supabase/migrations/`: migrazioni Supabase da trattare come fonte primaria.
- `supabase/pending_questionario/`: copie/staging delle migrazioni
  questionario.
- `gestionale-tabs-public/`: repo statico parallelo con `.git` interna e file
  non allineati.
- `output/`: report, CSV, PDF, screenshot, prototipi e pacchetti generati.

## Tecnologie effettive

L'app pubblicata e' statica:

- HTML, CSS e JavaScript vanilla.
- Script UMD caricati da CDN, non bundler runtime.
- Supabase JS v2 per il percorso moderno.
- Supabase JS v1 e `app-legacy.js` come fallback legacy.
- `anime.js` usato dal gestionale moderno.
- `localStorage` usato per preferenze, bozze, disponibilita, percorsi e fallback
  quando lo storage o il DB non sono disponibili.
- Supabase/Postgres come backend remoto.
- GitHub Pages come hosting.
- Script locali Node `.mjs` per build legacy e generazione icone.
- Script shell `serve-local.sh` per servire `3-gestionale/src` su
  `http://localhost:8027/`.

Non esiste un `package.json` alla root, ne una suite test configurata.

## Convenzioni frontend esistenti

- `index.html` contiene CSS, markup delle viste, modali e loader degli script.
- `app.js` contiene quasi tutta la logica applicativa in scope globale.
- Molte azioni sono collegate tramite attributi inline (`onclick`, `onchange`,
  `oninput`) nel markup o in HTML generato da stringhe.
- Le funzioni dichiarate in `app.js` sono API globale della pagina perche lo
  script non e' un modulo ES.
- I moduli del route builder espongono oggetti/classi su `window`, per esempio
  `window.RouteModels`, `window.RouteStorage`, `window.RouteBuilderPage`.
- Lo stile usa variabili CSS in `:root`, tema scuro, card/pannelli, bottoni
  `.btn`, messaggi `.msg` e viste `<section id="view-...">`.
- La compatibilita DB e' spesso gestita nel frontend con retry/fallback quando
  mancano colonne recenti.

## Come avviare localmente

Aprire l'app tramite server HTTP, non via `file://`.

Comando disponibile:

```bash
3-gestionale/scripts/serve-local.sh
```

Default:

- host: `127.0.0.1`;
- porta: `8027`;
- root servita: `3-gestionale/src`;
- URL: `http://localhost:8027/`.

`3-gestionale/src/index.html` redirige automaticamente da `file://` a
`http://localhost:8027/`.

## Build legacy

`3-gestionale/scripts/build-legacy.mjs` concatena catalogo, route-builder e
`app.js`, aggiunge polyfill e genera `3-gestionale/src/app-legacy.js` usando:

```bash
npx --yes esbuild@0.25.5 ...
```

Questo comando richiede rete se `esbuild` non e' gia disponibile in cache.
Non eseguirlo automaticamente se la richiesta non lo richiede.

## Deploy

Il deploy GitHub Pages e' in `.github/workflows/deploy-pages.yml`.

Comportamento:

- trigger su push a `main` e `workflow_dispatch`;
- checkout;
- configure Pages;
- upload artifact dalla cartella `3-gestionale/src`;
- deploy Pages.

La root del repository non viene pubblicata, salvo il redirect locale
`index.html` quando usata direttamente.

## Database e Supabase

Il frontend usa direttamente Supabase dal browser con publishable key presente
in `app.js` e `skill-questionario.html`.

Tabelle chiamate dal codice:

- `allievi`
- `allievi_condivisi`
- `app_notes`
- `lezioni`
- `lezioni_allievi`
- `lezioni_skills`
- `locations`
- `prerequisiti_skill`
- `progressi_allievo`
- `skill_definizioni`
- `skills`
- `tuning_risposte`

Funzioni/RLS note:

- gestione multi-maestro e condivisione allievi;
- super maestro hardcoded nel frontend come `francesco.grinovero@gmail.com`;
- policy RLS su molte tabelle;
- hardening di grant/execute;
- `notify pgrst, 'reload schema'` in alcune migrazioni recenti.

Le migrazioni hanno incongruenze:

- `supabase/migrations` contiene sia file timestampati sia file numerati
  `0018-0022`;
- `3-gestionale/db/migrations` replica molte migrazioni numerate;
- `supabase/pending_questionario` replica `0018-0021`;
- alcune migrazioni creano/alterano le stesse tabelle in piu passaggi
  (`locations`, `app_notes`, `skill_definizioni`).

## Aree funzionali dell'app

Viste principali presenti nel markup:

- `allievi`
- `scheda`
- `gruppo`
- `lezioni`
- `calendario`
- `appuntamenti`
- `location`
- `mappa`
- `lezione`
- `percorsi`
- `nuova-lezione`
- `nuovo-allievo`
- `nuovo-gruppo`
- `skills`
- `tuning`
- `app-notes`

Pagina separata:

- `skill-questionario.html`.

Funzioni osservate:

- login/logout Supabase;
- elenco, scheda, creazione, modifica, archiviazione, import/export allievi;
- gruppi, membri, referenti e logistica;
- lezioni individuali, gruppo e campo libero;
- stato lezione aperta/chiusa, meteo/check, note, partecipanti, skill lavorate;
- aggiornamento progressi da skill lavorate;
- suggerimenti skill/ripasso;
- calendario settimanale e generazione appuntamenti;
- disponibilita maestro/allievi/gruppi in `localStorage` e profilo allievo;
- location normalizzate, mappa Milano, coordinate locali/remote;
- catalogo skill, dettaglio skill, creazione/cancellazione/sostituzione skill;
- tuning risposte su parametri, requisiti, progressione e livelli;
- note operative app;
- editor percorsi/campo esercizi con salvataggio locale e JSON.

## Route builder

Il route builder e' il sottosistema piu modulare.

File:

- `routeModels.js`: modelli percorso, canvas, elementi, normalizzazione.
- `routeStorage.js`: persistenza `localStorage` con fallback in memoria.
- `routeJsonUtils.js`: import/export JSON.
- `ElementPalette.js`: palette elementi.
- `CanvasArea.js`: canvas drag/drop, pan, zoom, selezione.
- `ElementPropertiesPanel.js`: pannello proprieta elemento.
- `RouteToolbar.js`: titolo, metadati, canvas, salvataggio, import/export.
- `RouteBuilderPage.js`: orchestrazione.

Non salva su Supabase.

## Skill tree e metodologia

`3-gestionale/src/skilltree-catalog.js` definisce `window.SKILLTREE_NODES`.
Il catalogo osservato contiene 92 nodi distribuiti su:

- `stance`
- `gait`
- `break`
- `rotation`
- `air`

Il questionario converte questi rami in etichette italiane:

- `Equilibrio`
- `Andatura`
- `Frenata`
- `Rotazione`
- `Air`
- `Extra`

Nota: il documento metodologico piu vecchio parla di quattro rami e colloca
`Salto base / distacco` dentro Rotation; il catalogo frontend attuale ha invece
un ramo `air`.

## Cose da non inventare

Se una modifica richiede informazioni non presenti nel repo:

- non assumere un modello dati definitivo fra `skills`, `skill_definizioni`,
  documenti metodologia e catalogo JS;
- non assumere che `gestionale-tabs-public` sia aggiornato;
- non assumere che tutte le migrazioni siano applicate al progetto remoto;
- non assumere che `app-legacy.js` sia rigenerato automaticamente;
- non assumere che i prototipi in `output` siano sorgente viva;
- non assumere che esistano test automatici.

## Ambiguita e debito tecnico da preservare nei documenti

- `app.js` e' un grande modulo globale con molto stato condiviso.
- La documentazione del 2026-06-02 diceva che `index.html` conteneva molte
  funzioni JS; oggi la logica principale e' in `app.js`.
- Il titolo dell'app contiene esplicitamente `Big Ball of Mud` / `BBoM`.
- `Break` e `Frenata` convivono come naming.
- `Air` e `Distacco` sono modellati in modo non del tutto uniforme fra
  metodologia, DB e catalogo.
- Le skill `fakie` sono state neutralizzate/nascoste in alcune migrazioni, ma
  il frontend conserva dimensioni/fakie come metadati di lavorazione.
- Il DB ha fallback di compatibilita nel frontend per colonne mancanti.
- Alcuni output/report in `output/ordine` sono importanti come storico, ma non
  sono sorgente applicativa.

