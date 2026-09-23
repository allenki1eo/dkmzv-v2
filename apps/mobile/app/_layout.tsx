import '../global.css';
import '../src/theme/nativewind';
import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
} from '@expo-google-fonts/hanken-grotesk';
import { Literata_400Regular, Literata_600SemiBold } from '@expo-google-fonts/literata';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useAppTheme } from '../src/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function RootStack() {
  const { mode, theme } = useAppTheme();
  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.bg },
          animation: 'fade',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    Literata_400Regular,
    Literata_600SemiBold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => undefined);
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <RootStack />
    </ThemeProvider>
  );
}
