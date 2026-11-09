"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Property, PropertyAgent } from "@/types/property";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  agent: PropertyAgent;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  isOpen,
  onClose,
  property,
  agent,
}) => {
  const { t } = useTranslation();
  const [visitType, setVisitType] = useState<"in-person" | "video">("in-person");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const tourTypeLabel =
    visitType === "in-person"
      ? t("modals.inPerson")
      : t("modals.videoTour");

  const whatsappMessage = encodeURIComponent(
    t("modals.whatsappScheduleMessage", {
      agent: agent.name,
      tourType: tourTypeLabel,
      title: property.title,
      date: selectedDate || (tourTypeLabel.includes("visita") ? "esta semana" : "this week"),
      time: selectedTime,
      name: name || "Client",
    }) ||
      `Hello ${agent.name}, I'd like to schedule a ${tourTypeLabel} for ${property.title} on ${selectedDate || "this week"} at ${selectedTime}. My name is ${
        name || "Client"
      }.`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-mosque/10 relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100">
          <div className="min-w-0 pr-3">
            <h3 className="text-lg sm:text-xl font-bold text-nordic truncate">{t("modals.scheduleTitle")}</h3>
            <p className="text-xs text-nordic/60 mt-0.5 truncate">{property.title} • {property.location}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-nordic/40 hover:text-nordic p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-6 sm:py-8 text-center space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-mosque/10 text-mosque rounded-full mx-auto flex items-center justify-center">
              <span className="material-icons text-2xl sm:text-3xl">check_circle</span>
            </div>
            <h4 className="text-lg sm:text-xl font-semibold text-nordic">
              {t("modals.tourSuccessTitle")}
            </h4>
            <p className="text-xs sm:text-sm text-nordic/70 max-w-sm mx-auto">
              {t("modals.tourSuccessMessage")}
            </p>
            <div className="pt-3 sm:pt-4 flex flex-col gap-2">
              <a
                href={`https://wa.me/15553498201?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span className="material-icons text-sm">chat</span>
                <span>{t("propertyDetail.whatsappChat")}</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-nordic py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                {t("modals.close")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-3.5 sm:space-y-4">
            {/* Tour Type Selector */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setVisitType("in-person")}
                className={`py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                  visitType === "in-person"
                    ? "bg-white text-nordic shadow-xs"
                    : "text-nordic/60 hover:text-nordic"
                }`}
              >
                <span className="material-icons text-sm">place</span>
                <span>{t("modals.inPerson")}</span>
              </button>
              <button
                type="button"
                onClick={() => setVisitType("video")}
                className={`py-2 px-2 sm:px-3 text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                  visitType === "video"
                    ? "bg-white text-nordic shadow-xs"
                    : "text-nordic/60 hover:text-nordic"
                }`}
              >
                <span className="material-icons text-sm">videocam</span>
                <span>{t("modals.videoTour")}</span>
              </button>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-nordic/80 mb-1">
                  {t("modals.selectDate")} *
                </label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-nordic/80 mb-1">
                  {t("modals.selectTime")} *
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic bg-white focus:outline-none focus:border-mosque"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                </select>
              </div>
            </div>

            {/* Contact details */}
            <div>
              <label className="block text-xs font-semibold text-nordic/80 mb-1">
                {t("modals.fullName")} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-nordic/80 mb-1">
                  {t("modals.email")} *
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-nordic/80 mb-1">
                  {t("modals.phone")}
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
                />
              </div>
            </div>

            {/* Agent info preview */}
            <div className="p-2.5 sm:p-3 bg-mosque/5 rounded-lg border border-mosque/10 flex items-center gap-3">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={agent.avatarUrl}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-xs min-w-0">
                <span className="font-semibold text-nordic block truncate">
                  {t("modals.tourHostedBy", { name: agent.name })}
                </span>
                <span className="text-nordic/60 truncate block">
                  {agent.role === "Top Rated Agent"
                    ? t("propertyDetail.agentRating")
                    : agent.role}
                </span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              className="w-full bg-mosque hover:bg-primary-hover text-white py-3.5 px-4 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2 text-sm sm:text-base"
            >
              <span className="material-icons text-sm">calendar_today</span>
              <span>{t("modals.confirmTour")}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
