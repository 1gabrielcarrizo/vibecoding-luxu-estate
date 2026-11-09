"use client";

import React, { useState, useTransition, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { MarketSection } from "@/components/home/MarketSection";
import { PropertyCategory, MarketFilterTab, Property } from "@/types/property";
import { PaginationResult } from "@/types/pagination";
import { fetchPropertiesAction } from "@/app/actions/properties";
import { SearchFiltersModal, FilterState } from "@/components/home/SearchFiltersModal";
import { PropertyFooter } from "@/components/property/PropertyFooter";

interface HomeScreenProps {
  initialFeaturedProperties: Property[];
  initialPagination: PaginationResult;
  initialPage?: number;
  initialCategory?: PropertyCategory;
  initialMarketTab?: MarketFilterTab;
  initialQuery?: string;
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialBeds?: number;
  initialBaths?: number;
  initialAmenities?: string[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  initialFeaturedProperties,
  initialPagination,
  initialPage = 1,
  initialCategory = "All",
  initialMarketTab = "All",
  initialQuery = "",
  initialMinPrice,
  initialMaxPrice,
  initialBeds,
  initialBaths,
  initialAmenities,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Navigation & Search State
  const [navTab, setNavTab] = useState<string>(
    initialMarketTab === "Buy" || initialMarketTab === "Rent"
      ? initialMarketTab
      : "Buy"
  );
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] =
    useState<PropertyCategory>(initialCategory);
  const [marketTab, setMarketTab] =
    useState<MarketFilterTab>(initialMarketTab);

  // Advanced Filters State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<number | undefined>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialMaxPrice);
  const [beds, setBeds] = useState<number>(initialBeds || 0);
  const [baths, setBaths] = useState<number>(initialBaths || 0);
  const [amenities, setAmenities] = useState<string[]>(
    initialAmenities || []
  );

  // Pagination state from server
  const [pagination, setPagination] =
    useState<PaginationResult>(initialPagination);
  const [isLoading, setIsLoading] = useState(false);

  // Track initial mount and last searched query for live search debouncing
  const isFirstRender = useRef(true);
  const lastSearchedQuery = useRef(initialQuery);

  // Sync state when props change (e.g. back/forward navigation or server re-render)
  useEffect(() => {
    setPagination(initialPagination);
    setSelectedCategory(initialCategory);
    setMarketTab(initialMarketTab);
    setSearchQuery(initialQuery);
    lastSearchedQuery.current = initialQuery;
    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);
    setBeds(initialBeds || 0);
    setBaths(initialBaths || 0);
    setAmenities(initialAmenities || []);
  }, [
    initialPagination,
    initialCategory,
    initialMarketTab,
    initialQuery,
    initialMinPrice,
    initialMaxPrice,
    initialBeds,
    initialBaths,
    initialAmenities,
  ]);

  // Debounced live search: shows properties as the user types without having to click "buscar"
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (searchQuery === lastSearchedQuery.current) {
      return;
    }

    const timer = setTimeout(() => {
      lastSearchedQuery.current = searchQuery;
      updateData(
        1,
        selectedCategory,
        marketTab,
        searchQuery,
        minPrice,
        maxPrice,
        beds,
        baths,
        amenities,
        false
      );
    }, 350);

    return () => clearTimeout(timer);
  }, [
    searchQuery,
    selectedCategory,
    marketTab,
    minPrice,
    maxPrice,
    beds,
    baths,
    amenities,
  ]);

  // Count active advanced filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (minPrice !== undefined && minPrice > 0) count++;
    if (maxPrice !== undefined && maxPrice < 20000000) count++;
    if (beds > 0) count++;
    if (baths > 0) count++;
    if (amenities && amenities.length > 0) count++;
    return count;
  }, [minPrice, maxPrice, beds, baths, amenities]);

  // Synchronize URL and fetch new page data using Next.js Server Action
  const updateData = (
    newPage: number,
    newCategory: PropertyCategory,
    newTab: MarketFilterTab,
    newQuery: string,
    newMinPrice?: number,
    newMaxPrice?: number,
    newBeds?: number,
    newBaths?: number,
    newAmenities?: string[],
    scrollToMarket = false
  ) => {
    setIsLoading(true);

    startTransition(async () => {
      // 1. Update browser URL searchParams with Next.js navigation
      const params = new URLSearchParams();
      if (newPage > 1) params.set("page", newPage.toString());
      if (newCategory !== "All") params.set("category", newCategory);
      if (newTab !== "All") params.set("tab", newTab);
      if (newQuery.trim()) params.set("q", newQuery.trim());
      if (newMinPrice !== undefined && newMinPrice > 0)
        params.set("minPrice", newMinPrice.toString());
      if (newMaxPrice !== undefined && newMaxPrice < 20000000)
        params.set("maxPrice", newMaxPrice.toString());
      if (newBeds !== undefined && newBeds > 0)
        params.set("beds", newBeds.toString());
      if (newBaths !== undefined && newBaths > 0)
        params.set("baths", newBaths.toString());
      if (newAmenities && newAmenities.length > 0)
        params.set("amenities", newAmenities.join(","));

      const queryString = params.toString();
      router.push(queryString ? `/?${queryString}` : "/", { scroll: false });

      // 2. Execute Server Action to fetch from Supabase
      try {
        const result = await fetchPropertiesAction({
          page: newPage,
          pageSize: 8,
          category: newCategory,
          type: newTab,
          query: newQuery.trim(),
          minPrice: newMinPrice,
          maxPrice: newMaxPrice,
          beds: newBeds,
          baths: newBaths,
          amenities: newAmenities,
        });
        setPagination(result);
      } catch (err) {
        console.error("Failed to fetch paginated properties:", err);
      } finally {
        setIsLoading(false);
      }

      if (scrollToMarket) {
        const marketEl = document.getElementById("market-section");
        if (marketEl) {
          marketEl.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  };

  // Handlers
  const handlePageChange = (newPage: number) => {
    updateData(
      newPage,
      selectedCategory,
      marketTab,
      searchQuery,
      minPrice,
      maxPrice,
      beds,
      baths,
      amenities,
      true
    );
  };

  const handleCategorySelect = (category: PropertyCategory) => {
    // Toggle back to "All" if user clicks the currently active specific category
    const nextCategory =
      category === selectedCategory && category !== "All" ? "All" : category;
    setSelectedCategory(nextCategory);
    updateData(
      1,
      nextCategory,
      marketTab,
      searchQuery,
      minPrice,
      maxPrice,
      beds,
      baths,
      amenities,
      false
    );
  };

  const handleMarketTabChange = (tab: MarketFilterTab) => {
    setMarketTab(tab);
    updateData(
      1,
      selectedCategory,
      tab,
      searchQuery,
      minPrice,
      maxPrice,
      beds,
      baths,
      amenities,
      false
    );
  };

  const handleSearchSubmit = () => {
    lastSearchedQuery.current = searchQuery;
    updateData(
      1,
      selectedCategory,
      marketTab,
      searchQuery,
      minPrice,
      maxPrice,
      beds,
      baths,
      amenities,
      false
    );
  };

  const handleApplyFilters = (filters: FilterState) => {
    const nextCategory =
      filters.propertyType === "Any Type" ? "All" : filters.propertyType;
    setSelectedCategory(nextCategory);
    setSearchQuery(filters.location);
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
    setBeds(filters.beds);
    setBaths(filters.baths);
    setAmenities(filters.amenities);

    updateData(
      1,
      nextCategory,
      marketTab,
      filters.location,
      filters.minPrice,
      filters.maxPrice,
      filters.beds,
      filters.baths,
      filters.amenities,
      false
    );
  };

  const handleViewAllFeatured = () => {
    setSelectedCategory("All");
    setMarketTab("All");
    setSearchQuery("");
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setBeds(0);
    setBaths(0);
    setAmenities([]);
    updateData(1, "All", "All", "", undefined, undefined, 0, 0, [], true);
  };

  // Determine if any search or filter is currently active
  const isFilterActive = useMemo(() => {
    const hasCategory = selectedCategory !== "All";
    const hasQuery = searchQuery.trim().length > 0;
    const hasTab = marketTab !== "All";
    const hasMinPrice = minPrice !== undefined && minPrice > 0;
    const hasMaxPrice = maxPrice !== undefined && maxPrice < 20000000;
    const hasBeds = beds > 0;
    const hasBaths = baths > 0;
    const hasAmenities = amenities && amenities.length > 0;

    return (
      hasCategory ||
      hasQuery ||
      hasTab ||
      hasMinPrice ||
      hasMaxPrice ||
      hasBeds ||
      hasBaths ||
      hasAmenities
    );
  }, [
    selectedCategory,
    searchQuery,
    marketTab,
    minPrice,
    maxPrice,
    beds,
    baths,
    amenities,
  ]);

  // Strictly at most 2 featured properties, and ONLY when no filters/searches are applied
  const featuredPropertiesToDisplay = useMemo(() => {
    if (isFilterActive) return [];
    return initialFeaturedProperties.slice(0, 2);
  }, [isFilterActive, initialFeaturedProperties]);

  return (
    <div className="min-h-screen bg-background-light text-nordic-dark font-display antialiased selection:bg-mosque selection:text-white">
      {/* Navigation */}
      <Navbar
        activeTab={navTab}
        onTabChange={(tab) => {
          setNavTab(tab);
          if (tab === "Buy") handleMarketTabChange("Buy");
          if (tab === "Rent") handleMarketTabChange("Rent");
          if (tab === "Sell" || tab === "Saved Homes") {
            handleMarketTabChange("All");
          }
        }}
        onSearchClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Hero Section with Search & Categories */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          onToggleFilters={() => setIsFilterModalOpen(true)}
          activeFilterCount={activeFilterCount}
          isLoading={isLoading || isPending}
        />

        {/* Featured Collections Section: Only shown when no search filters are applied, and strictly max 2 properties */}
        {!isFilterActive && featuredPropertiesToDisplay.length > 0 && (
          <FeaturedCollections
            properties={featuredPropertiesToDisplay}
            onViewAll={handleViewAllFeatured}
          />
        )}

        {/* New in Market Section with Server-Side Pagination */}
        <div id="market-section" className="scroll-mt-24">
          <MarketSection
            properties={pagination.properties}
            activeTab={marketTab}
            onTabChange={handleMarketTabChange}
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            isLoading={isLoading || isPending}
          />
        </div>
      </main>

      {/* Footer */}
      <PropertyFooter />

      {/* Search Filters Modal matching search_filters_screen/code.html */}
      <SearchFiltersModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        initialFilters={{
          location: searchQuery,
          minPrice: minPrice !== undefined ? minPrice : 1200000,
          maxPrice: maxPrice !== undefined ? maxPrice : 4500000,
          propertyType:
            selectedCategory === "All" ? "Any Type" : selectedCategory,
          beds,
          baths,
          amenities,
        }}
        onApply={handleApplyFilters}
        totalMatchingHomes={pagination.totalCount}
      />
    </div>
  );
};
