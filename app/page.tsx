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
  }>;
}

async function HomeContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const category = (params.category || "All") as PropertyCategory;
  const marketTab = (params.tab || "All") as MarketFilterTab;
  const query = params.q || "";

  // Server-side fetching from Supabase using Next.js async Server Functions
  const [featuredProperties, paginationResult] = await Promise.all([
    getFeaturedProperties(),
    getPaginatedProperties({
      page,
      pageSize: 8,
      category,
      type: marketTab,
      query,
    }),
  ]);

  return (
    <HomeScreen
      initialFeaturedProperties={featuredProperties}
      initialPagination={paginationResult}
      initialPage={page}
      initialCategory={category}
      initialMarketTab={marketTab}
      initialQuery={query}
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
