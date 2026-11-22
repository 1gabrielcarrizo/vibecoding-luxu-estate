import { Navbar } from "@/components/common/Navbar";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { FavoritesSkeleton } from "@/components/favorites/FavoritesSkeleton";

export default function FavoritesLoading() {
  return (
    <div className="bg-clear-day font-display text-nordic min-h-screen flex flex-col">
      <Navbar activeTab="Saved Homes" />
      <main className="pt-8 sm:pt-10 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 animate-pulse">
          <div>
            <div className="h-10 bg-slate-200 w-56 rounded-lg mb-3" />
            <div className="h-4 bg-slate-200 w-72 rounded" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-10 bg-white w-44 rounded-lg shadow-sm" />
            <div className="h-10 bg-white w-20 rounded-lg shadow-sm" />
          </div>
        </div>
        <FavoritesSkeleton count={4} viewMode="grid" />
      </main>
      <PropertyFooter />
    </div>
  );
}
