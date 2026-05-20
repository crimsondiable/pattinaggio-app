# Blading Manager Design System Migration

Fonte: `3-gestionale/src/index.html`
File Figma: https://www.figma.com/design/y6Qxjpln7ts4YLyZEOgppX

Questo documento e' la prima migrazione ordinata degli elementi gia presenti nel prototipo "Big Ball of Mud" verso un design system Figma. L'obiettivo e' conservare cio' che funziona ora, ma renderlo trasferibile in una versione seria, responsive e componibile.

## Stato Figma

- File creato: `Blading Manager Design System`
- File key: `y6Qxjpln7ts4YLyZEOgppX`
- Stato iniziale ispezionato: una pagina vuota, nessun token, nessuno stile, nessun componente.
- Blocco attuale: il tool Figma ha raggiunto il limite MCP del piano Starter dopo la creazione/ispezione del file.
- Tentativo del 2026-05-19: il blocco MCP Starter e' ancora attivo, quindi non e' stato possibile scrivere nel file Figma.
- Bootstrap pronto: `3-gestionale/figma/design-system-foundations.use-figma.js`.
- Bypass MCP pronto: plugin locale Figma in `3-gestionale/figma/blading-manager-local-plugin/`.
- Il plugin locale crea anche i componenti dei pallini di progresso apprendimento derivati dal prototipo `Aggressive tricks` / gestionale public.

## Fondazioni

### Colori

| Token | Valore | Uso attuale |
| --- | --- | --- |
| `color.accent.cyan` | `#6ee7f9` | Azioni, stato attivo, link, focus, tab attivi |
| `color.accent.cyan-strong` | `#22b8cf` | Gradiente bottoni primari, progressi |
| `color.accent.cyan-soft` | `rgba(110,231,249,.13)` | Hover, selezioni leggere, nav active |
| `color.text.primary` | `#eef7fb` | Testo principale |
| `color.text.muted` | `#8fa4ad` | Metadata, label secondarie, empty state |
| `color.border.default` | `rgba(148,163,184,.22)` | Card, campi, separatori |
| `color.background.page` | `#081116` | Sfondo app |
| `color.surface.base` | `#101b22` | Superfici principali |
| `color.surface.panel` | `#13242c` | Modali e pannelli pieni |
| `color.surface.panel-soft` | `#0d1920` | Input, righe, blocchi interni |
| `color.status.danger` | `#fb7185` | Errori, azioni distruttive |
| `color.status.success` | `#7dd3a8` | Conferme, stati completati |
| `color.stage.0` | `#94a3b8` | Skill non avviata |
| `color.stage.1` | `#facc15` | Skill in avvio |
| `color.stage.2` | `#67e8f9` | Skill in raffinamento |
| `color.stage.3` | `#86efac` | Skill consolidata |

### Radius

| Token | Valore | Uso |
| --- | --- | --- |
| `radius.sm` | `4px` | Badge piccoli, ramo |
| `radius.md` | `8px` | Default: card, bottoni, campi, blocchi |
| `radius.lg` | `12px` | Modali |
| `radius.pill` | `20px` | Chip |

### Spacing

Scala iniziale da portare in Figma:

| Token | Valore |
| --- | --- |
| `space.1` | `4px` |
| `space.2` | `6px` |
| `space.3` | `8px` |
| `space.4` | `10px` |
| `space.5` | `12px` |
| `space.6` | `16px` |
| `space.7` | `18px` |
| `space.8` | `24px` |
| `space.9` | `28px` |
| `space.10` | `40px` |

### Tipografia

Famiglia: system UI.

| Stile | Size | Weight | Uso |
| --- | --- | --- | --- |
| `type.caption` | `11-12px` | `700-800` | Label uppercase, intestazioni tabellari |
| `type.body-sm` | `13px` | `400-600` | Righe compatte, metadati |
| `type.body` | `14px` | `400-600` | Testo UI principale |
| `type.section` | `16-17px` | `700` | Titoli sezioni e sottopannelli |
| `type.title` | `22-23px` | `750-800` | Header scheda e pagina |

Regola: i label funzionali restano piccoli e scansionabili; i titoli grandi solo nelle viste principali, non dentro pannelli compatti.

## Componenti V1

### Button

Varianti:

- `primary`: gradiente cyan, testo scuro, shadow glow.
- `outline`: bordo visibile, fondo trasparente leggero.
- `ghost`: azione secondaria, colore muted.
- Size: `sm`, `default`, `full`.
- Stati: `default`, `hover`, `active`, `disabled`, `focus`.

### Field

Varianti:

- `text`
- `select`
- `textarea`
- `readonly`
- `focus`
- `error` da aggiungere come stato formale, oggi non ancora sistematizzato.

Struttura:

- label uppercase piccolo
- controllo con `surface.panel-soft`
- bordo `border.default`
- focus ring cyan soft

### Card / Panel

Varianti:

- `card.default`: superficie principale, bordo, shadow.
- `card.inner`: blocco interno senza shadow pesante.
- `empty-state`: stessa struttura di card, testo muted centrato.

### Chip / Badge

Varianti:

- `chip.default`
- `chip.hover`
- `chip.selected`
- `badge.stage.0`
- `badge.stage.1`
- `badge.stage.2`
- `badge.stage.3`
- `badge.associazione`
- `badge.ramo`

### Tabs

Varianti:

- `default`
- `hover`
- `active`

Uso: schede allievo e viste con sezioni progressive. Layout lineare, bordo inferiore, indicatore cyan.

### Lesson Detail

Componenti da estrarre:

- `lesson.header`
  - sinistra: nome gruppo/allievo
  - destra: abbreviazione giorno + data
  - sotto data: ora/luogo se disponibili
- `lesson.participant-row`
  - ordine: nick, nome cognome, gruppo
  - righe compatte con separatore sottile
- `lesson.plan-table`
  - sezioni: teoria, riscaldamento, lezione, gioco
  - mostra empty state se non ci sono dati
- `lesson.skill-list`
  - stessa grafica di `lesson.plan-table`
- `lesson.note`
  - blocco statico leggibile

### Data Views

Componenti candidati:

- `table.wrapper`
- `table.header`
- `table.row`
- `lessons.year-row`
- `lessons.month-group`
- `student.card-row`
- `modal`
- `rating.dots`
- `rating.scale-5`
- `stat.tile`

## Layout Responsivo

### Desktop

- Larghezza contenuto vincolata.
- Header app fisso in alto.
- Viste operative in griglie a due colonne quando il contenuto lo richiede.
- Scheda lezione: colonna sinistra partecipanti, colonna destra lezione + skill.

### Mobile

Breakpoint principali gia presenti: `760`, `700`, `600`, `560`, `520`, `480`.

Regole da portare nel design system:

- Le griglie diventano una colonna.
- Header lezione passa da due colonne a blocco verticale.
- Data/luogo si allineano a sinistra.
- Bottoni e tab riducono padding e font, senza cambiare struttura.
- Tabelle operative vanno pensate come liste compatte o righe scrollabili, non come desktop compresso a forza.

## Priorita' Di Migrazione

1. Creare in Figma le pagine: `Foundations`, `Components`, `Patterns`, `Layouts`.
2. Creare variabili colore, radius, spacing e shadow.
3. Creare stili tipografici base.
4. Creare componenti atomici: button, field, card, chip, badge, tabs.
5. Creare pattern: lesson header, participant row, lesson block/table, empty state.
6. Creare due layout dimostrativi:
   - desktop: scheda lezione
   - mobile: scheda lezione
7. Solo dopo, usare questi componenti per ridisegnare le tab principali del gestionale.

## Bootstrap Figma Pronto

Il primo script operativo e' in `3-gestionale/figma/design-system-foundations.use-figma.js`.

Quando il limite MCP Figma si sblocca, eseguirlo con `use_figma` sul file key `y6Qxjpln7ts4YLyZEOgppX`.

Alternativa senza MCP: importare in Figma il manifest locale
`3-gestionale/figma/blading-manager-local-plugin/manifest.json` da
`Plugins > Development > Import plugin from manifest...`, poi eseguire
`Blading Manager Design System Bootstrap` dal menu `Plugins > Development`.

Lo script crea o aggiorna in modo idempotente:

- pagine: `Cover`, `Getting Started`, `Foundations`, `---`, `Components`, `Patterns`, `Layouts`, `Utilities`;
- collezioni variabili: `BM / Colors`, `BM / Radius`, `BM / Spacing`;
- token colore, radius e spacing della sezione Fondazioni;
- effect styles `shadow.card` e `shadow.modal`;
- text styles `type.caption`, `type.body-sm`, `type.body`, `type.section`, `type.title`.

Passaggio successivo dopo il bootstrap:

1. validare in Figma che variabili e stili siano comparsi correttamente;
2. creare la documentazione visiva della pagina `Foundations`;
3. iniziare i componenti atomici uno per volta, partendo da `Button`.

## Note Architetturali

Questo design system deve nascere dal prototipo attuale, non da un redesign astratto. Il gestionale futuro dovra' supportare:

- allievi
- gruppi
- lezioni
- tuning
- questionario skill
- suggerimenti automatici
- automazioni future sulle skill
- stati skill tipo `v / f / r / t / s` e successive estensioni

Per ora la cosa importante e' rendere usabile il gestionale attuale e isolare il linguaggio UI in componenti riutilizzabili.
