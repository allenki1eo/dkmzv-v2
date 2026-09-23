/** Radius has a job, not a fashion: sheets, cards, controls, chips. */
export const radius = {
  sheet: 20,
  card: 14,
  control: 10,
  chip: 999,
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

/** One soft shadow, only for things that actually float. */
export const shadow = {
  float: '0 10px 28px rgba(30, 28, 25, 0.12)',
  floatDark: '0 10px 28px rgba(0, 0, 0, 0.36)',
} as const;

export const motion = {
  themeMs: 200,
  sheetMs: 280,
  settleMs: 420,
} as const;

export const tapTarget = {
  min: 48,
} as const;
