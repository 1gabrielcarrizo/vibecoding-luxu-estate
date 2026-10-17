"use client";

import React, { useState, useMemo } from "react";
import { Navbar } from "@/components/common/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { MarketSection } from "@/components/home/MarketSection";
import {
  featuredProperties,
  initialMarketProperties,
  additionalMarketProperties,
} from "@/data/mockData";
import { PropertyCategory, MarketFilterTab, Property } from "@/types/property";

export const HomeScreen: React.FC = () => {
  // Navigation & Search State
  const [navTab, setNavTab] = useState("Buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<PropertyCategory>("All");
  const [marketTab, setMarketTab] = useState<MarketFilterTab>("All");

  // Market properties and pagination
  const [marketPropertiesList, setMarketPropertiesList] = useState<Property[]>(
    initialMarketProperties
  );
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter properties based on Category, Market Tab, and Search Query
  const filteredMarketProperties = useMemo(() => {
    return marketPropertiesList.filter((prop) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesLocation = prop.location.toLowerCase().includes(query);
        const matchesCategory = prop.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation && !matchesCategory) {
          return false;
        }
      }

      // 2. Category Filter (from Hero)
      if (selectedCategory !== "All" && prop.category !== selectedCategory) {
        return false;
      }

      // 3. Market Tab Filter (All, Buy, Rent)
      if (marketTab === "Buy" && prop.type !== "sale") {
        return false;
      }
      if (marketTab === "Rent" && prop.type !== "rent") {
        return false;
      }

      return true;
    });
  }, [marketPropertiesList, searchQuery, selectedCategory, marketTab]);

  // Featured properties filter (reacts to category and search if filtered)
  const filteredFeaturedProperties = useMemo(() => {
    return featuredProperties.filter((prop) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesLocation = prop.location.toLowerCase().includes(query);
        const matchesCategory = prop.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation && !matchesCategory) {
          return false;
        }
      }
      if (selectedCategory !== "All" && prop.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const handleSearchSubmit = () => {
    // Smooth scroll down slightly towards results if submitted
    const marketEl = document.getElementById("market-section");
    if (marketEl) {
      marketEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setMarketPropertiesList((prev) => [...prev, ...additionalMarketProperties]);
      setHasLoadedMore(true);
      setIsLoadingMore(false);
    }, 400);
  };

  const handleViewAllFeatured = () => {
    setSelectedCategory("All");
    setMarketTab("All");
  };

  return (
    <div className="min-h-screen bg-background-light text-nordic-dark font-display antialiased selection:bg-mosque selection:text-white">
      {/* Navigation */}
      <Navbar
        activeTab={navTab}
        onTabChange={(tab) => {
          setNavTab(tab);
          if (tab === "Buy") setMarketTab("Buy");
          if (tab === "Rent") setMarketTab("Rent");
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
          onSelectCategory={setSelectedCategory}
          onToggleFilters={() => {
            // Cycle through category filters or reset
            setSelectedCategory((prev) => (prev === "All" ? "Villa" : "All"));
          }}
        />

        {/* Featured Collections Section */}
        {filteredFeaturedProperties.length > 0 && (
          <FeaturedCollections
            properties={filteredFeaturedProperties}
            onViewAll={handleViewAllFeatured}
          />
        )}

        {/* New in Market Section */}
        <div id="market-section">
          <MarketSection
            properties={filteredMarketProperties}
            activeTab={marketTab}
            onTabChange={setMarketTab}
            onLoadMore={handleLoadMore}
            hasMore={!hasLoadedMore}
            isLoadingMore={isLoadingMore}
          />
        </div>
      </main>
    </div>
  );
};
