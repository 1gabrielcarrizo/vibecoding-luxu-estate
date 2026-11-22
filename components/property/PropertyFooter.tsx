"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { LegalInfoModal, LegalTopic } from "@/components/common/LegalInfoModal";

export const PropertyFooter: React.FC = () => {
  const { t } = useTranslation();
  const [legalTopic, setLegalTopic] = useState<LegalTopic | null>(null);

  return (
    <>
      <footer className="bg-white border-t border-slate-200 mt-8 sm:mt-12 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
          <div className="text-xs sm:text-sm text-nordic/50">
            {t("footer.rights")}
          </div>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-nordic/60"
          >
            <Link
              href="/favorites"
              className="hover:text-mosque transition-colors"
            >
              {t("nav.savedHomes")}
            </Link>
            <Link
              href="/profile"
              className="hover:text-mosque transition-colors"
            >
              {t("nav.myProfile")}
            </Link>
            <button
              type="button"
              onClick={() => setLegalTopic("privacy")}
              className="hover:text-mosque transition-colors cursor-pointer"
            >
              {t("footer.privacy")}
            </button>
            <button
              type="button"
              onClick={() => setLegalTopic("terms")}
              className="hover:text-mosque transition-colors cursor-pointer"
            >
              {t("footer.terms")}
            </button>
            <button
              type="button"
              onClick={() => setLegalTopic("help")}
              className="hover:text-mosque transition-colors cursor-pointer"
            >
              {t("auth.helpCenter")}
            </button>
          </nav>
        </div>
      </footer>

      <LegalInfoModal topic={legalTopic} onClose={() => setLegalTopic(null)} />
    </>
  );
};
