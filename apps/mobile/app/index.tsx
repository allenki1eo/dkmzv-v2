import { createTranslator } from '@ebenezer/shared';
import { seasons } from '@ebenezer/tokens';
import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoneMark } from '../src/components/StoneMark';
import { useAppTheme } from '../src/theme/ThemeProvider';

export default function Nyumbani() {
  const t = createTranslator('sw');
  const { theme } = useAppTheme();
  const season = seasons.ordinary;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View
        style={{
          backgroundColor: season.hex,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Text style={{ color: '#F6F4F0', fontFamily: 'HankenGrotesk_500Medium', fontSize: 15 }}>
          {season.sw}
        </Text>
        <Text style={{ color: '#F6F4F0', fontFamily: 'HankenGrotesk_400Regular', fontSize: 15 }}>
          Jumapili ya 16 baada ya Pentekoste
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <StoneMark size={48} />
          <View>
            <Text
              style={{
                fontFamily: 'Literata_600SemiBold',
                fontSize: 24,
                color: theme.colors.ink,
              }}
            >
              {t('appName')}
            </Text>
            <Text style={{ color: theme.colors.inkMuted, fontSize: 15 }}>
              {t('churchName')}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.card,
            borderWidth: 1,
            borderColor: theme.colors.line,
            padding: 20,
          }}
        >
          <Text style={{ color: theme.colors.inkMuted, fontSize: 15 }}>
            {t('home.verseTitle')}
          </Text>
          <Text
            style={{
              fontFamily: 'Literata_400Regular',
              fontSize: 32,
              lineHeight: 42,
              color: theme.colors.ink,
              marginTop: 12,
            }}
          >
            {t('markLine')}
          </Text>
          <Text style={{ marginTop: 12, color: theme.colors.inkMuted, fontSize: 15 }}>
            {t('markCite')}
          </Text>
        </View>

        <Link href="/design" asChild>
          <Pressable
            style={{
              marginTop: 24,
              minHeight: 48,
              borderRadius: theme.radius.control,
              backgroundColor: theme.colors.gold,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: theme.colors.surface,
                fontFamily: 'HankenGrotesk_500Medium',
                fontSize: 17,
              }}
            >
              {t('me.design')}
            </Text>
          </Pressable>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
