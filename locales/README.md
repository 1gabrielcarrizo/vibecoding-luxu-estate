# LuxeEstate — Internationalization (i18n) Guide

This folder contains the translation files for the application.

## Currently Supported Languages
- 🇪🇸 **Spanish (`es`)**: `locales/es.json` (Default)
- 🇺🇸 **English (`en`)**: `locales/en.json`
- 🇫🇷 **French (`fr`)**: `locales/fr.json`

## How to Add a New Language

Adding a new language (e.g., German `de`, Italian `it`, Portuguese `pt`) takes only 3 simple steps:

### Step 1: Create the translation JSON file
Copy `locales/en.json` or `locales/es.json` to a new file named with your ISO language code, for example `locales/it.json`:
```bash
cp locales/en.json locales/it.json
```
Translate all the strings in `locales/it.json`.

### Step 2: Register the new language in `lib/i18n/config.ts`
1. Add the code to the `Locale` union:
```typescript
export type Locale = "es" | "en" | "fr" | "it";
```
2. Add the language metadata in `SUPPORTED_LOCALES`:
```typescript
{
  code: "it",
  name: "Italian",
  nativeName: "Italiano",
  flag: "🇮🇹"
}
```

### Step 3: Register the dictionary in `lib/i18n/locales.ts`
1. Import the json:
```typescript
import it from "@/locales/it.json";
```
2. Add it to the `dictionaries` map:
```typescript
export const dictionaries: Record<Locale, TranslationDictionary> = {
  es,
  en,
  fr,
  it,
};
```

That's it! The language selector in the Navbar, mobile drawer, and all cookie handlers will immediately recognize and display the new language.

