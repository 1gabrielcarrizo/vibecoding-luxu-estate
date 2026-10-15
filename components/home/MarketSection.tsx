"use client";

import React from "react";
import { Property, MarketFilterTab } from "@/types/property";
import { PropertyCard } from "./PropertyCard";

interface MarketSectionProps {
  properties: Property[];
  activeTab: MarketFilterTab;
  onTabChange: (tab: MarketFilterTab) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onSelectProperty?: (property: Property) => void;
}

export const MarketSection: React.FC<MarketSectionProps> = ({
  properties,
  activeTab,
  onTabChange,
  onLoadMore,
  hasMore = true,
  isLoadingMore = false,
  onSelectProperty,
}) => {
  const tabs: MarketFilterTab[] = ["All", "Buy", "Rent"];

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">
            New in Market
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            Fresh opportunities added this week.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="hidden md:flex bg-white p-1 rounded-lg border border-nordic-dark/5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? "bg-nordic-dark text-white shadow-sm"
                    : "text-nordic-muted hover:text-nordic-dark"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Properties Grid */}
      {properties.length === 0 ? (
        <div className="text-center py-16 bg-white/50 rounded-xl border border-dashed border-nordic-dark/10">
          <span className="material-icons text-4xl text-nordic-muted">
            search_off
          </span>
          <p className="mt-2 text-nordic-muted">
            No properties found matching your selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              className={property.hideOnBreakpoint}
              onSelect={onSelectProperty}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 bg-white border border-nordic-dark/10 hover:border-mosque hover:text-mosque text-nordic-dark font-medium rounded-lg transition-all hover:shadow-md disabled:opacity-50"
          >
            {isLoadingMore ? "Loading properties..." : "Load more properties"}
          </button>
        </div>
      )}
    </section>
  );
};
