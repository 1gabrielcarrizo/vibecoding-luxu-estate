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
          title: string;
          location: string;
          price: number;
          formatted_price: string;
          price_suffix: string | null;
          type: "sale" | "rent";
          category: "House" | "Apartment" | "Villa" | "Penthouse";
          beds: number;
          baths: number;
          sqm: number;
          image_url: string;
          image_alt: string;
          badge: string | null;
          is_featured: boolean | null;
          hide_on_breakpoint: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          title: string;
          location: string;
          price: number;
          formatted_price: string;
          price_suffix?: string | null;
          type: "sale" | "rent";
          category: "House" | "Apartment" | "Villa" | "Penthouse";
          beds: number;
          baths: number;
          sqm: number;
          image_url: string;
          image_alt: string;
          badge?: string | null;
          is_featured?: boolean | null;
          hide_on_breakpoint?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          location?: string;
          price?: number;
          formatted_price?: string;
          price_suffix?: string | null;
          type?: "sale" | "rent";
          category?: "House" | "Apartment" | "Villa" | "Penthouse";
          beds?: number;
          baths?: number;
          sqm?: number;
          image_url?: string;
          image_alt?: string;
          badge?: string | null;
          is_featured?: boolean | null;
          hide_on_breakpoint?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type PropertyRow = Database["public"]["Tables"]["properties"]["Row"];
