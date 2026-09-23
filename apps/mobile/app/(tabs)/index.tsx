import { bundledParish, createTranslator, type ParishHome } from '@ebenezer/shared';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Share, Text, View } from 'react-native';
import { useSession } from '../../src/session';
import { useAppTheme } from '../../src/theme/ThemeProvider';

const api = process.env.EXPO_PUBLIC_API_URL;

export default function Nyumbani() {
  const { theme } = useAppTheme();
  const { user } = useSession();
  const t = createTranslator(user?.locale ?? 'sw');
  const en = user?.locale === 'en';
  const [home, setHome] = useState<ParishHome>(bundledParish);

  useEffect(() => {
    if (!api) return;
    fetch(`${api}/api/parish`)
      .then((response) => (response.ok ? response.json() : null))
      .then((body: ParishHome | null) => {
        if (body?.verse) setHome(body);
      })
      .catch(() => undefined);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ backgroundColor: home.season.hex, paddingHorizontal: 20, paddingVertical: 12 }}>
        <Text style={{ color: '#F6F4F0', fontFamily: 'HankenGrotesk_500Medium', fontSize: 15 }}>
          {en ? home.season.en : home.season.sw}
        </Text>
        <Text style={{ color: '#F6F4F0', fontSize: 17, marginTop: 2 }}>
          {en ? home.season.sundayEn : home.season.sundaySw}
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        {home.source === 'saved' ? (
          <Text style={{ color: theme.colors.inkMuted, marginBottom: 12 }}>{t('home.offlineNote')}</Text>
        ) : null}

        <Text style={{ color: theme.colors.inkMuted, fontSize: 15 }}>{t('home.verseTitle')}</Text>
        <Text
          style={{
            fontFamily: 'Literata_400Regular',
            fontSize: 32,
            lineHeight: 44,
            color: theme.colors.ink,
            marginTop: 8,
          }}
        >
          {en ? home.verse.textEn : home.verse.textSw}
        </Text>
        <Text style={{ marginTop: 8, color: theme.colors.inkMuted }}>{home.verse.reference}</Text>
        <Pressable
          onPress={() => {
            const line = en ? home.verse.textEn : home.verse.textSw;
            void Share.share({
              message: `${line}\n${home.verse.reference}\n— ${t('churchName')}`,
            });
          }}
          style={{ marginTop: 16, minHeight: 48, justifyContent: 'center' }}
        >
          <Text style={{ color: theme.colors.gold, fontSize: 17 }}>{t('home.shareVerse')}</Text>
        </Pressable>

        {home.live ? (
          <View
            style={{
              marginTop: 28,
              borderRadius: theme.radius.card,
              borderWidth: 1,
              borderColor: theme.colors.line,
              backgroundColor: theme.colors.surface,
              padding: 16,
            }}
          >
            <Text style={{ color: home.season.hex, fontFamily: 'HankenGrotesk_500Medium' }}>
              {t('home.liveNow')}
            </Text>
            <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 22, color: theme.colors.ink, marginTop: 6 }}>
              {en ? home.live.titleEn : home.live.titleSw}
            </Text>
            <Text style={{ color: theme.colors.inkMuted, marginTop: 4 }}>
              {home.live.viewers} {t('home.viewers')}
            </Text>
            <Link href="/ibada" asChild>
              <Pressable
                style={{
                  marginTop: 14,
                  minHeight: 48,
                  borderRadius: theme.radius.control,
                  backgroundColor: theme.colors.gold,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: theme.colors.surface, fontSize: 17 }}>{t('home.joinNow')}</Text>
              </Pressable>
            </Link>
          </View>
        ) : null}

        <Text style={{ marginTop: 28, fontFamily: 'Literata_600SemiBold', fontSize: 22, color: theme.colors.ink }}>
          {t('home.nextService')}
        </Text>
        <Text style={{ marginTop: 8, fontSize: 17, color: theme.colors.ink }}>
          {en ? home.nextService.whenEn : home.nextService.whenSw}
        </Text>
        <Text style={{ color: theme.colors.inkMuted, marginTop: 4 }}>{home.nextService.preacher}</Text>
        <Text style={{ color: theme.colors.inkMuted, marginTop: 4 }}>{home.nextService.readings}</Text>
        <Text style={{ color: theme.colors.inkMuted, marginTop: 4 }}>{home.nextService.place}</Text>

        <View style={{ marginTop: 28, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 22, color: theme.colors.ink }}>
            {t('home.announcements')}
          </Text>
          <Link href="/matangazo">
            <Text style={{ color: theme.colors.gold, fontSize: 15 }}>{t('home.seeAll')}</Text>
          </Link>
        </View>
        {home.announcements.slice(0, 3).map((item) => (
          <View key={item.id} style={{ borderTopWidth: 1, borderTopColor: theme.colors.line, paddingVertical: 12 }}>
            <Text style={{ fontSize: 17, color: theme.colors.ink }}>{en ? item.titleEn : item.titleSw}</Text>
            <Text style={{ color: theme.colors.inkMuted, marginTop: 4 }}>{item.whenSw}</Text>
          </View>
        ))}

        <Text style={{ marginTop: 20, fontFamily: 'Literata_600SemiBold', fontSize: 22, color: theme.colors.ink }}>
          {t('home.reminders')}
        </Text>
        {home.reminders.map((item) => (
          <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
            <Text style={{ fontSize: 17, color: theme.colors.ink }}>{en ? item.titleEn : item.titleSw}</Text>
            <Text style={{ color: theme.colors.inkMuted }}>{item.time}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
