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
  // Enforce strictly 2 featured properties at all times
  const displayedProperties = properties.slice(0, 2);

  if (displayedProperties.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light text-nordic-dark">
            {t("featured.title")}
          </h2>
          <p className="text-nordic-muted mt-1 text-sm">
            {t("featured.subtitle")}
          </p>
        </div>
        <button
          onClick={onViewAll}
          className="hidden sm:flex items-center gap-1 text-sm font-medium text-mosque hover:opacity-70 transition-opacity cursor-pointer"
        >
          {t("featured.viewAll")}{" "}
          <span className="material-icons text-sm">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
