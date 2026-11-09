"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import dynamic from "next/dynamic";
import { PropertyCoordinates } from "@/types/property";
import { useTranslation } from "@/lib/i18n/LanguageContext";

class MapErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Map boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Dynamically import the Leaflet map to prevent SSR window reference issues
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

  const safeLat =
    typeof coordinates?.lat === "number" && !isNaN(coordinates.lat)
      ? coordinates.lat
      : 37.4419;
  const safeLng =
    typeof coordinates?.lng === "number" && !isNaN(coordinates.lng)
      ? coordinates.lng
      : -122.143;

  const mapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${safeLat},${safeLng}`;

  const fallbackUI = (
    <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-center p-4">
      <span className="material-icons text-mosque text-3xl mb-1">location_on</span>
      <p className="text-xs text-nordic font-medium">{location}</p>
    </div>
  );

  return (
    <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
      <div className="relative z-0 [isolation:isolate] w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
        <MapErrorBoundary fallback={fallbackUI}>
          <DynamicReactLeafletMap
            coordinates={{ lat: safeLat, lng: safeLng }}
            title={title}
            location={location}
          />
        </MapErrorBoundary>

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
