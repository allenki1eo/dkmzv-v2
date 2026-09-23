import { dark, light, seasons, type ColorToken } from './colors';

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

export function passesAa(foreground: string, background: string, large = false): boolean {
  return contrastRatio(foreground, background) >= (large ? 3 : 4.5);
}

/** Pairs that must stay AA. Used by the design showcase and unit tests. */
export const requiredPairs: Array<{
  name: string;
  fg: ColorToken;
  bg: ColorToken;
  large?: boolean;
}> = [
  { name: 'ink on bg', fg: 'ink', bg: 'bg' },
  { name: 'ink on surface', fg: 'ink', bg: 'surface' },
  { name: 'ink-muted on bg', fg: 'inkMuted', bg: 'bg' },
  { name: 'ink-muted on surface', fg: 'inkMuted', bg: 'surface' },
  { name: 'gold on surface', fg: 'gold', bg: 'surface' },
  { name: 'gold on bg', fg: 'gold', bg: 'bg' },
  { name: 'success on surface', fg: 'success', bg: 'surface' },
  { name: 'danger on surface', fg: 'danger', bg: 'surface' },
];

export function auditTheme(mode: 'light' | 'dark') {
  const tokens = mode === 'light' ? light : dark;
  return requiredPairs.map((pair) => {
    const ratio = contrastRatio(tokens[pair.fg], tokens[pair.bg]);
    return {
      ...pair,
      mode,
      ratio: Number(ratio.toFixed(2)),
      pass: passesAa(tokens[pair.fg], tokens[pair.bg], pair.large),
    };
  });
}

export function seasonOnSurfaceInk(seasonHex: string): 'light' | 'dark' {
  return contrastRatio('#F6F4F0', seasonHex) >= 3 ? 'light' : 'dark';
}

export { seasons };
