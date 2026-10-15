export type PropertyCategory =
  | "All"
  | "House"
  | "Apartment"
  | "Villa"
  | "Penthouse";

export type ListingType = "sale" | "rent";

export type MarketFilterTab = "All" | "Buy" | "Rent";

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  formattedPrice: string;
  priceSuffix?: string;
  type: ListingType;
  category: "House" | "Apartment" | "Villa" | "Penthouse";
  beds: number;
  baths: number;
  sqm: number;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  isFeatured?: boolean;
  hideOnBreakpoint?: string;
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
