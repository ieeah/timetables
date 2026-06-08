import { Temporal } from "./temporal";
import type { PlainTime, Duration } from "./temporal";
import type { TimeEntry, WorkSlot } from "./types";
import { resolvePlaceholderDuration } from "./placeholders";
import type { WorkdayConfig } from "./workdays";

/**
 * Returns the duration between two PlainTime values.
 * Throws if end is not strictly after start.
 */
export function intervalDuration(
  start: PlainTime,
  end: PlainTime
): Duration {
  const cmp = Temporal.PlainTime.compare(start, end);
  if (cmp >= 0) {
    throw new RangeError(
      `end (${end}) must be after start (${start})`
    );
  }
  return start.until(end);
}

/**
 * Returns the total worked duration for a list of WorkSlots.
 *
 * TimeEntry slots contribute the clock-in → clock-out interval.
 * Placeholder slots use `resolvePlaceholderDuration` so range placeholders
 * correctly exclude holidays/weekends according to the provided config.
 *
 * Durations are balanced to hours + minutes (sub-minute precision is
 * preserved but not promoted).
 */
export function totalDuration(
  slots: WorkSlot[],
  config: WorkdayConfig = {}
): Duration {
  let totalMinutes = 0;

  for (const slot of slots) {
    if (slot.kind === "entry") {
      const d = intervalDuration(slot.start, slot.end);
      totalMinutes += d.total({ unit: "minutes" });
    } else {
      const d = resolvePlaceholderDuration(slot, config);
      totalMinutes += d.total({ unit: "minutes" });
    }
  }

  return Temporal.Duration.from({
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  });
}

/**
 * Convenience: duration of a single TimeEntry.
 */
export function entryDuration(entry: TimeEntry): Duration {
  return intervalDuration(entry.start, entry.end);
}

/**
 * Formats a Duration as "HH:MM".
 * Only meaningful for durations < 100 hours (typical workday/week range).
 */
export function formatDuration(duration: Duration): string {
  const totalMins = duration.total({ unit: "minutes" });
  const h = Math.floor(totalMins / 60);
  const m = Math.floor(totalMins % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
