import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { Spacing, Tokens } from '@/constants/theme';
import { formatDepartureTime, formatPrice } from '@/services/transitService';
import { useTheme } from '@/hooks/use-theme';
import type { Departure } from '@/types/transit';

type DepartureRowProps = {
  departure: Departure & { stopName?: string; lineNumber?: string };
  lineNumber?: string;
  onSelect?: () => void;
};

export function DepartureRow({ departure, lineNumber, onSelect }: DepartureRowProps) {
  const theme = useTheme();
  const line = lineNumber ?? departure.lineNumber ?? '-';

  return (
    <View style={[styles.row, { borderBottomColor: theme.border }]}>
      <View style={styles.left}>
        <View style={[styles.lineBadge, { backgroundColor: theme.primary }]}>
          <ThemedText style={[styles.lineBadgeText, { color: theme.primaryForeground }]}>
            {line}
          </ThemedText>
        </View>
        <View style={styles.info}>
          <ThemedText style={styles.dest}>To {departure.destination}</ThemedText>
          {departure.stopName ? (
            <ThemedText themeColor="textMuted" style={styles.stop}>
              {departure.stopName}
            </ThemedText>
          ) : null}
        </View>
      </View>
      <View style={styles.right}>
        <ThemedText style={styles.time}>{formatDepartureTime(departure.time)}</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.price}>
          {formatPrice(departure.price)}
        </ThemedText>
        {onSelect ? (
          <PrimaryButton label="Select" size="md" onPress={onSelect} style={styles.selectBtn} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.two,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  lineBadge: {
    minWidth: 44,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Tokens.radius.sm,
    alignItems: 'center',
  },
  lineBadgeText: {
    fontWeight: Tokens.fontWeight.bold,
    fontSize: Tokens.fontSize.caption,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  dest: {
    fontWeight: Tokens.fontWeight.semibold,
    fontSize: Tokens.fontSize.body,
  },
  stop: {
    fontSize: Tokens.fontSize.micro,
  },
  right: {
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  time: {
    fontWeight: Tokens.fontWeight.bold,
    fontSize: Tokens.fontSize.body,
  },
  price: {
    fontSize: Tokens.fontSize.caption,
  },
  selectBtn: {
    minWidth: 88,
    marginTop: Spacing.one,
  },
});
