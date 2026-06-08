import { create } from "zustand";
import { Temporal } from "@/lib/time";
import type { DayRecord, PlainDate, WorkSlot, TimeEntry, Placeholder } from "@/lib/time";

// ---------------------------------------------------------------------------
// Serialization helpers — Temporal objects are not JSON-serializable.
// We store DayRecord[] in memory (never in localStorage directly).
// ---------------------------------------------------------------------------

/** Returns the ISO string for the Monday of the week containing `date`. */
function mondayOf(date: PlainDate): PlainDate {
  const dow = date.dayOfWeek; // 1 = Mon, 7 = Sun
  return date.subtract({ days: dow - 1 });
}

/** Parse "YYYY-MM-DD" → PlainDate */
function parsePlainDate(s: string): PlainDate {
  return Temporal.PlainDate.from(s);
}

type WeekState = {
  /** ISO string for the Monday currently shown in the UI (YYYY-MM-DD). */
  visibleWeekStart: string;

  /**
   * In-memory record map, keyed by ISO date string "YYYY-MM-DD".
   * Only populated weeks are stored — sparse by design.
   */
  records: Map<string, DayRecord>;

  // Derived / computed (selectors, not stored)
  getWeekRecords: (weekStart: string) => DayRecord[];
  getDayRecord: (dateStr: string) => DayRecord | undefined;

  // Navigation
  goToWeek: (dateStr: string) => void;
  goToPrevWeek: () => void;
  goToNextWeek: () => void;
  goToToday: () => void;

  // Mutations
  setDayRecord: (record: DayRecord) => void;
  addSlot: (dateStr: string, slot: WorkSlot) => void;
  updateSlot: (dateStr: string, index: number, slot: WorkSlot) => void;
  removeSlot: (dateStr: string, index: number) => void;
  clearDay: (dateStr: string) => void;

  /** Bulk-load records (e.g. from DB or localStorage). Merges into existing map. */
  loadRecords: (records: DayRecord[]) => void;

  /** Replace all records with a fresh set (e.g. after full sync). */
  replaceRecords: (records: DayRecord[]) => void;
};

function todayMonday(): string {
  const today = Temporal.Now.plainDateISO();
  return mondayOf(today).toString();
}

export const useWeekStore = create<WeekState>((set, get) => ({
  visibleWeekStart: todayMonday(),
  records: new Map(),

  // ---------------------------------------------------------------------------
  // Selectors
  // ---------------------------------------------------------------------------

  getWeekRecords: (weekStart) => {
    const start = parsePlainDate(weekStart);
    const result: DayRecord[] = [];
    for (let i = 0; i < 7; i++) {
      const d = start.add({ days: i });
      const key = d.toString();
      const record = get().records.get(key);
      if (record) result.push(record);
    }
    return result;
  },

  getDayRecord: (dateStr) => get().records.get(dateStr),

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  goToWeek: (dateStr) => {
    const date = parsePlainDate(dateStr);
    set({ visibleWeekStart: mondayOf(date).toString() });
  },

  goToPrevWeek: () => {
    const current = parsePlainDate(get().visibleWeekStart);
    set({ visibleWeekStart: current.subtract({ weeks: 1 }).toString() });
  },

  goToNextWeek: () => {
    const current = parsePlainDate(get().visibleWeekStart);
    set({ visibleWeekStart: current.add({ weeks: 1 }).toString() });
  },

  goToToday: () => {
    set({ visibleWeekStart: todayMonday() });
  },

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  setDayRecord: (record) => {
    const key = record.date.toString();
    set((s) => {
      const next = new Map(s.records);
      next.set(key, record);
      return { records: next };
    });
  },

  addSlot: (dateStr, slot) => {
    set((s) => {
      const next = new Map(s.records);
      const existing = next.get(dateStr);
      if (existing) {
        next.set(dateStr, { ...existing, slots: [...existing.slots, slot] });
      } else {
        const date = parsePlainDate(dateStr);
        next.set(dateStr, { date, slots: [slot] });
      }
      return { records: next };
    });
  },

  updateSlot: (dateStr, index, slot) => {
    set((s) => {
      const existing = s.records.get(dateStr);
      if (!existing) return s;
      const slots = [...existing.slots];
      slots[index] = slot;
      const next = new Map(s.records);
      next.set(dateStr, { ...existing, slots });
      return { records: next };
    });
  },

  removeSlot: (dateStr, index) => {
    set((s) => {
      const existing = s.records.get(dateStr);
      if (!existing) return s;
      const slots = existing.slots.filter((_, i) => i !== index);
      const next = new Map(s.records);
      if (slots.length === 0) {
        next.delete(dateStr);
      } else {
        next.set(dateStr, { ...existing, slots });
      }
      return { records: next };
    });
  },

  clearDay: (dateStr) => {
    set((s) => {
      const next = new Map(s.records);
      next.delete(dateStr);
      return { records: next };
    });
  },

  loadRecords: (records) => {
    set((s) => {
      const next = new Map(s.records);
      for (const r of records) {
        next.set(r.date.toString(), r);
      }
      return { records: next };
    });
  },

  replaceRecords: (records) => {
    const next = new Map<string, DayRecord>();
    for (const r of records) {
      next.set(r.date.toString(), r);
    }
    set({ records: next });
  },
}));
