"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRealtimeTableSync } from "@/lib/supabase/useRealtimeSync";

interface PropertyRealtimeListenerProps {
  propertyId: string;
}

/**
 * Keeps a single property detail or schedule page synchronized in real time
 * whenever an admin edits or deactivates this property in Supabase.
 */
export const PropertyRealtimeListener: React.FC<
  PropertyRealtimeListenerProps
> = ({ propertyId }) => {
  const router = useRouter();

  const handleChange = useCallback(() => {
    router.refresh();
  }, [router]);

  useRealtimeTableSync({
    table: "properties",
    filter: `id=eq.${propertyId}`,
    debounceMs: 300,
    onEvent: handleChange,
  });

  return null;
};
