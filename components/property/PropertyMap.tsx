"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { PropertyCoordinates } from "@/types/property";

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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mapInstance: any = null;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Ensure container is empty before initializing
      if ((mapContainerRef.current as unknown as { _leaflet_id?: number })._leaflet_id) {
        return;
      }

      const map = L.map(mapContainerRef.current, {
        center: [coordinates.lat, coordinates.lng],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
      });

      mapInstance = map;

      // CartoDB Voyager tiles (clean, luxury architectural presentation)
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
        }
      ).addTo(map);

      // Custom pulsing pin matching the exact design from code.html
      const pinHtml = `
        <div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:#006655;border-radius:9999px;border:4px solid white;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);animation:bounce 1s infinite;">
          <span class="material-icons" style="color:white;font-size:16px;line-height:1;">home</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: "custom-leaflet-pin",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([coordinates.lat, coordinates.lng], {
        icon: customIcon,
      }).addTo(map);

      // Popup with property info
      marker.bindPopup(
        `<div style="font-family:inherit;padding:2px 4px;">
          <strong style="color:#19322F;display:block;font-size:13px;">${title}</strong>
          <span style="color:#5c706d;font-size:11px;">${location}</span>
        </div>`
      );

      setIsLoaded(true);
    });

    return () => {
      isMounted = false;
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [coordinates.lat, coordinates.lng, title, location]);

  const mapExternalUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;

  return (
    <div className="bg-white p-2 rounded-xl shadow-sm border border-mosque/5">
      <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Loading placeholder skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
            <span className="material-icons text-mosque/40 text-3xl">map</span>
          </div>
        )}

        {/* External Map Link as in code.html */}
        <a
          href={mapExternalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-xs font-medium px-2.5 py-1 rounded shadow-sm text-nordic hover:text-mosque transition-colors z-[400] flex items-center gap-1"
        >
          <span>View on Map</span>
          <span className="material-icons text-[12px]">open_in_new</span>
        </a>
      </div>
    </div>
  );
};

