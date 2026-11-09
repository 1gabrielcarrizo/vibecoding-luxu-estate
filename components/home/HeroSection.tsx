"use client";

import React from "react";
import { PropertyCategory } from "@/types/property";
import { categoryFilters } from "@/data/mockData";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  onSearchSubmit: () => void;
  selectedCategory: PropertyCategory;
  onSelectCategory: (category: PropertyCategory) => void;
  onToggleFilters?: () => void;
  activeFilterCount?: number;
  isLoading?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  selectedCategory,
  onSelectCategory,
  onToggleFilters,
  activeFilterCount = 0,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearchSubmit();
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-nordic-dark leading-tight px-2">
          {t("hero.titlePrefix")}{" "}
          <span className="relative inline-block">
            <span className="relative z-10 font-medium">
              {t("hero.titleHighlight")}
            </span>
            <span className="absolute bottom-1.5 sm:bottom-2 left-0 w-full h-2.5 sm:h-3 bg-mosque/20 -rotate-1 z-0"></span>
          </span>
          .
        </h1>

        {/* Search Bar */}
        <div className="relative group max-w-2xl mx-auto px-1 sm:px-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none">
            {isLoading ? (
              <span className="material-icons text-mosque text-xl sm:text-2xl animate-spin">
                sync
              </span>
            ) : (
              <span className="material-icons text-nordic-muted text-xl sm:text-2xl group-focus-within:text-mosque transition-colors">
                search
              </span>
            )}
          </div>
          <input
            className="block w-full pl-10 sm:pl-12 pr-24 sm:pr-32 py-3.5 sm:py-4 rounded-xl border-none bg-white text-nordic-dark shadow-soft placeholder-nordic-muted/60 focus:ring-2 focus:ring-mosque focus:bg-white transition-all text-base sm:text-lg outline-none"
            placeholder={t("hero.searchPlaceholder")}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-20 sm:right-28 pr-1 flex items-center text-nordic-muted/60 hover:text-nordic-dark transition-colors cursor-pointer"
              title="Limpiar búsqueda"
            >
              <span className="material-icons text-lg sm:text-xl">close</span>
            </button>
          )}
          <button
            onClick={onSearchSubmit}
            type="button"
            className="absolute inset-y-1.5 sm:inset-y-2 right-1.5 sm:right-2 px-3.5 sm:px-6 bg-mosque hover:bg-mosque/90 text-white font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-mosque/20 cursor-pointer"
          >
            {t("hero.searchButton")}
          </button>
        </div>

        {/* Category Pills & Filters */}
        <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-2 px-4 -mx-4 sm:mx-0 sm:px-0">
          {categoryFilters.map((category) => {
            const isSelected = selectedCategory === category;
            const categoryLabel = t(`categories.${category}`);
            return (
              <button
                key={category}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={`whitespace-nowrap px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer flex-shrink-0 ${
                  isSelected
                    ? "bg-nordic-dark text-white shadow-lg shadow-nordic-dark/10 -translate-y-0.5"
                    : "bg-white border border-nordic-dark/5 text-nordic-muted hover:text-nordic-dark hover:border-mosque/50 hover:bg-mosque/5"
                }`}
              >
                {categoryLabel}
              </button>
            );
          })}

          <div className="w-px h-5 sm:h-6 bg-nordic-dark/10 mx-1 sm:mx-2 flex-shrink-0"></div>

          <button
            type="button"
            onClick={onToggleFilters}
            className={`whitespace-nowrap flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-all cursor-pointer flex-shrink-0 ${
              activeFilterCount > 0
                ? "bg-mosque/10 text-mosque border border-mosque/30"
                : "text-nordic-dark hover:bg-black/5"
            }`}
          >
            <span className="material-icons text-sm sm:text-base">tune</span>
            <span>{t("hero.filtersButton")}</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-mosque text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
