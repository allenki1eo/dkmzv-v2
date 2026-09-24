import '../global.css';
import '../src/theme/nativewind';
import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
} from '@expo-google-fonts/hanken-grotesk';
import { Literata_400Regular, Literata_600SemiBold } from '@expo-google-fonts/literata';
import { useFonts } from 'expo-font';
import { Redirect, Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { DownloadsProvider } from '../src/downloads';
import { PlayerProvider } from '../src/player';
import { SessionProvider, useSession } from '../src/session';
import { ThemeProvider, useAppTheme } from '../src/theme/ThemeProvider';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

function Gate() {
  const { ready, user } = useSession();
  const pathname = usePathname();
  const { mode, theme } = useAppTheme();
  if (!ready) return null;
  const atDoor = pathname === '/ingia';
  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      {!user && !atDoor ? <Redirect href="/ingia" /> : null}
      {user && atDoor ? <Redirect href="/" /> : null}
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

  useEffect(() => {
    if (Platform.OS === 'web') return;
    void import('expo-notifications').then((Notifications) => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    });
  }, []);

  if (!loaded) return null;

  return (
    <ThemeProvider>
      <SessionProvider>
        <PlayerProvider>
          <DownloadsProvider>
            <Gate />
          </DownloadsProvider>
        </PlayerProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
