import { bundledParish, createTranslator } from '@ebenezer/shared';
import { ScrollView, Text, View } from 'react-native';
import { useSession } from '../src/session';
import { useAppTheme } from '../src/theme/ThemeProvider';
import { BackHeader, Screen } from '../src/ui';

export default function Matangazo() {
  const { theme } = useAppTheme();
  const { user } = useSession();
  const t = createTranslator(user?.locale ?? 'sw');
  const en = user?.locale === 'en';
  return (
    <Screen>
      <BackHeader title={t('home.announcements')} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {bundledParish.announcements.map((item) => (
          <View key={item.id} style={{ borderTopWidth: 1, borderTopColor: theme.colors.line, paddingVertical: 16 }}>
            <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 22, color: theme.colors.ink }}>
              {en ? item.titleEn : item.titleSw}
            </Text>
            <Text style={{ marginTop: 6, fontSize: 17, lineHeight: 26, color: theme.colors.ink }}>
              {en ? item.bodyEn : item.bodySw}
            </Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
