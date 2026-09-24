import { createTranslator } from '@ebenezer/shared';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { EnvelopeSimple, House, User, UsersThree, Waveform } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlayer } from '../../src/player';
import { Mark } from '../../src/ui';
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
        <Text style={{ color: theme.colors.bg, fontSize: 13 }}>{t('sermons.streaming')}</Text>
        <Text style={{ color: theme.colors.bg, fontFamily: 'Literata_600SemiBold', fontSize: 16 }} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <Text style={{ color: theme.colors.goldLeaf, fontSize: 15 }}>{playing ? t('sermons.pause') : t('sermons.play')}</Text>
    </Pressable>
  );
}

export default function TabsLayout() {
  const { theme } = useAppTheme();
  const { user } = useSession();
  const t = createTranslator(user?.locale ?? 'sw');
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      safeAreaInsets={{ top: 0, right: 0, bottom: 0, left: 0 }}
      tabBar={(props) => (
        <View style={{ backgroundColor: theme.colors.bg, paddingBottom: insets.bottom }}>
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
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <Mark icon={House} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="mahubiri"
        options={{
          title: t('tabs.sermons'),
          tabBarIcon: ({ color, size }) => <Mark icon={Waveform} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="jumuiya"
        options={{
          title: t('tabs.jumuiya'),
          tabBarIcon: ({ color, size }) => <Mark icon={UsersThree} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="sadaka"
        options={{
          title: t('tabs.giving'),
          tabBarIcon: ({ color, size }) => <Mark icon={EnvelopeSimple} color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="mimi"
        options={{
          title: t('tabs.me'),
          tabBarIcon: ({ color, size }) => <Mark icon={User} color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
