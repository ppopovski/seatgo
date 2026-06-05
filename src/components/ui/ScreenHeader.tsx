import { StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenHeaderProps = ViewProps & {
  title?: string;
  greeting?: string;
  subtitle?: string;
  dark?: boolean;
  roundedBottom?: boolean;
  children?: React.ReactNode;
};

export function ScreenHeader({
  title,
  greeting,
  subtitle,
  dark = true,
  roundedBottom = true,
  children,
  style,
  ...rest
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const bg = dark ? theme.headerBackground : theme.surface;
  const fg = dark ? theme.headerForeground : theme.text;
  const muted = dark ? theme.headerMuted : theme.textSecondary;

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + Spacing.two,
          backgroundColor: bg,
          borderBottomLeftRadius: roundedBottom ? Tokens.radius.xl : 0,
          borderBottomRightRadius: roundedBottom ? Tokens.radius.xl : 0,
        },
        style,
      ]}
      {...rest}>
      {greeting ? (
        <ThemedText style={[styles.greeting, { color: muted }]}>{greeting}</ThemedText>
      ) : null}
      {title ? (
        <ThemedText style={[styles.title, { color: fg }]}>{title}</ThemedText>
      ) : null}
      {subtitle ? (
        <ThemedText style={[styles.subtitle, { color: muted }]}>{subtitle}</ThemedText>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.one,
  },
  greeting: {
    fontSize: Tokens.fontSize.caption,
    fontWeight: Tokens.fontWeight.medium,
  },
  title: {
    fontSize: Tokens.fontSize.heading,
    fontWeight: Tokens.fontWeight.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Tokens.fontSize.body,
    marginTop: Spacing.one,
  },
});
