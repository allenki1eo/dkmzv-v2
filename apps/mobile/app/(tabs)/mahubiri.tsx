import { bundledParish, createTranslator } from '@ebenezer/shared';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSession } from '../../src/session';
import { useAppTheme } from '../../src/theme/ThemeProvider';

const filters = ['audio', 'series'] as const;

export default function Mahubiri() {
  const { theme } = useAppTheme();
  const { user } = useSession();
  const t = createTranslator(user?.locale ?? 'sw');
  const en = user?.locale === 'en';
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof filters)[number]>('audio');
  const sermons = bundledParish.sermons.filter((sermon) => {
    const haystack = `${sermon.titleSw} ${sermon.titleEn} ${sermon.preacher} ${sermon.readings}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesFilter = filter === 'audio' ? true : sermon.seriesSw === 'Jiwe la msaada';
    return matchesQuery && matchesFilter;
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 32, color: theme.colors.ink }}>
          {t('sermons.title')}
        </Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Kichwa, mhubiri, kitabu"
          placeholderTextColor={theme.colors.inkMuted}
          style={{
            marginTop: 16,
            minHeight: 48,
            borderWidth: 1,
            borderColor: theme.colors.line,
            borderRadius: theme.radius.control,
            backgroundColor: theme.colors.surface,
            paddingHorizontal: 12,
            color: theme.colors.ink,
            fontSize: 17,
          }}
        />
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          {filters.map((item) => (
            <Pressable
              key={item}
              onPress={() => setFilter(item)}
              style={{
                minHeight: 48,
                paddingHorizontal: 14,
                borderRadius: 999,
                justifyContent: 'center',
                backgroundColor: filter === item ? theme.colors.ink : theme.colors.surface,
              }}
            >
              <Text style={{ color: filter === item ? theme.colors.bg : theme.colors.ink }}>
                {item === 'audio' ? t('sermons.audio') : t('sermons.series')}
              </Text>
            </Pressable>
          ))}
        </View>
        {sermons.length === 0 ? (
          <Text style={{ marginTop: 24, color: theme.colors.inkMuted }}>{t('sermons.empty')}</Text>
        ) : (
          sermons.map((sermon) => (
            <Link key={sermon.id} href={`/hubiri/${sermon.id}`} asChild>
              <Pressable style={{ borderTopWidth: 1, borderTopColor: theme.colors.line, paddingVertical: 14, minHeight: 48 }}>
                <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 20, color: theme.colors.ink }}>
                  {en ? sermon.titleEn : sermon.titleSw}
                </Text>
                <Text style={{ color: theme.colors.inkMuted, marginTop: 4 }}>{sermon.preacher}</Text>
                <Text style={{ color: theme.colors.inkMuted }}>{sermon.preachedOn}</Text>
              </Pressable>
            </Link>
          ))
        )}
      </ScrollView>
    </View>
  );
}
