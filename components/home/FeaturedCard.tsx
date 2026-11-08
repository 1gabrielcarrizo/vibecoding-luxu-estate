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
      <div className="aspect-[4/3] w-full overflow-hidden relative bg-slate-100">
        <Image
          alt={property.imageAlt || displayTitle}
          src={primaryImage}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {property.badge && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic shadow-sm z-10">
            {getTranslatedBadge(property.badge)}
          </div>
        )}

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={t("propertyCard.favoriteAria")}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all z-10 cursor-pointer ${
            isFavorite
              ? "bg-mosque text-white"
              : "bg-white/90 text-nordic hover:bg-mosque hover:text-white"
          }`}
        >
          <span className="material-icons text-xl">
            {isFavorite ? "favorite" : "favorite_border"}
          </span>
        </button>

        {/* Dark subtle gradient bottom */}
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="p-6 relative">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-medium text-nordic group-hover:text-mosque transition-colors">
              {displayTitle}
            </h3>
            <p className="text-nordic-muted text-sm flex items-center gap-1 mt-1">
              <span className="material-icons text-sm text-mosque">place</span>{" "}
              {property.location}
            </p>
          </div>
          <span className="text-xl font-semibold text-mosque whitespace-nowrap ml-4">
            {property.formattedPrice}
            {property.priceSuffix && (
              <span className="text-sm font-normal text-nordic-muted">
                {property.priceSuffix.includes("/mo") || property.priceSuffix.includes("/mes")
                  ? ` ${t("propertyDetail.perMonth")}`
                  : ` ${property.priceSuffix}`}
              </span>
            )}
          </span>
        </div>

        {/* Specs Row */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic/5">
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg text-mosque/80">king_bed</span>{" "}
            {property.beds} {t("propertyCard.beds")}
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg text-mosque/80">bathtub</span>{" "}
            {property.baths} {t("propertyCard.baths")}
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg text-mosque/80">square_foot</span>{" "}
            {property.sqm.toLocaleString("en-US")} {t("propertyCard.sqm")}
          </div>
        </div>
      </div>
    </Link>
  );
};
