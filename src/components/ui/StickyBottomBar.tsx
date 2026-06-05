import { StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { Shadows, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type StickyBottomBarProps = ViewProps & {
  label: string;
  onPress: () => void;
  priceLabel?: string;
  price?: string;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

export function StickyBottomBar({
  label,
  onPress,
  priceLabel,
  price,
  secondaryLabel,
  onSecondaryPress,
  style,
  ...rest
}: StickyBottomBarProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <View
      style={[
        styles.bar,
        Shadows.lg,
        {
          paddingBottom: insets.bottom + Spacing.three,
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
        },
        style,
      ]}
      {...rest}>
      {(price || priceLabel) && (
        <View style={styles.priceBlock}>
          {priceLabel ? (
            <ThemedText themeColor="textMuted" style={styles.priceLabel}>
              {priceLabel}
            </ThemedText>
          ) : null}
          {price ? <ThemedText style={styles.price}>{price}</ThemedText> : null}
        </View>
      )}
      <View style={styles.actions}>
        {secondaryLabel && onSecondaryPress ? (
          <PrimaryButton
            label={secondaryLabel}
            variant="secondary"
            onPress={onSecondaryPress}
            style={styles.secondaryBtn}
          />
        ) : null}
        <PrimaryButton label={label} onPress={onPress} style={styles.primaryBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    gap: Spacing.three,
  },
  priceBlock: {
    minWidth: 72,
  },
  priceLabel: {
    fontSize: Tokens.fontSize.micro,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  price: {
    fontSize: Tokens.fontSize.title,
    fontWeight: Tokens.fontWeight.bold,
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.two,
  },
  primaryBtn: {
    flex: 1,
  },
  secondaryBtn: {
    flex: 1,
  },
});
