import { Suspense } from "react";
import { HomeScreen } from "@/components/home/HomeScreen";
import {
  getFeaturedProperties,
  getPaginatedProperties,
} from "@/lib/supabase/properties";
import { PropertyCategory, MarketFilterTab } from "@/types/property";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    tab?: string;
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
    baths?: string;
    amenities?: string;
  }>;
}

async function HomeContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const category = (params.category || "All") as PropertyCategory;
  const marketTab = (params.tab || "All") as MarketFilterTab;
  const query = params.q || "";
  const minPrice = params.minPrice ? parseInt(params.minPrice, 10) : undefined;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice, 10) : undefined;
  const beds = params.beds ? parseInt(params.beds, 10) : undefined;
  const baths = params.baths ? parseInt(params.baths, 10) : undefined;
  const amenities = params.amenities
    ? params.amenities.split(",").map((a) => a.trim()).filter(Boolean)
    : undefined;

  // Server-side fetching from Supabase using Next.js async Server Functions
  const [featuredProperties, paginationResult] = await Promise.all([
    getFeaturedProperties(),
    getPaginatedProperties({
      page,
      pageSize: 8,
      category,
      type: marketTab,
      query,
      minPrice,
      maxPrice,
      beds,
      baths,
      amenities,
    }),
  ]);

  return (
    <HomeScreen
      initialFeaturedProperties={featuredProperties.slice(0, 2)}
      initialPagination={paginationResult}
      initialPage={page}
      initialCategory={category}
      initialMarketTab={marketTab}
      initialQuery={query}
      initialMinPrice={minPrice}
      initialMaxPrice={maxPrice}
      initialBeds={beds}
      initialBaths={baths}
      initialAmenities={amenities}
    />
  );
}

export default function Home(props: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background-light flex items-center justify-center">
          <div className="text-nordic-dark/60 text-sm font-medium animate-pulse">
            Loading Luxe Estate...
          </div>
        </div>
      }
    >
      <HomeContent searchParams={props.searchParams} />
    </Suspense>
  );
}
