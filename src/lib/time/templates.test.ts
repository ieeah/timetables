import { describe, it, expect } from "vitest";
import { Temporal } from "./temporal";
import {
  entryTemplate,
  dayTemplate,
  applyTemplate,
  mergeTemplateRecords,
} from "./templates";
import type { WeekTemplate } from "./templates";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/**
 * A typical Italian office week:
 * Mon–Fri: 08:30–12:30, 13:10–18:30
 * (Saturday and Sunday intentionally omitted)
 */
const STANDARD_WEEK: WeekTemplate = {
  id: "standard",
  name: "Settimana standard",
  days: {
    1: dayTemplate(["08:30", "12:30"], ["13:10", "18:30"]),
    2: dayTemplate(["09:00", "12:30"], ["13:00", "18:30"]),
    3: dayTemplate(["08:30", "12:30"], ["13:10", "18:30"]),
    4: dayTemplate(["08:30", "12:30"], ["13:10", "18:30"]),
    5: dayTemplate(["08:30", "12:30"], ["13:10", "17:30"]), // venerdì corto
  },
};

const d = (iso: string) => Temporal.PlainDate.from(iso);

// ---------------------------------------------------------------------------
// entryTemplate
// ---------------------------------------------------------------------------

describe("entryTemplate", () => {
  it("accetta stringhe ISO", () => {
    const e = entryTemplate("08:30", "12:30");
    expect(e.start.toString()).toBe("08:30:00");
    expect(e.end.toString()).toBe("12:30:00");
  });

  it("accetta PlainTime direttamente", () => {
    const start = Temporal.PlainTime.from("08:30");
    const end = Temporal.PlainTime.from("12:30");
    const e = entryTemplate(start, end);
    expect(e.start).toBe(start);
    expect(e.end).toBe(end);
  });
});

// ---------------------------------------------------------------------------
// dayTemplate
// ---------------------------------------------------------------------------

describe("dayTemplate", () => {
  it("crea un DayTemplate con le entry in ordine", () => {
    const dt = dayTemplate(["08:30", "12:30"], ["13:10", "18:30"]);
    expect(dt.entries).toHaveLength(2);
    expect(dt.entries[0].start.toString()).toBe("08:30:00");
    expect(dt.entries[1].end.toString()).toBe("18:30:00");
  });

  it("permette una singola entry", () => {
    const dt = dayTemplate(["09:00", "17:00"]);
    expect(dt.entries).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// applyTemplate
// ---------------------------------------------------------------------------

describe("applyTemplate", () => {
  it("genera 5 DayRecord per una settimana lavorativa normale", () => {
    // Settimana del 8-12 giugno 2026 (lun-ven, nessun festivo)
    const records = applyTemplate(STANDARD_WEEK, d("2026-06-08"));
    expect(records).toHaveLength(5);
  });

  it("le date sono corrette e ordinate lun→ven", () => {
    const records = applyTemplate(STANDARD_WEEK, d("2026-06-08"));
    const dates = records.map((r) => r.date.toString());
    expect(dates).toEqual([
      "2026-06-08", // lun
      "2026-06-09", // mar
      "2026-06-10", // mer
      "2026-06-11", // gio
      "2026-06-12", // ven
    ]);
  });

  it("normalizza a lunedì se viene passata una data a metà settimana", () => {
    // mercoledì 10 giugno → deve calcolare dalla settimana lun 8
    const records = applyTemplate(STANDARD_WEEK, d("2026-06-10"));
    expect(records[0].date.toString()).toBe("2026-06-08");
  });

  it("gli slot del lunedì hanno 2 TimeEntry con gli orari corretti", () => {
    const records = applyTemplate(STANDARD_WEEK, d("2026-06-08"));
    const monday = records.find((r) => r.date.toString() === "2026-06-08")!;
    expect(monday.slots).toHaveLength(2);
    const [morning, afternoon] = monday.slots;
    expect(morning.kind).toBe("entry");
    expect(afternoon.kind).toBe("entry");
    if (morning.kind === "entry") {
      expect(morning.start.toString()).toBe("08:30:00");
      expect(morning.end.toString()).toBe("12:30:00");
    }
    if (afternoon.kind === "entry") {
      expect(afternoon.start.toString()).toBe("13:10:00");
      expect(afternoon.end.toString()).toBe("18:30:00");
    }
  });

  it("salta i giorni festivi anche se definiti nel template", () => {
    // Settimana che include il 2 giugno (Festa della Repubblica) — martedì
    // La settimana di riferimento è lun 1 – ven 5 giugno 2026
    const records = applyTemplate(STANDARD_WEEK, d("2026-06-01"));
    const dates = records.map((r) => r.date.toString());
    expect(dates).not.toContain("2026-06-02"); // festivo
    expect(dates).toContain("2026-06-01"); // lunedì ok
    expect(dates).toContain("2026-06-03"); // mercoledì ok
  });

  it("salta i giorni non presenti nel template (sabato/domenica)", () => {
    const records = applyTemplate(STANDARD_WEEK, d("2026-06-08"));
    const dates = records.map((r) => r.date.toString());
    expect(dates).not.toContain("2026-06-13"); // sabato
    expect(dates).not.toContain("2026-06-14"); // domenica
  });

  it("rispetta extraHolidays nella config", () => {
    const config = { extraHolidays: new Set(["2026-06-10"]) }; // mercoledì custom
    const records = applyTemplate(STANDARD_WEEK, d("2026-06-08"), config);
    const dates = records.map((r) => r.date.toString());
    expect(dates).not.toContain("2026-06-10");
    expect(records).toHaveLength(4);
  });

  it("restituisce array vuoto se tutta la settimana è festiva/weekend", () => {
    // Template solo per sabato (6) e domenica (7)
    const weekendOnly: WeekTemplate = {
      id: "weekend",
      name: "Weekend",
      days: {
        6: dayTemplate(["10:00", "12:00"]),
        7: dayTemplate(["10:00", "12:00"]),
      },
    };
    const records = applyTemplate(weekendOnly, d("2026-06-08"));
    expect(records).toHaveLength(0);
  });

  it("template vuoto (nessun giorno definito) → array vuoto", () => {
    const empty: WeekTemplate = { id: "empty", name: "Vuoto", days: {} };
    expect(applyTemplate(empty, d("2026-06-08"))).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// mergeTemplateRecords
// ---------------------------------------------------------------------------

describe("mergeTemplateRecords", () => {
  // Genero template records per la settimana 8-12 giugno 2026
  const tplRecords = applyTemplate(STANDARD_WEEK, d("2026-06-08"));

  it('strategia "skip": non sovrascrive record esistenti', () => {
    const existing = [
      {
        date: d("2026-06-08"),
        slots: [
          {
            kind: "entry" as const,
            start: Temporal.PlainTime.from("10:00"),
            end: Temporal.PlainTime.from("16:00"),
          },
        ],
      },
    ];
    const merged = mergeTemplateRecords(existing, tplRecords, "skip");
    const monday = merged.find((r) => r.date.toString() === "2026-06-08")!;
    // Gli slot originali non devono essere cambiati
    expect(monday.slots).toHaveLength(1);
    expect(monday.slots[0].kind === "entry" && monday.slots[0].start.toString()).toBe("10:00:00");
  });

  it('strategia "overwrite": sostituisce i record esistenti', () => {
    const existing = [
      {
        date: d("2026-06-08"),
        slots: [
          {
            kind: "entry" as const,
            start: Temporal.PlainTime.from("10:00"),
            end: Temporal.PlainTime.from("16:00"),
          },
        ],
      },
    ];
    const merged = mergeTemplateRecords(existing, tplRecords, "overwrite");
    const monday = merged.find((r) => r.date.toString() === "2026-06-08")!;
    expect(monday.slots).toHaveLength(2); // template ha 2 entry
    expect(monday.slots[0].kind === "entry" && monday.slots[0].start.toString()).toBe("08:30:00");
  });

  it('strategia "append": aggiunge slot al record esistente', () => {
    const existing = [
      {
        date: d("2026-06-08"),
        slots: [
          {
            kind: "entry" as const,
            start: Temporal.PlainTime.from("07:00"),
            end: Temporal.PlainTime.from("08:00"),
          },
        ],
      },
    ];
    const merged = mergeTemplateRecords(existing, tplRecords, "append");
    const monday = merged.find((r) => r.date.toString() === "2026-06-08")!;
    // 1 esistente + 2 dal template
    expect(monday.slots).toHaveLength(3);
  });

  it("aggiunge giorni nuovi in tutti i casi", () => {
    // existing ha solo lunedì, il template ha lun-ven
    const existing = [{ date: d("2026-06-08"), slots: [] }];
    const merged = mergeTemplateRecords(existing, tplRecords, "skip");
    expect(merged).toHaveLength(5);
  });

  it("il risultato è ordinato per data", () => {
    const merged = mergeTemplateRecords([], tplRecords);
    for (let i = 1; i < merged.length; i++) {
      expect(
        Temporal.PlainDate.compare(merged[i - 1].date, merged[i].date)
      ).toBe(-1);
    }
  });

  it('strategia default è "skip"', () => {
    const existing = [
      {
        date: d("2026-06-08"),
        slots: [
          {
            kind: "entry" as const,
            start: Temporal.PlainTime.from("10:00"),
            end: Temporal.PlainTime.from("16:00"),
          },
        ],
      },
    ];
    const merged = mergeTemplateRecords(existing, tplRecords); // nessuna strategia
    const monday = merged.find((r) => r.date.toString() === "2026-06-08")!;
    expect(monday.slots).toHaveLength(1); // non sovrascritto
  });
});
