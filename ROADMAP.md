# Roadmap — Local-first sync

## Contesto

L'app deve funzionare offline-first: i dati risiedono nel `localStorage` del browser e vengono sincronizzati con Supabase quando la connessione è disponibile. La sincronizzazione avviene via REST con debounce, senza WebSocket.

---

## Fase 1 — Schema DB su Supabase

**Obiettivo:** definire le tabelle che rispecchiano i tipi già modellati in `src/lib/time/types.ts`.

### Tabelle

**`day_records`**
| colonna | tipo | note |
|---|---|---|
| `id` | `uuid` PK | generato lato DB |
| `user_id` | `uuid` FK → `auth.users` | RLS per isolamento |
| `date` | `date` | chiave logica per utente |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | aggiornato da trigger |

**`work_slots`**
| colonna | tipo | note |
|---|---|---|
| `id` | `uuid` PK | |
| `day_record_id` | `uuid` FK → `day_records` | cascade delete |
| `user_id` | `uuid` FK → `auth.users` | RLS |
| `kind` | `text` | `"entry"` \| `"placeholder"` |
| `sort_order` | `integer` | ordine degli slot nel giorno |
| `start_time` | `time` | nullable, solo per `kind="entry"` |
| `end_time` | `time` | nullable, solo per `kind="entry"` |
| `placeholder_type` | `text` | nullable: `"leave"` \| `"sick"` \| `"holiday"` \| `"other"` |
| `placeholder_label` | `text` | nullable |
| `start_date` | `date` | nullable, per range placeholder |
| `end_date` | `date` | nullable, per range placeholder |
| `hours_per_day` | `numeric` | nullable, override ore/giorno |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**`user_settings`**
| colonna | tipo | note |
|---|---|---|
| `user_id` | `uuid` PK FK → `auth.users` | |
| `default_hours_per_day` | `numeric` | default 8 |
| `extra_holidays` | `jsonb` | array di `"YYYY-MM-DD"` |
| `working_overrides` | `jsonb` | array di `"YYYY-MM-DD"` |
| `non_working_days_of_week` | `jsonb` | array di interi 1-7 |
| `updated_at` | `timestamptz` | |

### Tasks
- [ ] Scrivere le migration SQL con RLS policies (`user_id = auth.uid()`)
- [ ] Aggiungere trigger `updated_at` su `work_slots` e `day_records`
- [ ] Testare le policy con utenti diversi

---

## Fase 2 — Serializzazione localStorage

**Obiettivo:** layer che legge/scrive i `DayRecord[]` nel localStorage in modo strutturato, mantenendo solo settimana corrente e precedente.

### Struttura chiave
```
timetables:records:<YYYY-Www>   →  DayRecord[] (serializzato JSON)
timetables:settings             →  WorkdayConfig
timetables:sync:<YYYY-Www>      →  { lastSyncedAt: ISO string, dirty: boolean }
```

### Funzioni da scrivere (`src/lib/storage/`)
- `loadWeek(weekKey)` → `DayRecord[]`
- `saveWeek(weekKey, records)` → void
- `markDirty(weekKey)` → void — chiamata ad ogni modifica locale
- `markSynced(weekKey)` → void — chiamata dopo sync riuscita
- `isDirty(weekKey)` → boolean
- `pruneOldWeeks()` → void — mantiene solo le ultime 2 settimane, chiamata al mount
- `loadSettings()` / `saveSettings(config)` → `WorkdayConfig`

### Serializzazione Temporal
`PlainTime`, `PlainDate`, `Duration` non sono serializzabili nativamente. Serve un layer `toJSON` / `fromJSON` che li converta in stringhe ISO prima di `JSON.stringify`.

### Tasks
- [ ] Implementare `src/lib/storage/localStore.ts` con le funzioni sopra
- [ ] Implementare `src/lib/storage/serialization.ts` per i tipi Temporal
- [ ] Unit test su serializzazione (round-trip `DayRecord` → JSON → `DayRecord`)
- [ ] Unit test su pruning (verifica che venga rimossa solo la terza settimana indietro)

---

## Fase 3 — Sync engine (REST + debounce)

**Obiettivo:** sincronizzare localStorage → Supabase con debounce, gestendo conflitti e retry in assenza di connessione.

### Flusso

```
modifica UI
    │
    ▼
saveWeek() + markDirty()
    │
    ▼
syncScheduler.schedule(weekKey)   ← debounce 3s
    │
    ▼ (se online)
pushWeek(weekKey)
    │ ├─ successo → markSynced() + aggiorna indicatore
    │ └─ errore rete → mette in coda, riprova al prossimo evento "online"
    │
    ▼ (se offline)
listener su window "online"
    └─ flush della coda → pushWeek() per ogni settimana dirty
```

### Strategia conflitti
**Last-write-wins su `updated_at`**: il client invia sempre l'intero `DayRecord` della settimana con il timestamp locale. Il DB aggiorna solo se `updated_at` del client è ≥ quello in DB. Sufficiente per un'app single-user.

### Funzioni da scrivere (`src/lib/sync/`)
- `pushWeek(weekKey)` → chiama Supabase upsert su `day_records` + `work_slots`
- `pullWeek(weekKey)` → legge da Supabase e aggiorna localStorage se più recente
- `syncScheduler` — gestisce debounce (3 secondi) e coda offline
- `flushDirtyWeeks()` — chiamata al mount e al ritorno della connessione

### Debounce
3 secondi è il valore di partenza: abbastanza lungo da non generare una chiamata per ogni tasto premuto su un campo orario, abbastanza corto da garantire sync entro pochi secondi dall'ultima modifica.

### Tasks
- [ ] Implementare `src/lib/sync/push.ts`
- [ ] Implementare `src/lib/sync/pull.ts`
- [ ] Implementare `src/lib/sync/scheduler.ts` con debounce + coda offline
- [ ] Gestire `window` `online`/`offline` events
- [ ] Unit test su scheduler (mock fetch, verifica debounce e flush)
- [ ] Integration test con Supabase local (via `supabase start`)

---

## Fase 4 — Hook React e stato di sync

**Obiettivo:** esporre lo stato di sincronizzazione ai componenti tramite un hook, alimentare l'indicatore visivo.

### `useSyncStatus` hook
```ts
type SyncStatus =
  | { state: "synced" }
  | { state: "pending" }   // modifiche locali, sync non ancora partita
  | { state: "syncing" }   // chiamata in corso
  | { state: "error"; error: Error }
  | { state: "offline" }   // nessuna connessione
```

### `useWeekRecords` hook
```ts
// Legge da localStorage, scrive su localStorage + schedula sync
function useWeekRecords(weekKey: string): {
  records: DayRecord[];
  updateSlot: (date: PlainDate, slots: WorkSlot[]) => void;
  syncStatus: SyncStatus;
}
```

### Tasks
- [ ] Implementare `src/hooks/useSyncStatus.ts`
- [ ] Implementare `src/hooks/useWeekRecords.ts`
- [ ] Collegare `syncScheduler` allo stato React senza accoppiamento diretto (event emitter leggero o `useSyncExternalStore`)

---

## Fase 5 — Indicatore salvataggio/connessione (UI)

**Obiettivo:** componente visivo che mostra lo stato di sync in tempo reale.

### Stati visivi

| `SyncStatus` | Icona suggerita | Label |
|---|---|---|
| `synced` | `cloud-on` ✓ | "Salvato" |
| `pending` | `cloud-off` … | "In attesa" |
| `syncing` | `refresh` (animato) | "Salvataggio…" |
| `error` | `cloud-off` ✗ | "Errore sync" |
| `offline` | `cloud-off` | "Offline" |

Le icone esistono già nel componente `Icon` (`cloud-on`, `cloud-off`, `refresh`).

### Tasks
- [ ] Implementare `src/app/components/SyncIndicator/SyncIndicator.tsx`
- [ ] Aggiungere `SyncIndicator` al layout (header o footer)
- [ ] Story Storybook per tutti gli stati

---

## Fase 6 — Guardia "unsaved changes" all'uscita

**Obiettivo:** se l'utente prova a chiudere/ricaricare la pagina con sync pendente, mostrare conferma.

### Comportamento
- `beforeunload` → se `SyncStatus` è `"pending"` o `"syncing"`, mostra il dialog nativo del browser ("Vuoi uscire? Le modifiche potrebbero non essere state salvate.")
- Navigazione interna Next.js (cambio route) → intercettare con `router.events` o App Router equivalent e mostrare un dialog custom se dirty

### Tasks
- [ ] Hook `useBeforeUnload(isDirty: boolean)` che registra/deregistra il listener
- [ ] Gestione navigazione interna con App Router (Next.js 14 non espone `router.events` — valutare `usePathname` + `useEffect` o middleware)

---

## Dipendenze tra fasi

```
Fase 1 (DB schema)
    │
    ├──▶ Fase 2 (localStorage) ──▶ Fase 4 (hooks) ──▶ Fase 5 (UI indicatore)
    │                                                        │
    └──▶ Fase 3 (sync engine) ─────────────────────────▶ Fase 6 (guardia uscita)
```

Fase 2 e Fase 3 possono procedere in parallelo una volta definito lo schema. Fase 4 richiede entrambe.

---

## Fuori scope (per ora)

- Sync real-time via Supabase Realtime/WebSocket
- Risoluzione conflitti multi-device avanzata (merge a livello di slot)
- Storico delle versioni / undo remoto
- Vista mese (roadmap separata)
