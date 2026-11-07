"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Locale,
  LocaleInfo,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  getLocaleInfo,
  isSupportedLocale,
} from "./config";
import {
  TranslationDictionary,
  dictionaries,
  getDictionary,
} from "./locales";
import { getClientLocaleCookie, setClientLocaleCookie } from "./cookies";
import { setLocaleCookieAction } from "@/app/actions/locale";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: TranslationDictionary;
  locales: LocaleInfo[];
  currentLocaleInfo: LocaleInfo;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  initialLocale = DEFAULT_LOCALE,
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Sync with cookie if available on client mount
  useEffect(() => {
    const cookieLocale = getClientLocaleCookie();
    if (cookieLocale && cookieLocale !== locale) {
      setLocaleState(cookieLocale);
    }
  }, []);

  // Keep <html lang="..."> in sync with current locale
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    if (!isSupportedLocale(newLocale)) return;
    setLocaleState(newLocale);
    setClientLocaleCookie(newLocale);
    // Background server cookie sync
    setLocaleCookieAction(newLocale).catch(() => {
      // Ignore background action errors
    });
  }, []);

  const dict = useMemo(() => getDictionary(locale), [locale]);
  const currentLocaleInfo = useMemo(() => getLocaleInfo(locale), [locale]);

  /**
   * Helper function to retrieve nested translation string with optional interpolation.
   * Example: t('nav.buy') or t('filters.showHomesCount', { count: 12 })
   */
  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      const keys = path.split(".");
      // 1. Look up in current dictionary
      let current: unknown = dict;
      for (const key of keys) {
        if (current && typeof current === "object" && key in current) {
          current = (current as Record<string, unknown>)[key];
        } else {
          current = undefined;
          break;
        }
      }

      // 2. If not found in current dictionary, look up in default (es) dictionary
      if (current === undefined && locale !== DEFAULT_LOCALE) {
        let fallback: unknown = dictionaries[DEFAULT_LOCALE];
        for (const key of keys) {
          if (fallback && typeof fallback === "object" && key in fallback) {
            fallback = (fallback as Record<string, unknown>)[key];
          } else {
            fallback = undefined;
            break;
          }
        }
        current = fallback;
      }

      if (typeof current !== "string") {
        return path;
      }

      // 3. Interpolate parameters if any (e.g. {count})
      if (params) {
        return Object.entries(params).reduce(
          (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
          current
        );
      }

      return current;
    },
    [dict, locale]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      dict,
      locales: SUPPORTED_LOCALES,
      currentLocaleInfo,
      t,
    }),
    [locale, setLocale, dict, currentLocaleInfo, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export const useTranslation = useLanguage;

