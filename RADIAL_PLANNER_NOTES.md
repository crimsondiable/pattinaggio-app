# RADIAL_PLANNER_NOTES.md

## Cosa e' stato aggiunto

Prima versione sperimentale di `LessonRadialPlanner`, una pagina del gestionale
che visualizza una giornata didattica come anello temporale. Il modulo usa dati
mock locali, non modifica il database e non chiama servizi esterni.

Funzioni incluse:

- vista giornata con anello SVG per blocchi temporali;
- segmenti per lezioni, pause, spostamenti, slot liberi e blocchi personali;
- evidenziazione del blocco corrente e del prossimo blocco in base all'ora;
- click/tap su segmento e lista fallback per aprire il dettaglio;
- vista dettaglio evento/lezione con allievi, luogo, orario, obiettivo, skill,
  esercizi, note, materiali, stato, progress bar, azioni locali, nota rapida e
  checklist;
- mapper `buildWatchLessonPayload(lesson)` per preparare un payload minimale
  serializzabile per wearable/app companion.

## Dove sono i file

- `3-gestionale/src/lesson-radial-planner/lessonRadialModels.js`
- `3-gestionale/src/lesson-radial-planner/mockLessonSchedule.js`
- `3-gestionale/src/lesson-radial-planner/watchPayloadMapper.js`
- `3-gestionale/src/lesson-radial-planner/RadialDayView.js`
- `3-gestionale/src/lesson-radial-planner/LessonTimelineList.js`
- `3-gestionale/src/lesson-radial-planner/LessonDetailPanel.js`
- `3-gestionale/src/lesson-radial-planner/LessonRadialPlannerPage.js`
- `3-gestionale/src/lesson-radial-planner/lessonRadialPlanner.css`

Agganci minimi:

- `3-gestionale/src/index.html`: nav `Planner`, sezione
  `view-lesson-radial-planner`, stylesheet e script loader.
- `3-gestionale/src/app.js`: route interna `lesson-radial-planner` e mount
  `ensureLessonRadialPlannerMounted()`.

## Come aprire la nuova pagina

Avviare il gestionale via server locale:

```bash
3-gestionale/scripts/serve-local.sh
```

Poi aprire:

```text
http://localhost:8027/#lesson-radial-planner
```

In alternativa, dopo il login nel gestionale moderno, usare il pulsante
`Planner` nella nav principale.

## Dati mock

La giornata mock e' costruita in `mockLessonSchedule.js` con fascia 07:00-23:00
e blocchi:

- 08:00-09:00 preparazione;
- 09:30-10:30 lezione singola principiante;
- 10:30-11:00 spostamento;
- 11:00-12:30 lezione doppia;
- 12:30-14:00 pausa;
- 15:00-16:00 slot libero;
- 16:30-18:00 gruppo bambini;
- 18:30-19:30 lezione avanzata;
- 20:00-20:30 note/follow-up.

Le skill mock includono posizione base, limone, frenata a limone, T-stop,
curve a 8, passo incrociato, fakie e monopedale.

## Cosa manca per collegarlo al database

- Definire una query reale sulle lezioni del giorno, probabilmente partendo da
  `lezioni`, `lezioni_allievi`, `lezioni_skills` e `locations`.
- Decidere dove salvare blocchi non-lezione: pause, spostamenti, blocchi
  personali e slot liberi oggi non hanno una fonte canonica unica.
- Convertire le lezioni reali con
  `LessonRadialModels.mapGestionaleLessonToRadialEvent(lesson)`.
- Allineare gli stati: il gestionale usa anche valori come `aperta`/`chiusa`,
  mentre il planner usa `planned`, `active`, `completed`, `cancelled`.
- Stabilire se nota rapida e checklist sono solo stato operativo locale o dati
  persistenti.

## Cosa manca per Amazfit/app companion

- Endpoint API autenticato per ricevere/esporre `WatchLessonPayload`.
- Scelta del canale di sincronizzazione: push da gestionale, polling app
  companion, o sync mediato da backend.
- Contratto stabile per `quickActions` e aggiornamenti di stato provenienti dal
  wearable.
- Gestione offline, conflitti e timestamp `updatedAt`.
- Riduzione payload per schermi piccoli e limiti del dispositivo.

## Rischi tecnici

- `app.js` resta un modulo globale molto grande: gli agganci sono minimi, ma le
  viste sono ancora registrate in liste ripetute.
- `app-legacy.js` non e' stato rigenerato; il planner e' pensato per il
  gestionale moderno.
- La pagina usa mock data: non verifica ancora permessi RLS, latenza Supabase o
  dati incompleti reali.
- Gli stati locali di azioni/checklist non persistono al refresh.
- La resa radiale su giornate molto dense andra' verificata con dati reali.

## Prossimi step consigliati

1. Collegare una prima query read-only alle lezioni del giorno, con fallback ai
   mock se Supabase non restituisce dati.
2. Definire una tabella o struttura locale per blocchi non-lezione.
3. Aggiungere filtro data/fascia oraria 24h oppure 07:00-23:00.
4. Stabilizzare `WatchLessonPayload` con versione schema.
5. Testare mobile e vista orologio con payload ridotto.
