import { useCallback, useEffect } from "react";
import en from "./locales/en";
import vi from "./locales/vi";
import { useLocaleStore, type Locale } from "@/src/stores/locale.store";

const dictionaries: Record<Locale, typeof vi> = { en, vi };

const getValue = (obj: Record<string, any>, path: string): string | undefined => {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const interpolate = (text: string, params?: Record<string, string | number>) => {
  if (!params) return text;
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, "g"), String(value)),
    text
  );
};

export const t = (key: string, params?: Record<string, string | number>, locale: Locale = "en") => {
  const dict = dictionaries[locale];
  const raw = getValue(dict as Record<string, any>, key) ?? key;
  return interpolate(raw, params);
};

export function useI18n() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const hydrate = useLocaleStore((s) => s.hydrate);
  const isHydrated = useLocaleStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [hydrate, isHydrated]);

  const translate = useCallback(
    (key: string, params?: Record<string, string | number>) => t(key, params, locale),
    [locale]
  );

  return { t: translate, locale, setLocale, isHydrated };
}
