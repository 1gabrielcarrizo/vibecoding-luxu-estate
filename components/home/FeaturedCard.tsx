"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types/property";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { getLocalizedTitle } from "@/lib/i18n/propertyTranslations";

interface FeaturedCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  priority?: boolean;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({
  property,
  onSelect,
  priority = false,
}) => {
  const { t, locale } = useTranslation();
  const [isFavorite, setIsFavorite] = useState(false);
  const displayTitle = getLocalizedTitle(property.slug, locale, property.title);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const primaryImage =
    (property.images && property.images.length > 0
      ? property.images[0]
      : property.imageUrl) ||
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80";

  // Translate badges if available
  const getTranslatedBadge = (badgeText?: string) => {
    if (!badgeText) return null;
    const clean = badgeText.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    if (clean === "exclusive" || clean === "exclusivo" || clean === "exclusif") {
      return t("propertyCard.exclusive");
    }
    if (clean === "new" || clean === "nuevo" || clean === "nouveau") {
      return t("propertyCard.new");
    }
    if (clean === "featured" || clean === "destacada" || clean === "envedette") {
      return t("propertyCard.featured");
    }
    if (clean === "pricecut" || clean === "rebajada" || clean === "prixreduit") {
      return t("propertyCard.priceCut");
    }
    if (clean === "rent" || clean === "forrent" || clean === "alquiler" || clean === "location") {
      return t("propertyCard.forRent");
    }
    if (clean === "sale" || clean === "forsale" || clean === "venta" || clean === "avendre") {
      return t("propertyCard.forSale");
    }
    if (clean === "newarrival") {
      return t("propertyCard.newArrival");
    }
    if (clean === "newlisting") {
      return t("propertyCard.newListing");
    }
    if (clean === "topfloor") {
      return t("propertyCard.topFloor");
    }
    if (clean === "alpine") {
      return t("propertyCard.alpine");
    }
    if (clean === "minimalist") {
      return t("propertyCard.minimalist");
    }
    if (clean === "penthouse") {
      return t("propertyCard.penthouse");
    }
    return badgeText;
  };

  return (
    <Link
      href={`/propiedades/${property.slug}`}
      onClick={(e) => {
        if (onSelect) {
          e.preventDefault();
          onSelect(property);
        }
      }}
      className="group relative rounded-xl overflow-hidden shadow-soft bg-white cursor-pointer hover:shadow-xl transition-all duration-300 border border-mosque/5 block"
    >
      {/* Media Container */}
      <div className="aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden relative bg-slate-100">
        <Image
          alt={property.imageAlt || displayTitle}
          src={primaryImage}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {property.badge && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-sm px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-nordic shadow-sm z-10">
            {getTranslatedBadge(property.badge)}
          </div>
        )}

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={t("propertyCard.favoriteAria")}
          className={`absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all z-10 cursor-pointer ${
            isFavorite
              ? "bg-mosque text-white"
              : "bg-white/90 text-nordic hover:bg-mosque hover:text-white"
          }`}
        >
          <span className="material-icons text-lg sm:text-xl">
            {isFavorite ? "favorite" : "favorite_border"}
          </span>
        </button>

        {/* Dark subtle gradient bottom */}
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 mb-2">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-medium text-nordic group-hover:text-mosque transition-colors truncate">
              {displayTitle}
            </h3>
            <p className="text-nordic-muted text-xs sm:text-sm flex items-center gap-1 mt-1 truncate">
              <span className="material-icons text-xs sm:text-sm text-mosque">place</span>{" "}
              {property.location}
            </p>
          </div>
          <span className="text-lg sm:text-xl font-semibold text-mosque whitespace-nowrap self-start">
            {property.formattedPrice}
            {property.priceSuffix && (
              <span className="text-xs sm:text-sm font-normal text-nordic-muted">
                {property.priceSuffix.includes("/mo") || property.priceSuffix.includes("/mes")
                  ? ` ${t("propertyDetail.perMonth")}`
                  : ` ${property.priceSuffix}`}
              </span>
            )}
          </span>
        </div>

        {/* Specs Row */}
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-nordic/5 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-nordic-muted">
            <span className="material-icons text-base sm:text-lg text-mosque/80">king_bed</span>{" "}
            <span>{property.beds} {t("propertyCard.beds")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-nordic-muted">
            <span className="material-icons text-base sm:text-lg text-mosque/80">bathtub</span>{" "}
            <span>{property.baths} {t("propertyCard.baths")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-nordic-muted">
            <span className="material-icons text-base sm:text-lg text-mosque/80">square_foot</span>{" "}
            <span>{property.sqm.toLocaleString("en-US")} {t("propertyCard.sqm")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
