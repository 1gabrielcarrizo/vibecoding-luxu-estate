"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { useAuth } from "@/lib/supabase/AuthContext";

export interface ScheduledVisit {
  id: string;
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  agentName: string;
  dateIso: string;
  timeSlot: string;
  message?: string;
  lat?: number;
  lng?: number;
  createdAt: number;
}

export type NewScheduledVisit = Omit<ScheduledVisit, "id" | "createdAt">;

interface VisitsContextType {
  visits: ScheduledVisit[];
  visitsCount: number;
  isHydrated: boolean;
  addVisit: (visit: NewScheduledVisit) => ScheduledVisit;
  removeVisit: (visitId: string) => void;
  clearVisits: () => void;
}

const GUEST_STORAGE_KEY = "luxe_estate_visits";
const VISITS_CHANGE_EVENT = "luxe-estate-visits-change";

function getStorageKey(userId?: string | null): string {
  return userId ? `${GUEST_STORAGE_KEY}_${userId}` : GUEST_STORAGE_KEY;
}

function parseVisitsRaw(raw: string | null): ScheduledVisit[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is ScheduledVisit =>
        Boolean(
          item &&
            typeof item === "object" &&
            typeof item.id === "string" &&
            typeof item.propertySlug === "string" &&
            typeof item.dateIso === "string" &&
            typeof item.timeSlot === "string"
        )
    );
  } catch {
    return [];
  }
}

function readRawFromStorage(key: string): string {
  if (typeof window === "undefined") return "[]";
  try {
    return window.localStorage.getItem(key) || "[]";
  } catch {
    return "[]";
  }
}

function writeVisitsToStorage(key: string, entries: ScheduledVisit[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(entries));
    window.dispatchEvent(
      new CustomEvent(VISITS_CHANGE_EVENT, { detail: { key } })
    );
  } catch (err) {
    console.warn("Unable to persist scheduled visits to localStorage:", err);
  }
}

function subscribeToHydration(): () => void {
  return () => {};
}

const VisitsContext = createContext<VisitsContextType | undefined>(undefined);

export const VisitsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const storageKey = useMemo(
    () => getStorageKey(user?.id ?? null),
    [user?.id]
  );

  const isClient = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  );

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined") return () => {};

      const handleStorage = (event: StorageEvent) => {
        if (!event.key || event.key === storageKey) {
          onStoreChange();
        }
      };

      const handleCustom = (event: Event) => {
        const detailKey = (event as CustomEvent<{ key?: string }>).detail?.key;
        if (!detailKey || detailKey === storageKey) {
          onStoreChange();
        }
      };

      window.addEventListener("storage", handleStorage);
      window.addEventListener(VISITS_CHANGE_EVENT, handleCustom);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(VISITS_CHANGE_EVENT, handleCustom);
      };
    },
    [storageKey]
  );

  const rawSnapshot = useSyncExternalStore(
    subscribe,
    () => readRawFromStorage(storageKey),
    () => "[]"
  );

  // Merge guest scheduled visits when signing in
  useEffect(() => {
    if (isAuthLoading || !user?.id || typeof window === "undefined") return;

    const guestEntries = parseVisitsRaw(readRawFromStorage(GUEST_STORAGE_KEY));
    if (guestEntries.length === 0) return;

    const userEntries = parseVisitsRaw(readRawFromStorage(storageKey));
    const mergedMap = new Map<string, ScheduledVisit>();

    for (const entry of userEntries) {
      mergedMap.set(entry.id, entry);
    }
    for (const entry of guestEntries) {
      if (!mergedMap.has(entry.id)) {
        mergedMap.set(entry.id, entry);
      }
    }

    const merged = Array.from(mergedMap.values()).sort(
      (a, b) => b.createdAt - a.createdAt
    );

    try {
      window.localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {
      // ignore
    }
    writeVisitsToStorage(storageKey, merged);
  }, [isAuthLoading, user?.id, storageKey]);

  const visits = useMemo(() => parseVisitsRaw(rawSnapshot), [rawSnapshot]);
  const isHydrated = isClient && !isAuthLoading;

  const addVisit = useCallback(
    (visit: NewScheduledVisit): ScheduledVisit => {
      const current = parseVisitsRaw(readRawFromStorage(storageKey));
      const newEntry: ScheduledVisit = {
        ...visit,
        id: `visit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: Date.now(),
      };
      // Replace any previous visit for the exact same property so rescheduling stays tidy
      const filtered = current.filter(
        (item) => item.propertyId !== visit.propertyId
      );
      const next = [newEntry, ...filtered];
      writeVisitsToStorage(storageKey, next);
      return newEntry;
    },
    [storageKey]
  );

  const removeVisit = useCallback(
    (visitId: string) => {
      const current = parseVisitsRaw(readRawFromStorage(storageKey));
      const next = current.filter((item) => item.id !== visitId);
      writeVisitsToStorage(storageKey, next);
    },
    [storageKey]
  );

  const clearVisits = useCallback(() => {
    writeVisitsToStorage(storageKey, []);
  }, [storageKey]);

  const value = useMemo(
    () => ({
      visits,
      visitsCount: visits.length,
      isHydrated,
      addVisit,
      removeVisit,
      clearVisits,
    }),
    [visits, isHydrated, addVisit, removeVisit, clearVisits]
  );

  return (
    <VisitsContext.Provider value={value}>{children}</VisitsContext.Provider>
  );
};

export const useVisits = () => {
  const context = useContext(VisitsContext);
  if (!context) {
    throw new Error("useVisits must be used within a VisitsProvider");
  }
  return context;
};
