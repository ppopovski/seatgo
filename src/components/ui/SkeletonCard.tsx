import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import { Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function SkeletonCard() {
  const theme = useTheme();
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement },
        animatedStyle,
      ]}>
      <View style={[styles.line, styles.lineShort, { backgroundColor: theme.border }]} />
      <View style={[styles.line, { backgroundColor: theme.border }]} />
      <View style={[styles.line, styles.lineMedium, { backgroundColor: theme.border }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Tokens.radius.lg,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  line: {
    height: 12,
    borderRadius: 6,
    width: '100%',
  },
  lineShort: {
    width: '40%',
  },
  lineMedium: {
    width: '70%',
  },
});
