"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types/property";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { getLocalizedTitle } from "@/lib/i18n/propertyTranslations";

interface FavoritePropertyCardProps {
  property: Property;
  viewMode: "grid" | "list";
  priority?: boolean;
  onRemove: (property: Property) => void;
  onBookVisit: (property: Property) => void;
}

export const FavoritePropertyCard: React.FC<FavoritePropertyCardProps> = ({
  property,
  viewMode,
  priority = false,
  onRemove,
  onBookVisit,
}) => {
  const { t, locale } = useTranslation();
  const displayTitle = getLocalizedTitle(property.slug, locale, property.title);

  const primaryImage =
    (property.images && property.images.length > 0
      ? property.images[0]
      : property.imageUrl) ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

  const getTranslatedBadge = (badgeText?: string) => {
    if (!badgeText) return null;
    const clean = badgeText.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
    if (
      clean === "rent" ||
      clean === "forrent" ||
      clean === "alquiler" ||
      clean === "location" ||
      clean === "sale" ||
      clean === "forsale" ||
      clean === "venta" ||
      clean === "avendre"
    ) {
      // Listing type is already displayed as a dedicated pill next to the price
      return null;
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
    if (
      clean === "pricecut" ||
      clean === "pricedrop" ||
      clean === "rebajada" ||
      clean === "prixreduit"
    ) {
      return t("propertyCard.priceCut");
    }
    if (clean === "newarrival") return t("propertyCard.newArrival");
    if (clean === "newlisting") return t("propertyCard.newListing");
    if (clean === "topfloor") return t("propertyCard.topFloor");
    if (clean === "alpine") return t("propertyCard.alpine");
    if (clean === "minimalist") return t("propertyCard.minimalist");
    if (clean === "penthouse") return t("propertyCard.penthouse");
    return badgeText;
  };

  const translatedBadge = getTranslatedBadge(property.badge);
  const isPriceDrop =
    property.badge?.toLowerCase().includes("price") ||
    property.badge?.toLowerCase().includes("rebaj");

  const isRent = property.type === "rent";
  const priceSuffixText =
    property.priceSuffix &&
    (property.priceSuffix.includes("/mo") ||
      property.priceSuffix.includes("/mes"))
      ? t("propertyDetail.perMonth")
      : property.priceSuffix || (isRent ? t("propertyDetail.perMonth") : "");

  const bedsLabel =
    property.beds === 1 ? t("favorites.bedSingular") : t("favorites.bedsPlural");
  const bathsLabel =
    property.baths === 1
      ? t("favorites.bathSingular")
      : t("favorites.bathsPlural");

  if (viewMode === "list") {
    return (
      <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col sm:flex-row">
        {/* Media */}
        <div className="relative h-56 sm:h-auto sm:w-72 md:w-80 overflow-hidden flex-shrink-0 bg-slate-100">
          <Link
            href={`/propiedades/${property.slug}`}
            className="block w-full h-full relative"
          >
            <Image
              alt={property.imageAlt || displayTitle}
              src={primaryImage}
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              priority={priority}
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </Link>

          <button
            type="button"
            onClick={() => onRemove(property)}
            aria-label={t("favorites.removeAria")}
            title={t("favorites.removeAria")}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-mosque hover:bg-mosque hover:text-white transition-colors shadow-sm z-10 cursor-pointer"
          >
            <span className="material-icons text-xl block">favorite</span>
          </button>

          {translatedBadge && (
            <div
              className={`absolute bottom-3 left-3 ${
                isPriceDrop ? "bg-mosque/90" : "bg-nordic/90"
              } backdrop-blur-md px-3 py-1 rounded-md pointer-events-none`}
            >
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                {translatedBadge}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex justify-between items-start gap-3 mb-2">
              <Link
                href={`/propiedades/${property.slug}`}
                className="min-w-0 group/link"
              >
                <h3 className="text-xl font-bold text-nordic group-hover/link:text-mosque transition-colors">
                  {property.formattedPrice}
                  {priceSuffixText && (
                    <span className="text-sm font-medium text-nordic/60">
                      {priceSuffixText}
                    </span>
                  )}
                </h3>
                <p className="text-nordic font-medium text-base mt-0.5 truncate group-hover/link:text-mosque transition-colors">
                  {displayTitle}
                </p>
              </Link>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded whitespace-nowrap flex-shrink-0 ${
                  isRent
                    ? "bg-blue-50 text-blue-800"
                    : "bg-hint-green text-mosque"
                }`}
              >
                {isRent
                  ? t("propertyDetail.badges.forRent")
                  : t("propertyDetail.badges.forSale")}
              </span>
            </div>

            <p className="text-nordic/70 text-sm mb-4 line-clamp-1 flex items-center gap-1">
              <span className="material-icons text-mosque text-sm">place</span>
              <span className="truncate">{property.location}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-5 text-nordic/60 text-xs font-medium flex-wrap">
              <div className="flex items-center gap-1">
                <span className="material-icons text-mosque text-base">bed</span>
                <span>
                  {property.beds} {bedsLabel}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-icons text-mosque text-base">
                  bathtub
                </span>
                <span>
                  {property.baths} {bathsLabel}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-icons text-mosque text-base">
                  square_foot
                </span>
                <span>
                  {property.sqm.toLocaleString("en-US")}{" "}
                  {t("propertyCard.sqm")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:flex-shrink-0">
              <Link
                href={`/propiedades/${property.slug}`}
                className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-nordic font-medium text-sm transition-colors text-center"
              >
                {t("propertyCard.viewDetails")}
              </Link>
              <button
                type="button"
                onClick={() => onBookVisit(property)}
                className="px-5 py-2.5 rounded-lg border border-mosque text-mosque font-medium text-sm hover:bg-mosque hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {isRent
                    ? t("favorites.scheduleTour")
                    : t("favorites.bookVisit")}
                </span>
                <span className="material-icons text-base">
                  {isRent ? "calendar_today" : "arrow_forward"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid View — Faithful to antigravity/resources/favorites_list_screen/code.html
  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col h-full">
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <Link
          href={`/propiedades/${property.slug}`}
          className="block w-full h-full relative"
        >
          <Image
            alt={property.imageAlt || displayTitle}
            src={primaryImage}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            priority={priority}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </Link>

        <button
          type="button"
          onClick={() => onRemove(property)}
          aria-label={t("favorites.removeAria")}
          title={t("favorites.removeAria")}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-mosque hover:bg-mosque hover:text-white transition-colors shadow-sm z-10 cursor-pointer"
        >
          <span className="material-icons text-xl block">favorite</span>
        </button>

        {translatedBadge && (
          <div
            className={`absolute bottom-3 left-3 ${
              isPriceDrop ? "bg-mosque/90" : "bg-nordic/90"
            } backdrop-blur-md px-3 py-1 rounded-md pointer-events-none`}
          >
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              {translatedBadge}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Link
            href={`/propiedades/${property.slug}`}
            className="min-w-0 hover:text-mosque transition-colors"
          >
            <h3 className="text-lg font-bold text-nordic truncate">
              {property.formattedPrice}
              {priceSuffixText && (
                <span className="text-xs font-medium text-nordic/60">
                  {priceSuffixText}
                </span>
              )}
            </h3>
          </Link>
          <span
            className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${
              isRent ? "bg-blue-50 text-blue-800" : "bg-hint-green text-mosque"
            }`}
          >
            {isRent
              ? t("propertyDetail.badges.forRent")
              : t("propertyDetail.badges.forSale")}
          </span>
        </div>

        <Link
          href={`/propiedades/${property.slug}`}
          className="text-nordic font-medium text-sm line-clamp-1 hover:text-mosque transition-colors mb-0.5"
        >
          {displayTitle}
        </Link>
        <p className="text-nordic/70 text-sm mb-4 line-clamp-1">
          {property.location}
        </p>

        <div className="flex items-center justify-between text-nordic/60 text-xs font-medium mb-6">
          <div className="flex items-center gap-1">
            <span className="material-icons text-mosque text-base">bed</span>
            <span>
              {property.beds} {bedsLabel}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-icons text-mosque text-base">
              bathtub
            </span>
            <span>
              {property.baths} {bathsLabel}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-icons text-mosque text-base">
              square_foot
            </span>
            <span>
              {property.sqm.toLocaleString("en-US")} {t("propertyCard.sqm")}
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <button
            type="button"
            onClick={() => onBookVisit(property)}
            className="w-full py-2.5 rounded-lg border border-mosque text-mosque font-medium text-sm hover:bg-mosque hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>
              {isRent ? t("favorites.scheduleTour") : t("favorites.bookVisit")}
            </span>
            <span className="material-icons text-base">
              {isRent ? "calendar_today" : "arrow_forward"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};
