import { createTranslator } from '@ebenezer/shared';
import { auditTheme, seasons, type ColorToken } from '@ebenezer/tokens';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StoneMark } from '../src/components/StoneMark';
import { useAppTheme } from '../src/theme/ThemeProvider';

const tokenOrder: ColorToken[] = [
  'bg',
  'surface',
  'ink',
  'inkMuted',
  'line',
  'gold',
  'season',
  'success',
  'danger',
  'goldLeaf',
];

export default function DesignScreen() {
  const t = createTranslator('sw');
  const { theme, preference, setPreference, mode } = useAppTheme();
  const contrast = auditTheme(mode);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 64 }}>
        <StoneMark />
        <Text
          style={{
            fontFamily: 'Literata_600SemiBold',
            fontSize: 32,
            color: theme.colors.ink,
            marginTop: 12,
          }}
        >
          {t('design.title')}
        </Text>
        <Text style={{ color: theme.colors.inkMuted, fontSize: 17, marginTop: 8 }}>
          {t('design.subtitle')}
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 20 }}>
          {(['system', 'light', 'dark'] as const).map((option) => (
            <Pressable
              key={option}
              onPress={() => setPreference(option)}
              style={{
                minHeight: 48,
                paddingHorizontal: 14,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: theme.colors.line,
                backgroundColor:
                  preference === option ? theme.colors.surface : theme.colors.bg,
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: theme.colors.ink, fontSize: 15 }}>
                {option === 'system' ? 'Mfumo' : option === 'light' ? 'Mwanga' : 'Giza'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text
          style={{
            fontFamily: 'Literata_600SemiBold',
            fontSize: 24,
            color: theme.colors.ink,
            marginTop: 32,
          }}
        >
          {t('design.tokens')}
        </Text>
        <View style={{ gap: 12, marginTop: 12 }}>
          {tokenOrder.map((key) => (
            <View key={key} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: theme.colors[key],
                  borderColor: theme.colors.line,
                  borderWidth: 1,
                  borderRadius: key === 'bg' ? 20 : key === 'surface' ? 14 : 10,
                }}
              />
              <View>
                <Text style={{ color: theme.colors.ink, fontSize: 15 }}>{key}</Text>
                <Text style={{ color: theme.colors.inkMuted, fontSize: 13 }}>
                  {theme.colors[key]}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <Text
          style={{
            fontFamily: 'Literata_600SemiBold',
            fontSize: 24,
            color: theme.colors.ink,
            marginTop: 32,
          }}
        >
          {t('design.seasons')}
        </Text>
        <Text style={{ color: theme.colors.inkMuted, fontSize: 15, marginTop: 8 }}>
          {t('design.seasonUse')}
        </Text>
        <View style={{ gap: 10, marginTop: 12 }}>
          {Object.values(seasons).map((season) => (
            <View key={season.sw} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: season.hex,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme.colors.line,
                }}
              />
              <Text style={{ color: theme.colors.ink, fontSize: 17 }}>{season.sw}</Text>
            </View>
          ))}
        </View>

        <Text
          style={{
            fontFamily: 'Literata_400Regular',
            fontSize: 32,
            lineHeight: 44,
            color: theme.colors.ink,
            marginTop: 32,
          }}
        >
          {t('design.verseSample')}
        </Text>
        <Text style={{ color: theme.colors.inkMuted, marginTop: 8 }}>{t('design.serifUse')}</Text>

        <Text
          style={{
            fontFamily: 'Literata_600SemiBold',
            fontSize: 24,
            color: theme.colors.ink,
            marginTop: 32,
          }}
        >
          {t('design.contrast')}
        </Text>
        {contrast.map((row) => (
          <Text
            key={row.name}
            style={{
              color: row.pass ? theme.colors.success : theme.colors.danger,
              fontSize: 15,
              marginTop: 6,
            }}
          >
            {row.name}: {row.ratio} {row.pass ? 'AA' : 'fail'}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}
