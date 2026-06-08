# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint via Next.js
npm run storybook    # Storybook component explorer at http://localhost:6006
npm run build-storybook
npm test             # Vitest (run once)
npm run test:watch   # Vitest in watch mode
npm run test:ui      # Vitest browser UI
```

Tests live alongside source files as `*.test.ts`. Vitest config is in [`vitest.config.ts`](vitest.config.ts).

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript 5.9, SCSS modules, Supabase, Zustand 5, Storybook 8.

**Supabase:** The client and auth helpers live in [`supabaseClient.ts`](supabaseClient.ts) at the project root. `supabaseAuth` wraps auth operations (`login`, `signUp`, `getSession`, `signOut`, `onAuthStateChange`) and returns `[error, data]` tuples. Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars.

**Component system (`src/app/components/`):** Components use a dispatch pattern — a top-level component selects the right variant via a map:

- `Input` → dispatches to `BasicInput` or `Password` based on `type` prop. Supported types: `"text"`, `"email"`, `"password"` (see [`Input/types.ts`](src/app/components/Input/types.ts)).
- `Icon` → dispatches to the correct SVG component via `iconMap` in [`Icon/Icons.tsx`](src/app/components/Icon/Icons.tsx). Icons accept `size`, `thickness`, and `color` props.
- `Button` → `variant="primary" | "secondary"` (default: `"secondary"`). Uses `classnames` for conditional class merging.

**Styling:** Global CSS variables (colors, spacing, fonts) are defined in [`src/app/style/globals/globals.css`](src/app/style/globals/globals.css). Utility classes live in `utilities.css`. Component-level styles use SCSS (`.scss` colocated with each component). Dark mode CSS is drafted but commented out — the project is currently light-mode only.

**Font:** Roboto (via `fonts/fonts.ts`) applied on `<body>` in the root layout. `--font-mono` (Roboto Mono) and `--font-serif` (Lora) are available as CSS variables.

**Pages:**
- `/` — home page (`src/app/page.tsx`)
- `/login` — login/signup form using `supabaseAuth`; client component

**Storybook:** Stories live in `src/stories/`. The Storybook config at `.storybook/` uses `@storybook/nextjs` preset with SCSS support.

## Client state (`src/store/`)

Zustand 5 stores. Single import point: `import { useAuthStore, useWeekStore, useSettingsStore, useSyncStore } from "@/store"`.

**`useAuthStore`** — auth state (`status`, `user`, `session`). Call `initialize()` once from the root layout to restore the existing session and subscribe to auth changes. Actions: `login`, `signUp`, `logout`. `status` values: `"idle" | "loading" | "authenticated" | "unauthenticated" | "error"`.

**`useWeekStore`** — week/day records as an in-memory `Map<dateStr, DayRecord>`. Navigation: `goToWeek`, `goToPrevWeek`, `goToNextWeek`, `goToToday`. Mutations: `addSlot`, `updateSlot`, `removeSlot`, `clearDay`, `setDayRecord`. Bulk load: `loadRecords` (merge), `replaceRecords` (full replace). Temporal objects live only in memory — never persisted to localStorage directly.

**`useSettingsStore`** — user's `WorkdayConfig`. Persisted to localStorage (`"timetables-settings"`) as plain JSON arrays; rehydrated to `ReadonlySet` types automatically. `config` always holds the resolved `WorkdayConfig` ready to pass to lib/time utilities. Actions: `setDefaultHoursPerDay`, `addExtraHoliday`, `removeExtraHoliday`, `addWorkingOverride`, `removeWorkingOverride`, `setNonWorkingDaysOfWeek`, `resetToDefaults`.

**`useSyncStore`** — sync status enum: `"idle" | "pending" | "syncing" | "synced" | "error" | "offline"`. Actions: `setPending`, `setSyncing`, `setSynced`, `setError(msg)`, `setOffline`, `setOnline` (transitions to `"pending"` to trigger a re-sync on reconnect). `lastSyncedAt` is an ISO timestamp string.

## Database layer (`src/lib/db/`)

Single import point: `import { db } from "@/lib/db"`.

**Switch mock ↔ Supabase:** controlled by `NEXT_PUBLIC_USE_MOCK_DB` in `.env.local`. Set to `"false"` and provide Supabase credentials to use the real DB — no call-site changes needed.

**`db.from(table)`** — query builder: `.select()`, `.insert()`, `.upsert()`, `.update()`, `.delete()`, `.eq()`, `.order()`. Returns `Promise<{ data, error }>` identical to Supabase JS client.

**`db.auth`** — auth methods: `signInWithPassword`, `signUp`, `getSession`, `signOut`, `onAuthStateChange`. Mock accepts any password for existing accounts; skips email confirmation.

**Mock store** (`mock/store.ts`) — in-memory singleton. Call `resetStore()` in tests to get a clean state (`beforeEach`).

**Row types** (`types.ts`): `DayRecordRow`, `WorkSlotRow`, `UserSettingsRow`, `UserRow` — plain JSON-serializable, Temporal values stored as ISO strings.

`supabaseClient.ts` is a legacy shim that re-exports `db.auth` as `supabaseAuth` for existing call-sites.

## Business logic (`src/lib/time/`)

All time/workday utilities. Single import point: `import { ... } from "@/lib/time"`.

**Temporal API:** `src/lib/time/temporal.ts` exports `Temporal` (native if available, `@js-temporal/polyfill` otherwise) plus the three aliased types `PlainTime`, `PlainDate`, `Duration`. Always import types from here, not directly from the polyfill.

**Core types** (`types.ts`):
- `TimeEntry` — `{ kind: "entry"; start: PlainTime; end: PlainTime }` — real clock-in/out
- `Placeholder` — `{ kind: "placeholder"; type: PlaceholderKind; duration: Duration; label? }` — credited time without real clock (leave/sick/holiday/other)
- `WorkSlot = TimeEntry | Placeholder`
- `DayRecord = { date: PlainDate; slots: WorkSlot[] }`

**Duration utilities** (`duration.ts`): `intervalDuration(start, end)`, `totalDuration(slots[])`, `entryDuration(entry)`, `formatDuration(d)` → `"HH:MM"`.

**Workday utilities** (`workdays.ts`): `isWorkingDay(date, config?)` checks Italian public holidays (fixed + variable Easter/Pasquetta) plus weekend. `countWorkingDays(start, end, config?)` counts working days in a range. `WorkdayConfig` allows `extraHolidays`, `workingOverrides`, `nonWorkingDaysOfWeek`, and `defaultHoursPerDay` (default 8).

**Placeholder utilities** (`placeholders.ts`):
- `createPlaceholder(type, date, opts?)` — single-day placeholder
- `createRangePlaceholder(type, start, end, opts?)` — multi-day range; returns `null` if no working days in range. The range is stored intact (`startDate`/`endDate`) and duration is pre-computed excluding non-working days.
- `resolvePlaceholderDuration(placeholder, config?)` — recomputes duration from the range using current config (call this instead of reading `.duration` directly when config may have changed)
- `expandPlaceholderDays(placeholder, config?)` — returns each working `PlainDate` in the range (for UI cell rendering)
- `skippedDaysInPlaceholder(placeholder, config?)` — returns non-working days inside the range (for UI to highlight "excluded" cells)

`Placeholder.hoursPerDay` overrides `WorkdayConfig.defaultHoursPerDay` for that slot only. `totalDuration()` now accepts an optional `WorkdayConfig` so range placeholders resolve correctly.

**Template utilities** (`templates.ts`):
- `WeekTemplate` — `{ id, name, days: Partial<Record<1–7, DayTemplate>> }` — a reusable weekly schedule. Keys are ISO day-of-week (1=Mon … 7=Sun); omitted days mean no scheduled entries.
- `DayTemplate` — `{ entries: TimeEntryTemplate[] }` where `TimeEntryTemplate = { start, end: PlainTime }`.
- `entryTemplate(start, end)` — factory accepting strings (`"08:30"`) or `PlainTime`.
- `dayTemplate(...[start, end][])` — factory for a full day's entries.
- `applyTemplate(template, weekStart, config?)` — materialises a template into `DayRecord[]` for the week containing `weekStart` (normalises to Monday automatically). Non-working days and days without template entries are skipped.
- `mergeTemplateRecords(existing, templateRecords, strategy?)` — merges template-generated records into existing ones. Strategy: `"skip"` (default, keeps existing), `"overwrite"`, `"append"`.
