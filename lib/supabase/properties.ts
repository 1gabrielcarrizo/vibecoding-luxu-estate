import { supabase } from "./client";
import { Property, PropertyCategory } from "@/types/property";
import { PropertyRow } from "@/types/database.types";
import { PaginationResult, PropertyFilterParams } from "@/types/pagination";
import {
  featuredProperties as fallbackFeatured,
  initialMarketProperties,
  additionalMarketProperties,
} from "@/data/mockData";

export function mapRowToProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    price: Number(row.price),
    formattedPrice: row.formatted_price,
    priceSuffix: row.price_suffix ?? undefined,
    type: row.type,
    category: row.category,
    beds: Number(row.beds),
    baths: Number(row.baths),
    sqm: Number(row.sqm),
    imageUrl: row.image_url,
    imageAlt: row.image_alt,
    badge: row.badge ?? undefined,
    isFeatured: row.is_featured ?? false,
    hideOnBreakpoint: row.hide_on_breakpoint ?? undefined,
  };
}

/**
 * Fetches featured properties from Supabase
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .order("id", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("Using fallback featured properties:", error?.message);
      return fallbackFeatured;
    }

    return data.map(mapRowToProperty);
  } catch (err) {
    console.error("Error fetching featured properties:", err);
    return fallbackFeatured;
  }
}

/**
 * Server-side paginated properties query with filters
 */
export async function getPaginatedProperties(
  params: PropertyFilterParams = {}
): Promise<PaginationResult> {
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.max(1, Number(params.pageSize) || 8);
  const category = params.category;
  const type = params.type;
  const rawQuery = params.query?.trim();

  try {
    let queryBuilder = supabase
      .from("properties")
      .select("*", { count: "exact" })
      .eq("is_featured", false);

    // Filter by Category
    if (category && category !== "All") {
      queryBuilder = queryBuilder.eq(
        "category",
        category as "House" | "Apartment" | "Villa" | "Penthouse"
      );
    }

    // Filter by Market tab / Type
    if (type === "Buy" || type === "sale") {
      queryBuilder = queryBuilder.eq("type", "sale");
    } else if (type === "Rent" || type === "rent") {
      queryBuilder = queryBuilder.eq("type", "rent");
    }

    // Filter by Search Query
    if (rawQuery) {
      // Escape special characters for ilike
      const cleanQuery = rawQuery.replace(/[%_]/g, "\\$&");
      queryBuilder = queryBuilder.or(
        `title.ilike.%${cleanQuery}%,location.ilike.%${cleanQuery}%,category.ilike.%${cleanQuery}%`
      );
    }

    // Pagination range
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await queryBuilder
      .order("id", { ascending: true })
      .range(from, to);

    if (error || !data) {
      console.warn("Using fallback paginated properties:", error?.message);
      return getFallbackPaginatedProperties({
        page,
        pageSize,
        category,
        type,
        query: rawQuery,
      });
    }

    const totalCount = count ?? data.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const properties = data.map(mapRowToProperty);

    return {
      properties,
      totalCount,
      totalPages,
      currentPage: page,
      pageSize,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (err) {
    console.error("Error fetching paginated properties from Supabase:", err);
    return getFallbackPaginatedProperties({
      page,
      pageSize,
      category,
      type,
      query: rawQuery,
    });
  }
}

/**
 * Fallback in-memory pagination in case of network issues
 */
function getFallbackPaginatedProperties(
  params: PropertyFilterParams
): PaginationResult {
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.max(1, Number(params.pageSize) || 8);
  const allFallback = [...initialMarketProperties, ...additionalMarketProperties];

  let filtered = allFallback;

  if (params.query?.trim()) {
    const q = params.query.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (params.category && params.category !== "All") {
    filtered = filtered.filter((p) => p.category === params.category);
  }

  if (params.type === "Buy" || params.type === "sale") {
    filtered = filtered.filter((p) => p.type === "sale");
  } else if (params.type === "Rent" || params.type === "rent") {
    filtered = filtered.filter((p) => p.type === "rent");
  }

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const from = (page - 1) * pageSize;
  const properties = filtered.slice(from, from + pageSize);

  return {
    properties,
    totalCount,
    totalPages,
    currentPage: page,
    pageSize,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
