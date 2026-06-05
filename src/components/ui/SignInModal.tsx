import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { Shadows, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SignInModalProps = {
  visible: boolean;
  onClose: () => void;
  onSignIn: () => void;
};

export function SignInModal({ visible, onClose, onSignIn }: SignInModalProps) {
  const theme = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheet,
            Shadows.lg,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
          onPress={(e) => e.stopPropagation()}>
          <View style={[styles.icon, { backgroundColor: theme.accentSoft }]}>
            <ThemedText style={styles.iconText}>🔒</ThemedText>
          </View>
          <ThemedText style={styles.title}>Sign in to continue</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.body}>
            Create an account to top up your balance, buy tickets, and call taxis from the app.
          </ThemedText>
          <View style={styles.actions}>
            <PrimaryButton label="Create account" onPress={onSignIn} />
            <PrimaryButton label="Cancel" variant="outline" onPress={onClose} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  sheet: {
    borderRadius: Tokens.radius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    alignItems: 'center',
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontSize: Tokens.fontSize.title,
    fontWeight: Tokens.fontWeight.bold,
    textAlign: 'center',
  },
  body: {
    fontSize: Tokens.fontSize.body,
    lineHeight: 22,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
