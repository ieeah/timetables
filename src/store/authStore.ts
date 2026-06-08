import { create } from "zustand";
import { db } from "@/lib/db";
import type { AuthSession, AuthUser, AuthResponse, SessionResponse } from "@/lib/db";

// Cast helpers: when USE_MOCK=false, db.auth returns Supabase types which are
// structurally compatible but not nominally identical. We cast at the boundary
// so the rest of the store works purely against our AuthUser/AuthSession types.
const auth = db.auth as {
  getSession(): Promise<SessionResponse>;
  signInWithPassword(c: { email: string; password: string }): Promise<AuthResponse>;
  signUp(c: { email: string; password: string }): Promise<AuthResponse>;
  signOut(): Promise<{ error: { message: string } | null }>;
  onAuthStateChange(
    cb: (event: string, session: AuthSession | null) => void
  ): { data: { subscription: { unsubscribe(): void } } };
};

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated" | "error";

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSession | null;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  _setSession: (session: AuthSession | null) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  user: null,
  session: null,
  error: null,

  /**
   * Load the existing session on app startup and subscribe to auth changes.
   * Call once from a top-level component or layout.
   */
  initialize: async () => {
    set({ status: "loading" });

    const { data, error } = await auth.getSession();
    if (error) {
      set({ status: "error", error: error.message });
      return;
    }

    const session = data?.session ?? null;
    set({
      status: session ? "authenticated" : "unauthenticated",
      session,
      user: session?.user ?? null,
      error: null,
    });

    // Keep in sync with auth events (tab/session restore, logout from elsewhere)
    auth.onAuthStateChange((_event, session) => {
      get()._setSession(session);
    });
  },

  login: async (email, password) => {
    set({ status: "loading", error: null });
    const { data, error } = await auth.signInWithPassword({ email, password });
    if (error) {
      set({ status: "unauthenticated", error: error.message });
      return error.message;
    }
    set({
      status: "authenticated",
      session: data!.session,
      user: data!.user,
      error: null,
    });
    return null;
  },

  signUp: async (email, password) => {
    set({ status: "loading", error: null });
    const { data, error } = await auth.signUp({ email, password });
    if (error) {
      set({ status: "unauthenticated", error: error.message });
      return error.message;
    }
    set({
      status: "authenticated",
      session: data!.session,
      user: data!.user,
      error: null,
    });
    return null;
  },

  logout: async () => {
    await auth.signOut();
    set({ status: "unauthenticated", session: null, user: null, error: null });
  },

  _setSession: (session) => {
    set({
      status: session ? "authenticated" : "unauthenticated",
      session,
      user: session?.user ?? null,
    });
  },
}));
