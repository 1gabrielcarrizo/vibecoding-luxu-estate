"use client";

import React from "react";
import { Property } from "@/types/property";
import { FeaturedCard } from "./FeaturedCard";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface FeaturedCollectionsProps {
  properties: Property[];
  onViewAll?: () => void;
  onSelectProperty?: (property: Property) => void;
}

export const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({
  properties,
  onViewAll,
  onSelectProperty,
}) => {
  const { t } = useTranslation();
  // Display featured properties (up to 4 in a balanced 2-column grid)
  const displayedProperties = properties.slice(0, 4);

  if (displayedProperties.length === 0) return null;

  return (
    <section className="mb-12 sm:mb-16">
      <div className="flex items-end justify-between mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-light text-nordic-dark">
            {t("featured.title")}
          </h2>
          <p className="text-nordic-muted mt-1 text-xs sm:text-sm">
            {t("featured.subtitle")}
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs sm:text-sm font-medium text-mosque hover:opacity-70 transition-opacity cursor-pointer"
        >
          <span>{t("featured.viewAll")}</span>
          <span className="material-icons text-sm">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {displayedProperties.map((property) => (
          <FeaturedCard
            key={property.id}
            property={property}
            onSelect={onSelectProperty}
          />
        ))}
      </div>
    </section>
  );
};
