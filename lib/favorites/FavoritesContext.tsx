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

export interface FavoriteEntry {
  id: string;
  addedAt: number;
}

interface FavoritesContextType {
  favorites: FavoriteEntry[];
  favoriteIds: Set<string>;
  favoritesCount: number;
  isHydrated: boolean;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => void;
  addFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
  clearFavorites: () => void;
}

const GUEST_STORAGE_KEY = "luxe_estate_favorites";
const FAVORITES_CHANGE_EVENT = "luxe-estate-favorites-change";

function getStorageKey(userId?: string | null): string {
  return userId ? `${GUEST_STORAGE_KEY}_${userId}` : GUEST_STORAGE_KEY;
}

function parseFavoritesRaw(raw: string | null): FavoriteEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const normalized: FavoriteEntry[] = [];
    const seen = new Set<string>();

    for (const item of parsed) {
      if (typeof item === "string" && item.trim() && !seen.has(item)) {
        seen.add(item);
        normalized.push({ id: item, addedAt: 0 });
      } else if (
        item &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        item.id.trim() &&
        !seen.has(item.id)
      ) {
        seen.add(item.id);
        normalized.push({
          id: item.id,
          addedAt: typeof item.addedAt === "number" ? item.addedAt : 0,
        });
      }
    }

    return normalized;
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

function writeFavoritesToStorage(key: string, entries: FavoriteEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(entries));
    window.dispatchEvent(
      new CustomEvent(FAVORITES_CHANGE_EVENT, { detail: { key } })
    );
  } catch (err) {
    console.warn("Unable to persist favorites to localStorage:", err);
  }
}

function subscribeToHydration(): () => void {
  return () => {};
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const storageKey = useMemo(
    () => getStorageKey(user?.id ?? null),
    [user?.id]
  );

  // React 19 hydration-safe client flag
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
      window.addEventListener(FAVORITES_CHANGE_EVENT, handleCustom);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(FAVORITES_CHANGE_EVENT, handleCustom);
      };
    },
    [storageKey]
  );

  const rawSnapshot = useSyncExternalStore(
    subscribe,
    () => readRawFromStorage(storageKey),
    () => "[]"
  );

  // Merge guest favorites into authenticated user's favorites on login
  useEffect(() => {
    if (isAuthLoading || !user?.id || typeof window === "undefined") return;

    const guestEntries = parseFavoritesRaw(readRawFromStorage(GUEST_STORAGE_KEY));
    if (guestEntries.length === 0) return;

    const userEntries = parseFavoritesRaw(readRawFromStorage(storageKey));
    const mergedMap = new Map<string, FavoriteEntry>();

    for (const entry of userEntries) {
      mergedMap.set(entry.id, entry);
    }
    for (const entry of guestEntries) {
      if (!mergedMap.has(entry.id)) {
        mergedMap.set(entry.id, entry);
      }
    }

    const merged = Array.from(mergedMap.values()).sort(
      (a, b) => b.addedAt - a.addedAt
    );

    try {
      window.localStorage.removeItem(GUEST_STORAGE_KEY);
    } catch {
      // ignore
    }
    writeFavoritesToStorage(storageKey, merged);
  }, [isAuthLoading, user?.id, storageKey]);

  const favorites = useMemo(
    () => parseFavoritesRaw(rawSnapshot),
    [rawSnapshot]
  );

  const isHydrated = isClient && !isAuthLoading;

  const favoriteIds = useMemo(
    () => new Set(favorites.map((entry) => entry.id)),
    [favorites]
  );

  const isFavorite = useCallback(
    (propertyId: string) => favoriteIds.has(propertyId),
    [favoriteIds]
  );

  const addFavorite = useCallback(
    (propertyId: string) => {
      const current = parseFavoritesRaw(readRawFromStorage(storageKey));
      if (current.some((entry) => entry.id === propertyId)) return;
      const next = [{ id: propertyId, addedAt: Date.now() }, ...current];
      writeFavoritesToStorage(storageKey, next);
    },
    [storageKey]
  );

  const removeFavorite = useCallback(
    (propertyId: string) => {
      const current = parseFavoritesRaw(readRawFromStorage(storageKey));
      const next = current.filter((entry) => entry.id !== propertyId);
      writeFavoritesToStorage(storageKey, next);
    },
    [storageKey]
  );

  const toggleFavorite = useCallback(
    (propertyId: string) => {
      const current = parseFavoritesRaw(readRawFromStorage(storageKey));
      const exists = current.some((entry) => entry.id === propertyId);
      const next = exists
        ? current.filter((entry) => entry.id !== propertyId)
        : [{ id: propertyId, addedAt: Date.now() }, ...current];
      writeFavoritesToStorage(storageKey, next);
    },
    [storageKey]
  );

  const clearFavorites = useCallback(() => {
    writeFavoritesToStorage(storageKey, []);
  }, [storageKey]);

  const value = useMemo(
    () => ({
      favorites,
      favoriteIds,
      favoritesCount: favorites.length,
      isHydrated,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [
      favorites,
      favoriteIds,
      isHydrated,
      isFavorite,
      toggleFavorite,
      addFavorite,
      removeFavorite,
      clearFavorites,
    ]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
