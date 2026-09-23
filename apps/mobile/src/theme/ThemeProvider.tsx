import { nativeTheme, type ThemePreference } from '@ebenezer/tokens/native';
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Appearance, useColorScheme } from 'react-native';

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
  theme: ReturnType<typeof nativeTheme>;
  mode: 'light' | 'dark';
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');
  const mode = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;
  const theme = useMemo(() => nativeTheme(mode), [mode]);

  const value = useMemo(
    () => ({ preference, setPreference, theme, mode }),
    [preference, theme, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within ThemeProvider');
  return ctx;
}

export function hydrateSystemTheme() {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}
