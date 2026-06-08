import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WorkdayConfig } from "@/lib/time";

// ---------------------------------------------------------------------------
// Storable config — mirrors WorkdayConfig but uses plain arrays so the
// values survive JSON serialization (localStorage). Converted to WorkdayConfig
// (with ReadonlySet) on demand via `toWorkdayConfig()`.
// ---------------------------------------------------------------------------

type StorableConfig = {
  defaultHoursPerDay: number;
  extraHolidays: string[];
  workingOverrides: string[];
  nonWorkingDaysOfWeek: number[];
};

/** Convert the storable form to the WorkdayConfig shape expected by lib/time. */
function toWorkdayConfig(c: StorableConfig): WorkdayConfig {
  return {
    defaultHoursPerDay: c.defaultHoursPerDay,
    extraHolidays: new Set(c.extraHolidays),
    workingOverrides: new Set(c.workingOverrides),
    nonWorkingDaysOfWeek: c.nonWorkingDaysOfWeek,
  };
}

type SettingsState = {
  /** Raw storable config (arrays, JSON-safe). */
  _raw: StorableConfig;
  /** Derived WorkdayConfig with ReadonlySet — recomputed lazily. */
  config: WorkdayConfig;

  // Actions
  setDefaultHoursPerDay: (hours: number) => void;
  addExtraHoliday: (dateStr: string) => void;
  removeExtraHoliday: (dateStr: string) => void;
  addWorkingOverride: (dateStr: string) => void;
  removeWorkingOverride: (dateStr: string) => void;
  setNonWorkingDaysOfWeek: (days: number[]) => void;
  resetToDefaults: () => void;
};

const DEFAULT_RAW: StorableConfig = {
  defaultHoursPerDay: 8,
  extraHolidays: [],
  workingOverrides: [],
  nonWorkingDaysOfWeek: [6, 7], // Saturday, Sunday
};

function applyRaw(raw: StorableConfig): Pick<SettingsState, "_raw" | "config"> {
  return { _raw: raw, config: toWorkdayConfig(raw) };
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...applyRaw(DEFAULT_RAW),

      setDefaultHoursPerDay: (hours) =>
        set((s) => applyRaw({ ...s._raw, defaultHoursPerDay: hours })),

      addExtraHoliday: (dateStr) =>
        set((s) => {
          if (s._raw.extraHolidays.includes(dateStr)) return s;
          return applyRaw({ ...s._raw, extraHolidays: [...s._raw.extraHolidays, dateStr] });
        }),

      removeExtraHoliday: (dateStr) =>
        set((s) =>
          applyRaw({
            ...s._raw,
            extraHolidays: s._raw.extraHolidays.filter((d) => d !== dateStr),
          })
        ),

      addWorkingOverride: (dateStr) =>
        set((s) => {
          if (s._raw.workingOverrides.includes(dateStr)) return s;
          return applyRaw({ ...s._raw, workingOverrides: [...s._raw.workingOverrides, dateStr] });
        }),

      removeWorkingOverride: (dateStr) =>
        set((s) =>
          applyRaw({
            ...s._raw,
            workingOverrides: s._raw.workingOverrides.filter((d) => d !== dateStr),
          })
        ),

      setNonWorkingDaysOfWeek: (days) =>
        set((s) => applyRaw({ ...s._raw, nonWorkingDaysOfWeek: days })),

      resetToDefaults: () => set(applyRaw(DEFAULT_RAW)),
    }),
    {
      name: "timetables-settings",
      // Persist only the raw (JSON-safe) part; `config` is re-derived on rehydration
      partialize: (s) => ({ _raw: s._raw }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.config = toWorkdayConfig(state._raw);
        }
      },
    }
  )
);
