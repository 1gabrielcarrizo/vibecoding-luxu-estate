"use client";

import React, { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PropertyCoordinates } from "@/types/property";

interface ReactLeafletMapProps {
  coordinates?: PropertyCoordinates;
  title: string;
  location: string;
  zoomPosition?: "topright" | "topleft" | "bottomleft" | "bottomright";
}

export const ReactLeafletMap: React.FC<ReactLeafletMapProps> = ({
  coordinates,
  title,
  location,
  zoomPosition = "topright",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Validate coordinates safely
  const rawLat = Number(coordinates?.lat);
  const rawLng = Number(coordinates?.lng);
  const validLat = isFinite(rawLat) ? rawLat : 37.4419;
  const validLng = isFinite(rawLng) ? rawLng : -122.143;

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Critical: Clean up any previous Leaflet state on container
    // to prevent "Map container is being reused by another instance"
    if ((container as any)._leaflet_id) {
      delete (container as any)._leaflet_id;
    }

    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        // Safe cleanup ignore
      }
      mapInstanceRef.current = null;
    }

    let map: L.Map | null = null;

    try {
      map = L.map(container, {
        center: [validLat, validLng],
        zoom: 14,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Reliable OpenStreetMap tiles without API key
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Mosque bounce pin matching LuxeEstate brand design
      const customPinIcon = L.divIcon({
        html: `
          <div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;background:#006655;border-radius:9999px;border:4px solid white;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);animation:bounce 1s infinite;">
            <span class="material-icons" style="color:white;font-size:16px;line-height:1;">home</span>
          </div>
        `,
        className: "custom-leaflet-pin",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const safeTitle = (title || "").replace(/[<>&"]/g, "");
      const safeLocation = (location || "").replace(/[<>&"]/g, "");

      const marker = L.marker([validLat, validLng], { icon: customPinIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: inherit; padding: 2px 4px;">
          <strong style="color: #19322F; display: block; font-size: 13px;">${safeTitle}</strong>
          <span style="color: #5c706d; font-size: 11px;">${safeLocation}</span>
        </div>
      `);
    } catch (err) {
      console.warn("Leaflet map initialization caught safely:", err);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (cleanupErr) {
          // Ignore unmount cleanup error
        }
        mapInstanceRef.current = null;
      }
      if (container && (container as any)._leaflet_id) {
        delete (container as any)._leaflet_id;
      }
    };
  }, [validLat, validLng, title, location]);

  const positionClasses: Record<string, string> = {
    topright: "top-3 right-3",
    topleft: "top-3 left-3",
    bottomleft: "bottom-3 left-3",
    bottomright: "bottom-3 right-3",
  };

  const posClass = positionClasses[zoomPosition] || positionClasses.topright;

  return (
    <div className="relative w-full h-full select-none">
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%", zIndex: 0 }}
      />

      {/* Custom Zoom Buttons */}
      <div className={`absolute ${posClass} flex flex-col gap-1.5 z-[400]`}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            mapInstanceRef.current?.zoomIn();
          }}
          aria-label="Acercar mapa"
          title="Acercar (+)"
          className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-nordic hover:text-mosque shadow-md flex items-center justify-center transition-all border border-gray-200/90 hover:border-mosque/40 active:scale-95 cursor-pointer"
        >
          <span className="material-icons text-base font-bold leading-none select-none">
            add
          </span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            mapInstanceRef.current?.zoomOut();
          }}
          aria-label="Alejar mapa"
          title="Alejar (-)"
          className="w-8 h-8 rounded-lg bg-white/95 hover:bg-white text-nordic hover:text-mosque shadow-md flex items-center justify-center transition-all border border-gray-200/90 hover:border-mosque/40 active:scale-95 cursor-pointer"
        >
          <span className="material-icons text-base font-bold leading-none select-none">
            remove
          </span>
        </button>
      </div>
    </div>
  );
};

export default ReactLeafletMap;
