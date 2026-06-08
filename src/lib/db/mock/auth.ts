/**
 * Mock implementation of the Supabase Auth API surface.
 * Exposes the same method signatures as `supabase.auth` so callers
 * don't need to know whether they're hitting real Supabase or the mock.
 */

import type {
  AuthResponse,
  SessionResponse,
  AuthSession,
  AuthUser,
} from "../types";
import { store, notifyAuthListeners, mockToken, resetStore as _reset } from "./store";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function now(): string {
  return new Date().toISOString();
}

function makeSession(user: AuthUser): AuthSession {
  return {
    user,
    access_token: mockToken(user.id),
    refresh_token: mockToken(user.id + "-refresh"),
  };
}

// ---------------------------------------------------------------------------
// Auth methods (Supabase-compatible signatures)
// ---------------------------------------------------------------------------

export const mockAuth = {
  /**
   * Signs in with email + password.
   * In the mock any password is accepted for existing accounts.
   */
  async signInWithPassword({
    email,
    password: _password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    let user = store.users.find((u) => u.email === email);

    if (!user) {
      return {
        data: null,
        error: { message: "Invalid login credentials", code: "invalid_credentials" },
      };
    }

    const session = makeSession(user);
    store.currentSession = session;
    notifyAuthListeners("SIGNED_IN", session);

    return { data: { user, session }, error: null };
  },

  /**
   * Registers a new user.
   * In the mock, duplicate emails return an error (matching Supabase behaviour).
   */
  async signUp({
    email,
    password: _password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    if (store.users.find((u) => u.email === email)) {
      return {
        data: null,
        error: { message: "User already registered", code: "user_already_exists" },
      };
    }

    const user: AuthUser = {
      id: crypto.randomUUID(),
      email,
      created_at: now(),
    };

    store.users.push({ id: user.id, email, created_at: user.created_at });

    // In real Supabase with email confirmation enabled, session is null until confirmed.
    // Mock skips confirmation and returns a live session immediately.
    const session = makeSession(user);
    store.currentSession = session;
    notifyAuthListeners("SIGNED_IN", session);

    return { data: { user, session }, error: null };
  },

  async getSession(): Promise<SessionResponse> {
    return {
      data: { session: store.currentSession },
      error: null,
    };
  },

  async signOut(): Promise<{ error: null }> {
    store.currentSession = null;
    notifyAuthListeners("SIGNED_OUT", null);
    return { error: null };
  },

  onAuthStateChange(
    callback: (event: string, session: AuthSession | null) => void
  ): { data: { subscription: { unsubscribe: () => void } } } {
    store.authListeners.push(callback);

    return {
      data: {
        subscription: {
          unsubscribe() {
            const idx = store.authListeners.indexOf(callback);
            if (idx !== -1) store.authListeners.splice(idx, 1);
          },
        },
      },
    };
  },
};
