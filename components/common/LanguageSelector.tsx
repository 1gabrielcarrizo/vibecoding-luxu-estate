"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Locale } from "@/lib/i18n/config";

interface LanguageSelectorProps {
  variant?: "navbar" | "mobile";
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = "navbar",
  className = "",
}) => {
  const { locale, setLocale, locales, currentLocaleInfo, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  if (variant === "mobile") {
    return (
      <div className={`pt-2 border-t border-mosque/10 ${className}`}>
        <p className="px-3 pb-2 text-xs font-semibold text-nordic/50 uppercase tracking-wider">
          {t("languages.selectLanguage")}
        </p>
        <div className="grid grid-cols-3 gap-2 px-1">
          {locales.map((loc) => {
            const isCurrent = loc.code === locale;
            return (
              <button
                key={loc.code}
                type="button"
                onClick={() => handleSelect(loc.code)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-mosque text-white shadow-xs"
                    : "bg-white text-nordic/80 hover:bg-mosque/10 border border-mosque/10"
                }`}
              >
                <span>{loc.flag}</span>
                <span>{loc.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t("languages.selectLanguage")}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-nordic hover:text-mosque hover:bg-mosque/5 transition-all text-sm font-semibold border border-mosque/15 bg-white/70 backdrop-blur-xs cursor-pointer shadow-2xs group focus:outline-none focus:ring-2 focus:ring-mosque/30"
      >
        <span className="text-base leading-none select-none">
          {currentLocaleInfo.flag}
        </span>
        <span className="text-xs uppercase tracking-wider font-bold">
          {currentLocaleInfo.shortLabel}
        </span>
        <span
          className={`material-icons text-sm text-nordic/60 group-hover:text-mosque transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={t("languages.selectLanguage")}
          className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-mosque/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3.5 py-1.5 border-b border-mosque/5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-nordic/40">
              {t("languages.selectLanguage")}
            </span>
          </div>

          <div className="py-1">
            {locales.map((loc) => {
              const isCurrent = loc.code === locale;
              return (
                <button
                  key={loc.code}
                  role="option"
                  aria-selected={isCurrent}
                  onClick={() => handleSelect(loc.code)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors cursor-pointer ${
                    isCurrent
                      ? "bg-mosque/10 text-mosque font-bold"
                      : "text-nordic hover:bg-mosque/5 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none select-none">
                      {loc.flag}
                    </span>
                    <span>{loc.nativeName}</span>
                  </div>
                  {isCurrent && (
                    <span className="material-icons text-sm text-mosque">
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

