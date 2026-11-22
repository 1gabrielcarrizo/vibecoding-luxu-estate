"use client";

import React, { useCallback } from "react";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useRealtimeTableSync } from "@/lib/supabase/useRealtimeSync";
import { useAuth } from "@/lib/supabase/AuthContext";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useNotifications } from "@/lib/notifications/NotificationsContext";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface ProfileAlertPrefs {
  newPropertyAlerts: boolean;
  priceDropAlerts: boolean;
}

function readAlertPrefs(userId?: string | null): ProfileAlertPrefs {
  if (typeof window === "undefined") {
    return { newPropertyAlerts: true, priceDropAlerts: true };
  }
  const key = userId
    ? `luxe_estate_profile_prefs_${userId}`
    : "luxe_estate_profile_prefs";
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return { newPropertyAlerts: true, priceDropAlerts: true };
    const parsed = JSON.parse(raw);
    return {
      newPropertyAlerts:
        typeof parsed?.newPropertyAlerts === "boolean"
          ? parsed.newPropertyAlerts
          : true,
      priceDropAlerts:
        typeof parsed?.priceDropAlerts === "boolean"
          ? parsed.priceDropAlerts
          : true,
    };
  } catch {
    return { newPropertyAlerts: true, priceDropAlerts: true };
  }
}

function formatPriceUsd(price: number): string {
  return `$${Math.round(price).toLocaleString("en-US")}`;
}

/**
 * Global zero-UI listener that translates live Supabase Realtime property events
 * into user notifications respecting their profile alert preferences.
 */
export const RealtimeAlertsBridge: React.FC = () => {
  const { user } = useAuth();
  const { isFavorite } = useFavorites();
  const { addNotification } = useNotifications();
  const { t } = useTranslation();

  const handlePropertyEvent = useCallback(
    (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      const prefs = readAlertPrefs(user?.id ?? null);
      const next = payload.new as Record<string, unknown> | undefined;
      const prev = payload.old as Record<string, unknown> | undefined;

      if (!next || typeof next.id !== "string") return;

      const isActive = next.is_active !== false;
      const title =
        typeof next.title === "string" && next.title.trim()
          ? next.title
          : "LuxeEstate";
      const slug =
        typeof next.slug === "string" && next.slug.trim() ? next.slug : next.id;
      const location =
        typeof next.location === "string" ? next.location : "";

      // 1. Price drop alert on a saved favorite property
      if (payload.eventType === "UPDATE" && isActive && prefs.priceDropAlerts) {
        const newPrice = Number(next.price);
        const oldPrice = Number(prev?.price);
        if (
          isFavorite(next.id) &&
          Number.isFinite(newPrice) &&
          Number.isFinite(oldPrice) &&
          oldPrice > 0 &&
          newPrice > 0 &&
          newPrice < oldPrice
        ) {
          addNotification({
            type: "system",
            title: t("notifications.priceDropTitle"),
            message: t("notifications.priceDropMessage", {
              title,
              oldPrice: formatPriceUsd(oldPrice),
              newPrice: formatPriceUsd(newPrice),
            }),
            href: `/propiedades/${slug}`,
          });
        }
      }

      // 2. New property alert when an active listing is created
      if (payload.eventType === "INSERT" && isActive && prefs.newPropertyAlerts) {
        const formattedPrice =
          typeof next.formatted_price === "string" && next.formatted_price
            ? next.formatted_price
            : Number.isFinite(Number(next.price))
              ? formatPriceUsd(Number(next.price))
              : "";
        addNotification({
          type: "system",
          title: t("notifications.newPropertyTitle"),
          message: t("notifications.newPropertyMessage", {
            title,
            location,
            price: formattedPrice,
          }),
          href: `/propiedades/${slug}`,
        });
      }
    },
    [user?.id, isFavorite, addNotification, t]
  );

  useRealtimeTableSync({
    table: "properties",
    onEvent: handlePropertyEvent,
  });

  return null;
};
