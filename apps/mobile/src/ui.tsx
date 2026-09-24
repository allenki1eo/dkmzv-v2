import { useRouter } from 'expo-router';
import { CaretLeft, type Icon } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from './theme/ThemeProvider';

export function Mark({ icon, color, size = 24 }: { icon: Icon; color: string; size?: number }) {
  const Drawn = icon as unknown as (props: { color: string; size: number }) => ReactNode;
  return <Drawn color={color} size={size} />;
}

export function Screen({ children }: { children: ReactNode }) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, backgroundColor: theme.colors.bg, paddingTop: insets.top }}>{children}</View>;
}

export function BackHeader({ title }: { title: string }) {
  const router = useRouter();
  const { theme } = useAppTheme();
  return (
    <View style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={8}
        style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}
      >
        <Mark icon={CaretLeft} color={theme.colors.ink} size={24} />
      </Pressable>
      <Text style={{ flex: 1, fontFamily: 'Literata_600SemiBold', fontSize: 20, color: theme.colors.ink }} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

export function goldButton(backgroundColor: string, radius: number) {
  return {
    marginTop: 16,
    minHeight: 52,
    borderRadius: radius,
    backgroundColor,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingHorizontal: 16,
  };
}
