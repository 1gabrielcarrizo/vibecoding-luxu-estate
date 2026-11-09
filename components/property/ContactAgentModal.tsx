"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Property, PropertyAgent } from "@/types/property";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface ContactAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  agent: PropertyAgent;
}

export const ContactAgentModal: React.FC<ContactAgentModalProps> = ({
  isOpen,
  onClose,
  property,
  agent,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setMessage(
        t("modals.defaultContactMessage", {
          title: property.title,
          location: property.location,
        })
      );
      setIsSent(false);
    }
  }, [isOpen, property.title, property.location, t]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  const whatsappMessage = encodeURIComponent(
    t("modals.whatsappContactMessage", {
      agent: agent.name,
      message,
      name: name || "Client",
      email: email || "",
      phone: phone || "",
    }) ||
      `Hello ${agent.name}, ${message} My contact is ${name} (${email}, ${phone}).`
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
            <h3 className="text-lg sm:text-xl font-bold text-nordic truncate">
              {t("modals.contactTitle")}
            </h3>
            <p className="text-xs text-nordic/60 mt-0.5 truncate">{property.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-nordic/40 hover:text-nordic p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer flex-shrink-0"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        {isSent ? (
          <div className="py-6 sm:py-8 text-center space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-mosque/10 text-mosque rounded-full mx-auto flex items-center justify-center">
              <span className="material-icons text-2xl sm:text-3xl">mark_email_read</span>
            </div>
            <h4 className="text-lg sm:text-xl font-semibold text-nordic">
              {t("modals.contactSuccessTitle")}
            </h4>
            <p className="text-xs sm:text-sm text-nordic/70 max-w-sm mx-auto">
              {t("modals.contactSuccessMessage")}
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
            {/* Agent info preview */}
            <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-mosque/5 rounded-xl border border-mosque/10">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={agent.avatarUrl}
                  alt={agent.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-nordic text-sm truncate">{agent.name}</h4>
                <p className="text-xs text-mosque font-medium truncate">
                  {agent.role === "Top Rated Agent"
                    ? t("propertyDetail.agentRating")
                    : agent.role}
                </p>
              </div>
              <div className="ml-auto flex gap-2 flex-shrink-0">
                <a
                  href={`tel:${agent.phone || "+15553498201"}`}
                  className="p-2 rounded-full bg-white text-mosque shadow-xs hover:bg-mosque hover:text-white transition-colors"
                  title={t("propertyDetail.callAgent")}
                >
                  <span className="material-icons text-sm">call</span>
                </a>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-nordic/80 mb-1">
                {t("modals.fullName")} *
              </label>
              <input
                type="text"
                required
                placeholder="John Doe"
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

            <div>
              <label className="block text-xs font-semibold text-nordic/80 mb-1">
                {t("modals.message")} *
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-mosque hover:bg-primary-hover text-white py-3.5 px-4 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              <span className="material-icons text-sm">send</span>
              <span>{t("modals.sendMessage")}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
