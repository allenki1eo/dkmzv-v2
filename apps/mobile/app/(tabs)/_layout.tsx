import { createTranslator } from '@ebenezer/shared';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { usePlayer } from '../../src/player';
import { useSession } from '../../src/session';
import { useAppTheme } from '../../src/theme/ThemeProvider';

function MiniPlayer() {
  const { sermon, playing, toggle } = usePlayer();
  const { theme } = useAppTheme();
  const { user } = useSession();
  const t = createTranslator(user?.locale ?? 'sw');
  if (!sermon) return null;
  const title = user?.locale === 'en' ? sermon.titleEn : sermon.titleSw;
  return (
    <Pressable
      onPress={() => void toggle()}
      style={{
        minHeight: 56,
        marginHorizontal: 12,
        marginBottom: 8,
        borderRadius: theme.radius.card,
        backgroundColor: theme.colors.ink,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ color: theme.colors.bg, fontSize: 13 }}>{t('sermons.mini')}</Text>
        <Text style={{ color: theme.colors.bg, fontFamily: 'Literata_600SemiBold', fontSize: 16 }} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <Text style={{ color: theme.colors.goldLeaf, fontSize: 15 }}>
        {playing ? t('sermons.pause') : t('sermons.play')}
      </Text>
    </Pressable>
  );
}

export default function TabsLayout() {
  const { theme } = useAppTheme();
  const { user } = useSession();
  const t = createTranslator(user?.locale ?? 'sw');

  return (
    <Tabs
      tabBar={(props) => (
        <View style={{ backgroundColor: theme.colors.bg }}>
          <MiniPlayer />
          <BottomTabBar {...props} />
        </View>
      )}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.season,
        tabBarInactiveTintColor: theme.colors.inkMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.line,
          height: 64,
        },
        tabBarLabelStyle: {
          fontFamily: 'HankenGrotesk_500Medium',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.home') }} />
      <Tabs.Screen name="mahubiri" options={{ title: t('tabs.sermons') }} />
      <Tabs.Screen name="jumuiya" options={{ title: t('tabs.jumuiya') }} />
      <Tabs.Screen name="sadaka" options={{ title: t('tabs.giving') }} />
      <Tabs.Screen name="mimi" options={{ title: t('tabs.me') }} />
    </Tabs>
  );
}
