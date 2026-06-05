import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { FontFamily, Shadows, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SearchFieldProps = TextInputProps & {
  onPress?: () => void;
  editable?: boolean;
  displayValue?: string;
};

export function SearchField({
  onPress,
  editable = true,
  displayValue,
  style,
  placeholder,
  value,
  ...rest
}: SearchFieldProps) {
  const theme = useTheme();
  const shownText = displayValue ?? value ?? placeholder ?? 'Search';

  const field = (
    <View
      style={[
        styles.container,
        Shadows.md,
        { backgroundColor: theme.surface, borderColor: theme.border },
      ]}>
      <Ionicons name="search" size={20} color={theme.textMuted} />
      {editable ? (
        <TextInput
          style={[styles.input, { color: theme.text }, style]}
          placeholderTextColor={theme.textMuted}
          placeholder={placeholder}
          value={value}
          {...rest}
        />
      ) : (
        <ThemedText
          themeColor={displayValue || value ? 'text' : 'textSecondary'}
          style={styles.placeholder}>
          {shownText}
        </ThemedText>
      )}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{field}</Pressable>;
  }

  return field;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Tokens.radius.lg,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: Tokens.fontSize.body,
    fontWeight: '400',
    padding: 0,
  },
  placeholder: {
    flex: 1,
    fontSize: Tokens.fontSize.body,
  },
});
