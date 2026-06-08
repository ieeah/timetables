/**
 * In-memory store for the mock DB.
 * All tables are plain arrays; IDs are generated with crypto.randomUUID().
 *
 * The store is a singleton — imported references always share the same object,
 * so mutations in auth.ts are visible in queries.ts and vice versa.
 */

import type {
  UserRow,
  UserSettingsRow,
  DayRecordRow,
  WorkSlotRow,
  AuthSession,
} from "../types";

export type MockStore = {
  users: UserRow[];
  settings: UserSettingsRow[];
  day_records: DayRecordRow[];
  work_slots: WorkSlotRow[];
  // active session (one at a time — single-user mock)
  currentSession: AuthSession | null;
  // auth state listeners
  authListeners: Array<(event: string, session: AuthSession | null) => void>;
};

export const store: MockStore = {
  users: [],
  settings: [],
  day_records: [],
  work_slots: [],
  currentSession: null,
  authListeners: [],
};

/** Notify all registered auth listeners. */
export function notifyAuthListeners(
  event: string,
  session: AuthSession | null
): void {
  for (const fn of store.authListeners) {
    fn(event, session);
  }
}

/** Generate a mock JWT-like access token (not a real JWT). */
export function mockToken(userId: string): string {
  return `mock-token-${userId}-${Date.now()}`;
}

/** Reset the store to empty — useful in tests. */
export function resetStore(): void {
  store.users = [];
  store.settings = [];
  store.day_records = [];
  store.work_slots = [];
  store.currentSession = null;
  store.authListeners = [];
}
