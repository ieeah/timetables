import { Temporal } from "./temporal";
import type { PlainDate, PlainTime } from "./temporal";
import type { DayRecord, TimeEntry } from "./types";
import { isWorkingDay } from "./workdays";
import type { WorkdayConfig } from "./workdays";

/**
 * A single time-entry definition inside a template: just start/end times,
 * no date attached yet.
 */
export type TimeEntryTemplate = {
  start: PlainTime;
  end: PlainTime;
};

/**
 * The schedule for one day of the week inside a template.
 * A day can have multiple entries (e.g. morning + afternoon blocks).
 */
export type DayTemplate = {
  /** Ordered list of time blocks for this day. */
  entries: TimeEntryTemplate[];
};

/**
 * Day-of-week index following ISO 8601: 1 = Monday … 7 = Sunday.
 */
export type ISODayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * A reusable weekly schedule template.
 *
 * `days` is a partial map so that days without entries (e.g. Saturday/Sunday)
 * can simply be omitted rather than stored as empty objects.
 *
 * Templates are pure value objects — they carry no IDs or persistence
 * concerns at this layer.
 */
export type WeekTemplate = {
  id: string;
  name: string;
  /**
   * Per-day schedule. Keys are ISO day-of-week numbers (1–7).
   * Omitted days are treated as "no scheduled entries".
   */
  days: Partial<Record<ISODayOfWeek, DayTemplate>>;
};

// ---------------------------------------------------------------------------
// Factory helpers
// ---------------------------------------------------------------------------

/**
 * Convenience factory for a TimeEntryTemplate from plain strings.
 *
 * @example
 * entryTemplate("08:30", "12:30")
 */
export function entryTemplate(
  start: string | PlainTime,
  end: string | PlainTime
): TimeEntryTemplate {
  return {
    start:
      typeof start === "string" ? Temporal.PlainTime.from(start) : start,
    end:
      typeof end === "string" ? Temporal.PlainTime.from(end) : end,
  };
}

/**
 * Convenience factory for a DayTemplate from an array of [start, end] pairs.
 *
 * @example
 * dayTemplate(["08:30", "12:30"], ["13:10", "18:30"])
 */
export function dayTemplate(
  ...entries: [string | PlainTime, string | PlainTime][]
): DayTemplate {
  return { entries: entries.map(([s, e]) => entryTemplate(s, e)) };
}

// ---------------------------------------------------------------------------
// Application
// ---------------------------------------------------------------------------

/**
 * Converts a template's entries for a single day into concrete TimeEntry slots.
 */
function templateEntriesToSlots(entries: TimeEntryTemplate[]): TimeEntry[] {
  return entries.map(({ start, end }) => ({ kind: "entry", start, end }));
}

/**
 * Applies a WeekTemplate to a specific week, returning one DayRecord per
 * day that has both a template definition AND is a working day.
 *
 * @param template   The template to apply.
 * @param weekStart  Any PlainDate within the desired week. The function
 *                   normalises it to Monday automatically.
 * @param config     Optional WorkdayConfig (holidays, overrides, etc.).
 *                   Days that are non-working according to the config are
 *                   skipped even if the template defines entries for them.
 *
 * @returns DayRecord[] sorted by date, one entry per matched working day.
 *          Days without template entries or non-working days are excluded.
 */
export function applyTemplate(
  template: WeekTemplate,
  weekStart: PlainDate,
  config: WorkdayConfig = {}
): DayRecord[] {
  // Normalise to Monday of the given week
  const monday = weekStart.subtract({ days: weekStart.dayOfWeek - 1 });

  const records: DayRecord[] = [];

  for (let offset = 0; offset < 7; offset++) {
    const date = monday.add({ days: offset });
    const dow = date.dayOfWeek as ISODayOfWeek;
    const dayTpl = template.days[dow];

    // Skip days with no template entries
    if (!dayTpl || dayTpl.entries.length === 0) continue;

    // Skip non-working days (holidays, custom config, etc.)
    if (!isWorkingDay(date, config)) continue;

    records.push({
      date,
      slots: templateEntriesToSlots(dayTpl.entries),
    });
  }

  return records;
}

/**
 * Merges template-generated DayRecords into an existing set of DayRecords.
 *
 * Strategy options:
 * - `"skip"` (default): days that already have slots are left untouched.
 * - `"overwrite"`: template entries replace existing slots on matching days.
 * - `"append"`: template entries are added after existing slots.
 *
 * Days present in `template` but not in `existing` are always added.
 */
export type MergeStrategy = "skip" | "overwrite" | "append";

export function mergeTemplateRecords(
  existing: DayRecord[],
  templateRecords: DayRecord[],
  strategy: MergeStrategy = "skip"
): DayRecord[] {
  const byDate = new Map<string, DayRecord>(
    existing.map((r) => [r.date.toString(), r])
  );

  for (const tplRecord of templateRecords) {
    const key = tplRecord.date.toString();
    const existing = byDate.get(key);

    if (!existing) {
      byDate.set(key, tplRecord);
      continue;
    }

    if (strategy === "skip") continue;

    if (strategy === "overwrite") {
      byDate.set(key, tplRecord);
      continue;
    }

    // "append"
    byDate.set(key, {
      ...existing,
      slots: [...existing.slots, ...tplRecord.slots],
    });
  }

  return [...byDate.values()].sort((a, b) =>
    Temporal.PlainDate.compare(a.date, b.date)
  );
}
