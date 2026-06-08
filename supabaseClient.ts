/**
 * Legacy compatibility shim.
 *
 * All new code should import from "@/lib/db" directly.
 * This file re-exports `db.auth` as `supabaseAuth` so existing call-sites
 * (login/page.tsx) keep working without changes.
 */

import { db } from "@/lib/db";

export const supabaseAuth = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const { error, data } = await db.auth.signInWithPassword({ email, password });
      return error ? [error, null] : [null, data];
    } catch (err) {
      return [err as Error, null];
    }
  },

  signUp: async ({ email, password }: { email: string; password: string }) => {
    try {
      const { error, data } = await db.auth.signUp({ email, password });
      return error ? [error, null] : [null, data];
    } catch (err) {
      return [err as Error, null];
    }
  },

  getSession: async () => {
    try {
      const { data, error } = await db.auth.getSession();
      return error ? [error, null] : [null, data];
    } catch (err) {
      return [err as Error, null];
    }
  },

  signOut: async () => {
    try {
      const { error } = await db.auth.signOut();
      return error ? [error, null] : [null, {}];
    } catch (err) {
      return [err as Error, null];
    }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const { data } = db.auth.onAuthStateChange(callback);
    return data;
  },
};

/** @deprecated Use `db` from "@/lib/db" directly. */
export { db as supabase } from "@/lib/db";
