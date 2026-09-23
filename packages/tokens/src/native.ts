import { dark, light, type ColorToken, type ThemeName, type ThemePreference } from './colors';

export type { ThemePreference };
import { radius, shadow, spacing, tapTarget } from './shape';
import { fonts, lineHeights, mobileScale } from './typography';

export function nativeTheme(mode: ThemeName) {
  const colors = mode === 'dark' ? dark : light;
  return {
    colors,
    fonts,
    type: mobileScale,
    lineHeights,
    radius,
    spacing,
    tapTarget,
    shadow: mode === 'dark' ? shadow.floatDark : shadow.float,
  };
}

export type NativeTheme = ReturnType<typeof nativeTheme>;
export type NativeColor = ColorToken;
