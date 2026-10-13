export const locales = ["it", "en"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return value === "it" || value === "en";
}

export function localePath(locale: Locale, path = "/") {
  if (path === "/") {
    return `/${locale}`;
  }

  return `/${locale}${path.startsWith("/") ? path : `/${path}`}`;
}
