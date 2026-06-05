import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Shadows, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PrimaryButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'md' | 'lg';
  style?: PressableProps['style'];
};

export function PrimaryButton({
  label,
  variant = 'primary',
  size = 'lg',
  disabled,
  style,
  ...rest
}: PrimaryButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      disabled={disabled}
      style={(state) => {
        const resolvedStyle = typeof style === 'function' ? style(state) : style;
        return [
          styles.button,
          size === 'lg' ? styles.lg : styles.md,
          isPrimary && Shadows.sm,
          {
            backgroundColor:
              variant === 'ghost'
                ? 'transparent'
                : variant === 'outline'
                  ? 'transparent'
                  : isPrimary
                    ? theme.primary
                    : theme.surface,
            borderColor: variant === 'outline' || variant === 'secondary' ? theme.border : 'transparent',
            borderWidth: variant === 'outline' || variant === 'secondary' ? 1.5 : 0,
            opacity: disabled ? 0.5 : state.pressed ? 0.88 : 1,
            transform: [{ scale: state.pressed ? Tokens.motion.pressScale : 1 }],
          },
          resolvedStyle,
        ];
      }}
      {...rest}>
      <ThemedText
        style={[
          styles.label,
          size === 'lg' ? styles.labelLg : styles.labelMd,
          {
            color:
              variant === 'ghost' || variant === 'outline'
                ? theme.text
                : isPrimary
                  ? theme.primaryForeground
                  : theme.text,
          },
        ]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Tokens.radius.lg,
  },
  lg: {
    paddingVertical: Spacing.three + 2,
    paddingHorizontal: Spacing.four,
  },
  md: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  label: {
    fontWeight: Tokens.fontWeight.semibold,
  },
  labelLg: {
    fontSize: Tokens.fontSize.body,
  },
  labelMd: {
    fontSize: Tokens.fontSize.caption,
  },
});
