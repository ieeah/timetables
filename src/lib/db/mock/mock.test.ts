import { describe, it, expect, beforeEach } from "vitest";
import { db, resetStore } from "../index";

beforeEach(() => {
  resetStore();
});

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

describe("mock auth — signUp", () => {
  it("crea un nuovo utente e restituisce sessione", async () => {
    const { data, error } = await db.auth.signUp({
      email: "test@example.com",
      password: "password123",
    });
    expect(error).toBeNull();
    expect(data?.user?.email).toBe("test@example.com");
    expect(data?.session?.access_token).toBeTruthy();
  });

  it("restituisce errore per email duplicata", async () => {
    await db.auth.signUp({ email: "dup@example.com", password: "pw" });
    const { data, error } = await db.auth.signUp({
      email: "dup@example.com",
      password: "pw",
    });
    expect(data).toBeNull();
    expect(error?.code).toBe("user_already_exists");
  });
});

describe("mock auth — signInWithPassword", () => {
  it("autentica un utente esistente", async () => {
    await db.auth.signUp({ email: "user@example.com", password: "pw" });
    const { data, error } = await db.auth.signInWithPassword({
      email: "user@example.com",
      password: "any-password", // mock accetta qualsiasi password
    });
    expect(error).toBeNull();
    expect(data?.user?.email).toBe("user@example.com");
  });

  it("restituisce errore per utente inesistente", async () => {
    const { data, error } = await db.auth.signInWithPassword({
      email: "ghost@example.com",
      password: "pw",
    });
    expect(data).toBeNull();
    expect(error?.code).toBe("invalid_credentials");
  });
});

describe("mock auth — getSession / signOut", () => {
  it("getSession restituisce la sessione attiva dopo login", async () => {
    await db.auth.signUp({ email: "s@example.com", password: "pw" });
    const { data } = await db.auth.getSession();
    expect(data?.session?.user.email).toBe("s@example.com");
  });

  it("getSession restituisce null dopo signOut", async () => {
    await db.auth.signUp({ email: "s@example.com", password: "pw" });
    await db.auth.signOut();
    const { data } = await db.auth.getSession();
    expect(data?.session).toBeNull();
  });
});

describe("mock auth — onAuthStateChange", () => {
  it("notifica SIGNED_IN al login", async () => {
    const events: string[] = [];
    const { data: sub } = db.auth.onAuthStateChange((event) => {
      events.push(event);
    });
    await db.auth.signUp({ email: "evt@example.com", password: "pw" });
    expect(events).toContain("SIGNED_IN");
    sub.subscription.unsubscribe();
  });

  it("notifica SIGNED_OUT al logout", async () => {
    const events: string[] = [];
    const { data: sub } = db.auth.onAuthStateChange((event) => {
      events.push(event);
    });
    await db.auth.signUp({ email: "evt@example.com", password: "pw" });
    await db.auth.signOut();
    expect(events).toContain("SIGNED_OUT");
    sub.subscription.unsubscribe();
  });

  it("unsubscribe smette di ricevere eventi", async () => {
    const events: string[] = [];
    const { data: sub } = db.auth.onAuthStateChange((event) => {
      events.push(event);
    });
    sub.subscription.unsubscribe();
    await db.auth.signUp({ email: "evt2@example.com", password: "pw" });
    expect(events).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Query builder
// ---------------------------------------------------------------------------

describe("mock queries — insert + select", () => {
  it("inserisce un record e lo recupera con select", async () => {
    const userId = crypto.randomUUID();
    await db.from("day_records").insert({
      id: crypto.randomUUID(),
      user_id: userId,
      date: "2026-06-08",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const { data, error } = await db.from("day_records").select("*");
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
    expect((data as any[])[0].date).toBe("2026-06-08");
  });

  it("genera id automaticamente se non fornito", async () => {
    await db.from("day_records").insert({
      user_id: crypto.randomUUID(),
      date: "2026-06-09",
    });
    const { data } = await db.from("day_records").select("*");
    expect((data as any[])[0].id).toBeTruthy();
  });
});

describe("mock queries — eq filter", () => {
  it("filtra per colonna", async () => {
    const idA = crypto.randomUUID();
    const idB = crypto.randomUUID();
    await db.from("day_records").insert([
      { user_id: idA, date: "2026-06-08" },
      { user_id: idB, date: "2026-06-09" },
    ]);

    const { data } = await db
      .from("day_records")
      .select("*")
      .eq("user_id", idA);

    expect((data as any[])).toHaveLength(1);
    expect((data as any[])[0].date).toBe("2026-06-08");
  });
});

describe("mock queries — upsert", () => {
  it("inserisce se il record non esiste", async () => {
    const id = crypto.randomUUID();
    await db.from("day_records").upsert({ id, user_id: "u1", date: "2026-06-08" });
    const { data } = await db.from("day_records").select("*");
    expect((data as any[])).toHaveLength(1);
  });

  it("aggiorna se il record esiste (conflict su id)", async () => {
    const id = crypto.randomUUID();
    await db.from("day_records").upsert({ id, user_id: "u1", date: "2026-06-08" });
    await db.from("day_records").upsert({ id, user_id: "u1", date: "2026-06-10" });
    const { data } = await db.from("day_records").select("*");
    expect((data as any[])).toHaveLength(1);
    expect((data as any[])[0].date).toBe("2026-06-10");
  });
});

describe("mock queries — update", () => {
  it("aggiorna i campi specificati sui record filtrati", async () => {
    const id = crypto.randomUUID();
    await db.from("day_records").insert({ id, user_id: "u1", date: "2026-06-08" });
    await db.from("day_records").update({ date: "2026-06-15" }).eq("id", id);
    const { data } = await db.from("day_records").select("*").eq("id", id);
    expect((data as any[])[0].date).toBe("2026-06-15");
  });
});

describe("mock queries — delete", () => {
  it("elimina i record che soddisfano il filtro", async () => {
    const idA = crypto.randomUUID();
    const idB = crypto.randomUUID();
    await db.from("day_records").insert([
      { id: idA, user_id: "u1", date: "2026-06-08" },
      { id: idB, user_id: "u1", date: "2026-06-09" },
    ]);
    await db.from("day_records").delete().eq("id", idA);
    const { data } = await db.from("day_records").select("*");
    expect((data as any[])).toHaveLength(1);
    expect((data as any[])[0].id).toBe(idB);
  });
});

describe("mock queries — order", () => {
  it("ordina per colonna ascending", async () => {
    await db.from("day_records").insert([
      { user_id: "u1", date: "2026-06-10" },
      { user_id: "u1", date: "2026-06-08" },
      { user_id: "u1", date: "2026-06-09" },
    ]);
    const { data } = await db
      .from("day_records")
      .select("*")
      .order("date", { ascending: true });
    const dates = (data as any[]).map((r) => r.date);
    expect(dates).toEqual(["2026-06-08", "2026-06-09", "2026-06-10"]);
  });

  it("ordina per colonna descending", async () => {
    await db.from("day_records").insert([
      { user_id: "u1", date: "2026-06-08" },
      { user_id: "u1", date: "2026-06-10" },
    ]);
    const { data } = await db
      .from("day_records")
      .select("*")
      .order("date", { ascending: false });
    expect((data as any[])[0].date).toBe("2026-06-10");
  });
});

describe("mock queries — tabella sconosciuta", () => {
  it("lancia errore per tabella non registrata", () => {
    expect(() => db.from("nonexistent_table")).toThrow(
      'Mock DB: unknown table "nonexistent_table"'
    );
  });
});
