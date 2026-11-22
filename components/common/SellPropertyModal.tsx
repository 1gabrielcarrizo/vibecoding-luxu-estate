"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { useAuth } from "@/lib/supabase/AuthContext";
import { useNotifications } from "@/lib/notifications/NotificationsContext";

interface SellPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellPropertyModal: React.FC<SellPropertyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { displayName, email, isAdmin } = useAuth();
  const { addNotification } = useNotifications();

  const [propertyType, setPropertyType] = useState("House");
  const [operation, setOperation] = useState<"sale" | "rent">("sale");
  const [location, setLocation] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [ownerNameInput, setOwnerNameInput] = useState<string | null>(null);
  const [ownerEmailInput, setOwnerEmailInput] = useState<string | null>(null);
  const [ownerPhone, setOwnerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ownerName = ownerNameInput ?? displayName ?? "";
  const ownerEmail = ownerEmailInput ?? email ?? "";

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSubmitted(false);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification({
      type: "sell_request",
      title: t("notifications.sellRequestTitle"),
      message: t("notifications.sellRequestMessage", {
        type: t(`categories.${propertyType}`) || propertyType,
        location: location.trim(),
      }),
      href: "/profile",
    });
    setIsSubmitted(true);
  };

  const whatsappMessage = encodeURIComponent(
    t("sellModal.whatsappMessage", {
      type: t(`categories.${propertyType}`) || propertyType,
      operation:
        operation === "sale"
          ? t("sellModal.operationSale")
          : t("sellModal.operationRent"),
      location: location || "-",
      price: estimatedPrice || "-",
      name: ownerName || "Cliente",
      email: ownerEmail || "",
    })
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sell-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        className="fixed inset-0"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-mosque/10 relative z-10 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="min-w-0 pr-3">
            <h3
              id="sell-modal-title"
              className="text-lg sm:text-xl font-bold text-nordic"
            >
              {t("sellModal.title")}
            </h3>
            <p className="text-xs text-nordic/60 mt-0.5">
              {t("sellModal.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t("modals.close")}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-gray-100 text-nordic/40 hover:text-nordic flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          >
            <span className="material-icons text-lg sm:text-xl leading-none select-none">
              close
            </span>
          </button>
        </div>

        {/* Admin direct publish shortcut */}
        {isAdmin && !isSubmitted && (
          <div className="mt-4 p-3.5 rounded-xl bg-hint-green/50 border border-mosque/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-mosque text-xl flex-shrink-0">
                admin_panel_settings
              </span>
              <p className="text-xs font-medium text-nordic leading-snug">
                {t("sellModal.adminShortcutText")}
              </p>
            </div>
            <Link
              href="/admin/properties/new"
              onClick={handleClose}
              className="px-3.5 py-2 rounded-lg bg-mosque hover:bg-nordic text-white text-xs font-semibold transition-colors text-center whitespace-nowrap flex-shrink-0"
            >
              {t("sellModal.adminShortcutCta")}
            </Link>
          </div>
        )}

        {isSubmitted ? (
          <div className="py-6 sm:py-8 text-center space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-hint-green text-mosque rounded-full mx-auto flex items-center justify-center">
              <span className="material-icons text-2xl sm:text-3xl">
                check_circle
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-semibold text-nordic">
              {t("sellModal.successTitle")}
            </h4>
            <p className="text-xs sm:text-sm text-nordic/70 max-w-sm mx-auto leading-relaxed">
              {t("sellModal.successMessage")}
            </p>
            <div className="pt-3 flex flex-col gap-2">
              <a
                href={`https://wa.me/15553498201?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <span className="material-icons text-sm">chat</span>
                <span>{t("propertyDetail.whatsappChat")}</span>
              </a>
              <button
                type="button"
                onClick={handleClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-nordic py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                {t("modals.close")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            {/* Operation Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-clear-day rounded-lg">
              <button
                type="button"
                onClick={() => setOperation("sale")}
                className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer ${
                  operation === "sale"
                    ? "bg-white text-mosque shadow-xs"
                    : "text-nordic/60 hover:text-nordic"
                }`}
              >
                {t("sellModal.operationSale")}
              </button>
              <button
                type="button"
                onClick={() => setOperation("rent")}
                className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-md transition-all cursor-pointer ${
                  operation === "rent"
                    ? "bg-white text-mosque shadow-xs"
                    : "text-nordic/60 hover:text-nordic"
                }`}
              >
                {t("sellModal.operationRent")}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-nordic/80 mb-1">
                  {t("filters.propertyType")} *
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic bg-white focus:outline-none focus:border-mosque cursor-pointer"
                >
                  <option value="House">{t("categories.House")}</option>
                  <option value="Apartment">{t("categories.Apartment")}</option>
                  <option value="Villa">{t("categories.Villa")}</option>
                  <option value="Penthouse">{t("categories.Penthouse")}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-nordic/80 mb-1">
                  {t("sellModal.estimatedPrice")}
                </label>
                <input
                  type="text"
                  placeholder="$1,500,000"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-nordic/80 mb-1">
                {t("sellModal.locationLabel")} *
              </label>
              <input
                type="text"
                required
                placeholder={t("sellModal.locationPlaceholder")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-nordic/80 mb-1">
                {t("modals.fullName")} *
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerNameInput(e.target.value)}
                placeholder="Alex Morgan"
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
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-nordic/80 mb-1">
                  {t("modals.phone")}
                </label>
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-nordic/80 mb-1">
                {t("sellModal.notesLabel")}
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("sellModal.notesPlaceholder")}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-nordic focus:outline-none focus:border-mosque resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-mosque hover:bg-primary-hover text-white py-3.5 px-4 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              <span className="material-icons text-sm">real_estate_agent</span>
              <span>{t("sellModal.submitCta")}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
