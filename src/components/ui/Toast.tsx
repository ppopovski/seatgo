import { Modal, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ToastProps = {
  visible: boolean;
  message: string;
};

export function Toast({ visible, message }: ToastProps) {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <View style={[styles.toast, { backgroundColor: theme.primary }]}>
          <ThemedText style={{ color: theme.primaryForeground, fontWeight: '600' }}>
            {message}
          </ThemedText>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: Spacing.four,
    pointerEvents: 'none',
  },
  toast: {
    padding: Spacing.three,
    borderRadius: Tokens.radius.md,
    alignItems: 'center',
  },
});
