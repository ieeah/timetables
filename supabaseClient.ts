import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
);

export const supabaseAuth = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return error ? [error, null] : [null, data];
    } catch (error) {
      return [error as Error, null];
    }
  },

  signUp: async ({ email, password }: { email: string; password: string }) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });
      return error ? [error, null] : [null, data];
    } catch (error) {
      return [error as Error, null];
    }
  },

  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      return error ? [error, null] : [null, data];
    } catch (error) {
      return [error as Error, null];
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return error ? [error, null] : [null, {}];
    } catch (error) {
      return [error as Error, null];
    }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return data;
  },
};
