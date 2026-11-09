"use server";

import {
  getPaginatedProperties,
  setPropertyFeaturedStatus,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyById,
  PropertyInput,
} from "@/lib/supabase/properties";
import { PaginationResult, PropertyFilterParams } from "@/types/pagination";
import { Property } from "@/types/property";
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
  revalidatePath("/admin/properties");
  return updated;
}

/**
 * Next.js Server Action to fetch a single property by ID
 */
export async function getPropertyByIdAction(
  id: string
): Promise<Property | null> {
  return await getPropertyById(id);
}

/**
 * Next.js Server Action to create a new property listing
 */
export async function createPropertyAction(
  data: PropertyInput
): Promise<{ success: boolean; property?: Property; error?: string }> {
  try {
    const created = await createProperty(data);
    revalidatePath("/");
    revalidatePath("/admin/properties");
    if (created.slug) {
      revalidatePath(`/propiedades/${created.slug}`);
    }
    return { success: true, property: created };
  } catch (err: any) {
    console.error("createPropertyAction error:", err);
    return {
      success: false,
      error: err?.message || "Failed to create property listing.",
    };
  }
}

/**
 * Next.js Server Action to update an existing property listing
 */
export async function updatePropertyAction(
  id: string,
  data: Partial<PropertyInput>
): Promise<{ success: boolean; property?: Property; error?: string }> {
  try {
    const updated = await updateProperty(id, data);
    revalidatePath("/");
    revalidatePath("/admin/properties");
    if (updated.slug) {
      revalidatePath(`/propiedades/${updated.slug}`);
    }
    return { success: true, property: updated };
  } catch (err: any) {
    console.error("updatePropertyAction error:", err);
    return {
      success: false,
      error: err?.message || "Failed to update property listing.",
    };
  }
}

/**
 * Next.js Server Action to delete a property listing
 */
export async function deletePropertyAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteProperty(id);
    revalidatePath("/");
    revalidatePath("/admin/properties");
    return { success: true };
  } catch (err: any) {
    console.error("deletePropertyAction error:", err);
    return {
      success: false,
      error: err?.message || "Failed to delete property listing.",
    };
  }
}
