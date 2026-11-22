import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllActiveProperties } from "@/lib/supabase/properties";
import { FavoritesScreen } from "@/components/favorites/FavoritesScreen";
import { FavoritesSkeleton } from "@/components/favorites/FavoritesSkeleton";
import { Navbar } from "@/components/common/Navbar";
import { PropertyFooter } from "@/components/property/PropertyFooter";

export const metadata: Metadata = {
  title: "Your Favorites — LuxeEstate",
  description:
    "View and manage your saved luxury properties, compare options, and schedule private tours with LuxeEstate.",
};

async function FavoritesContent() {
  const allProperties = await getAllActiveProperties();
  return <FavoritesScreen allProperties={allProperties} />;
}

export default function FavoritesPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-clear-day font-display text-nordic min-h-screen flex flex-col">
          <Navbar activeTab="Saved Homes" />
          <main className="pt-8 sm:pt-10 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 w-full">
            <div className="mb-10 animate-pulse">
              <div className="h-10 bg-slate-200 w-56 rounded-lg mb-3" />
              <div className="h-4 bg-slate-200 w-72 rounded" />
            </div>
            <FavoritesSkeleton count={4} viewMode="grid" />
          </main>
          <PropertyFooter />
        </div>
      }
    >
      <FavoritesContent />
    </Suspense>
  );
}
