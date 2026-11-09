"use client";

import React from "react";
import dynamic from "next/dynamic";
import { PropertyCoordinates } from "@/types/property";
import { useTranslation } from "@/lib/i18n/LanguageContext";

// Dynamically import the React-Leaflet map to prevent SSR window reference issues
const DynamicReactLeafletMap = dynamic(
  () => import("./ReactLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
        <span className="material-icons text-mosque/40 text-3xl">map</span>
      </div>
    ),
  }
);

interface PropertyMapProps {
  coordinates?: PropertyCoordinates;
  title: string;
  location: string;
}

export const PropertyMap: React.FC<PropertyMapProps> = ({
  coordinates = { lat: 37.4419, lng: -122.143 },
  title,
  location,
}) => {
  const { t } = useTranslation();
  const mapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;

  return (
    <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
      <div className="relative z-0 [isolation:isolate] w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
        <DynamicReactLeafletMap
          coordinates={coordinates}
          title={title}
          location={location}
        />

        {/* External Map Link as in code.html */}
        <a
          href={mapExternalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-xs font-medium px-2.5 py-1 rounded shadow-sm text-nordic hover:text-mosque transition-colors z-[400] flex items-center gap-1 cursor-pointer"
        >
          <span>{t("propertyDetail.viewOnMap")}</span>
          <span className="material-icons text-[12px]">open_in_new</span>
        </a>
      </div>
    </div>
  );
};
