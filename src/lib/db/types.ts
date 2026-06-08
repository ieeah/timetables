/**
 * Database row types — mirror the Supabase table schemas defined in ROADMAP.md.
 * These are plain JSON-serializable objects (no Temporal types).
 * Temporal values are stored as ISO strings and parsed at the application layer.
 */

export type UserRow = {
  id: string;           // uuid
  email: string;
  created_at: string;   // ISO timestamptz
};

export type UserSettingsRow = {
  user_id: string;
  default_hours_per_day: number;
  extra_holidays: string[];         // "YYYY-MM-DD"[]
  working_overrides: string[];      // "YYYY-MM-DD"[]
  non_working_days_of_week: number[]; // 1–7
  updated_at: string;
};

export type DayRecordRow = {
  id: string;
  user_id: string;
  date: string;         // "YYYY-MM-DD"
  created_at: string;
  updated_at: string;
};

export type WorkSlotRow = {
  id: string;
  day_record_id: string;
  user_id: string;
  kind: "entry" | "placeholder";
  sort_order: number;
  // entry fields
  start_time: string | null;        // "HH:MM:SS"
  end_time: string | null;          // "HH:MM:SS"
  // placeholder fields
  placeholder_type: "leave" | "holiday" | "sick" | "other" | null;
  placeholder_label: string | null;
  start_date: string | null;        // "YYYY-MM-DD"
  end_date: string | null;          // "YYYY-MM-DD"
  hours_per_day: number | null;
  created_at: string;
  updated_at: string;
};

// ---------------------------------------------------------------------------
// Supabase-compatible response shapes
// ---------------------------------------------------------------------------

export type DbResponse<T> = {
  data: T | null;
  error: DbError | null;
};

export type DbError = {
  message: string;
  code?: string;
};

// Auth types (subset of Supabase Auth)
export type AuthUser = {
  id: string;
  email: string | undefined;
  created_at: string;
};

export type AuthSession = {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
};

export type AuthResponse = DbResponse<{ user: AuthUser; session: AuthSession | null }>;
export type SessionResponse = DbResponse<{ session: AuthSession | null }>;
