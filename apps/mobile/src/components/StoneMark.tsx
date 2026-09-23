import { View } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';

export function StoneMark({ size = 56 }: { size?: number }) {
  const { theme } = useAppTheme();
  const stoneW = size * 0.34;
  const stoneH = size * 0.6;
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          position: 'absolute',
          left: size * 0.28,
          top: size * 0.22,
          width: stoneW,
          height: stoneH,
          borderRadius: 4,
          backgroundColor: theme.colors.ink,
          opacity: 0.88,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: size * 0.12,
          top: size * 0.12,
          width: 8,
          height: 8,
          borderRadius: 8,
          backgroundColor: theme.colors.goldLeaf,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: size * 0.2,
          top: size * 0.18,
          width: size * 0.22,
          height: 2,
          backgroundColor: theme.colors.gold,
          transform: [{ rotate: '26deg' }],
        }}
      />
    </View>
  );
}
