"use client";

import React from "react";
import { Property, MarketFilterTab } from "@/types/property";
import { PropertyCard } from "./PropertyCard";
import { Pagination } from "./Pagination";

interface MarketSectionProps {
  properties: Property[];
  activeTab: MarketFilterTab;
  onTabChange: (tab: MarketFilterTab) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  onSelectProperty?: (property: Property) => void;
}

export const MarketSection: React.FC<MarketSectionProps> = ({
  properties,
  activeTab,
  onTabChange,
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  pageSize = 8,
  onPageChange,
  isLoading = false,
  onSelectProperty,
}) => {
  const tabs: MarketFilterTab[] = ["All", "Buy", "Rent"];

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-light text-nordic-dark">
              New in Market
            </h2>
            {isLoading && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-nordic-dark/10 text-nordic-dark animate-pulse">
                Updating...
              </span>
            )}
          </div>
          <p className="text-nordic-muted mt-1 text-sm">
            Fresh opportunities added this week.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="hidden md:flex bg-white p-1 rounded-lg border border-nordic-dark/5 shadow-xs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-nordic-dark text-white shadow-xs"
                    : "text-nordic-muted hover:text-nordic-dark"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Properties Grid with smooth loading state */}
      <div className={`transition-opacity duration-200 ${isLoading ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
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
      </div>

      {/* Server-Side Pagination Controls */}
      {onPageChange && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      )}
    </section>
  );
};
