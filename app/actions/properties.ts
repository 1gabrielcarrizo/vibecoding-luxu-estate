"use server";

import {
  getPaginatedProperties,
  setPropertyFeaturedStatus,
} from "@/lib/supabase/properties";
import { PaginationResult, PropertyFilterParams } from "@/types/pagination";
import { revalidatePath } from "next/cache";

/**
 * Next.js Server Action to fetch paginated properties from Supabase
 */
export async function fetchPropertiesAction(
  params: PropertyFilterParams
): Promise<PaginationResult> {
  return await getPaginatedProperties(params);
}

/**
 * Next.js Server Action to assign or update the 'is_featured' flag of a property
 */
export async function setPropertyFeaturedAction(
  propertyId: string,
  isFeatured: boolean
) {
  const updated = await setPropertyFeaturedStatus(propertyId, isFeatured);
  revalidatePath("/");
  return updated;
}
