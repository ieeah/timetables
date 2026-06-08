/**
 * Database client — single switch point between mock and real Supabase.
 *
 * To connect real Supabase:
 *   1. Set NEXT_PUBLIC_USE_MOCK_DB=false (or remove it) in .env.local
 *   2. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * The exported `db` object exposes:
 *   db.from(table)  — query builder (select / insert / upsert / update / delete)
 *   db.auth         — auth methods (signInWithPassword / signUp / getSession / signOut / onAuthStateChange)
 *
 * Both shapes are identical to the Supabase JS client so no call-site changes
 * are needed when switching.
 */

import { mockAuth } from "./mock/auth";
import { from as mockFrom } from "./mock/queries";

// ---------------------------------------------------------------------------
// Mode detection
// ---------------------------------------------------------------------------

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK_DB !== "false" ||
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ---------------------------------------------------------------------------
// Real Supabase client (lazy — only instantiated when USE_MOCK is false)
// ---------------------------------------------------------------------------

let _supabaseClient: import("@supabase/supabase-js").SupabaseClient | null = null;

function getSupabaseClient() {
  if (_supabaseClient) return _supabaseClient;
  // Dynamic import keeps the Supabase SDK out of the bundle in mock mode
  const { createClient } = require("@supabase/supabase-js");
  _supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return _supabaseClient!;
}

// ---------------------------------------------------------------------------
// Unified db client
// ---------------------------------------------------------------------------

export const db = {
  from(table: string) {
    if (USE_MOCK) return mockFrom(table);
    return getSupabaseClient().from(table);
  },

  get auth() {
    if (USE_MOCK) return mockAuth;
    return getSupabaseClient().auth;
  },
} as const;

export { USE_MOCK };
