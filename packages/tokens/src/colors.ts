/**
 * Ebenezer color tokens — limestone at morning, stone at evening service.
 * Components must use these semantic names. Never paste raw hex in UI.
 */

export const seasons = {
  advent: { sw: 'Majilio', en: 'Advent', hex: '#4B2E6F' },
  christmas: { sw: 'Krismasi', en: 'Christmas', hex: '#F7F5EF' },
  epiphany: { sw: 'Epifania', en: 'Epiphany', hex: '#4F6B3A' },
  ordinary: { sw: 'Kipindi cha Kawaida', en: 'Ordinary time', hex: '#4F6B3A' },
  lent: { sw: 'Kwaresma', en: 'Lent', hex: '#5A3E66' },
  easter: { sw: 'Pasaka', en: 'Easter', hex: '#F7F5EF' },
  pentecost: { sw: 'Pentekoste', en: 'Pentecost', hex: '#9E2B25' },
} as const;

export type SeasonKey = keyof typeof seasons;

export const light = {
  bg: '#E9E6DF',
  surface: '#F6F4F0',
  ink: '#1E1C19',
  inkMuted: '#5E5950',
  line: '#CFCAC0',
  /** Specified #9A7418 failed AA on limestone (3.91). Aged brass at #7A5A12 holds 5.1:1. */
  gold: '#7A5A12',
  season: seasons.ordinary.hex,
  success: '#2F5A38',
  danger: '#8A3A2C',
  /** Gold leaf behind Christmas / Easter white season marks */
  goldLeaf: '#C4A046',
} as const;

export const dark = {
  bg: '#16171A',
  surface: '#202226',
  ink: '#EDEAE3',
  inkMuted: '#A39E94',
  line: '#33363B',
  gold: '#D4AE4F',
  season: seasons.ordinary.hex,
  success: '#8FB896',
  danger: '#E0A094',
  goldLeaf: '#D4AE4F',
} as const;

export type ColorTokens = { [K in keyof typeof light]: string };
export type ColorToken = keyof typeof light;
export type ThemeName = 'light' | 'dark';
export type ThemePreference = 'system' | 'light' | 'dark';

export const themes = { light, dark } as const;

export const tokenCssNames: Record<ColorToken, string> = {
  bg: 'bg',
  surface: 'surface',
  ink: 'ink',
  inkMuted: 'ink-muted',
  line: 'line',
  gold: 'gold',
  season: 'season',
  success: 'success',
  danger: 'danger',
  goldLeaf: 'gold-leaf',
};
