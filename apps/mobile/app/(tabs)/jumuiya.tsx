import { bundledParish, createTranslator, locateJumuiya } from '@ebenezer/shared';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { JumuiyaMap } from '../../src/map';
import { useSession } from '../../src/session';
import { useAppTheme } from '../../src/theme/ThemeProvider';
import { Screen } from '../../src/ui';

export default function JumuiyaScreen() {
  const { theme } = useAppTheme();
  const { user, update } = useSession();
  const t = createTranslator(user?.locale ?? 'sw');
  const [going, setGoing] = useState(false);
  const [asked, setAsked] = useState(user?.jumuiyaAsked ?? false);
  const places = bundledParish.jumuiya.map(locateJumuiya);
  const [selectedId, setSelectedId] = useState<string | null>(user?.jumuiyaId ?? places[0]?.id ?? null);
  const selected = places.find((item) => item.id === selectedId) ?? places[0] ?? null;
  const mine = places.find((item) => item.id === user?.jumuiyaId) ?? null;

  function openMaps(lat?: number, lng?: number) {
    if (lat == null || lng == null) return;
    void Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 32, color: theme.colors.ink }}>{t('jumuiya.title')}</Text>
          <Text style={{ marginTop: 6, color: theme.colors.inkMuted }}>{t('jumuiya.map')}</Text>
        </View>
        <View
          style={{
            marginTop: 16,
            marginHorizontal: 20,
            borderRadius: theme.radius.card,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: theme.colors.line,
            height: 280,
          }}
        >
          <JumuiyaMap
            points={places}
            selectedId={selected?.id ?? null}
            gold={theme.colors.gold}
            ink={theme.colors.ink}
            onSelect={setSelectedId}
          />
        </View>

        {selected ? (
          <View style={{ marginHorizontal: 20, marginTop: 16 }}>
            <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 28, color: theme.colors.ink }}>{selected.name}</Text>
            {selected.id === mine?.id ? (
              <Text style={{ marginTop: 4, color: theme.colors.gold }}>{t('jumuiya.yours')}</Text>
            ) : null}
            <Text style={{ marginTop: 12, fontSize: 17, color: theme.colors.ink }}>{selected.place}</Text>
            <Text style={{ marginTop: 4, color: theme.colors.inkMuted }}>
              {selected.street} · {selected.day}
            </Text>
            <Text style={{ marginTop: 4, color: theme.colors.inkMuted }}>
              {t('jumuiya.leader')}: {selected.leader}
            </Text>
            <Pressable
              onPress={() => openMaps(selected.lat, selected.lng)}
              style={{
                marginTop: 16,
                minHeight: 52,
                borderRadius: theme.radius.control,
                backgroundColor: theme.colors.gold,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: theme.colors.surface, fontSize: 17 }}>{t('jumuiya.openMap')}</Text>
            </Pressable>
            {selected.id === mine?.id ? (
              <Pressable onPress={() => setGoing(true)} style={{ minHeight: 48, justifyContent: 'center' }}>
                <Text style={{ color: theme.colors.ink, fontSize: 17 }}>{going ? t('jumuiya.going') : t('jumuiya.attend')}</Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => void update({ jumuiyaId: selected.id, street: selected.street ?? user?.street })} style={{ minHeight: 48, justifyContent: 'center' }}>
                <Text style={{ color: theme.colors.ink, fontSize: 17 }}>{t('jumuiya.pick')}</Text>
              </Pressable>
            )}
          </View>
        ) : null}

        <View style={{ marginTop: 12 }}>
          {places.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => setSelectedId(item.id)}
              style={{
                minHeight: 64,
                justifyContent: 'center',
                paddingHorizontal: 20,
                borderTopWidth: 1,
                borderTopColor: theme.colors.line,
                backgroundColor: item.id === selected?.id ? theme.colors.surface : theme.colors.bg,
              }}
            >
              <Text style={{ fontSize: 17, color: theme.colors.ink }}>{item.name}</Text>
              <Text style={{ color: theme.colors.inkMuted }}>{item.place}</Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => {
              setAsked(true);
              void update({ jumuiyaId: null, jumuiyaAsked: true });
            }}
            style={{ minHeight: 52, justifyContent: 'center', paddingHorizontal: 20 }}
          >
            <Text style={{ color: theme.colors.inkMuted }}>{asked ? t('jumuiya.requestSent') : t('jumuiya.unknown')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}
