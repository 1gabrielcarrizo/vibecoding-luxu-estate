export type Locale = "es" | "en" | "fr";

export interface LocaleInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LOCALES: LocaleInfo[] = [
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
  },
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
  },
];

export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_COOKIE_NAME = "luxe_locale";

export function isSupportedLocale(locale?: string | null): locale is Locale {
  if (!locale) return false;
  return SUPPORTED_LOCALES.some((l) => l.code === locale);
}

export function getLocaleInfo(locale: Locale): LocaleInfo {
  return (
    SUPPORTED_LOCALES.find((l) => l.code === locale) || SUPPORTED_LOCALES[0]
  );
}
