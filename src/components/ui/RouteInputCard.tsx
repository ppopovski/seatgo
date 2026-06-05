import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Shadows, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type RouteInputCardProps = {
  from: string;
  to?: string;
};

export function RouteInputCard({ from, to }: RouteInputCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        Shadows.md,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}>
      <View style={styles.timeline}>
        <View style={[styles.dot, { backgroundColor: theme.primary }]} />
        <View style={[styles.line, { backgroundColor: theme.border }]} />
        <View style={[styles.dot, styles.dotOutline, { borderColor: theme.textMuted }]} />
      </View>
      <View style={styles.fields}>
        <View style={styles.row}>
          <ThemedText themeColor="textMuted" style={styles.label}>
            From
          </ThemedText>
          <ThemedText style={styles.value} numberOfLines={1}>
            {from}
          </ThemedText>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <View style={styles.row}>
          <ThemedText themeColor="textMuted" style={styles.label}>
            To
          </ThemedText>
          <ThemedText style={styles.value} numberOfLines={1}>
            {to ?? 'Where to?'}
          </ThemedText>
        </View>
      </View>
      <Ionicons name="swap-vertical" size={22} color={theme.textMuted} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  timeline: {
    alignItems: 'center',
    paddingVertical: Spacing.one,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  line: {
    width: 2,
    height: 28,
    marginVertical: 4,
  },
  fields: {
    flex: 1,
    gap: Spacing.two,
  },
  row: {
    gap: 2,
  },
  label: {
    fontSize: Tokens.fontSize.micro,
    fontWeight: Tokens.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: Tokens.fontSize.body,
    fontWeight: Tokens.fontWeight.semibold,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
