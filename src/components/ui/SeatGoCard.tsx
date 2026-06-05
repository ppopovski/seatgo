import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Shadows, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SeatGoCardProps = ViewProps & {
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'flat';
};

export function SeatGoCard({
  style,
  onPress,
  variant = 'elevated',
  children,
  ...rest
}: SeatGoCardProps) {
  const theme = useTheme();

  const content = (
    <View
      style={[
        styles.card,
        variant === 'elevated' && Shadows.md,
        variant === 'flat' && styles.flat,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          { transform: [{ scale: pressed ? Tokens.motion.pressScale : 1 }] },
        ]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
    padding: Spacing.three,
  },
  flat: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
});
