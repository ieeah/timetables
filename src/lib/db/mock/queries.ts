/**
 * Mock implementation of the Supabase query builder.
 *
 * Supports the subset of the Supabase JS client used by this app:
 *   db.from(table).select(...)
 *   db.from(table).select(...).eq(col, val)
 *   db.from(table).select(...).eq(...).order(col, { ascending })
 *   db.from(table).insert(row | rows)
 *   db.from(table).upsert(row | rows, { onConflict })
 *   db.from(table).update(patch).eq(col, val)
 *   db.from(table).delete().eq(col, val)
 *
 * Every terminal call returns a Promise<{ data, error }> — identical to
 * how Supabase resolves queries.
 */

import type { DbResponse } from "../types";
import { store } from "./store";

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

type TableName = keyof typeof tableMap;
type Row = Record<string, unknown>;
type Filter = { col: string; value: unknown };
type OrderOpt = { ascending?: boolean };

// Map table names to store keys
const tableMap = {
  users: "users",
  user_settings: "settings",
  day_records: "day_records",
  work_slots: "work_slots",
} as const;

function getTable(name: TableName): Row[] {
  return store[tableMap[name]] as Row[];
}

function now(): string {
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// Query builder
// ---------------------------------------------------------------------------

class MockQueryBuilder {
  private _table: TableName;
  private _filters: Filter[] = [];
  private _orderCol: string | null = null;
  private _orderAsc = true;
  private _operation: "select" | "insert" | "upsert" | "update" | "delete" =
    "select";
  private _payload: Row | Row[] | null = null;
  private _upsertConflict: string | null = null;
  private _updatePatch: Partial<Row> | null = null;

  constructor(table: TableName) {
    this._table = table;
  }

  // ---- Filters ----

  eq(col: string, value: unknown): this {
    this._filters.push({ col, value });
    return this;
  }

  order(col: string, opts: OrderOpt = {}): this {
    this._orderCol = col;
    this._orderAsc = opts.ascending ?? true;
    return this;
  }

  // ---- Operations ----

  select(_columns = "*"): this {
    this._operation = "select";
    return this;
  }

  insert(rows: Row | Row[]): this {
    this._operation = "insert";
    this._payload = rows;
    return this;
  }

  upsert(rows: Row | Row[], opts: { onConflict?: string } = {}): this {
    this._operation = "upsert";
    this._payload = rows;
    this._upsertConflict = opts.onConflict ?? "id";
    return this;
  }

  update(patch: Partial<Row>): this {
    this._operation = "update";
    this._updatePatch = patch;
    return this;
  }

  delete(): this {
    this._operation = "delete";
    return this;
  }

  // ---- Execution (awaiting the builder resolves it) ----

  then<TResult>(
    resolve: (value: DbResponse<Row[]>) => TResult
  ): Promise<TResult> {
    return Promise.resolve(this._execute()).then(resolve);
  }

  private _execute(): DbResponse<Row[]> {
    try {
      const table = getTable(this._table);

      switch (this._operation) {
        case "select": {
          let rows = [...table];
          rows = this._applyFilters(rows);
          rows = this._applyOrder(rows);
          return { data: rows, error: null };
        }

        case "insert": {
          const incoming = Array.isArray(this._payload)
            ? this._payload
            : [this._payload!];
          const stamped = incoming.map((r) => ({
            ...r,
            id: r.id ?? crypto.randomUUID(),
            created_at: r.created_at ?? now(),
            updated_at: r.updated_at ?? now(),
          }));
          table.push(...stamped);
          return { data: stamped, error: null };
        }

        case "upsert": {
          const incoming = Array.isArray(this._payload)
            ? this._payload
            : [this._payload!];
          const conflictKey = this._upsertConflict ?? "id";
          const result: Row[] = [];
          for (const row of incoming) {
            const idx = table.findIndex(
              (r) => r[conflictKey] === row[conflictKey]
            );
            const stamped = {
              ...row,
              id: row.id ?? crypto.randomUUID(),
              created_at: idx >= 0 ? table[idx].created_at : now(),
              updated_at: now(),
            };
            if (idx >= 0) {
              table[idx] = { ...table[idx], ...stamped };
              result.push(table[idx]);
            } else {
              table.push(stamped);
              result.push(stamped);
            }
          }
          return { data: result, error: null };
        }

        case "update": {
          const patch = this._updatePatch!;
          let rows = this._applyFilters([...table]);
          const updated: Row[] = [];
          for (const row of rows) {
            const idx = table.findIndex((r) => r.id === row.id);
            if (idx >= 0) {
              table[idx] = { ...table[idx], ...patch, updated_at: now() };
              updated.push(table[idx]);
            }
          }
          return { data: updated, error: null };
        }

        case "delete": {
          let toDelete = this._applyFilters([...table]);
          const ids = new Set(toDelete.map((r) => r.id));
          const remaining = table.filter((r) => !ids.has(r.id));
          // mutate in-place
          table.splice(0, table.length, ...remaining);
          return { data: toDelete, error: null };
        }
      }
    } catch (err) {
      return {
        data: null,
        error: { message: (err as Error).message },
      };
    }
  }

  private _applyFilters(rows: Row[]): Row[] {
    for (const { col, value } of this._filters) {
      rows = rows.filter((r) => r[col] === value);
    }
    return rows;
  }

  private _applyOrder(rows: Row[]): Row[] {
    if (!this._orderCol) return rows;
    const col = this._orderCol;
    return [...rows].sort((a, b) => {
      const av = a[col] as string;
      const bv = b[col] as string;
      return this._orderAsc
        ? av < bv ? -1 : av > bv ? 1 : 0
        : av > bv ? -1 : av < bv ? 1 : 0;
    });
  }
}

// ---------------------------------------------------------------------------
// Public factory — `db.from("table_name")`
// ---------------------------------------------------------------------------

export function from(table: string): MockQueryBuilder {
  if (!(table in tableMap)) {
    throw new Error(`Mock DB: unknown table "${table}"`);
  }
  return new MockQueryBuilder(table as TableName);
}
