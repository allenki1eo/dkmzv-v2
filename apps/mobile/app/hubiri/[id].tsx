import { bundledParish, createTranslator } from '@ebenezer/shared';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useDownloads } from '../../src/downloads';
import { usePlayer } from '../../src/player';
import { useSession } from '../../src/session';
import { useAppTheme } from '../../src/theme/ThemeProvider';

export default function Hubiri() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sermon = bundledParish.sermons.find((item) => item.id === id) ?? bundledParish.sermons[0];
  const { theme } = useAppTheme();
  const { user } = useSession();
  const { play, sermon: current, playing, toggle, cycleSpeed, speed } = usePlayer();
  const downloads = useDownloads();
  const t = createTranslator(user?.locale ?? 'sw');
  const en = user?.locale === 'en';
  if (!sermon) return null;
  const active = current?.id === sermon.id;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View
          style={{
            height: 180,
            borderRadius: theme.radius.sheet,
            backgroundColor: theme.colors.ink,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Pressable
            onPress={() => (active ? void toggle() : void play(sermon))}
            style={{ minHeight: 48, minWidth: 160, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: theme.colors.bg, fontSize: 17 }}>
              {active && playing ? t('sermons.pause') : t('sermons.play')}
            </Text>
          </Pressable>
        </View>
        <Text style={{ marginTop: 20, fontFamily: 'Literata_600SemiBold', fontSize: 32, lineHeight: 40, color: theme.colors.ink }}>
          {en ? sermon.titleEn : sermon.titleSw}
        </Text>
        <Text style={{ marginTop: 8, fontSize: 17, color: theme.colors.ink }}>{sermon.preacher}</Text>
        <Text style={{ color: theme.colors.inkMuted }}>{sermon.preachedOn}</Text>
        <Text style={{ marginTop: 8, color: theme.colors.inkMuted }}>{sermon.readings}</Text>
        <Text style={{ marginTop: 16, fontSize: 17, lineHeight: 28, color: theme.colors.ink }}>
          {en ? sermon.notesEn : sermon.notesSw}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
          <Pressable
            onPress={() => downloads.toggle(sermon.id)}
            style={{
              minHeight: 48,
              paddingHorizontal: 16,
              borderRadius: theme.radius.control,
              backgroundColor: theme.colors.gold,
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: theme.colors.surface }}>
              {downloads.has(sermon.id) ? t('sermons.downloaded') : t('sermons.download')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => void cycleSpeed()}
            style={{
              minHeight: 48,
              paddingHorizontal: 16,
              borderRadius: theme.radius.control,
              borderWidth: 1,
              borderColor: theme.colors.line,
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: theme.colors.ink }}>
              {t('sermons.speed')} {speed}x
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
