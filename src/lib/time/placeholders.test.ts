import { describe, it, expect } from "vitest";
import { Temporal } from "./temporal";
import type { PlainDate } from "./temporal";
import {
  createPlaceholder,
  createRangePlaceholder,
  resolvePlaceholderDuration,
  expandPlaceholderDays,
  skippedDaysInPlaceholder,
} from "./placeholders";

const d = (iso: string) => Temporal.PlainDate.from(iso);
const isoList = (dates: PlainDate[]) => dates.map((d) => d.toString());

describe("createPlaceholder", () => {
  it("crea un placeholder singolo con durata di default 8h", () => {
    const p = createPlaceholder("leave", d("2026-06-01"));
    expect(p.kind).toBe("placeholder");
    expect(p.type).toBe("leave");
    expect(p.duration?.total({ unit: "hours" })).toBe(8);
    expect(p.startDate?.toString()).toBe("2026-06-01");
    expect(p.endDate?.toString()).toBe("2026-06-01");
  });

  it("rispetta hoursPerDay esplicito", () => {
    const p = createPlaceholder("sick", d("2026-06-01"), { hoursPerDay: 6 });
    expect(p.hoursPerDay).toBe(6);
    expect(p.duration?.total({ unit: "hours" })).toBe(6);
  });

  it("hoursPerDay sul singolo slot ha precedenza su defaultHoursPerDay della config", () => {
    const p = createPlaceholder("leave", d("2026-06-01"), {
      hoursPerDay: 4,
      config: { defaultHoursPerDay: 7 },
    });
    expect(p.hoursPerDay).toBe(4);
  });

  it("usa defaultHoursPerDay dalla config se hoursPerDay non è specificato", () => {
    const p = createPlaceholder("leave", d("2026-06-01"), {
      config: { defaultHoursPerDay: 7 },
    });
    expect(p.hoursPerDay).toBe(7);
    expect(p.duration?.total({ unit: "hours" })).toBe(7);
  });

  it("salva il label opzionale", () => {
    const p = createPlaceholder("other", d("2026-06-01"), { label: "Permesso sindacale" });
    expect(p.label).toBe("Permesso sindacale");
  });
});

describe("createRangePlaceholder", () => {
  it("caso reale: 1-6 giugno 2026 → 4 giorni × 8h = 32h", () => {
    const p = createRangePlaceholder("leave", d("2026-06-01"), d("2026-06-06"));
    expect(p).not.toBeNull();
    expect(p!.duration?.total({ unit: "hours" })).toBe(32);
    expect(p!.startDate?.toString()).toBe("2026-06-01");
    expect(p!.endDate?.toString()).toBe("2026-06-06");
  });

  it("range di un solo giorno lavorativo → 8h", () => {
    const p = createRangePlaceholder("leave", d("2026-06-01"), d("2026-06-01"));
    expect(p!.duration?.total({ unit: "hours" })).toBe(8);
  });

  it("restituisce null se il range non contiene giorni lavorativi", () => {
    // 6-7 giugno 2026: sabato + domenica
    const p = createRangePlaceholder("leave", d("2026-06-06"), d("2026-06-07"));
    expect(p).toBeNull();
  });

  it("restituisce null per un singolo giorno festivo", () => {
    const p = createRangePlaceholder("holiday", d("2026-06-02"), d("2026-06-02"));
    expect(p).toBeNull();
  });

  it("lancia RangeError se start > end", () => {
    expect(() =>
      createRangePlaceholder("leave", d("2026-06-10"), d("2026-06-01"))
    ).toThrow(RangeError);
  });

  it("rispetta hoursPerDay custom", () => {
    // 1-5 giugno 2026: lun + mer + gio + ven = 4 giorni (2/6 festivo)
    const p = createRangePlaceholder("leave", d("2026-06-01"), d("2026-06-05"), {
      hoursPerDay: 4,
    });
    expect(p!.duration?.total({ unit: "hours" })).toBe(16); // 4 giorni × 4h
  });

  it("tiene il range completo anche con giorni saltati", () => {
    const p = createRangePlaceholder("leave", d("2026-06-01"), d("2026-06-06"));
    // Il range non viene spezzato: startDate e endDate rimangono invariati
    expect(p!.startDate?.toString()).toBe("2026-06-01");
    expect(p!.endDate?.toString()).toBe("2026-06-06");
  });

  it("rispetta extraHolidays dalla config", () => {
    // senza config: lun 8, mar 9, mer 10, gio 11, ven 12 = 5 giorni
    // con 2026-06-10 come extra holiday: 4 giorni
    const config = { extraHolidays: new Set(["2026-06-10"]) };
    const p = createRangePlaceholder("leave", d("2026-06-08"), d("2026-06-12"), { config });
    expect(p!.duration?.total({ unit: "hours" })).toBe(32); // 4 × 8h
  });
});

describe("resolvePlaceholderDuration", () => {
  it("ricalcola da startDate/endDate ignorando la duration pre-calcolata", () => {
    const p = createRangePlaceholder("leave", d("2026-06-01"), d("2026-06-06"))!;
    // Aggiunta di un extra holiday che non c'era al momento della creazione
    const config = { extraHolidays: new Set(["2026-06-03"]) };
    const resolved = resolvePlaceholderDuration(p, config);
    // Senza config: 4 giorni × 8h = 32h. Con mercoledì 3 come extra holiday: 3 × 8 = 24h
    expect(resolved.total({ unit: "hours" })).toBe(24);
  });

  it("restituisce duration esplicita se non ci sono startDate/endDate", () => {
    const p = {
      kind: "placeholder" as const,
      type: "leave" as const,
      duration: Temporal.Duration.from({ hours: 4 }),
    };
    expect(resolvePlaceholderDuration(p).total({ unit: "hours" })).toBe(4);
  });

  it("lancia se mancano sia il range che la duration", () => {
    const p = { kind: "placeholder" as const, type: "leave" as const };
    expect(() => resolvePlaceholderDuration(p)).toThrow();
  });
});

describe("expandPlaceholderDays", () => {
  it("restituisce i soli giorni lavorativi del range", () => {
    const p = createRangePlaceholder("leave", d("2026-06-01"), d("2026-06-06"))!;
    const days = isoList(expandPlaceholderDays(p));
    expect(days).toEqual(["2026-06-01", "2026-06-03", "2026-06-04", "2026-06-05"]);
  });

  it("restituisce un solo giorno per placeholder singolo", () => {
    const p = createPlaceholder("sick", d("2026-06-01"));
    const days = isoList(expandPlaceholderDays(p));
    expect(days).toEqual(["2026-06-01"]);
  });

  it("restituisce array vuoto per placeholder senza date", () => {
    const p = { kind: "placeholder" as const, type: "leave" as const };
    expect(expandPlaceholderDays(p)).toEqual([]);
  });
});

describe("skippedDaysInPlaceholder", () => {
  it("restituisce i giorni non lavorativi interni al range", () => {
    const p = createRangePlaceholder("leave", d("2026-06-01"), d("2026-06-06"))!;
    const skipped = isoList(skippedDaysInPlaceholder(p));
    // 2/6 = festivo, 6/6 = sabato
    expect(skipped).toEqual(["2026-06-02", "2026-06-06"]);
  });

  it("restituisce array vuoto per una settimana piena senza festivi", () => {
    const p = createRangePlaceholder("leave", d("2026-06-08"), d("2026-06-12"))!;
    expect(skippedDaysInPlaceholder(p)).toHaveLength(0);
  });

  it("restituisce array vuoto se il placeholder non ha range", () => {
    const p = { kind: "placeholder" as const, type: "leave" as const };
    expect(skippedDaysInPlaceholder(p)).toEqual([]);
  });

  it("rispetta extraHolidays aggiuntivi", () => {
    const config = { extraHolidays: new Set(["2026-06-03"]) };
    const p = createRangePlaceholder("leave", d("2026-06-01"), d("2026-06-06"))!;
    const skipped = isoList(skippedDaysInPlaceholder(p, config));
    expect(skipped).toContain("2026-06-03");
  });
});
