import { Temporal } from "./temporal";
import type { PlainDate, Duration } from "./temporal";
import type { Placeholder, PlaceholderKind } from "./types";
import { isWorkingDay, countWorkingDays } from "./workdays";
import type { WorkdayConfig } from "./workdays";

const DEFAULT_HOURS_PER_DAY = 8;

/**
 * Creates a single-day Placeholder.
 */
export function createPlaceholder(
  type: PlaceholderKind,
  date: PlainDate,
  options: {
    hoursPerDay?: number;
    label?: string;
    config?: WorkdayConfig;
  } = {}
): Placeholder {
  const { hoursPerDay, label, config = {} } = options;
  const hours = hoursPerDay ?? config.defaultHoursPerDay ?? DEFAULT_HOURS_PER_DAY;

  return {
    kind: "placeholder",
    type,
    label,
    startDate: date,
    endDate: date,
    hoursPerDay: hours,
    duration: Temporal.Duration.from({ hours }),
  };
}

/**
 * Creates a Placeholder spanning a range of dates [startDate, endDate] inclusive.
 *
 * Weekends, public holidays, and any other non-working days within the range
 * are automatically excluded from the credited duration — but the range itself
 * is kept intact so the UI can display the full span and highlight skipped days.
 *
 * Returns `null` if the range contains no working days at all.
 */
export function createRangePlaceholder(
  type: PlaceholderKind,
  startDate: PlainDate,
  endDate: PlainDate,
  options: {
    hoursPerDay?: number;
    label?: string;
    config?: WorkdayConfig;
  } = {}
): Placeholder | null {
  if (Temporal.PlainDate.compare(startDate, endDate) > 0) {
    throw new RangeError(
      `startDate (${startDate}) must be <= endDate (${endDate})`
    );
  }

  const { hoursPerDay, label, config = {} } = options;
  const hours = hoursPerDay ?? config.defaultHoursPerDay ?? DEFAULT_HOURS_PER_DAY;
  const workingDays = countWorkingDays(startDate, endDate, config);

  if (workingDays === 0) return null;

  return {
    kind: "placeholder",
    type,
    label,
    startDate,
    endDate,
    hoursPerDay: hours,
    duration: Temporal.Duration.from({ hours: workingDays * hours }),
  };
}

/**
 * Resolves the credited Duration for a Placeholder.
 *
 * For range placeholders this recalculates the duration from scratch using the
 * provided config, so the result stays consistent if holidays change.
 * For single-day or manually-set placeholders it returns `duration` as-is.
 */
export function resolvePlaceholderDuration(
  placeholder: Placeholder,
  config: WorkdayConfig = {}
): Duration {
  const { startDate, endDate, hoursPerDay, duration } = placeholder;

  if (startDate && endDate) {
    const hours =
      hoursPerDay ?? config.defaultHoursPerDay ?? DEFAULT_HOURS_PER_DAY;
    const workingDays = countWorkingDays(startDate, endDate, config);
    return Temporal.Duration.from({ hours: workingDays * hours });
  }

  if (duration) return duration;

  throw new Error(
    "Placeholder must have either startDate+endDate or an explicit duration"
  );
}

/**
 * Returns every working day within a Placeholder's range as individual PlainDates.
 * Useful for rendering: the UI can iterate these to mark cells as "leave" etc.
 *
 * Returns an empty array for single-day placeholders without a range
 * (use `placeholder.startDate` directly in that case).
 */
export function expandPlaceholderDays(
  placeholder: Placeholder,
  config: WorkdayConfig = {}
): PlainDate[] {
  const { startDate, endDate } = placeholder;
  if (!startDate || !endDate) return startDate ? [startDate] : [];

  const days: PlainDate[] = [];
  let current = startDate;

  while (Temporal.PlainDate.compare(current, endDate) <= 0) {
    if (isWorkingDay(current, config)) {
      days.push(current);
    }
    current = current.add({ days: 1 });
  }

  return days;
}

/**
 * Returns all the non-working days (weekends/holidays) that fall inside
 * a Placeholder's range. Useful for the UI to visually differentiate
 * "skipped" cells within the same leave block.
 */
export function skippedDaysInPlaceholder(
  placeholder: Placeholder,
  config: WorkdayConfig = {}
): PlainDate[] {
  const { startDate, endDate } = placeholder;
  if (!startDate || !endDate) return [];

  const days: PlainDate[] = [];
  let current = startDate;

  while (Temporal.PlainDate.compare(current, endDate) <= 0) {
    if (!isWorkingDay(current, config)) {
      days.push(current);
    }
    current = current.add({ days: 1 });
  }

  return days;
}
