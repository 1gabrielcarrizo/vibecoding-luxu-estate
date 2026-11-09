"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface PropertyAmenitiesProps {
  amenities?: string[];
}

export const PropertyAmenities: React.FC<PropertyAmenitiesProps> = ({
  amenities = [
    "Smart Home System",
    "Swimming Pool",
    "Central Heating & Cooling",
    "Electric Vehicle Charging",
    "Private Gym",
    "Wine Cellar",
  ],
}) => {
  const { t, dict } = useTranslation();

  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-mosque/5">
      <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-nordic">
        {t("propertyDetail.amenitiesTitle")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-6 sm:gap-x-8">
        {amenities.map((amenity) => {
          const trimmed = (amenity || "").trim();
          let displayLabel = t(`amenitiesList.${trimmed}`);

          // Fallback to case-insensitive dictionary lookup
          if (displayLabel === `amenitiesList.${trimmed}`) {
            const list = dict?.amenitiesList as Record<string, string> | undefined;
            if (list) {
              const matchedKey = Object.keys(list).find(
                (k) => k.toLowerCase() === trimmed.toLowerCase()
              );
              if (matchedKey && list[matchedKey]) {
                displayLabel = list[matchedKey];
              } else {
                displayLabel = trimmed;
              }
            } else {
              displayLabel = trimmed;
            }
          }

          return (
            <div key={amenity} className="flex items-center gap-3 text-nordic/70">
              <span className="material-icons text-mosque/60 text-sm">
                check_circle
              </span>
              <span className="text-sm font-medium">{displayLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
