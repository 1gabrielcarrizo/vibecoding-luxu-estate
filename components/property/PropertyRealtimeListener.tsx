"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useRealtimeTableSync } from "@/lib/supabase/useRealtimeSync";
import { slugify } from "@/types/property";

interface PropertyRealtimeListenerProps {
  propertyId: string;
  currentSlug: string;
  subPath?: "" | "/schedule";
}

/**
 * Keeps a single property detail or schedule page synchronized in real time.
 * If an admin renames the property (changing its slug), seamlessly transitions
 * via client-side router.replace to the new slug instead of showing 404.
 */
export const PropertyRealtimeListener: React.FC<
  PropertyRealtimeListenerProps
> = ({ propertyId, currentSlug, subPath = "" }) => {
  const router = useRouter();

  const handleChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
      if (payload.eventType === "DELETE") {
        router.refresh();
        return;
      }

      const next = payload.new as Record<string, unknown> | undefined;
      if (!next) {
        router.refresh();
        return;
      }

      // If deactivated, refresh so the page reflects unavailability
      if (next.is_active === false) {
        router.refresh();
        return;
      }

      const nextSlug =
        (typeof next.slug === "string" && next.slug.trim()) ||
        (typeof next.title === "string" && next.title.trim()
          ? slugify(next.title)
          : "");

      if (
        nextSlug &&
        nextSlug.toLowerCase() !== currentSlug.toLowerCase()
      ) {
        router.replace(`/propiedades/${nextSlug}${subPath}`);
        return;
      }

      router.refresh();
    },
    [router, currentSlug, subPath]
  );

  useRealtimeTableSync({
    table: "properties",
    filter: `id=eq.${propertyId}`,
    debounceMs: 250,
    onEvent: handleChange,
  });

  return null;
};
