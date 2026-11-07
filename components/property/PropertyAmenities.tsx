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
  const { t } = useTranslation();

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
      <h2 className="text-lg font-semibold mb-6 text-nordic">
        {t("propertyDetail.amenitiesTitle")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
        {amenities.map((amenity) => {
          const translated = t(`amenitiesList.${amenity}`);
          const displayLabel =
            translated !== `amenitiesList.${amenity}` ? translated : amenity;
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
