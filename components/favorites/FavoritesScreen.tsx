"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { Property } from "@/types/property";
import { defaultAgent } from "@/data/mockData";
import { Navbar } from "@/components/common/Navbar";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { ScheduleVisitModal } from "@/components/property/ScheduleVisitModal";
import { useFavorites } from "@/lib/favorites/FavoritesContext";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { getLocalizedTitle } from "@/lib/i18n/propertyTranslations";
import { FavoritePropertyCard } from "./FavoritePropertyCard";
import { FavoritesSkeleton } from "./FavoritesSkeleton";

type SortOption = "date_desc" | "price_asc" | "price_desc" | "sqm_desc";

interface FavoritesScreenProps {
  allProperties: Property[];
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  allProperties,
}) => {
  const { t, locale } = useTranslation();
  const { favorites, isHydrated, removeFavorite, addFavorite } = useFavorites();

  const [sortBy, setSortBy] = useState<SortOption>("date_desc");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [removedProperty, setRemovedProperty] = useState<Property | null>(null);

  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    if (!isSortOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSortOpen]);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  // Resolve saved properties along with their addedAt timestamp
  const savedProperties = useMemo(() => {
    const propertyMap = new Map<string, Property>();
    for (const prop of allProperties) {
      propertyMap.set(prop.id, prop);
    }

    const matched: Array<{ property: Property; addedAt: number }> = [];
    for (const entry of favorites) {
      const prop = propertyMap.get(entry.id);
      if (prop) {
        matched.push({ property: prop, addedAt: entry.addedAt });
      }
    }

    switch (sortBy) {
      case "price_asc":
        return [...matched].sort((a, b) => a.property.price - b.property.price);
      case "price_desc":
        return [...matched].sort((a, b) => b.property.price - a.property.price);
      case "sqm_desc":
        return [...matched].sort((a, b) => b.property.sqm - a.property.sqm);
      case "date_desc":
      default:
        return [...matched].sort((a, b) => b.addedAt - a.addedAt);
    }
  }, [allProperties, favorites, sortBy]);

  const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: "date_desc", label: t("favorites.sortDateAdded") },
    { value: "price_asc", label: t("favorites.sortPriceLow") },
    { value: "price_desc", label: t("favorites.sortPriceHigh") },
    { value: "sqm_desc", label: t("favorites.sortLargest") },
  ];

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label ||
    t("favorites.sortDateAdded");

  const handleRemove = (property: Property) => {
    removeFavorite(property.id);
    setRemovedProperty(property);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
      setRemovedProperty(null);
    }, 5000);
  };

  const handleUndoRemove = () => {
    if (removedProperty) {
      addFavorite(removedProperty.id);
      setRemovedProperty(null);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    }
  };

  const savedCount = savedProperties.length;
  const subtitleText = !isHydrated
    ? t("favorites.loadingSubtitle")
    : savedCount === 0
      ? t("favorites.subtitleEmpty")
      : savedCount === 1
        ? t("favorites.subtitleSingular")
        : t("favorites.subtitlePlural", { count: savedCount });

  return (
    <div className="bg-clear-day font-display text-nordic min-h-screen flex flex-col transition-colors duration-300">
      <Navbar activeTab="Saved Homes" />

      <main className="pt-8 sm:pt-10 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-1 w-full">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-nordic tracking-tight mb-2">
              {t("favorites.title")}
            </h1>
            <p className="text-nordic/70">{subtitleText}</p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                aria-expanded={isSortOpen}
                aria-haspopup="listbox"
                className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-lg text-sm font-medium text-nordic shadow-sm hover:shadow-md transition-all border border-transparent hover:border-mosque/30 cursor-pointer"
              >
                <span>
                  {t("favorites.sortByPrefix")} {currentSortLabel}
                </span>
                <span
                  className={`material-icons text-lg transition-transform duration-200 ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                >
                  keyboard_arrow_down
                </span>
              </button>

              {isSortOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-dropdown border border-mosque/10 py-1.5 z-30"
                >
                  {sortOptions.map((option) => {
                    const isSelected = option.value === sortBy;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-hint-green/50 text-mosque font-semibold"
                            : "text-nordic/80 hover:bg-slate-50 hover:text-nordic"
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <span className="material-icons text-base text-mosque">
                            check
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Grid / List View Switcher */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label={t("favorites.gridViewAria")}
                aria-pressed={viewMode === "grid"}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "text-mosque bg-hint-green"
                    : "text-nordic/40 hover:text-nordic/70"
                }`}
              >
                <span className="material-icons text-xl block">grid_view</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label={t("favorites.listViewAria")}
                aria-pressed={viewMode === "list"}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "text-mosque bg-hint-green"
                    : "text-nordic/40 hover:text-nordic/70"
                }`}
              >
                <span className="material-icons text-xl block">view_list</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Grid / List */}
        {!isHydrated ? (
          <FavoritesSkeleton count={4} viewMode={viewMode} />
        ) : savedCount === 0 ? (
          <div className="max-w-xl mx-auto my-8">
            <Link
              href="/"
              className="group bg-hint-green/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-2 border-dashed border-mosque/30 hover:border-mosque flex flex-col items-center justify-center min-h-[340px] cursor-pointer text-center p-8 sm:p-10"
            >
              <div className="w-16 h-16 rounded-full bg-hint-green flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="material-icons text-mosque text-3xl">
                  favorite_border
                </span>
              </div>
              <h2 className="text-2xl font-bold text-nordic mb-2">
                {t("favorites.emptyTitle")}
              </h2>
              <p className="text-nordic/70 text-sm mb-7 max-w-sm">
                {t("favorites.emptyDescription")}
              </p>
              <span className="px-6 py-2.5 rounded-lg bg-mosque text-white font-medium text-sm shadow-lg shadow-mosque/30 group-hover:shadow-mosque/50 transition-all inline-flex items-center gap-2">
                <span>{t("favorites.browseListings")}</span>
                <span className="material-icons text-base">arrow_forward</span>
              </span>
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {savedProperties.map(({ property }, index) => (
              <FavoritePropertyCard
                key={property.id}
                property={property}
                viewMode="grid"
                priority={index === 0}
                onRemove={handleRemove}
                onBookVisit={setBookingProperty}
              />
            ))}

            {/* Discover More Card — exact dashed card from code.html */}
            <Link
              href="/"
              className="group bg-hint-green/30 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-2 border-dashed border-mosque/30 hover:border-mosque flex flex-col h-full items-center justify-center min-h-[400px] cursor-pointer text-center p-6"
            >
              <div className="w-16 h-16 rounded-full bg-hint-green flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-icons text-mosque text-3xl">add</span>
              </div>
              <h3 className="text-xl font-bold text-nordic mb-2">
                {t("favorites.discoverMore")}
              </h3>
              <p className="text-nordic/70 text-sm mb-6 max-w-[200px]">
                {t("favorites.discoverMoreSub")}
              </p>
              <span className="px-6 py-2.5 rounded-lg bg-mosque text-white font-medium text-sm shadow-lg shadow-mosque/30 group-hover:shadow-mosque/50 transition-all">
                {t("favorites.browseListings")}
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {savedProperties.map(({ property }, index) => (
              <FavoritePropertyCard
                key={property.id}
                property={property}
                viewMode="list"
                priority={index === 0}
                onRemove={handleRemove}
                onBookVisit={setBookingProperty}
              />
            ))}

            {/* Discover More Horizontal Banner in List Mode */}
            <Link
              href="/"
              className="group bg-hint-green/30 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-2 border-dashed border-mosque/30 hover:border-mosque flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer p-6 sm:px-8"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-full bg-hint-green flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-icons text-mosque text-2xl">
                    add
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-nordic">
                    {t("favorites.discoverMore")}
                  </h3>
                  <p className="text-nordic/70 text-sm">
                    {t("favorites.discoverMoreSub")}
                  </p>
                </div>
              </div>
              <span className="px-6 py-2.5 rounded-lg bg-mosque text-white font-medium text-sm shadow-lg shadow-mosque/30 group-hover:shadow-mosque/50 transition-all whitespace-nowrap">
                {t("favorites.browseListings")}
              </span>
            </Link>
          </div>
        )}
      </main>

      {/* Undo Removal Toast */}
      {removedProperty && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-40 bg-nordic text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-4 max-w-sm border border-white/10"
        >
          <span className="text-sm truncate">
            {t("favorites.removedToast", {
              title: getLocalizedTitle(
                removedProperty.slug,
                locale,
                removedProperty.title
              ),
            })}
          </span>
          <button
            type="button"
            onClick={handleUndoRemove}
            className="text-xs font-semibold uppercase tracking-wider text-hint-green hover:text-white transition-colors cursor-pointer flex-shrink-0"
          >
            {t("favorites.undo")}
          </button>
        </div>
      )}

      {/* Book Visit / Schedule Tour Modal */}
      {bookingProperty && (
        <ScheduleVisitModal
          isOpen={!!bookingProperty}
          onClose={() => setBookingProperty(null)}
          property={{
            ...bookingProperty,
            title: getLocalizedTitle(
              bookingProperty.slug,
              locale,
              bookingProperty.title
            ),
          }}
          agent={bookingProperty.agent || defaultAgent}
        />
      )}

      <PropertyFooter />
    </div>
  );
};
