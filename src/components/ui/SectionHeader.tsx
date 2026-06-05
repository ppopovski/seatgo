import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing, Tokens } from '@/constants/theme';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction}>
          <ThemedText themeColor="textSecondary" style={styles.action}>
            {actionLabel}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
    marginTop: Spacing.two,
  },
  title: {
    fontSize: Tokens.fontSize.title,
    fontWeight: Tokens.fontWeight.bold,
    letterSpacing: -0.3,
  },
  action: {
    fontSize: Tokens.fontSize.caption,
    fontWeight: Tokens.fontWeight.semibold,
  },
});
