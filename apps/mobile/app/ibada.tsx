import { bundledParish, createTranslator } from '@ebenezer/shared';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSession } from '../src/session';
import { useAppTheme } from '../src/theme/ThemeProvider';

export default function Ibada() {
  const { theme } = useAppTheme();
  const { user, update } = useSession();
  const t = createTranslator(user?.locale ?? 'sw');
  const live = bundledParish.live;
  const [audioOnly, setAudioOnly] = useState(user?.lowData ?? false);
  if (!live) return null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ height: 280, backgroundColor: theme.colors.ink, justifyContent: 'flex-end', padding: 20 }}>
        <Text style={{ color: bundledParish.season.hex, fontFamily: 'HankenGrotesk_500Medium' }}>{t('home.liveNow')}</Text>
        <Text style={{ color: theme.colors.bg, fontFamily: 'Literata_600SemiBold', fontSize: 28, marginTop: 8 }}>
          {user?.locale === 'en' ? live.titleEn : live.titleSw}
        </Text>
        <Text style={{ color: theme.colors.bg, marginTop: 6 }}>
          {live.viewers} {t('home.viewers')}
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Pressable
          onPress={() => {
            const next = !audioOnly;
            setAudioOnly(next);
            void update({ lowData: next });
          }}
          style={{ minHeight: 48, justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 17, color: theme.colors.ink }}>
            {t('me.lowData')}: {audioOnly ? 'sauti tu' : 'video'}
          </Text>
        </Pressable>
        <Text style={{ marginTop: 12, fontFamily: 'Literata_600SemiBold', fontSize: 22, color: theme.colors.ink }}>Liturgia</Text>
        <Text style={{ marginTop: 8, fontSize: 17, lineHeight: 28, color: theme.colors.ink }}>{live.liturgySw}</Text>
        <Text style={{ marginTop: 16, color: theme.colors.inkMuted }}>{live.readings}</Text>
      </ScrollView>
    </View>
  );
}
