import { supabase } from "./client";
import { Property, PropertyCategory, slugify } from "@/types/property";
import { PropertyRow, Database } from "@/types/database.types";
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

/**
 * Safely extracts an array of image URLs from a database row,
 * supporting native arrays (text[]/jsonb), JSON string ('["..."]'), or single URL string.
 */
export function parseImagesFromRow(
  row: PropertyRow,
  fallbackImages?: string[]
): string[] {
  // 1. Direct array in image_url
  if (Array.isArray(row.image_url) && row.image_url.length > 0) {
    return (row.image_url as unknown[]).map(String).filter(Boolean);
  }

  // 2. Direct array in images column (if present)
  if (Array.isArray(row.images) && row.images.length > 0) {
    return (row.images as unknown[]).map(String).filter(Boolean);
  }

  // 3. String representation in image_url (e.g. JSON string '["url1","url2"]' or single string)
  if (typeof row.image_url === "string" && row.image_url.trim().length > 0) {
    const trimmed = row.image_url.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(String).filter(Boolean);
        }
      } catch {
        // Fallback below
      }
    } else if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const items = trimmed
        .slice(1, -1)
        .split(",")
        .map((s) => s.replace(/^"|"$/g, "").trim())
        .filter(Boolean);
      if (items.length > 0) return items;
    } else {
      return [trimmed];
    }
  }

  // 4. Use matching fallback images from local data
  if (fallbackImages && fallbackImages.length > 0) {
    return fallbackImages;
  }

  return extraFallbackImages;
}

export function mapRowToProperty(row: PropertyRow): Property {
  // Check if we have richer mock data for this property id
  const matchingFallback = allFallbackProperties.find((p) => p.id === row.id);

  const rawImages = parseImagesFromRow(row, matchingFallback?.images);

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

  const description = row.description
    ? (row.description.includes("\n\n") ? row.description.split("\n\n").filter(Boolean) : [row.description])
    : (matchingFallback?.description ?? [
      `Experience exceptional luxury living at ${row.title}, situated in ${row.location}. Crafted with meticulous attention to detail, this residence provides expansive open spaces and modern comfort.`,
      `Featuring ${row.beds} spacious bedrooms, ${row.baths} pristine bathrooms, and high-end finishes throughout. Contact our dedicated advisory team for a private viewing.`,
    ]);

  const amenities =
    row.amenities && row.amenities.length > 0
      ? row.amenities
      : (matchingFallback?.amenities ?? defaultAmenities);

  const garage = row.garage != null ? Number(row.garage) : (matchingFallback?.garage ?? 2);
  const yearBuilt = row.year_built != null ? Number(row.year_built) : undefined;

  const rawCoords =
    row.lat != null && row.lng != null
      ? { lat: Number(row.lat), lng: Number(row.lng) }
      : row.coordinates && typeof row.coordinates === "object"
      ? {
          lat: Number((row.coordinates as any).lat) || 37.7749,
          lng: Number((row.coordinates as any).lng) || -122.4194,
        }
      : (matchingFallback?.coordinates ?? {
          lat: 37.7749,
          lng: -122.4194,
        });

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
    garage,
    yearBuilt,
    images,
    imageUrl: images[0],
    imageAlt: row.image_alt,
    badge: row.badge ?? undefined,
    badges: matchingFallback?.badges ?? (row.badge ? [row.badge] : []),
    isFeatured: row.is_featured ?? false,
    isActive: row.is_active ?? true,
    hideOnBreakpoint: row.hide_on_breakpoint ?? undefined,
    description,
    amenities,
    agent: matchingFallback?.agent ?? defaultAgent,
    coordinates: rawCoords,
    estimatedPayment: matchingFallback?.estimatedPayment ?? {
      monthly: monthlyEst,
      formattedMonthly: `$${monthlyEst.toLocaleString()}/mo`,
      downPaymentPercent: 20,
    },
  };
}

/**
 * Fetches featured properties from Supabase (strictly limited to 2)
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("id", { ascending: true })
      .limit(2);

    if (error || !data || data.length === 0) {
      console.warn("Using fallback featured properties:", error?.message);
      return fallbackFeatured.filter((p) => p.isActive !== false).slice(0, 2);
    }

    return data.slice(0, 2).map(mapRowToProperty);
  } catch (err) {
    console.error("Error fetching featured properties:", err);
    return fallbackFeatured.filter((p) => p.isActive !== false).slice(0, 2);
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
 * Retrieves all market properties, merging Supabase database entries with rich mock additions
 */
export async function getAllMarketProperties(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("is_featured", false)
      .eq("is_active", true);

    if (data && data.length > 0 && !error) {
      const dbProps = data.map(mapRowToProperty);
      const existingIds = new Set(dbProps.map((p) => p.id));
      const extraProps = [
        ...initialMarketProperties.filter((p) => !existingIds.has(p.id) && p.isActive !== false),
        ...additionalMarketProperties.filter((p) => !existingIds.has(p.id) && p.isActive !== false),
      ];
      return [...dbProps, ...extraProps];
    }
  } catch (err) {
    console.warn("Using fallback market properties:", err);
  }

  return [
    ...initialMarketProperties.filter((p) => p.isActive !== false),
    ...additionalMarketProperties.filter((p) => p.isActive !== false),
  ];
}

/**
 * Retrieves ALL properties for the admin dashboard (both featured and standard),
 * merging Supabase entries with fallbacks.
 */
export async function getAllPropertiesForAdmin(): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && data.length > 0 && !error) {
      const dbProps = data.map(mapRowToProperty);
      const existingIds = new Set(dbProps.map((p) => p.id));
      const extraProps = allFallbackProperties.filter(
        (p) => !existingIds.has(p.id)
      );
      return [...dbProps, ...extraProps];
    }
  } catch (err) {
    console.warn("Using fallback properties for admin:", err);
  }

  return allFallbackProperties;
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
  const minPrice = params.minPrice;
  const maxPrice = params.maxPrice;
  const beds = params.beds;
  const baths = params.baths;
  const amenities = params.amenities;

  const allProps = await getAllMarketProperties();

  let filtered = allProps;

  // Filter by Search Query
  if (rawQuery) {
    const q = rawQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // Filter by Category
  if (category && category !== "All" && category !== "Any Type") {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by Market tab / Type
  if (type === "Buy" || type === "sale") {
    filtered = filtered.filter((p) => p.type === "sale");
  } else if (type === "Rent" || type === "rent") {
    filtered = filtered.filter((p) => p.type === "rent");
  }

  // Filter by Min Price
  if (typeof minPrice === "number" && !isNaN(minPrice) && minPrice > 0) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }

  // Filter by Max Price
  if (typeof maxPrice === "number" && !isNaN(maxPrice) && maxPrice > 0) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  // Filter by Bedrooms
  if (typeof beds === "number" && !isNaN(beds) && beds > 0) {
    filtered = filtered.filter((p) => p.beds >= beds);
  }

  // Filter by Bathrooms
  if (typeof baths === "number" && !isNaN(baths) && baths > 0) {
    filtered = filtered.filter((p) => p.baths >= baths);
  }

  // Filter by Amenities
  if (amenities && Array.isArray(amenities) && amenities.length > 0) {
    filtered = filtered.filter((p) => {
      if (!p.amenities || p.amenities.length === 0) return false;
      const propAmenitiesLower = p.amenities.map((a) => a.toLowerCase());
      return amenities.every((req) =>
        propAmenitiesLower.some(
          (a) => a.includes(req.toLowerCase()) || req.toLowerCase().includes(a)
        )
      );
    });
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
      if (data.is_active === false) {
        return null;
      }
      return mapRowToProperty(data);
    }

    // If no direct slug match in DB, try matching by ID
    const { data: dataById } = await supabase
      .from("properties")
      .select("*")
      .eq("id", cleanSlug)
      .maybeSingle();

    if (dataById) {
      if (dataById.is_active === false) {
        return null;
      }
      return mapRowToProperty(dataById);
    }
  } catch {
    // Continue to fallback check
  }

  // 2. Check local fallback datasets
  const fallback = allFallbackProperties.find(
    (p) =>
      p.isActive !== false &&
      (p.slug.toLowerCase() === cleanSlug ||
        p.id.toLowerCase() === cleanSlug ||
        slugify(p.title) === cleanSlug)
  );

  return fallback || null;
}

/**
 * Returns all property slugs for static optimization / pre-rendering
 */
export async function getAllPropertySlugs(): Promise<string[]> {
  try {
    const { data } = await supabase
      .from("properties")
      .select("id, title, slug, is_active")
      .eq("is_active", true);
    if (data && data.length > 0) {
      return data.map((d) => d.slug || slugify(d.title || d.id));
    }
  } catch {
    // Continue to fallback
  }

  return allFallbackProperties
    .filter((p) => p.isActive !== false)
    .map((p) => p.slug);
}

/**
 * Fallback in-memory pagination in case of network issues
 */
function getFallbackPaginatedProperties(
  params: PropertyFilterParams
): PaginationResult {
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.max(1, Number(params.pageSize) || 8);
  const allFallback = [
    ...initialMarketProperties.filter((p) => p.isActive !== false),
    ...additionalMarketProperties.filter((p) => p.isActive !== false),
  ];

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

  if (params.category && params.category !== "All" && params.category !== "Any Type") {
    filtered = filtered.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
  }

  if (params.type === "Buy" || params.type === "sale") {
    filtered = filtered.filter((p) => p.type === "sale");
  } else if (params.type === "Rent" || params.type === "rent") {
    filtered = filtered.filter((p) => p.type === "rent");
  }

  if (typeof params.minPrice === "number" && !isNaN(params.minPrice) && params.minPrice > 0) {
    filtered = filtered.filter((p) => p.price >= params.minPrice!);
  }

  if (typeof params.maxPrice === "number" && !isNaN(params.maxPrice) && params.maxPrice > 0) {
    filtered = filtered.filter((p) => p.price <= params.maxPrice!);
  }

  if (typeof params.beds === "number" && !isNaN(params.beds) && params.beds > 0) {
    filtered = filtered.filter((p) => p.beds >= params.beds!);
  }

  if (typeof params.baths === "number" && !isNaN(params.baths) && params.baths > 0) {
    filtered = filtered.filter((p) => p.baths >= params.baths!);
  }

  if (params.amenities && Array.isArray(params.amenities) && params.amenities.length > 0) {
    filtered = filtered.filter((p) => {
      if (!p.amenities || p.amenities.length === 0) return false;
      const propAmenitiesLower = p.amenities.map((a) => a.toLowerCase());
      return params.amenities!.every((req) =>
        propAmenitiesLower.some(
          (a) => a.includes(req.toLowerCase()) || req.toLowerCase().includes(a)
        )
      );
    });
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

export interface PropertyInput {
  id?: string;
  title: string;
  location: string;
  price: number;
  type: "sale" | "rent";
  category: "House" | "Apartment" | "Villa" | "Penthouse" | "Commercial";
  beds: number;
  baths: number;
  sqm: number;
  garage?: number;
  yearBuilt?: number;
  images: string[];
  description?: string;
  amenities?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  badge?: string;
  priceSuffix?: string;
  lat?: number;
  lng?: number;
  coordinates?: { lat: number; lng: number };
}

/**
 * Fetches a single property by its ID (checking Supabase DB first, then fallback mock data)
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  const cleanId = decodeURIComponent(id).trim();
  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", cleanId)
      .maybeSingle();

    if (data && !error) {
      return mapRowToProperty(data);
    }
  } catch (err) {
    console.warn("Error fetching property by id from db:", err);
  }

  // Fallback to local
  const fallback = allFallbackProperties.find(
    (p) => p.id === cleanId || p.slug === cleanId
  );
  return fallback || null;
}

/**
 * Creates a new property in Supabase database
 */
export async function createProperty(input: PropertyInput): Promise<Property> {
  const newId = input.id || `prop-${Date.now()}`;
  const slug = slugify(input.title) || `prop-${Date.now()}`;
  const formattedPrice = `$${Number(input.price).toLocaleString("en-US")}`;
  const images =
    input.images && input.images.length > 0
      ? input.images
      : [extraFallbackImages[0]];
  const imageUrl = JSON.stringify(images);
  const imageAlt = `${input.title} - ${input.location}`;

  const rowData: Database["public"]["Tables"]["properties"]["Insert"] = {
    id: newId,
    slug,
    title: input.title,
    location: input.location,
    price: input.price,
    formatted_price: formattedPrice,
    price_suffix: input.priceSuffix || (input.type === "rent" ? "/month" : null),
    type: input.type,
    category: input.category,
    beds: input.beds,
    baths: input.baths,
    sqm: input.sqm,
    garage: input.garage ?? 1,
    year_built: input.yearBuilt ?? new Date().getFullYear(),
    image_url: imageUrl,
    images: images,
    image_alt: imageAlt,
    badge:
      input.badge ||
      (input.isFeatured
        ? "Featured"
        : input.type === "rent"
          ? "For Rent"
          : "For Sale"),
    is_featured: !!input.isFeatured,
    is_active: input.isActive !== undefined ? input.isActive : true,
    description: input.description || null,
    amenities: input.amenities && input.amenities.length > 0 ? input.amenities : defaultAmenities,
    lat: input.lat ?? input.coordinates?.lat ?? null,
    lng: input.lng ?? input.coordinates?.lng ?? null,
    coordinates: input.coordinates || (input.lat != null && input.lng != null ? { lat: input.lat, lng: input.lng } : null),
  };

  const { data, error } = await supabase
    .from("properties")
    .insert(rowData)
    .select()
    .single();

  if (error || !data) {
    console.error("Error creating property in Supabase:", error);
    throw new Error(error?.message || "Failed to create property in database");
  }

  return mapRowToProperty(data);
}

/**
 * Updates an existing property in Supabase database
 */
export async function updateProperty(
  id: string,
  input: Partial<PropertyInput>
): Promise<Property> {
  const updateData: Database["public"]["Tables"]["properties"]["Update"] = {};

  if (input.title !== undefined) {
    updateData.title = input.title;
    updateData.slug = slugify(input.title);
  }
  if (input.location !== undefined) {
    updateData.location = input.location;
  }
  if (input.price !== undefined) {
    updateData.price = input.price;
    updateData.formatted_price = `$${Number(input.price).toLocaleString("en-US")}`;
  }
  if (input.priceSuffix !== undefined) {
    updateData.price_suffix = input.priceSuffix;
  }
  if (input.type !== undefined) {
    updateData.type = input.type;
  }
  if (input.category !== undefined) {
    updateData.category = input.category;
  }
  if (input.beds !== undefined) {
    updateData.beds = input.beds;
  }
  if (input.baths !== undefined) {
    updateData.baths = input.baths;
  }
  if (input.sqm !== undefined) {
    updateData.sqm = input.sqm;
  }
  if (input.garage !== undefined) {
    updateData.garage = input.garage;
  }
  if (input.yearBuilt !== undefined) {
    updateData.year_built = input.yearBuilt;
  }
  if (input.images !== undefined && input.images.length > 0) {
    updateData.images = input.images;
    updateData.image_url = JSON.stringify(input.images);
  }
  if (input.badge !== undefined) {
    updateData.badge = input.badge;
  }
  if (input.isFeatured !== undefined) {
    updateData.is_featured = input.isFeatured;
  }
  if (input.isActive !== undefined) {
    updateData.is_active = input.isActive;
  }
  if (input.description !== undefined) {
    updateData.description = input.description;
  }
  if (input.amenities !== undefined) {
    updateData.amenities = input.amenities;
  }
  if (input.lat !== undefined) {
    updateData.lat = input.lat;
  }
  if (input.lng !== undefined) {
    updateData.lng = input.lng;
  }
  if (input.coordinates !== undefined) {
    updateData.coordinates = input.coordinates;
    updateData.lat = input.coordinates?.lat ?? null;
    updateData.lng = input.coordinates?.lng ?? null;
  } else if (input.lat !== undefined && input.lng !== undefined) {
    updateData.coordinates = { lat: input.lat, lng: input.lng };
  }

  const { data, error } = await supabase
    .from("properties")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error(`Error updating property ${id} in Supabase:`, error);
    throw new Error(error?.message || "Failed to update property in database");
  }

  return mapRowToProperty(data);
}

/**
 * Deactivates a property in Supabase database (soft delete instead of hard delete)
 */
export async function deactivateProperty(id: string): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .update({ is_active: false })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error(`Error deactivating property ${id}:`, error);
      throw new Error(error?.message || "Failed to deactivate property");
    }

    return mapRowToProperty(data);
  } catch (err: any) {
    console.error(`Unexpected error deactivating property ${id}:`, err);
    throw err;
  }
}

/**
 * Activates a property in Supabase database
 */
export async function activateProperty(id: string): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from("properties")
      .update({ is_active: true })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      console.error(`Error activating property ${id}:`, error);
      throw new Error(error?.message || "Failed to activate property");
    }

    return mapRowToProperty(data);
  } catch (err: any) {
    console.error(`Unexpected error activating property ${id}:`, err);
    throw err;
  }
}

/**
 * Toggles a property's active status in Supabase database
 */
export async function togglePropertyActiveStatus(
  id: string,
  isActive: boolean
): Promise<Property | null> {
  if (isActive) {
    return await activateProperty(id);
  } else {
    return await deactivateProperty(id);
  }
}

/**
 * Soft delete fallback for backwards compatibility:
 * Deactivates property instead of physically deleting it from database.
 */
export async function deleteProperty(id: string): Promise<boolean> {
  await deactivateProperty(id);
  return true;
}
