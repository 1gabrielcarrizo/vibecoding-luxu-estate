"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { getLocalizedDescription } from "@/lib/i18n/propertyTranslations";

interface PropertyAboutProps {
  slug?: string;
  description?: string[];
  title: string;
}

export const PropertyAbout: React.FC<PropertyAboutProps> = ({
  slug,
  description,
  title,
}) => {
  const { t, dict, locale } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Retrieve fully localized description for this property
  const paragraphs = React.useMemo(() => {
    if (slug) {
      const localized = getLocalizedDescription(slug, locale);
      if (localized && localized.length > 0) {
        return localized;
      }
    }

    if (description && description.length > 0) {
      // If the property has custom description not in translation map,
      // and language is not English, provide the elegant localized default description
      if (locale !== "en") {
        return dict.propertyDetail.defaultDescription || description;
      }
      return description;
    }

    return dict.propertyDetail.defaultDescription || [];
  }, [slug, locale, description, dict]);

  const visibleParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 2);

  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-mosque/5">
      <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-nordic">
        {t("propertyDetail.aboutTitle")}
      </h2>

      <div className="prose prose-slate max-w-none text-nordic/70 leading-relaxed space-y-3 sm:space-y-4 text-sm sm:text-base">
        {visibleParagraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {paragraphs.length > 2 && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-mosque font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all cursor-pointer focus:outline-none"
        >
          <span>
            {isExpanded
              ? t("propertyDetail.showLess")
              : t("propertyDetail.readMore")}
          </span>
          <span
            className={`material-icons text-sm transition-transform duration-300 ${
              isExpanded ? "rotate-90" : ""
            }`}
          >
            arrow_forward
          </span>
        </button>
      )}
    </div>
  );
};
