"use client";

import React, { useEffect } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export type LegalTopic = "privacy" | "terms" | "help";

interface LegalInfoModalProps {
  topic: LegalTopic | null;
  onClose: () => void;
}

export const LegalInfoModal: React.FC<LegalInfoModalProps> = ({
  topic,
  onClose,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!topic) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [topic, onClose]);

  if (!topic) return null;

  const iconMap: Record<LegalTopic, string> = {
    privacy: "verified_user",
    terms: "gavel",
    help: "support_agent",
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-mosque/10 relative z-10 my-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5 min-w-0 pr-3">
            <div className="w-9 h-9 rounded-full bg-hint-green text-mosque flex items-center justify-center flex-shrink-0">
              <span className="material-icons text-lg">{iconMap[topic]}</span>
            </div>
            <h3
              id="legal-modal-title"
              className="text-lg sm:text-xl font-bold text-nordic truncate"
            >
              {t(`legal.${topic}.title`)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("modals.close")}
            className="w-8 h-8 rounded-full hover:bg-gray-100 text-nordic/40 hover:text-nordic flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
          >
            <span className="material-icons text-lg leading-none select-none">
              close
            </span>
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm text-nordic/75 leading-relaxed">
          <p>{t(`legal.${topic}.p1`)}</p>
          <p>{t(`legal.${topic}.p2`)}</p>
          <p>{t(`legal.${topic}.p3`)}</p>
        </div>

        {topic === "help" && (
          <div className="mt-5 p-4 rounded-xl bg-clear-day border border-mosque/10 space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-nordic/60">
              {t("legal.help.contactTitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="mailto:concierge@luxeestate.com"
                className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-nordic/10 hover:border-mosque text-nordic hover:text-mosque text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-icons text-sm">mail</span>
                <span>concierge@luxeestate.com</span>
              </a>
              <a
                href="https://wa.me/15553498201"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-icons text-sm">chat</span>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-mosque hover:bg-nordic text-white text-sm font-medium transition-colors cursor-pointer"
          >
            {t("modals.close")}
          </button>
        </div>
      </div>
    </div>
  );
};
