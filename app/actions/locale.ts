"use server";

import { cookies } from "next/headers";
import { Locale, LOCALE_COOKIE_NAME, isSupportedLocale } from "@/lib/i18n/config";

/**
 * Server Action to persist the locale cookie securely on the server.
 */
export async function setLocaleCookieAction(locale: Locale) {
  if (!isSupportedLocale(locale)) return;
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

