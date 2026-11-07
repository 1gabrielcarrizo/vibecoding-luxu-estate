"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { PropertyFooter } from "@/components/property/PropertyFooter";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function PropertyNotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-clear-day text-nordic flex flex-col font-display">
      <Navbar isDetailPage={true} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-mosque/10 text-mosque rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl">villa</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-light text-nordic mb-3">
          {t("notFound.title")}
        </h1>
        <p className="text-nordic/60 max-w-md mb-8 text-sm">
          {t("notFound.description")}
        </p>

        <Link
          href="/"
          className="bg-mosque hover:bg-primary-hover text-white px-6 py-3.5 rounded-lg font-medium transition-all shadow-md flex items-center gap-2"
        >
          <span className="material-icons text-sm">arrow_back</span>
          <span>{t("notFound.explore")}</span>
        </Link>
      </main>

      <PropertyFooter />
    </div>
  );
}
