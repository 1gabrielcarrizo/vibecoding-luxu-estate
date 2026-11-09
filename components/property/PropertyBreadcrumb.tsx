"use client";

import React from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { PropertyCategory } from "@/types/property";
import { getLocalizedTitle } from "@/lib/i18n/propertyTranslations";

interface PropertyBreadcrumbProps {
  category: PropertyCategory;
  title: string;
  slug?: string;
}

export const PropertyBreadcrumb: React.FC<PropertyBreadcrumbProps> = ({
  category,
  title,
  slug,
}) => {
  const { t, locale } = useTranslation();
  const categoryLabel = t(`categories.${category}`) || category;
  const displayTitle = slug ? getLocalizedTitle(slug, locale, title) : title;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 sm:mb-6 flex items-center gap-1.5 sm:gap-2 text-xs text-nordic/60 overflow-x-auto scrollbar-hide py-1"
    >
      <Link
        href="/"
        className="hover:text-mosque transition-colors flex items-center gap-1 flex-shrink-0"
      >
        <span className="material-icons text-sm">home</span>
        <span>{t("nav.home")}</span>
      </Link>
      <span className="text-nordic/30 flex-shrink-0">/</span>
      <Link
        href={`/?category=${category}`}
        className="hover:text-mosque transition-colors flex-shrink-0"
      >
        {categoryLabel}
      </Link>
      <span className="text-nordic/30 flex-shrink-0">/</span>
      <span className="text-nordic font-medium truncate max-w-[150px] xs:max-w-xs sm:max-w-md flex-shrink">
        {displayTitle}
      </span>
    </nav>
  );
};

