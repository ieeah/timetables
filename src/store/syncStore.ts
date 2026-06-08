import { create } from "zustand";

export type SyncStatus = "idle" | "pending" | "syncing" | "synced" | "error" | "offline";

type SyncState = {
  status: SyncStatus;
  lastSyncedAt: string | null; // ISO timestamp
  error: string | null;

  // Actions
  setPending: () => void;
  setSyncing: () => void;
  setSynced: () => void;
  setError: (message: string) => void;
  setOffline: () => void;
  setOnline: () => void;
};

export const useSyncStore = create<SyncState>((set, get) => ({
  status: "idle",
  lastSyncedAt: null,
  error: null,

  setPending: () => set({ status: "pending", error: null }),

  setSyncing: () => set({ status: "syncing", error: null }),

  setSynced: () =>
    set({ status: "synced", lastSyncedAt: new Date().toISOString(), error: null }),

  setError: (message) => set({ status: "error", error: message }),

  setOffline: () => {
    // Only transition to offline if not already; preserve last known status in error
    if (get().status !== "offline") {
      set({ status: "offline", error: null });
    }
  },

  setOnline: () => {
    if (get().status === "offline") {
      set({ status: "pending" }); // Trigger a sync attempt on reconnect
    }
  },
}));
