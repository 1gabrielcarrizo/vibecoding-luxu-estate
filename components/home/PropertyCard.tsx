"use client";

import React, { useState } from "react";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  className = "",
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const badgeBg =
    property.type === "rent" ? "bg-mosque/90" : "bg-nordic-dark/90";

  return (
    <article
      onClick={() => onSelect?.(property)}
      className={`bg-white rounded-xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 group cursor-pointer h-full flex flex-col ${className}`}
    >
      {/* Media */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          alt={property.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={property.imageUrl}
          loading="lazy"
        />

        {/* Favorite Icon */}
        <button
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
            isFavorite
              ? "bg-mosque text-white"
              : "bg-white/90 text-nordic-dark hover:bg-mosque hover:text-white"
          }`}
        >
          <span className="material-icons text-lg leading-none block">
            {isFavorite ? "favorite" : "favorite_border"}
          </span>
        </button>

        {/* Status Badge */}
        {property.badge && (
          <div
            className={`absolute bottom-3 left-3 ${badgeBg} text-white text-xs font-bold px-2 py-1 rounded shadow-sm`}
          >
            {property.badge}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="font-bold text-lg text-nordic-dark">
            {property.formattedPrice}
            {property.priceSuffix && (
              <span className="text-sm font-normal text-nordic-muted">
                {property.priceSuffix}
              </span>
            )}
          </h3>
        </div>

        <h4 className="text-nordic-dark font-medium truncate mb-1">
          {property.title}
        </h4>
        <p className="text-nordic-muted text-xs mb-4">{property.location}</p>

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
    </article>
  );
};
