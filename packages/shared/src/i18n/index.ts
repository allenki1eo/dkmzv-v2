import { en } from './en';
import { sw, type Dictionary } from './sw';

export const locales = ['sw', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'sw';

const dictionaries: Record<Locale, Dictionary> = { sw, en };

export type { Dictionary };

type LeafPaths<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? LeafPaths<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

export type MessageKey = LeafPaths<Dictionary>;

function lookup(dict: Dictionary, key: MessageKey): string {
  const parts = key.split('.');
  let current: unknown = dict;
  for (const part of parts) {
    if (typeof current !== 'object' || current === null || !(part in current)) {
      return key;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : key;
}

export function createTranslator(locale: Locale = defaultLocale) {
  const dict = dictionaries[locale] ?? sw;
  return (key: MessageKey, vars?: Record<string, string | number>) => {
    let value = lookup(dict, key);
    if (vars) {
      for (const [name, replacement] of Object.entries(vars)) {
        value = value.replaceAll(`{${name}}`, String(replacement));
      }
    }
    return value;
  };
}

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] ?? sw;
}

export { sw, en };
