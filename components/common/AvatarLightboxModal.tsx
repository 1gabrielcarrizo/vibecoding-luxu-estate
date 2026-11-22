"use client";

import React, { useEffect } from "react";
import { getHighResAvatarUrl } from "@/lib/utils/avatar";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface AvatarLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  name: string;
  subtitle?: string | null;
}

export const AvatarLightboxModal: React.FC<AvatarLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  name,
  subtitle,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  const highResUrl = getHighResAvatarUrl(imageUrl, 800) || imageUrl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={name}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-[#152e2a] border border-nordic/10 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-nordic/10 dark:border-white/10">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-nordic dark:text-white truncate">
              {name}
            </h3>
            {subtitle && (
              <p className="text-xs text-nordic/60 dark:text-gray-400 truncate">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("modals.close")}
            className="w-8 h-8 rounded-full flex items-center justify-center text-nordic/60 dark:text-gray-300 hover:bg-nordic/10 dark:hover:bg-white/10 hover:text-nordic dark:hover:text-white transition-colors cursor-pointer flex-shrink-0"
          >
            <span className="material-icons text-xl">close</span>
          </button>
        </div>

        {/* Enlarged High-Res Photo */}
        <div className="p-6 flex items-center justify-center bg-clear-day/70 dark:bg-black/20">
          <img
            src={highResUrl}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-72 h-72 sm:w-80 sm:h-80 rounded-2xl object-cover shadow-lg border-4 border-white dark:border-white/10 bg-white"
          />
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-nordic/10 dark:border-white/10 flex items-center justify-between gap-3 bg-white dark:bg-[#152e2a]">
          <a
            href={highResUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-mosque hover:text-nordic dark:text-accent dark:hover:text-white transition-colors"
          >
            <span className="material-icons text-base">open_in_new</span>
            <span>{t("profile.openFullImage")}</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-nordic/10 hover:bg-nordic/15 dark:bg-white/10 dark:hover:bg-white/20 text-xs font-semibold text-nordic dark:text-white transition-colors cursor-pointer"
          >
            {t("modals.close")}
          </button>
        </div>
      </div>
    </div>
  );
};
