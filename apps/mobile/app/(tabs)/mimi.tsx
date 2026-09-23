import { createTranslator } from '@ebenezer/shared';
import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useDownloads } from '../../src/downloads';
import { useSession } from '../../src/session';
import { useAppTheme } from '../../src/theme/ThemeProvider';

export default function Mimi() {
  const { theme, preference, setPreference } = useAppTheme();
  const { user, update, signOut } = useSession();
  const downloads = useDownloads();
  const t = createTranslator(user?.locale ?? 'sw');

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 32, color: theme.colors.ink }}>{user?.name}</Text>
        <Text style={{ marginTop: 4, color: theme.colors.inkMuted }}>{user?.phone}</Text>

        <Text style={{ marginTop: 28, color: theme.colors.inkMuted }}>{t('me.language')}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          {(['sw', 'en'] as const).map((locale) => (
            <Pressable
              key={locale}
              onPress={() => void update({ locale })}
              style={{
                minHeight: 48,
                paddingHorizontal: 14,
                borderRadius: 999,
                justifyContent: 'center',
                backgroundColor: user?.locale === locale ? theme.colors.ink : theme.colors.surface,
              }}
            >
              <Text style={{ color: user?.locale === locale ? theme.colors.bg : theme.colors.ink }}>
                {locale === 'sw' ? 'Kiswahili' : 'English'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ marginTop: 24, color: theme.colors.inkMuted }}>{t('theme.label')}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          {(['system', 'light', 'dark'] as const).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => setPreference(mode)}
              style={{
                minHeight: 48,
                paddingHorizontal: 14,
                borderRadius: 999,
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: theme.colors.line,
                backgroundColor: preference === mode ? theme.colors.surface : theme.colors.bg,
              }}
            >
              <Text style={{ color: theme.colors.ink }}>{t(`theme.${mode}`)}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => void update({ lowData: !user?.lowData })} style={{ minHeight: 48, justifyContent: 'center', marginTop: 16 }}>
          <Text style={{ fontSize: 17, color: theme.colors.ink }}>
            {t('me.lowData')}: {user?.lowData ? 'imewashwa' : 'imezimwa'}
          </Text>
        </Pressable>

        <Text style={{ marginTop: 12, fontSize: 17, color: theme.colors.ink }}>
          {t('me.downloads')}: {downloads.ids.length}
        </Text>
        <Text style={{ color: theme.colors.inkMuted }}>
          {Math.max(downloads.ids.length, 0) * 0.4} MB
        </Text>

        <Text style={{ marginTop: 20, fontSize: 17, color: theme.colors.ink }}>{t('me.contactOffice')}</Text>
        <Text style={{ color: theme.colors.inkMuted }}>+255 22 270 0100</Text>
        <Text style={{ color: theme.colors.inkMuted }}>ofisi@ebenezer.or.tz</Text>

        <Link href="/design" style={{ marginTop: 20 }}>
          <Text style={{ color: theme.colors.gold, fontSize: 17 }}>{t('me.design')}</Text>
        </Link>

        <Pressable onPress={() => void signOut()} style={{ minHeight: 48, justifyContent: 'center', marginTop: 12 }}>
          <Text style={{ color: theme.colors.danger, fontSize: 17 }}>{t('auth.signOut')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
