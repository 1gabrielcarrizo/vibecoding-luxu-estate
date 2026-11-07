import es from "@/locales/es.json";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import { Locale, DEFAULT_LOCALE } from "./config";

export type TranslationDictionary = typeof es;

export const dictionaries: Record<Locale, TranslationDictionary> = {
  es,
  en,
  fr,
};

export function getDictionary(locale: Locale): TranslationDictionary {
  return dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
}

