import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Shadows, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ModeFilter } from '@/types/transit';

const MODE_CONFIG: Record<
  Exclude<ModeFilter, 'all'>,
  { label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  taxi: { label: 'Taxi', icon: 'car-outline' },
  bus: { label: 'Bus', icon: 'bus-outline' },
  train: { label: 'Train', icon: 'train-outline' },
};

type TransportModeCardProps = {
  mode: Exclude<ModeFilter, 'all'>;
  selected?: boolean;
  onPress?: () => void;
  style?: import('react-native').ViewStyle;
};

export function TransportModeCard({ mode, selected, onPress, style }: TransportModeCardProps) {
  const theme = useTheme();
  const config = MODE_CONFIG[mode];
  const bg = selected ? theme.primary : theme.surface;
  const fg = selected ? theme.primaryForeground : theme.text;
  const muted = selected ? theme.headerMuted : theme.textSecondary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        Shadows.md,
        style,
        {
          backgroundColor: bg,
          borderColor: selected ? theme.primary : theme.border,
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? Tokens.motion.pressScale : 1 }],
        },
      ]}>
      <View style={styles.content}>
        <ThemedText style={[styles.label, { color: fg }]}>{config.label}</ThemedText>
        <View style={[styles.selectPill, { backgroundColor: selected ? theme.primaryForeground : theme.accentSoft }]}>
          <ThemedText style={[styles.selectText, { color: selected ? theme.primary : theme.text }]}>
            Select
          </ThemedText>
        </View>
        <ThemedText style={[styles.hint, { color: muted }]}>View on map</ThemedText>
      </View>
      <Ionicons name={config.icon} size={48} color={selected ? theme.primaryForeground : theme.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.three,
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
  },
  content: {
    gap: Spacing.two,
    flex: 1,
  },
  label: {
    fontSize: Tokens.fontSize.title,
    fontWeight: Tokens.fontWeight.bold,
  },
  selectPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Tokens.radius.pill,
  },
  selectText: {
    fontSize: Tokens.fontSize.micro,
    fontWeight: Tokens.fontWeight.semibold,
  },
  hint: {
    fontSize: Tokens.fontSize.micro,
  },
});
