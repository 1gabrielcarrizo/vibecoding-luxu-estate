"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PropertyCoordinates } from "@/types/property";

interface ReactLeafletMapProps {
  coordinates: PropertyCoordinates;
  title: string;
  location: string;
  zoomPosition?: "topright" | "topleft" | "bottomleft" | "bottomright";
}

const CustomZoomButtons: React.FC<{
  position?: "topright" | "topleft" | "bottomleft" | "bottomright";
}> = ({ position = "topright" }) => {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      L.DomEvent.disableClickPropagation(containerRef.current);
      L.DomEvent.disableScrollPropagation(containerRef.current);
    }
  }, []);

  const positionClasses: Record<string, string> = {
    topright: "top-3 right-3",
    topleft: "top-3 left-3",
    bottomleft: "bottom-3 left-3",
    bottomright: "bottom-3 right-3",
  };

  const posClass = positionClasses[position] || positionClasses.topright;

  return (
    <div
      ref={containerRef}
      className={`absolute ${posClass} flex flex-col gap-1.5 z-[400] select-none`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          map.zoomIn();
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
          map.zoomOut();
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
  );
};

export const ReactLeafletMap: React.FC<ReactLeafletMapProps> = ({
  coordinates,
  title,
  location,
  zoomPosition = "topright",
}) => {
  // Custom pin with Mosque color, white border, home icon, and bounce animation matching code.html
  const customPinIcon = useMemo(() => {
    return L.divIcon({
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
  }, []);

  const position: [number, number] = [coordinates.lat, coordinates.lng];

  return (
    <MapContainer
      center={position}
      zoom={14}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      style={{ width: "100%", height: "100%", zIndex: 0 }}
    >
      {/* Standard OpenStreetMap tiles - Free, reliable, NO API KEY required */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
      />

      <Marker position={position} icon={customPinIcon}>
        <Popup>
          <div style={{ fontFamily: "inherit", padding: "2px 4px" }}>
            <strong style={{ color: "#19322F", display: "block", fontSize: "13px" }}>
              {title}
            </strong>
            <span style={{ color: "#5c706d", fontSize: "11px" }}>{location}</span>
          </div>
        </Popup>
      </Marker>

      {/* Custom zoom controls inside the map */}
      <CustomZoomButtons position={zoomPosition} />
    </MapContainer>
  );
};

export default ReactLeafletMap;

