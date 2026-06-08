import { describe, it, expect } from "vitest";
import { Temporal } from "./temporal";
import { intervalDuration, totalDuration, entryDuration, formatDuration } from "./duration";
import type { WorkSlot } from "./types";

const t = (hh: number, mm: number) => Temporal.PlainTime.from({ hour: hh, minute: mm });
const dur = (h: number, m = 0) => Temporal.Duration.from({ hours: h, minutes: m });

describe("intervalDuration", () => {
  it("calcola la durata tra due orari nello stesso giorno", () => {
    const d = intervalDuration(t(9, 0), t(13, 0));
    expect(d.total({ unit: "minutes" })).toBe(240);
  });

  it("gestisce minuti non interi", () => {
    const d = intervalDuration(t(9, 15), t(12, 45));
    expect(d.total({ unit: "minutes" })).toBe(210);
  });

  it("lancia RangeError se end === start", () => {
    expect(() => intervalDuration(t(9, 0), t(9, 0))).toThrow(RangeError);
  });

  it("lancia RangeError se end è prima di start", () => {
    expect(() => intervalDuration(t(13, 0), t(9, 0))).toThrow(RangeError);
  });
});

describe("entryDuration", () => {
  it("restituisce la durata di un TimeEntry", () => {
    const entry: WorkSlot = { kind: "entry", start: t(8, 30), end: t(17, 30) };
    expect(entryDuration(entry).total({ unit: "hours" })).toBe(9);
  });
});

describe("totalDuration", () => {
  it("somma più TimeEntry", () => {
    const slots: WorkSlot[] = [
      { kind: "entry", start: t(9, 0), end: t(13, 0) },
      { kind: "entry", start: t(14, 0), end: t(18, 0) },
    ];
    expect(totalDuration(slots).total({ unit: "hours" })).toBe(8);
  });

  it("include un placeholder con duration esplicita", () => {
    const slots: WorkSlot[] = [
      { kind: "entry", start: t(9, 0), end: t(13, 0) },
      { kind: "placeholder", type: "leave", duration: dur(4) },
    ];
    expect(totalDuration(slots).total({ unit: "hours" })).toBe(8);
  });

  it("include un range placeholder escludendo i festivi", () => {
    // 1-6 giugno 2026: 4 giorni lavorativi (2=Festa Repubblica, 6=Sabato)
    const slots: WorkSlot[] = [
      {
        kind: "placeholder",
        type: "leave",
        startDate: Temporal.PlainDate.from("2026-06-01"),
        endDate: Temporal.PlainDate.from("2026-06-06"),
        hoursPerDay: 8,
      },
    ];
    expect(totalDuration(slots).total({ unit: "hours" })).toBe(32);
  });

  it("restituisce zero per lista vuota", () => {
    expect(totalDuration([]).total({ unit: "minutes" })).toBe(0);
  });

  it("accumula ore e minuti correttamente senza overflow", () => {
    // 3 slot da 90 minuti = 270 min = 4h30
    const slots: WorkSlot[] = [
      { kind: "entry", start: t(8, 0), end: t(9, 30) },
      { kind: "entry", start: t(10, 0), end: t(11, 30) },
      { kind: "entry", start: t(12, 0), end: t(13, 30) },
    ];
    const d = totalDuration(slots);
    expect(d.hours).toBe(4);
    expect(d.minutes).toBe(30);
  });
});

describe("formatDuration", () => {
  it("formatta ore e minuti con zero padding", () => {
    expect(formatDuration(dur(8, 0))).toBe("08:00");
    expect(formatDuration(dur(1, 5))).toBe("01:05");
    expect(formatDuration(dur(0, 30))).toBe("00:30");
  });

  it("gestisce durate superiori a 9 ore", () => {
    expect(formatDuration(dur(40, 0))).toBe("40:00");
  });
});
