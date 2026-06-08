import { Temporal } from "./temporal";
import type { PlainDate } from "./temporal";

/**
 * Italian public holidays that fall on a fixed date every year.
 * Format: "MM-DD"
 */
const IT_FIXED_HOLIDAYS: ReadonlySet<string> = new Set([
  "01-01", // Capodanno
  "01-06", // Epifania
  "04-25", // Festa della Liberazione
  "05-01", // Festa dei Lavoratori
  "06-02", // Festa della Repubblica
  "08-15", // Ferragosto
  "11-01", // Ognissanti
  "12-08", // Immacolata Concezione
  "12-25", // Natale
  "12-26", // Santo Stefano
]);

/**
 * Computes Easter Sunday for a given year using the Anonymous Gregorian algorithm.
 * Returns the date as a PlainDate.
 */
function easterSunday(year: number): PlainDate {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return Temporal.PlainDate.from({ year, month, day });
}

/**
 * Returns the set of Italian variable holidays (Easter + Pasquetta) for a year,
 * serialized as "YYYY-MM-DD".
 */
function itVariableHolidays(year: number): Set<string> {
  const easter = easterSunday(year);
  const pasquetta = easter.add({ days: 1 });
  return new Set([easter.toString(), pasquetta.toString()]);
}

export type WorkdayConfig = {
  /**
   * Extra days off to add on top of Italian holidays, keyed as "YYYY-MM-DD".
   * Useful for local saints' days, company-specific closures, etc.
   */
  extraHolidays?: ReadonlySet<string>;
  /**
   * Dates that override and ARE treated as working days despite being
   * a weekend or holiday (e.g., a makeup Saturday).
   */
  workingOverrides?: ReadonlySet<string>;
  /**
   * Days of the week considered non-working. 1 = Monday … 7 = Sunday.
   * Defaults to [6, 7] (Saturday, Sunday).
   */
  nonWorkingDaysOfWeek?: ReadonlyArray<number>;
  /**
   * Default credited hours for each working day in a range placeholder.
   * Defaults to 8. Can be overridden per-placeholder via `Placeholder.hoursPerDay`.
   */
  defaultHoursPerDay?: number;
};

const DEFAULT_NON_WORKING = [6, 7];

/**
 * Returns true if the given date is a working day according to Italian
 * public holidays and the optional config.
 */
export function isWorkingDay(
  date: PlainDate,
  config: WorkdayConfig = {}
): boolean {
  const {
    extraHolidays = new Set(),
    workingOverrides = new Set(),
    nonWorkingDaysOfWeek = DEFAULT_NON_WORKING,
  } = config;

  const iso = date.toString(); // "YYYY-MM-DD"
  const mmdd = `${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;

  // Explicit override always wins
  if (workingOverrides.has(iso)) return true;

  // Weekend (or custom non-working weekday)
  if (nonWorkingDaysOfWeek.includes(date.dayOfWeek)) return false;

  // Italian fixed holidays
  if (IT_FIXED_HOLIDAYS.has(mmdd)) return false;

  // Italian variable holidays (Easter + Pasquetta)
  if (itVariableHolidays(date.year).has(iso)) return false;

  // Extra custom holidays
  if (extraHolidays.has(iso)) return false;

  return true;
}

/**
 * Returns the number of working days in a range [startDate, endDate] inclusive.
 */
export function countWorkingDays(
  startDate: PlainDate,
  endDate: PlainDate,
  config?: WorkdayConfig
): number {
  if (Temporal.PlainDate.compare(startDate, endDate) > 0) {
    throw new RangeError("startDate must be <= endDate");
  }

  let count = 0;
  let current = startDate;

  while (Temporal.PlainDate.compare(current, endDate) <= 0) {
    if (isWorkingDay(current, config)) count++;
    current = current.add({ days: 1 });
  }

  return count;
}
