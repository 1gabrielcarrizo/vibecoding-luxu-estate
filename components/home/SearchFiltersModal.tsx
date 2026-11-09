"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PropertyCategory } from "@/types/property";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export interface FilterState {
  location: string;
  minPrice: number;
  maxPrice: number;
  propertyType: PropertyCategory | "Any Type";
  beds: number;
  baths: number;
  amenities: string[];
}

interface SearchFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: Partial<FilterState>;
  onApply: (filters: FilterState) => void;
  totalMatchingHomes?: number;
}

const MIN_LIMIT = 0;
const MAX_LIMIT = 20000000;
const STEP = 50000;

const AMENITY_OPTIONS = [
  { id: "Swimming Pool", label: "Swimming Pool", icon: "pool" },
  { id: "Gym", label: "Gym", icon: "fitness_center" },
  { id: "Parking", label: "Parking", icon: "local_parking" },
  { id: "Air Conditioning", label: "Air Conditioning", icon: "ac_unit" },
  { id: "High-speed Wifi", label: "High-speed Wifi", icon: "wifi" },
  { id: "Patio / Terrace", label: "Patio / Terrace", icon: "deck" },
];

function formatPriceShort(num: number): string {
  if (num <= 0) return "$0";
  if (num >= 1000000) {
    const val = num / 1000000;
    return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `$${Math.round(num / 1000)}K`;
  }
  return `$${num}`;
}

function formatWithCommas(val: number): string {
  if (val === 0) return "0";
  return val.toLocaleString("en-US");
}

function parseNumber(str: string): number {
  const cleaned = str.replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export const SearchFiltersModal: React.FC<SearchFiltersModalProps> = ({
  isOpen,
  onClose,
  initialFilters,
  onApply,
  totalMatchingHomes,
}) => {
  const { t } = useTranslation();

  // Local state for all filters
  const [location, setLocation] = useState(initialFilters.location || "");
  const [minPrice, setMinPrice] = useState(
    initialFilters.minPrice !== undefined ? initialFilters.minPrice : 1200000
  );
  const [maxPrice, setMaxPrice] = useState(
    initialFilters.maxPrice !== undefined ? initialFilters.maxPrice : 4500000
  );
  const [minPriceInput, setMinPriceInput] = useState(
    formatWithCommas(
      initialFilters.minPrice !== undefined ? initialFilters.minPrice : 1200000
    )
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    formatWithCommas(
      initialFilters.maxPrice !== undefined ? initialFilters.maxPrice : 4500000
    )
  );
  const [propertyType, setPropertyType] = useState<PropertyCategory | "Any Type">(
    initialFilters.propertyType || "Any Type"
  );
  const [beds, setBeds] = useState(
    initialFilters.beds !== undefined ? initialFilters.beds : 3
  );
  const [baths, setBaths] = useState(
    initialFilters.baths !== undefined ? initialFilters.baths : 2
  );
  const [amenities, setAmenities] = useState<string[]>(
    initialFilters.amenities || ["Swimming Pool", "High-speed Wifi"]
  );

  // Sync state whenever modal opens or initialFilters change
  useEffect(() => {
    if (isOpen) {
      const initMin =
        initialFilters.minPrice !== undefined
          ? initialFilters.minPrice
          : 1200000;
      const initMax =
        initialFilters.maxPrice !== undefined
          ? initialFilters.maxPrice
          : 4500000;

      setLocation(initialFilters.location || "");
      setMinPrice(initMin);
      setMaxPrice(initMax);
      setMinPriceInput(formatWithCommas(initMin));
      setMaxPriceInput(formatWithCommas(initMax));
      setPropertyType(initialFilters.propertyType || "Any Type");
      setBeds(initialFilters.beds !== undefined ? initialFilters.beds : 3);
      setBaths(initialFilters.baths !== undefined ? initialFilters.baths : 2);
      setAmenities(
        initialFilters.amenities && initialFilters.amenities.length > 0
          ? initialFilters.amenities
          : ["Swimming Pool", "High-speed Wifi"]
      );
    }
  }, [isOpen, initialFilters]);

  // Handle escape key and lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Price range percentage calculations
  const minPercent = useMemo(
    () => Math.round(((minPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100),
    [minPrice]
  );
  const maxPercent = useMemo(
    () => Math.round(((maxPrice - MIN_LIMIT) / (MAX_LIMIT - MIN_LIMIT)) * 100),
    [maxPrice]
  );

  // Price range formatted header text
  const priceRangeLabel = useMemo(() => {
    if (minPrice <= MIN_LIMIT && maxPrice >= MAX_LIMIT) {
      return "Any Price";
    }
    return `${formatPriceShort(minPrice)} – ${formatPriceShort(maxPrice)}`;
  }, [minPrice, maxPrice]);

  // Price slider handlers
  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxPrice - STEP);
    setMinPrice(val);
    setMinPriceInput(formatWithCommas(val));
  };

  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minPrice + STEP);
    setMaxPrice(val);
    setMaxPriceInput(formatWithCommas(val));
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPriceInput(e.target.value);
    const num = parseNumber(e.target.value);
    if (!isNaN(num) && num <= maxPrice) {
      setMinPrice(Math.max(MIN_LIMIT, num));
    }
  };

  const handleMinInputBlur = () => {
    const num = parseNumber(minPriceInput);
    const clamped = Math.min(Math.max(MIN_LIMIT, num), maxPrice - STEP);
    setMinPrice(clamped);
    setMinPriceInput(formatWithCommas(clamped));
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPriceInput(e.target.value);
    const num = parseNumber(e.target.value);
    if (!isNaN(num) && num >= minPrice) {
      setMaxPrice(Math.min(MAX_LIMIT, num));
    }
  };

  const handleMaxInputBlur = () => {
    const num = parseNumber(maxPriceInput);
    const clamped = Math.max(Math.min(MAX_LIMIT, num), minPrice + STEP);
    setMaxPrice(clamped);
    setMaxPriceInput(formatWithCommas(clamped));
  };

  // Toggle amenities
  const handleToggleAmenity = (amenityId: string) => {
    setAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((a) => a !== amenityId)
        : [...prev, amenityId]
    );
  };

  // Clear filters
  const handleClearAll = () => {
    setLocation("");
    setMinPrice(MIN_LIMIT);
    setMaxPrice(MAX_LIMIT);
    setMinPriceInput(formatWithCommas(MIN_LIMIT));
    setMaxPriceInput(formatWithCommas(MAX_LIMIT));
    setPropertyType("Any Type");
    setBeds(0);
    setBaths(0);
    setAmenities([]);
  };

  // Apply filters
  const handleApply = () => {
    onApply({
      location,
      minPrice,
      maxPrice,
      propertyType,
      beds,
      baths,
      amenities,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Image Layer simulation */}
      <div
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Modal Overlay / Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-10 transition-opacity"
        aria-hidden="true"
      />

      {/* Main Modal Container */}
      <main className="relative z-20 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <header className="px-5 sm:px-8 py-4 sm:py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sticky top-0 z-30">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {t("filters.title")}
          </h1>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400 cursor-pointer flex-shrink-0"
            aria-label={t("modals.close")}
          >
            <span className="material-icons text-lg sm:text-xl leading-none select-none flex items-center justify-center">
              close
            </span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 sm:p-8 space-y-6 sm:space-y-10">
          {/* Section 1: Location */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
              {t("filters.location")}
            </label>
            <div className="relative group">
              <span className="material-icons absolute left-4 top-3.5 text-gray-400 group-focus-within:text-mosque transition-colors">
                location_on
              </span>
              <input
                className="w-full pl-12 pr-4 py-3 bg-[#f5f8f6] dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-mosque focus:bg-white dark:focus:bg-gray-800 transition-all shadow-sm outline-none text-sm sm:text-base"
                placeholder={t("filters.locationPlaceholder")}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </section>

          {/* Section 2: Price Range */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t("filters.priceRange")}
              </label>
              <span className="text-xs sm:text-sm font-medium text-mosque">
                {priceRangeLabel}
              </span>
            </div>

            {/* Interactive Dual Slider Track */}
            <div className="relative h-12 flex items-center mb-6 px-2">
              <div className="relative w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-mosque transition-all duration-75"
                  style={{
                    marginLeft: `${minPercent}%`,
                    width: `${Math.max(0, maxPercent - minPercent)}%`,
                  }}
                />
              </div>

              {/* Min Handle Range Input */}
              <input
                type="range"
                min={MIN_LIMIT}
                max={MAX_LIMIT}
                step={STEP}
                value={minPrice}
                onChange={handleMinSliderChange}
                className="range-slider-input absolute inset-0 w-full z-20 pointer-events-none"
                aria-label={t("filters.minPrice")}
              />

              {/* Max Handle Range Input */}
              <input
                type="range"
                min={MIN_LIMIT}
                max={MAX_LIMIT}
                step={STEP}
                value={maxPrice}
                onChange={handleMaxSliderChange}
                className="range-slider-input absolute inset-0 w-full z-20 pointer-events-none"
                aria-label={t("filters.maxPrice")}
              />
            </div>

            {/* Min and Max Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-[#f5f8f6] dark:bg-gray-800 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                  {t("filters.minPrice")}
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-white font-medium focus:ring-0 text-sm outline-none"
                    type="text"
                    value={minPriceInput}
                    onChange={handleMinInputChange}
                    onBlur={handleMinInputBlur}
                  />
                </div>
              </div>
              <div className="bg-[#f5f8f6] dark:bg-gray-800 p-3 rounded-lg border border-transparent focus-within:border-mosque/30 transition-colors">
                <label className="block text-[10px] text-gray-500 uppercase font-medium mb-1">
                  {t("filters.maxPrice")}
                </label>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-1">$</span>
                  <input
                    className="w-full bg-transparent border-0 p-0 text-gray-900 dark:text-white font-medium focus:ring-0 text-sm outline-none"
                    type="text"
                    value={maxPriceInput}
                    onChange={handleMaxInputChange}
                    onBlur={handleMaxInputBlur}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Property Details */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Property Type */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t("filters.propertyType")}
              </label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) =>
                    setPropertyType(
                      e.target.value as PropertyCategory | "Any Type"
                    )
                  }
                  className="w-full bg-[#f5f8f6] dark:bg-gray-800 border-0 rounded-lg py-3 pl-4 pr-10 text-gray-900 dark:text-white appearance-none focus:ring-2 focus:ring-mosque cursor-pointer outline-none text-sm sm:text-base"
                >
                  <option value="Any Type">{t("filters.anyType")}</option>
                  <option value="House">{t("categories.House")}</option>
                  <option value="Apartment">{t("categories.Apartment")}</option>
                  <option value="Villa">{t("categories.Villa")}</option>
                  <option value="Penthouse">{t("categories.Penthouse")}</option>
                </select>
                <span className="material-icons absolute right-3 top-3 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Rooms */}
            <div className="space-y-4">
              {/* Beds */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t("filters.bedrooms")}
                </span>
                <div className="flex items-center space-x-3 bg-[#f5f8f6] dark:bg-gray-800 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => setBeds((b) => Math.max(0, b - 1))}
                    disabled={beds <= 0}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-40 disabled:hover:text-gray-500 transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-6 text-center text-gray-900 dark:text-white">
                    {beds === 0 ? t("filters.any") : `${beds}+`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBeds((b) => Math.min(6, b + 1))}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>

              {/* Baths */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t("filters.bathrooms")}
                </span>
                <div className="flex items-center space-x-3 bg-[#f5f8f6] dark:bg-gray-800 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => setBaths((b) => Math.max(0, b - 1))}
                    disabled={baths <= 0}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-500 hover:text-mosque disabled:opacity-40 disabled:hover:text-gray-500 transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-base">remove</span>
                  </button>
                  <span className="text-sm font-semibold w-6 text-center text-gray-900 dark:text-white">
                    {baths === 0 ? t("filters.any") : `${baths}+`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBaths((b) => Math.min(6, b + 1))}
                    className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-mosque hover:bg-mosque hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="material-icons text-base">add</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Amenities */}
          <section>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              {t("filters.amenities")}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
              {AMENITY_OPTIONS.map((item) => {
                const isSelected = amenities.includes(item.id);
                const translatedLabel = t(`amenitiesList.${item.id}`);
                return (
                  <label
                    key={item.id}
                    onClick={() => handleToggleAmenity(item.id)}
                    className="cursor-pointer group relative select-none"
                  >
                    <div
                      className={`h-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg border text-xs sm:text-sm flex items-center justify-start sm:justify-center gap-2.5 sm:gap-2 transition-all ${
                        isSelected
                          ? "border-mosque bg-mosque/5 dark:bg-mosque/20 text-mosque font-medium hover:bg-mosque/10"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <span
                        className={`material-icons text-lg ${
                          isSelected
                            ? "text-mosque"
                            : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">
                        {translatedLabel !== `amenitiesList.${item.id}`
                          ? translatedLabel
                          : item.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-mosque rounded-full" />
                    )}
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-5 sm:px-8 py-4 sm:py-6 sticky bottom-0 z-30 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors underline decoration-gray-300 underline-offset-4 cursor-pointer text-center py-2 sm:py-0"
          >
            {t("filters.clearAll")}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="bg-mosque hover:bg-mosque/90 text-white px-6 sm:px-8 py-3 rounded-lg font-medium text-sm sm:text-base shadow-lg shadow-mosque/30 transition-all hover:shadow-mosque/40 flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
          >
            <span>
              {totalMatchingHomes !== undefined
                ? t("filters.showHomesCount", { count: totalMatchingHomes })
                : t("filters.showHomes")}
            </span>
            <span className="material-icons text-sm">arrow_forward</span>
          </button>
        </footer>
      </main>
    </div>
  );
};

