"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types/property";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { getLocalizedTitle } from "@/lib/i18n/propertyTranslations";

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  className?: string;
  priority?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  className = "",
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

  const badgeBg =
    property.type === "rent" ? "bg-mosque/90" : "bg-nordic/90";

  const primaryImage =
    (property.images && property.images.length > 0
      ? property.images[0]
      : property.imageUrl) ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  // Translate badges if available
  const getTranslatedBadge = (badgeText?: string) => {
    if (!badgeText) return null;
    const clean = badgeText.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    if (clean === "rent" || clean === "forrent" || clean === "alquiler" || clean === "location") {
      return t("propertyCard.forRent");
    }
    if (clean === "sale" || clean === "forsale" || clean === "venta" || clean === "avendre") {
      return t("propertyCard.forSale");
    }
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
      className={`bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col border border-mosque/5 hover:border-mosque/20 ${className}`}
    >
      {/* Media */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          alt={property.imageAlt || displayTitle}
          src={primaryImage}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Favorite Icon */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={t("propertyCard.favoriteAria")}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors z-10 cursor-pointer ${
            isFavorite
              ? "bg-mosque text-white"
              : "bg-white/90 text-nordic hover:bg-mosque hover:text-white"
          }`}
        >
          <span className="material-icons text-lg leading-none block">
            {isFavorite ? "favorite" : "favorite_border"}
          </span>
        </button>

        {/* Status Badge */}
        {property.badge && (
          <div
            className={`absolute bottom-3 left-3 ${badgeBg} text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm`}
          >
            {getTranslatedBadge(property.badge)}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-1.5 sm:mb-2">
          <h3 className="font-bold text-base sm:text-lg text-nordic truncate">
            {property.formattedPrice}
            {property.priceSuffix && (
              <span className="text-xs sm:text-sm font-normal text-nordic-muted">
                {property.priceSuffix.includes("/mo") || property.priceSuffix.includes("/mes")
                  ? ` ${t("propertyDetail.perMonth")}`
                  : ` ${property.priceSuffix}`}
              </span>
            )}
          </h3>
        </div>

        <h4 className="text-nordic text-sm sm:text-base font-medium truncate mb-1 group-hover:text-mosque transition-colors">
          {displayTitle}
        </h4>
        <p className="text-nordic-muted text-xs mb-3 sm:mb-4 flex items-center gap-1">
          <span className="material-icons text-xs text-mosque">place</span>
          <span className="truncate">{property.location}</span>
        </p>

        {/* Specs */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 text-[11px] sm:text-xs">
          <div className="flex items-center gap-1 text-nordic-muted">
            <span className="material-icons text-sm text-mosque/80">
              king_bed
            </span>{" "}
            <span>{property.beds} {t("propertyCard.beds")}</span>
          </div>
          <div className="flex items-center gap-1 text-nordic-muted">
            <span className="material-icons text-sm text-mosque/80">
              bathtub
            </span>{" "}
            <span>{property.baths} {t("propertyCard.baths")}</span>
          </div>
          <div className="flex items-center gap-1 text-nordic-muted">
            <span className="material-icons text-sm text-mosque/80">
              square_foot
            </span>{" "}
            <span>{property.sqm} {t("propertyCard.sqm")}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
