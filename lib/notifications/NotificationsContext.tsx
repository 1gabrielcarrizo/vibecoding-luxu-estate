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

export type NotificationType =
  | "visit_scheduled"
  | "visit_cancelled"
  | "agent_message"
  | "sell_request"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  read: boolean;
  createdAt: number;
}

export type NewNotification = Omit<AppNotification, "id" | "read" | "createdAt">;

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isHydrated: boolean;
  addNotification: (notification: NewNotification) => AppNotification;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const GUEST_STORAGE_KEY = "luxe_estate_notifications";
const NOTIFICATIONS_CHANGE_EVENT = "luxe-estate-notifications-change";
const MAX_NOTIFICATIONS = 30;

function getStorageKey(userId?: string | null): string {
  return userId ? `${GUEST_STORAGE_KEY}_${userId}` : GUEST_STORAGE_KEY;
}

function parseNotificationsRaw(raw: string | null): AppNotification[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is AppNotification =>
        Boolean(
          item &&
            typeof item === "object" &&
            typeof item.id === "string" &&
            typeof item.type === "string" &&
            typeof item.title === "string" &&
            typeof item.message === "string" &&
            typeof item.read === "boolean" &&
            typeof item.createdAt === "number"
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

function writeNotificationsToStorage(
  key: string,
  entries: AppNotification[]
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      key,
      JSON.stringify(entries.slice(0, MAX_NOTIFICATIONS))
    );
    window.dispatchEvent(
      new CustomEvent(NOTIFICATIONS_CHANGE_EVENT, { detail: { key } })
    );
  } catch (err) {
    console.warn("Unable to persist notifications to localStorage:", err);
  }
}

function subscribeToHydration(): () => void {
  return () => {};
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({
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
      window.addEventListener(NOTIFICATIONS_CHANGE_EVENT, handleCustom);

      return () => {
        window.removeEventListener("storage", handleStorage);
        window.removeEventListener(NOTIFICATIONS_CHANGE_EVENT, handleCustom);
      };
    },
    [storageKey]
  );

  const rawSnapshot = useSyncExternalStore(
    subscribe,
    () => readRawFromStorage(storageKey),
    () => "[]"
  );

  // Merge guest notifications into user notifications on login
  useEffect(() => {
    if (isAuthLoading || !user?.id || typeof window === "undefined") return;

    const guestEntries = parseNotificationsRaw(
      readRawFromStorage(GUEST_STORAGE_KEY)
    );
    if (guestEntries.length === 0) return;

    const userEntries = parseNotificationsRaw(readRawFromStorage(storageKey));
    const mergedMap = new Map<string, AppNotification>();

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
    writeNotificationsToStorage(storageKey, merged);
  }, [isAuthLoading, user?.id, storageKey]);

  const notifications = useMemo(
    () => parseNotificationsRaw(rawSnapshot),
    [rawSnapshot]
  );

  const isHydrated = isClient && !isAuthLoading;

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const addNotification = useCallback(
    (notification: NewNotification): AppNotification => {
      const current = parseNotificationsRaw(readRawFromStorage(storageKey));
      const newEntry: AppNotification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        read: false,
        createdAt: Date.now(),
      };
      const next = [newEntry, ...current].slice(0, MAX_NOTIFICATIONS);
      writeNotificationsToStorage(storageKey, next);
      return newEntry;
    },
    [storageKey]
  );

  const markAsRead = useCallback(
    (id: string) => {
      const current = parseNotificationsRaw(readRawFromStorage(storageKey));
      const next = current.map((n) => (n.id === id ? { ...n, read: true } : n));
      writeNotificationsToStorage(storageKey, next);
    },
    [storageKey]
  );

  const markAllAsRead = useCallback(() => {
    const current = parseNotificationsRaw(readRawFromStorage(storageKey));
    const next = current.map((n) => ({ ...n, read: true }));
    writeNotificationsToStorage(storageKey, next);
  }, [storageKey]);

  const removeNotification = useCallback(
    (id: string) => {
      const current = parseNotificationsRaw(readRawFromStorage(storageKey));
      const next = current.filter((n) => n.id !== id);
      writeNotificationsToStorage(storageKey, next);
    },
    [storageKey]
  );

  const clearNotifications = useCallback(() => {
    writeNotificationsToStorage(storageKey, []);
  }, [storageKey]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isHydrated,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearNotifications,
    }),
    [
      notifications,
      unreadCount,
      isHydrated,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearNotifications,
    ]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
