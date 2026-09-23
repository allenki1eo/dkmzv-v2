import {
  dark,
  light,
  tokenCssNames,
  type ColorToken,
  type ColorTokens,
  type ThemeName,
} from './colors';
import { motion, radius, shadow } from './shape';
import { fonts } from './typography';

function toCssBlock(theme: ThemeName, tokens: ColorTokens) {
  const lines = (Object.keys(tokens) as ColorToken[]).map((key) => {
    return `  --${tokenCssNames[key]}: ${tokens[key]};`;
  });
  return `${theme === 'dark' ? '.dark' : ':root'} {\n${lines.join('\n')}\n}`;
}

/** CSS custom properties consumed by admin Tailwind and any web surface. */
export function tokensToCss(): string {
  return `/* Generated from @ebenezer/tokens — do not edit by hand in app CSS. */
${toCssBlock('light', light)}
${toCssBlock('dark', dark)}

:root {
  --font-serif: ${fonts.serif}, 'Iowan Old Style', 'Palatino Linotype', Palatino, serif;
  --font-sans: ${fonts.sans}, 'SF Pro Text', 'Segoe UI', sans-serif;
  --radius-sheet: ${radius.sheet}px;
  --radius-card: ${radius.card}px;
  --radius-control: ${radius.control}px;
  --radius-chip: ${radius.chip}px;
  --shadow-float: ${shadow.float};
  --motion-theme: ${motion.themeMs}ms;
}

.dark {
  --shadow-float: ${shadow.floatDark};
}

html {
  color-scheme: light;
}

html.dark {
  color-scheme: dark;
}

html, body {
  background-color: var(--bg);
  color: var(--ink);
  transition:
    background-color var(--motion-theme) ease,
    color var(--motion-theme) ease,
    border-color var(--motion-theme) ease;
}

@media (prefers-reduced-motion: reduce) {
  html, body, * {
    transition: none !important;
    animation: none !important;
  }
}
`;
}
