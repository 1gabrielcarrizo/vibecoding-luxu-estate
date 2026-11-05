"use client";

import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { PropertyCoordinates } from "@/types/property";

interface ReactLeafletMapProps {
  coordinates: PropertyCoordinates;
  title: string;
  location: string;
}

export const ReactLeafletMap: React.FC<ReactLeafletMapProps> = ({
  coordinates,
  title,
  location,
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
    </MapContainer>
  );
};

export default ReactLeafletMap;

