import { supabase } from "./client";
import { Property, PropertyCategory, slugify } from "@/types/property";
import { PropertyRow } from "@/types/database.types";
import { PaginationResult, PropertyFilterParams } from "@/types/pagination";
import {
  featuredProperties as fallbackFeatured,
  initialMarketProperties,
  additionalMarketProperties,
  defaultAgent,
  defaultAmenities,
} from "@/data/mockData";

const allFallbackProperties = [
  ...fallbackFeatured,
  ...initialMarketProperties,
  ...additionalMarketProperties,
];

const extraFallbackImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
];

export function mapRowToProperty(row: PropertyRow): Property {
  // Check if we have richer mock data for this property id
  const matchingFallback = allFallbackProperties.find((p) => p.id === row.id);

  const rawImages =
    row.images && Array.isArray(row.images) && row.images.length > 0
      ? row.images
      : matchingFallback?.images && matchingFallback.images.length > 0
      ? matchingFallback.images
      : row.image_url
      ? [row.image_url]
      : [extraFallbackImages[0]];

  // Ensure each property has at least 4 images (1 main + 3 additional)
  const images =
    rawImages.length >= 4
      ? rawImages
      : [
          ...rawImages,
          ...extraFallbackImages.filter((img) => !rawImages.includes(img)),
        ].slice(0, 5);

  const slug =
    row.slug ||
    matchingFallback?.slug ||
    slugify(row.title || `property-${row.id}`);

  const monthlyEst = Math.round(Number(row.price) * 0.0043);

  return {
    id: row.id,
    slug,
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
    garage: matchingFallback?.garage ?? 2,
    images,
    imageUrl: images[0],
    imageAlt: row.image_alt,
    badge: row.badge ?? undefined,
    badges: matchingFallback?.badges ?? (row.badge ? [row.badge] : []),
    isFeatured: row.is_featured ?? false,
    hideOnBreakpoint: row.hide_on_breakpoint ?? undefined,
    description: matchingFallback?.description ?? [
      `Experience exceptional luxury living at ${row.title}, situated in ${row.location}. Crafted with meticulous attention to detail, this residence provides expansive open spaces and modern comfort.`,
      `Featuring ${row.beds} spacious bedrooms, ${row.baths} pristine bathrooms, and high-end finishes throughout. Contact our dedicated advisory team for a private viewing.`,
    ],
    amenities: matchingFallback?.amenities ?? defaultAmenities,
    agent: matchingFallback?.agent ?? defaultAgent,
    coordinates: matchingFallback?.coordinates ?? {
      lat: 37.7749,
      lng: -122.4194,
    },
    estimatedPayment: matchingFallback?.estimatedPayment ?? {
      monthly: monthlyEst,
      formattedMonthly: `$${monthlyEst.toLocaleString()}/mo`,
      downPaymentPercent: 20,
    },
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
 * Updates the 'is_featured' flag for a property in Supabase
 */
export async function setPropertyFeaturedStatus(
  id: string,
  isFeatured: boolean
): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .update({ is_featured: isFeatured })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error(`Error setting featured status for property ${id}:`, error);
      return null;
    }

    return mapRowToProperty(data);
  } catch (err) {
    console.error(`Unexpected error updating is_featured for ${id}:`, err);
    return null;
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
 * Fetches a single property by slug (with fallback to ID or local dataset)
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();

  // 1. Try querying Supabase
  try {
    // Check if property matches slug directly
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (data && !error) {
      return mapRowToProperty(data);
    }

    // If no direct slug match in DB, try matching by ID
    const { data: dataById } = await supabase
      .from("properties")
      .select("*")
      .eq("id", cleanSlug)
      .maybeSingle();

    if (dataById) {
      return mapRowToProperty(dataById);
    }
  } catch {
    // Continue to fallback check
  }

  // 2. Check local fallback datasets
  const fallback = allFallbackProperties.find(
    (p) =>
      p.slug.toLowerCase() === cleanSlug ||
      p.id.toLowerCase() === cleanSlug ||
      slugify(p.title) === cleanSlug
  );

  return fallback || null;
}

/**
 * Returns all property slugs for static optimization / pre-rendering
 */
export async function getAllPropertySlugs(): Promise<string[]> {
  try {
    const { data } = await supabase.from("properties").select("id, title, slug");
    if (data && data.length > 0) {
      return data.map((d) => d.slug || slugify(d.title || d.id));
    }
  } catch {
    // Continue to fallback
  }

  return allFallbackProperties.map((p) => p.slug);
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
