import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { Shadows, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type DestinationListCardProps = {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  accentIcon?: boolean;
  onPress?: () => void;
  compact?: boolean;
};

export function DestinationListCard({
  title,
  subtitle,
  icon = 'location-outline',
  accentIcon = false,
  onPress,
  compact = false,
}: DestinationListCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        Shadows.sm,
        compact && styles.compact,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}>
      {accentIcon ? (
        <View style={[styles.accentCircle, { backgroundColor: theme.primary }]}>
          <Ionicons name="add" size={18} color={theme.primaryForeground} />
        </View>
      ) : (
        <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name={icon} size={18} color={theme.text} />
        </View>
      )}
      <View style={styles.textWrap}>
        <ThemedText style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText themeColor="textSecondary" style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
    minWidth: 240,
  },
  compact: {
    minWidth: 220,
  },
  accentCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Tokens.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: Tokens.fontSize.body,
    fontWeight: Tokens.fontWeight.bold,
  },
  subtitle: {
    fontSize: Tokens.fontSize.caption,
  },
});
