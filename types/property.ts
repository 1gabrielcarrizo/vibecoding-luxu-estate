export type PropertyCategory =
  | "All"
  | "House"
  | "Apartment"
  | "Villa"
  | "Penthouse"
  | "Commercial";

export type ListingType = "sale" | "rent";

export type MarketFilterTab = "All" | "Buy" | "Rent";

export interface PropertyAgent {
  name: string;
  role: string;
  avatarUrl: string;
  phone?: string;
  email?: string;
  rating?: number;
}

export interface PropertyCoordinates {
  lat: number;
  lng: number;
}

export interface EstimatedPaymentInfo {
  monthly: number;
  formattedMonthly: string;
  downPaymentPercent: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: number;
  formattedPrice: string;
  priceSuffix?: string;
  type: ListingType;
  category: "House" | "Apartment" | "Villa" | "Penthouse" | "Commercial";
  beds: number;
  baths: number;
  sqm: number;
  garage?: number;
  yearBuilt?: number;
  images: string[];
  imageUrl?: string;
  imageAlt: string;
  badge?: string;
  badges?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  hideOnBreakpoint?: string;
  description?: string[];
  amenities?: string[];
  coordinates?: PropertyCoordinates;
  agent?: PropertyAgent;
  estimatedPayment?: EstimatedPaymentInfo;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
}

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-"); // Replace multiple - with single -
}
