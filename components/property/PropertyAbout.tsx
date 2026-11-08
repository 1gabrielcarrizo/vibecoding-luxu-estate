"use client";

import React, { useState } from "react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

interface PropertyAboutProps {
  description?: string[];
  title: string;
}

export const PropertyAbout: React.FC<PropertyAboutProps> = ({
  description,
  title,
}) => {
  const { t, dict, locale } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  // If description matches default mock or is not provided, use translated description
  const isDefaultOrEmpty =
    !description ||
    description.length === 0 ||
    description[0]?.startsWith("Experience modern luxury") ||
    description[0]?.startsWith("Set amidst the rolling foothills");

  const paragraphs =
    isDefaultOrEmpty && dict.propertyDetail.defaultDescription
      ? dict.propertyDetail.defaultDescription
      : description || [];

  const visibleParagraphs = isExpanded ? paragraphs : paragraphs.slice(0, 2);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-mosque/5">
      <h2 className="text-lg font-semibold mb-4 text-nordic">
        {t("propertyDetail.aboutTitle")}
      </h2>

      <div className="prose prose-slate max-w-none text-nordic/70 leading-relaxed space-y-4">
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
