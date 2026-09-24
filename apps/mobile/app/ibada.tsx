import { bundledParish, createTranslator } from '@ebenezer/shared';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { usePlayer } from '../src/player';
import { useSession } from '../src/session';
import { useAppTheme } from '../src/theme/ThemeProvider';
import { BackHeader, Screen } from '../src/ui';

export default function Ibada() {
  const { theme } = useAppTheme();
  const { user, update } = useSession();
  const { play, playing, sermon, toggle } = usePlayer();
  const t = createTranslator(user?.locale ?? 'sw');
  const live = bundledParish.live;
  const audio = user?.lowData ?? false;
  const sermonForLive = bundledParish.sermons[0];
  if (!live || !sermonForLive) return null;
  const streaming = sermon?.id === sermonForLive.id && playing;

  return (
    <Screen>
      <BackHeader title={t('sermons.liveStream')} />
      <View style={{ height: 280, backgroundColor: theme.colors.ink, justifyContent: 'flex-end', padding: 20 }}>
        <Text style={{ color: bundledParish.season.hex, fontFamily: 'HankenGrotesk_500Medium' }}>{t('home.liveNow')}</Text>
        <Text style={{ color: theme.colors.bg, fontFamily: 'Literata_600SemiBold', fontSize: 28, marginTop: 8 }}>
          {user?.locale === 'en' ? live.titleEn : live.titleSw}
        </Text>
        <Text style={{ color: theme.colors.bg, marginTop: 6 }}>
          {live.viewers} {t('home.viewers')}
        </Text>
        <Pressable
          onPress={() => void (streaming ? toggle() : play(sermonForLive))}
          style={{
            marginTop: 18,
            minHeight: 52,
            borderRadius: theme.radius.control,
            backgroundColor: theme.colors.gold,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: theme.colors.surface, fontSize: 17 }}>
            {streaming ? t('sermons.pause') : audio ? t('sermons.audio') : t('sermons.stream')}
          </Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Pressable
          onPress={() => void update({ lowData: !audio })}
          style={{ minHeight: 48, justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 17, color: theme.colors.ink }}>
            {t('me.lowData')}: {audio ? t('sermons.audio') : t('sermons.video')}
          </Text>
        </Pressable>
        <Text style={{ marginTop: 12, fontFamily: 'Literata_600SemiBold', fontSize: 22, color: theme.colors.ink }}>Liturgia</Text>
        <Text style={{ marginTop: 8, fontSize: 17, lineHeight: 28, color: theme.colors.ink }}>{live.liturgySw}</Text>
        <Text style={{ marginTop: 16, color: theme.colors.inkMuted }}>{live.readings}</Text>
      </ScrollView>
    </Screen>
  );
}
