import type { PlainDate, PlainTime, Duration } from "./temporal";

export type PlaceholderKind = "leave" | "holiday" | "sick" | "other";

/**
 * A real clock-in/clock-out pair.
 */
export type TimeEntry = {
  kind: "entry";
  start: PlainTime;
  end: PlainTime;
};

/**
 * A block of time that counts as worked without real clock times
 * (paid leave, sick day, public holiday, etc.).
 *
 * Single-day usage: set `duration` directly.
 *
 * Multi-day range usage: set `startDate` + `endDate` and leave `duration`
 * unset. Duration is computed on-demand via `resolvePlaceholderDuration()`
 * so it stays consistent if workday config changes later.
 *
 * `hoursPerDay` overrides the global default (defined in `WorkdayConfig`)
 * for this specific placeholder only.
 */
export type Placeholder = {
  kind: "placeholder";
  type: PlaceholderKind;
  label?: string;
  /** Explicit duration. Used for single-day placeholders. */
  duration?: Duration;
  /** Inclusive start of a multi-day range. */
  startDate?: PlainDate;
  /** Inclusive end of a multi-day range. */
  endDate?: PlainDate;
  /**
   * Working hours credited per day when resolving a date range.
   * Takes priority over `WorkdayConfig.defaultHoursPerDay`.
   */
  hoursPerDay?: number;
};

export type WorkSlot = TimeEntry | Placeholder;

/**
 * All work recorded for a single calendar day.
 */
export type DayRecord = {
  date: PlainDate;
  slots: WorkSlot[];
};
