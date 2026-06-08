export { Temporal } from "./temporal";
export type { PlainTime, PlainDate, Duration } from "./temporal";

export type { PlaceholderKind, TimeEntry, Placeholder, WorkSlot, DayRecord } from "./types";

export {
  intervalDuration,
  totalDuration,
  entryDuration,
  formatDuration,
} from "./duration";

export {
  isWorkingDay,
  countWorkingDays,
} from "./workdays";
export type { WorkdayConfig } from "./workdays";

export {
  createPlaceholder,
  createRangePlaceholder,
  resolvePlaceholderDuration,
  expandPlaceholderDays,
  skippedDaysInPlaceholder,
} from "./placeholders";

export {
  entryTemplate,
  dayTemplate,
  applyTemplate,
  mergeTemplateRecords,
} from "./templates";
export type {
  TimeEntryTemplate,
  DayTemplate,
  ISODayOfWeek,
  WeekTemplate,
  MergeStrategy,
} from "./templates";
