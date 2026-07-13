# Progressi per modalità e provenienza

Stato: proposta tecnica, non applicata.

Data: 2026-07-14.

Ambito: `progressi_allievo`, `lezioni_skills`, progressi manuali e
`allievi.profilo.fakie_progress`.

## Obiettivo

Rendere Frontale e Fakie due progressi indipendenti della stessa skill e usare
sempre `lezioni.data` come data delle skill lavorate. Creazione, modifica e
cancellazione di una lezione devono ricalcolare soltanto le coppie
allievo/skill/modalità coinvolte senza perdere progressi manuali o legacy.

## Stato verificato

- `progressi_allievo` ammette una sola riga per allievo/skill e non registra
  modalità o provenienza.
- Fakie è conservato anche in `allievi.profilo.fakie_progress`.
- Il trigger `sync_progressi_da_lezione()` non distingue `lezioni_skills.fakie`.
- Il frontend può cancellare il risultato del trigger e reinserirlo usando la
  data di salvataggio.
- Simulazione remota read-only del 2026-07-14:
  - 159 progressi attuali;
  - 136 coppie Frontale ricostruibili dalle sole lezioni non-Fakie;
  - 26 baseline manuali/legacy da preservare;
  - 159 progressi Frontale finali nella simulazione conservativa;
  - 131 invariati e 28 con date/stato da riallineare;
  - 5 progressi Fakie finali ottenuti unendo lezioni e JSON;
  - un record Frontale è ambiguo perché non ha lezioni Frontali e coincide con
    il corrispondente dato Fakie: richiede conferma manuale prima del backfill.

## Modello target

### 1. Proiezione `progressi_allievo`

`progressi_allievo` resta il riepilogo veloce letto dall'applicazione, ma non è
più la fonte primaria delle evidenze.

Modifiche previste:

- aggiungere `modalita text not null default 'frontale'`;
- vincolare `modalita` a `frontale` o `fakie`;
- sostituire l'unicità `(allievo_id, skill_id)` con
  `(allievo_id, skill_id, modalita)`;
- mantenere stadio e tre date come risultato del ricalcolo;
- impedire progressivamente le scritture dirette del browser sulla proiezione.

L'indice univoco composto copre le ricerche per allievo/skill/modalità. Gli
indici esistenti per allievo e skill restano da valutare con `EXPLAIN` prima di
rimuoverli.

### 2. Evidenze non derivate da lezioni

Creare una tabella `progressi_evidenze` per i soli contributi manuali o legacy.
Le lezioni restano canoniche in `lezioni` + `lezioni_skills` e non vengono
duplicate nella nuova tabella.

Campi proposti:

| Campo | Scopo |
| --- | --- |
| `id uuid` | Chiave primaria |
| `allievo_id uuid` | FK `allievi(id) ON DELETE CASCADE` |
| `skill_id uuid` | FK `skills(id) ON DELETE RESTRICT` |
| `modalita text` | `frontale` o `fakie` |
| `origine text` | `manuale` o `legacy_importato` |
| `stadio smallint` | Valore 1-3 |
| `data_inizio date` | Prima evidenza di stadio almeno 1 |
| `data_acquisizione date` | Prima evidenza di stadio almeno 2 |
| `data_perfezionamento date` | Prima evidenza di stadio 3 |
| `note text` | Nota dell'operatore o della migrazione |
| `registrato_da uuid` | Utente che ha creato/corretto l'evidenza |
| `creato_il`, `aggiornato_il` | Metadata, mai date didattiche |

Vincoli proposti:

- stadio compreso fra 1 e 3;
- modalità e origine limitate ai valori previsti;
- date, quando presenti, in ordine cronologico;
- unicità `(allievo_id, skill_id, modalita, origine)` nella prima versione;
- indici sulle FK e sulla chiave di ricalcolo.

La tabella deve avere RLS attiva. Le policy iniziali devono seguire lo stesso
confine di accesso dell'allievo senza ampliare i privilegi esistenti. Grants e
RLS devono essere definiti insieme e verificati con gli advisor Supabase.

### 3. Ricalcolo della proiezione

Per una coppia allievo/skill/modalità il ricalcolo unisce:

1. righe `lezioni_skills` della modalità richiesta, con data presa da
   `lezioni.data` e `allievo_id` non nullo;
2. righe `progressi_evidenze` manuali o legacy della stessa modalità.

Il risultato contiene:

- stadio massimo;
- minima data con stadio almeno 1;
- minima data con stadio almeno 2;
- minima data con stadio 3.

Se non resta alcuna evidenza, la riga della proiezione viene eliminata. Lezioni
`aperta` e `chiusa` usano entrambe la propria `lezioni.data`. Campo libero senza
allievo non partecipa al ricalcolo.

La funzione interna deve:

- lavorare in una transazione breve;
- bloccare/aggiornare le coppie in ordine stabile;
- avere `search_path` fissato e privilegi minimi;
- non essere esposta come RPC pubblica senza autorizzazione esplicita;
- essere verificata con RLS, grants e database advisors.

## Strategia di migrazione proposta

1. Esportare snapshot e checksum di `progressi_allievo`, `lezioni`,
   `lezioni_skills` e dei JSON Fakie.
2. Creare in modo additivo `progressi_evidenze` e la colonna `modalita`.
3. Marcare le 159 righe esistenti come Frontale senza cancellarle.
4. Copiare nelle evidenze soltanto le baseline manuali/legacy che aggiungono
   informazione rispetto alle lezioni Frontali.
5. Copiare i quattro progressi Fakie JSON come evidenze manuali/legacy e unirli
   alle quattro coppie Fakie ricostruite dalle lezioni, ottenendo cinque
   progressi Fakie finali.
6. Sottoporre a conferma il singolo record Frontale ambiguo prima di preservarlo
   o classificarlo come duplicazione Fakie.
7. Ricalcolare la proiezione e confrontare conteggi, stadi e date con la
   simulazione read-only.
8. Aggiornare il frontend: lettura per modalità, editor manuale sulle evidenze,
   eliminazione del doppio aggiornamento post-lezione.
9. Verificare creazione, modifica, cancellazione e rollback per entrambe le
   modalità.
10. Rimuovere il JSON Fakie soltanto in una migrazione successiva, dopo almeno
    una verifica completa dell'applicazione.

## Rollback e criteri di accettazione

La prima migrazione deve essere additiva: nessun dato originario o JSON Fakie
viene eliminato. Il passaggio è accettabile soltanto se:

- nessun progresso manuale/legacy scompare;
- Frontale e Fakie non si aggiornano reciprocamente;
- tutte le date derivate da lezioni coincidono con `lezioni.data`;
- cancellare o modificare una lezione ricalcola solo le coppie interessate;
- un errore lascia invariati lezione, relazioni e proiezione;
- utente non autorizzato non può modificare evidenze o proiezioni altrui;
- la ricostruzione ripetuta è idempotente.

## Fuori ambito per questa proposta

- applicazione al database remoto;
- eliminazione dei dati JSON esistenti;
- modifica immediata del frontend;
- scelta automatica sul singolo record Frontale/Fakie ambiguo;
- migrazione attiva con timestamp definitivo.
