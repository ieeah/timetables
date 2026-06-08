/**
 * Single import point for Temporal. Uses the native API when available,
 * falls back to the TC39 polyfill otherwise.
 */
import { Temporal as TemporalPolyfill } from "@js-temporal/polyfill";

export const Temporal: typeof TemporalPolyfill =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).Temporal ?? TemporalPolyfill;

export type PlainTime = TemporalPolyfill.PlainTime;
export type PlainDate = TemporalPolyfill.PlainDate;
export type Duration = TemporalPolyfill.Duration;
