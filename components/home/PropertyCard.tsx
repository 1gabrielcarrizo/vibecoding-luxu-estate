"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/types/property";

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
  const [isFavorite, setIsFavorite] = useState(false);

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
          alt={property.imageAlt || property.title}
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
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors z-10 ${
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
            {property.badge}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic">
            {property.formattedPrice}
            {property.priceSuffix && (
              <span className="text-sm font-normal text-nordic-muted">
                {property.priceSuffix}
              </span>
            )}
          </h3>
        </div>

        <h4 className="text-nordic font-medium truncate mb-1 group-hover:text-mosque transition-colors">
          {property.title}
        </h4>
        <p className="text-nordic-muted text-xs mb-4 flex items-center gap-1">
          <span className="material-icons text-xs text-mosque">place</span>
          <span className="truncate">{property.location}</span>
        </p>

        {/* Specs */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">
              king_bed
            </span>{" "}
            {property.beds}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">
              bathtub
            </span>{" "}
            {property.baths}
          </div>
          <div className="flex items-center gap-1 text-nordic-muted text-xs">
            <span className="material-icons text-sm text-mosque/80">
              square_foot
            </span>{" "}
            {property.sqm}m²
          </div>
        </div>
      </div>
    </Link>
  );
};
