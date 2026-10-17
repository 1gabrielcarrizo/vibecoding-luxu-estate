"use server";

import { getPaginatedProperties } from "@/lib/supabase/properties";
import { PaginationResult, PropertyFilterParams } from "@/types/pagination";

/**
 * Next.js Server Action to fetch paginated properties from Supabase
 */
export async function fetchPropertiesAction(
  params: PropertyFilterParams
): Promise<PaginationResult> {
  return await getPaginatedProperties(params);
}
