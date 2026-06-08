import { describe, it, expect } from "vitest";
import { Temporal } from "./temporal";
import { isWorkingDay, countWorkingDays } from "./workdays";

const d = (iso: string) => Temporal.PlainDate.from(iso);

describe("isWorkingDay", () => {
  describe("weekend", () => {
    it("sabato non è lavorativo", () => {
      expect(isWorkingDay(d("2026-06-06"))).toBe(false); // sabato
    });

    it("domenica non è lavorativa", () => {
      expect(isWorkingDay(d("2026-06-07"))).toBe(false); // domenica
    });

    it("lunedì è lavorativo", () => {
      expect(isWorkingDay(d("2026-06-08"))).toBe(true);
    });
  });

  describe("festivi fissi italiani", () => {
    it("1 gennaio — Capodanno", () => expect(isWorkingDay(d("2026-01-01"))).toBe(false));
    it("6 gennaio — Epifania", () => expect(isWorkingDay(d("2026-01-06"))).toBe(false));
    it("25 aprile — Liberazione", () => expect(isWorkingDay(d("2026-04-25"))).toBe(false));
    it("1 maggio — Festa Lavoratori", () => expect(isWorkingDay(d("2026-05-01"))).toBe(false));
    it("2 giugno — Festa Repubblica", () => expect(isWorkingDay(d("2026-06-02"))).toBe(false));
    it("15 agosto — Ferragosto", () => expect(isWorkingDay(d("2026-08-15"))).toBe(false));
    it("1 novembre — Ognissanti", () => expect(isWorkingDay(d("2026-11-01"))).toBe(false));
    it("8 dicembre — Immacolata", () => expect(isWorkingDay(d("2026-12-08"))).toBe(false));
    it("25 dicembre — Natale", () => expect(isWorkingDay(d("2026-12-25"))).toBe(false));
    it("26 dicembre — Santo Stefano", () => expect(isWorkingDay(d("2026-12-26"))).toBe(false));
  });

  describe("festivi variabili", () => {
    // Pasqua 2026 = 5 aprile, Pasquetta = 6 aprile
    it("Pasqua 2026 (5 aprile)", () => expect(isWorkingDay(d("2026-04-05"))).toBe(false));
    it("Pasquetta 2026 (6 aprile)", () => expect(isWorkingDay(d("2026-04-06"))).toBe(false));
    // Pasqua 2025 = 20 aprile, Pasquetta = 21 aprile
    it("Pasqua 2025 (20 aprile)", () => expect(isWorkingDay(d("2025-04-20"))).toBe(false));
    it("Pasquetta 2025 (21 aprile)", () => expect(isWorkingDay(d("2025-04-21"))).toBe(false));
  });

  describe("WorkdayConfig — extraHolidays", () => {
    it("aggiunge un giorno festivo custom", () => {
      const config = { extraHolidays: new Set(["2026-03-19"]) }; // San Giuseppe
      expect(isWorkingDay(d("2026-03-19"), config)).toBe(false);
      expect(isWorkingDay(d("2026-03-19"))).toBe(true); // senza config è lavorativo
    });
  });

  describe("WorkdayConfig — workingOverrides", () => {
    it("un override rende lavorativo un festivo", () => {
      const config = { workingOverrides: new Set(["2026-06-02"]) };
      expect(isWorkingDay(d("2026-06-02"), config)).toBe(true);
    });

    it("un override ha precedenza anche sul weekend", () => {
      const config = { workingOverrides: new Set(["2026-06-06"]) };
      expect(isWorkingDay(d("2026-06-06"), config)).toBe(true); // sabato con override
    });
  });

  describe("WorkdayConfig — nonWorkingDaysOfWeek", () => {
    it("settimana corta (lun-gio): venerdì non è lavorativo", () => {
      const config = { nonWorkingDaysOfWeek: [5, 6, 7] };
      expect(isWorkingDay(d("2026-06-05"), config)).toBe(false); // venerdì
      expect(isWorkingDay(d("2026-06-04"), config)).toBe(true);  // giovedì
    });
  });
});

describe("countWorkingDays", () => {
  it("conta i giorni lavorativi in una settimana normale", () => {
    // lun 8 → ven 12 giugno 2026: 5 giorni
    expect(countWorkingDays(d("2026-06-08"), d("2026-06-12"))).toBe(5);
  });

  it("esclude weekend", () => {
    // lun 8 → dom 14 giugno 2026: 5 giorni (sab/dom esclusi)
    expect(countWorkingDays(d("2026-06-08"), d("2026-06-14"))).toBe(5);
  });

  it("caso reale: 1-6 giugno 2026 → 4 giorni (esclusi 2/6 festivo e 6/6 sabato)", () => {
    expect(countWorkingDays(d("2026-06-01"), d("2026-06-06"))).toBe(4);
  });

  it("range di un singolo giorno lavorativo → 1", () => {
    expect(countWorkingDays(d("2026-06-01"), d("2026-06-01"))).toBe(1);
  });

  it("range di un singolo giorno festivo → 0", () => {
    expect(countWorkingDays(d("2026-06-02"), d("2026-06-02"))).toBe(0);
  });

  it("lancia RangeError se start > end", () => {
    expect(() => countWorkingDays(d("2026-06-10"), d("2026-06-01"))).toThrow(RangeError);
  });

  it("rispetta extraHolidays nella config", () => {
    const config = { extraHolidays: new Set(["2026-06-08"]) }; // lunedì
    expect(countWorkingDays(d("2026-06-08"), d("2026-06-12"), config)).toBe(4);
  });
});
