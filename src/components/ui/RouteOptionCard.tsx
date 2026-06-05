import { Pressable, StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { Shadows, Spacing, Tokens } from '@/constants/theme';
import { formatPrice } from '@/services/transitService';
import { useTheme } from '@/hooks/use-theme';
import type { RouteOption } from '@/types/transit';

type RouteOptionCardProps = {
  option: RouteOption;
  onPress?: () => void;
  onDetails?: () => void;
  compact?: boolean;
};

function modeLabel(mode: string): string {
  switch (mode) {
    case 'bus':
      return 'Bus';
    case 'train':
      return 'Train';
    case 'taxi':
      return 'Taxi';
    default:
      return mode;
  }
}

export function RouteOptionCard({ option, onPress, onDetails, compact }: RouteOptionCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        Shadows.md,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed && onPress ? 0.95 : 1,
        },
      ]}>
      <View style={styles.top}>
        <View style={styles.modes}>
          {option.modes.map((m) => (
            <View key={m} style={[styles.modeTag, { backgroundColor: theme.accentSoft }]}>
              <ThemedText style={styles.modeTagText}>{modeLabel(m)}</ThemedText>
            </View>
          ))}
        </View>
        {option.isFastest ? (
          <View style={[styles.badge, { backgroundColor: theme.primary }]}>
            <ThemedText style={[styles.badgeText, { color: theme.primaryForeground }]}>
              Fastest
            </ThemedText>
          </View>
        ) : null}
      </View>

      <View style={styles.mainRow}>
        <ThemedText style={styles.time}>{option.totalTimeMinutes} min</ThemedText>
        <View style={styles.priceBlock}>
          <ThemedText themeColor="textMuted" style={styles.priceLabel}>
            Total
          </ThemedText>
          <ThemedText style={styles.price}>{formatPrice(option.price)}</ThemedText>
        </View>
      </View>

      <ThemedText themeColor="textSecondary" style={styles.meta}>
        {option.label} · ETA{' '}
        {option.eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </ThemedText>

      {onDetails && !compact ? (
        <PrimaryButton label="Select route" variant="secondary" size="md" onPress={onDetails} style={styles.btn} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modes: {
    flexDirection: 'row',
    gap: Spacing.one,
    flexWrap: 'wrap',
  },
  modeTag: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Tokens.radius.sm,
  },
  modeTagText: {
    fontSize: Tokens.fontSize.micro,
    fontWeight: Tokens.fontWeight.semibold,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Tokens.radius.pill,
  },
  badgeText: {
    fontSize: Tokens.fontSize.micro,
    fontWeight: Tokens.fontWeight.bold,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 32,
    fontWeight: Tokens.fontWeight.bold,
    letterSpacing: -1,
  },
  priceBlock: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: Tokens.fontSize.micro,
    textTransform: 'uppercase',
  },
  price: {
    fontSize: Tokens.fontSize.title,
    fontWeight: Tokens.fontWeight.bold,
  },
  meta: {
    fontSize: Tokens.fontSize.caption,
  },
  btn: {
    marginTop: Spacing.one,
  },
});
