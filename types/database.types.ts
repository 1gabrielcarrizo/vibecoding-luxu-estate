export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string;
          slug?: string | null;
          title: string;
          location: string;
          price: number;
          formatted_price: string;
          price_suffix: string | null;
          type: "sale" | "rent";
          category: "House" | "Apartment" | "Villa" | "Penthouse" | "Commercial";
          beds: number;
          baths: number;
          sqm: number;
          image_url: string | string[];
          images?: string[] | null;
          image_alt: string;
          badge: string | null;
          is_featured: boolean | null;
          hide_on_breakpoint: string | null;
          description?: string | null;
          amenities?: string[] | null;
          garage?: number | null;
          year_built?: number | null;
          coordinates?: Json | null;
          lat?: number | null;
          lng?: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          slug?: string | null;
          title: string;
          location: string;
          price: number;
          formatted_price: string;
          price_suffix?: string | null;
          type: "sale" | "rent";
          category: "House" | "Apartment" | "Villa" | "Penthouse" | "Commercial";
          beds: number;
          baths: number;
          sqm: number;
          image_url: string | string[];
          images?: string[] | null;
          image_alt: string;
          badge?: string | null;
          is_featured?: boolean | null;
          hide_on_breakpoint?: string | null;
          description?: string | null;
          amenities?: string[] | null;
          garage?: number | null;
          year_built?: number | null;
          coordinates?: Json | null;
          lat?: number | null;
          lng?: number | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          slug?: string | null;
          title?: string;
          location?: string;
          price?: number;
          formatted_price?: string;
          price_suffix?: string | null;
          type?: "sale" | "rent";
          category?: "House" | "Apartment" | "Villa" | "Penthouse" | "Commercial";
          beds?: number;
          baths?: number;
          sqm?: number;
          image_url?: string | string[] | null;
          images?: string[] | null;
          image_alt?: string;
          badge?: string | null;
          is_featured?: boolean | null;
          hide_on_breakpoint?: string | null;
          description?: string | null;
          amenities?: string[] | null;
          garage?: number | null;
          year_built?: number | null;
          coordinates?: Json | null;
          lat?: number | null;
          lng?: number | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          email: string | null;
          role: "admin" | "agent" | "user";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          role?: "admin" | "agent" | "user";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          role?: "admin" | "agent" | "user";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      app_user_role: "admin" | "agent" | "user";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
export type UserRole = "admin" | "agent" | "user";
export type UserRoleRow = Database["public"]["Tables"]["user_roles"]["Row"];
