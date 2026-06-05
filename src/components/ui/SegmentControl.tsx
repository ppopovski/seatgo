import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Shadows, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SegmentControlProps<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentControlProps<T>) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              selected && [Shadows.sm, { backgroundColor: theme.surface }],
            ]}>
            <ThemedText
              style={[
                styles.label,
                { color: selected ? theme.text : theme.textSecondary },
              ]}>
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: Tokens.radius.lg,
    padding: Spacing.one,
    gap: Spacing.one,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.two + 2,
    borderRadius: Tokens.radius.md,
    alignItems: 'center',
  },
  label: {
    fontSize: Tokens.fontSize.caption,
    fontWeight: Tokens.fontWeight.semibold,
  },
});
