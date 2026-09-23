import { bundledParish, createTranslator } from '@ebenezer/shared';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSession } from '../../src/session';
import { useAppTheme } from '../../src/theme/ThemeProvider';

export default function JumuiyaScreen() {
  const { theme } = useAppTheme();
  const { user, update } = useSession();
  const t = createTranslator(user?.locale ?? 'sw');
  const [going, setGoing] = useState(false);
  const [asked, setAsked] = useState(user?.jumuiyaAsked ?? false);
  const mine = bundledParish.jumuiya.find((item) => item.id === user?.jumuiyaId) ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 32, color: theme.colors.ink }}>
          {t('jumuiya.title')}
        </Text>
        {mine ? (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 28, color: theme.colors.ink }}>{mine.name}</Text>
            <Text style={{ marginTop: 12, color: theme.colors.ink }}>
              {t('jumuiya.leader')}
              <Text style={{ color: theme.colors.inkMuted }}>{`\n${mine.leader}`}</Text>
            </Text>
            <Text style={{ marginTop: 12, color: theme.colors.ink }}>
              {t('jumuiya.meets')}
              <Text style={{ color: theme.colors.inkMuted }}>{`\n${mine.day}`}</Text>
            </Text>
            <Text style={{ marginTop: 12, color: theme.colors.ink }}>
              {t('jumuiya.place')}
              <Text style={{ color: theme.colors.inkMuted }}>{`\n${mine.place}`}</Text>
            </Text>
            <Text style={{ marginTop: 12, color: theme.colors.inkMuted }}>
              {mine.members} {t('jumuiya.members')}
            </Text>
            <Pressable
              onPress={() => setGoing(true)}
              style={{
                marginTop: 20,
                minHeight: 48,
                borderRadius: theme.radius.control,
                backgroundColor: theme.colors.gold,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: theme.colors.surface, fontSize: 17 }}>
                {going ? t('jumuiya.going') : t('jumuiya.attend')}
              </Text>
            </Pressable>
          </View>
        ) : (
          <Text style={{ marginTop: 16, fontSize: 17, lineHeight: 26, color: theme.colors.ink }}>{t('jumuiya.empty')}</Text>
        )}

        <Text style={{ marginTop: 28, fontFamily: 'Literata_600SemiBold', fontSize: 22, color: theme.colors.ink }}>
          {t('jumuiya.pick')}
        </Text>
        {bundledParish.jumuiya.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => void update({ jumuiyaId: item.id })}
            style={{ minHeight: 48, justifyContent: 'center', borderTopWidth: 1, borderTopColor: theme.colors.line }}
          >
            <Text style={{ fontSize: 17, color: item.id === mine?.id ? theme.colors.gold : theme.colors.ink }}>
              {item.name}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => {
            setAsked(true);
            void update({ jumuiyaId: null, jumuiyaAsked: true });
          }}
          style={{ minHeight: 48, justifyContent: 'center' }}
        >
          <Text style={{ color: theme.colors.inkMuted }}>{asked ? t('jumuiya.requestSent') : t('jumuiya.unknown')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
