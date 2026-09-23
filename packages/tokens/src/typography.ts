export const fonts = {
  serif: 'Literata',
  sans: 'Hanken Grotesk',
} as const;

/** Mobile type scale. Serif body uses 1.6; sans uses 1.45. */
export const mobileScale = {
  caption: 13,
  label: 15,
  body: 17,
  title: 20,
  display: 24,
  verse: 32,
  hero: 40,
} as const;

export const adminScale = {
  caption: 12,
  label: 13,
  body: 15,
  title: 18,
  display: 22,
  verse: 28,
  hero: 34,
} as const;

export const lineHeights = {
  serif: 1.6,
  sans: 1.45,
} as const;
