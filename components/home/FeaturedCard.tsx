"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types/property";

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
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
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
          alt={property.imageAlt || property.title}
          src={property.imageUrl}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Badge */}
        {property.badge && (
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-nordic shadow-sm z-10">
            {property.badge}
          </div>
        )}

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all z-10 ${
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
              {property.title}
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
                {property.priceSuffix}
              </span>
            )}
          </span>
        </div>

        {/* Specs Row */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-nordic/5">
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg text-mosque/80">king_bed</span>{" "}
            {property.beds} Beds
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg text-mosque/80">bathtub</span>{" "}
            {property.baths} Baths
          </div>
          <div className="flex items-center gap-2 text-nordic-muted text-sm">
            <span className="material-icons text-lg text-mosque/80">square_foot</span>{" "}
            {property.sqm.toLocaleString("en-US")} m²
          </div>
        </div>
      </div>
    </Link>
  );
};
