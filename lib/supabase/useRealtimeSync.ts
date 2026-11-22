"use client";

import { useEffect, useRef } from "react";
import type {
  RealtimePostgresChangesPayload,
  RealtimeChannel,
} from "@supabase/supabase-js";
import { supabase } from "./client";

export type RealtimeTableName = "properties" | "user_roles";

export interface UseRealtimeTableSyncOptions {
  table: RealtimeTableName;
  event?: "*" | "INSERT" | "UPDATE" | "DELETE";
  filter?: string;
  enabled?: boolean;
  debounceMs?: number;
  onEvent: (
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>
  ) => void;
}

let channelCounter = 0;

/**
 * Fail-safe hook that subscribes to Supabase Realtime postgres_changes
 * for a given public table. Never throws or blocks rendering if WebSockets
 * are unavailable; always cleans up its channel on unmount.
 */
export function useRealtimeTableSync({
  table,
  event = "*",
  filter,
  enabled = true,
  debounceMs = 0,
  onEvent,
}: UseRealtimeTableSyncOptions): void {
  const onEventRef = useRef(onEvent);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let channel: RealtimeChannel | null = null;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let isDisposed = false;

    const channelName = `rt-${table}-${++channelCounter}-${Date.now()}`;

    try {
      const subscriptionConfig: {
        event: "*" | "INSERT" | "UPDATE" | "DELETE";
        schema: "public";
        table: string;
        filter?: string;
      } = {
        event,
        schema: "public",
        table,
      };

      if (filter) {
        subscriptionConfig.filter = filter;
      }

      channel = supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          subscriptionConfig,
          (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
            if (isDisposed) return;

            if (debounceMs > 0) {
              if (debounceTimer) clearTimeout(debounceTimer);
              debounceTimer = setTimeout(() => {
                if (!isDisposed) {
                  onEventRef.current(payload);
                }
              }, debounceMs);
            } else {
              onEventRef.current(payload);
            }
          }
        )
        .subscribe((status, err) => {
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            console.warn(
              `[Realtime] Channel "${channelName}" status: ${status}`,
              err ?? ""
            );
          }
        });
    } catch (err) {
      console.warn(
        `[Realtime] Could not subscribe to public.${table}:`,
        err
      );
    }

    return () => {
      isDisposed = true;
      if (debounceTimer) clearTimeout(debounceTimer);
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [table, event, filter, enabled, debounceMs]);
}
