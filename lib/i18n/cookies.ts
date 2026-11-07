import { Locale, LOCALE_COOKIE_NAME, isSupportedLocale } from "./config";

/**
 * Reads the locale stored in client-side document.cookie.
 */
export function getClientLocaleCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE_NAME}=([^;]+)`)
  );
  if (match && match[1]) {
    const val = decodeURIComponent(match[1]);
    if (isSupportedLocale(val)) {
      return val;
    }
  }
  return null;
}

/**
 * Saves the user's selected locale to a persistent cookie (1 year duration).
 */
export function setClientLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365; // 365 days in seconds
  document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(
    locale
  )}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

