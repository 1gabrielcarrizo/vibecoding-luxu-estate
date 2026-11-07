"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Property } from "@/types/property";
import { PropertyMap } from "./PropertyMap";
import { ScheduleVisitModal } from "./ScheduleVisitModal";
import { ContactAgentModal } from "./ContactAgentModal";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface PropertySidebarProps {
  property: Property;
}

export const PropertySidebar: React.FC<PropertySidebarProps> = ({ property }) => {
  const { t } = useTranslation();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const agent = property.agent || {
    name: "Sarah Jenkins",
    role: "Top Rated Agent",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4TxUmdQRb2VMjuaNxLEwLorv_dgHzoET2_wL5toSvew6nhtziaR3DX-U69DBN7J74yO6oKokpw8tqEFutJf13MeXghCy7FwZuAxnoJel6FYcKeCRUVinpZtrNnkZvXd-MY5_2MAtRD7JP5BieHixfCaeAPW04jm-y-nvF3HIrwcZ_HRDk_MrNP5WiPV3u9zNrEgM-SQoWGh4xLVSV444aZAbVl03mjjsW5WBpIeodCyqJxprTDp6Q157D06VxcdUSCf-l9UKQT-w",
    phone: "+1 (555) 349-8201",
    email: "sarah.jenkins@luxeestate.com",
    rating: 4.9,
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${agent.name}, I'm interested in viewing ${property.title} (${property.location}) priced at ${property.formattedPrice}. Reference: ${property.slug}`
  );
  const whatsappUrl = `https://wa.me/15553498201?text=${whatsappMessage}`;

  const roleText =
    agent.role === "Top Rated Agent"
      ? t("propertyDetail.agentRating")
      : agent.role;

  const priceSuffixText =
    property.priceSuffix &&
    (property.priceSuffix.includes("/mo") ||
      property.priceSuffix.includes("/mes"))
      ? t("propertyDetail.perMonth")
      : property.priceSuffix;

  return (
    <div className="lg:col-span-4 relative">
      <div className="sticky top-28 space-y-6">
        {/* Card 1: Pricing & Agent Contact */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-mosque/5">
          <div className="mb-4">
            <h1 className="text-4xl font-display font-light text-nordic mb-2">
              {property.formattedPrice}
              {priceSuffixText && (
                <span className="text-lg font-normal text-nordic/60 ml-1">
                  {priceSuffixText}
                </span>
              )}
            </h1>
            <p className="text-nordic/60 font-medium flex items-center gap-1">
              <span className="material-icons text-mosque text-sm">location_on</span>
              <span>{property.location}</span>
            </p>
          </div>

          <div className="h-px bg-slate-100 my-6"></div>

          {/* Agent info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0 bg-slate-100">
              <Image
                alt={agent.name}
                src={agent.avatarUrl}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-nordic">{agent.name}</h3>
              <div className="flex items-center gap-1 text-xs text-mosque font-medium">
                <span className="material-icons text-[14px]">star</span>
                <span>{roleText}</span>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={t("propertyDetail.whatsappChat")}
                aria-label={t("propertyDetail.whatsappChat")}
                className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-icons text-sm">chat</span>
              </a>
              <a
                href={`tel:${agent.phone || "+15553498201"}`}
                title={t("propertyDetail.callAgent")}
                aria-label={t("propertyDetail.callAgent")}
                className="p-2 rounded-full bg-mosque/10 text-mosque hover:bg-mosque hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-icons text-sm">call</span>
              </a>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsScheduleOpen(true)}
              className="w-full bg-mosque hover:bg-primary-hover text-white py-4 px-6 rounded-lg font-medium transition-all shadow-lg shadow-mosque/20 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span className="material-icons text-xl group-hover:scale-110 transition-transform">
                calendar_today
              </span>
              <span>{t("propertyDetail.scheduleTour")}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="w-full bg-transparent border border-nordic/10 hover:border-mosque text-nordic/80 hover:text-mosque py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-icons text-xl">mail_outline</span>
              <span>{t("propertyDetail.contactAgent")}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Interactive Leaflet Map */}
        <PropertyMap
          coordinates={property.coordinates}
          title={property.title}
          location={property.location}
        />
      </div>

      {/* Modals for lead capture */}
      <ScheduleVisitModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        property={property}
        agent={agent}
      />

      <ContactAgentModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        property={property}
        agent={agent}
      />
    </div>
  );
};
