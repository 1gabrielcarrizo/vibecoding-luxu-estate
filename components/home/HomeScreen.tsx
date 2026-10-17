"use client";

import React, { useState, useTransition, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { MarketSection } from "@/components/home/MarketSection";
import { PropertyCategory, MarketFilterTab, Property } from "@/types/property";
import { PaginationResult } from "@/types/pagination";
import { fetchPropertiesAction } from "@/app/actions/properties";

interface HomeScreenProps {
  initialFeaturedProperties: Property[];
  initialPagination: PaginationResult;
  initialPage?: number;
  initialCategory?: PropertyCategory;
  initialMarketTab?: MarketFilterTab;
  initialQuery?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  initialFeaturedProperties,
  initialPagination,
  initialPage = 1,
  initialCategory = "All",
  initialMarketTab = "All",
  initialQuery = "",
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

  // Pagination state from server
  const [pagination, setPagination] =
    useState<PaginationResult>(initialPagination);
  const [isLoading, setIsLoading] = useState(false);

  // Sync state when props change (e.g. back/forward navigation or server re-render)
  useEffect(() => {
    setPagination(initialPagination);
    setSelectedCategory(initialCategory);
    setMarketTab(initialMarketTab);
    setSearchQuery(initialQuery);
  }, [initialPagination, initialCategory, initialMarketTab, initialQuery]);

  // Synchronize URL and fetch new page data using Next.js Server Action
  const updateData = (
    newPage: number,
    newCategory: PropertyCategory,
    newTab: MarketFilterTab,
    newQuery: string,
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
    updateData(newPage, selectedCategory, marketTab, searchQuery, true);
  };

  const handleCategorySelect = (category: PropertyCategory) => {
    setSelectedCategory(category);
    updateData(1, category, marketTab, searchQuery, true);
  };

  const handleMarketTabChange = (tab: MarketFilterTab) => {
    setMarketTab(tab);
    updateData(1, selectedCategory, tab, searchQuery, true);
  };

  const handleSearchSubmit = () => {
    updateData(1, selectedCategory, marketTab, searchQuery, true);
  };

  const handleViewAllFeatured = () => {
    setSelectedCategory("All");
    setMarketTab("All");
    setSearchQuery("");
    updateData(1, "All", "All", "", true);
  };

  // Filter featured properties locally for search/category match
  const filteredFeaturedProperties = useMemo(() => {
    return initialFeaturedProperties.filter((prop) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          prop.title.toLowerCase().includes(q) ||
          prop.location.toLowerCase().includes(q) ||
          prop.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedCategory !== "All" && prop.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [initialFeaturedProperties, searchQuery, selectedCategory]);

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
          onToggleFilters={() => {
            handleCategorySelect(
              selectedCategory === "All" ? "Villa" : "All"
            );
          }}
        />

        {/* Featured Collections Section */}
        {filteredFeaturedProperties.length > 0 && (
          <FeaturedCollections
            properties={filteredFeaturedProperties}
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
    </div>
  );
};
