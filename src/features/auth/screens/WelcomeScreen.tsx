import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/stores/authStore';

export function WelcomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);

  return (
    <ThemedView style={styles.container}>
      <ScreenHeader roundedBottom={false}>
        <View style={styles.brandRow}>
          <View style={[styles.logo, { backgroundColor: theme.primaryForeground }]}>
            <Ionicons name="navigate" size={36} color={theme.primary} />
          </View>
          <ThemedText style={[styles.brandTitle, { color: theme.headerForeground }]}>
            SeatGo
          </ThemedText>
          <ThemedText style={[styles.brandSub, { color: theme.headerMuted }]}>
            Unified urban transport for Skopje
          </ThemedText>
        </View>
      </ScreenHeader>

      <SafeAreaView style={styles.body} edges={['bottom']}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <ThemedText style={styles.cardTitle}>Get started</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.cardBody}>
            Plan trips across taxi, bus, and train. Sign in to pay, buy tickets, and book rides.
          </ThemedText>

          <View style={styles.actions}>
            <PrimaryButton
              label="Continue with account"
              onPress={() => router.push('/auth/sign-in')}
            />
            <PrimaryButton
              label="Continue as guest"
              variant="outline"
              onPress={() => {
                continueAsGuest();
                router.replace('/(tabs)/home');
              }}
            />
          </View>
        </View>

        <ThemedText themeColor="textMuted" style={styles.disclaimer}>
          Guests can view schedules and prices only. Top-ups, tickets, and taxi booking require an
          account.
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  brandRow: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
    gap: Spacing.two,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: Tokens.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: Tokens.fontSize.display,
    fontWeight: Tokens.fontWeight.bold,
    letterSpacing: -1,
  },
  brandSub: {
    textAlign: 'center',
    fontSize: Tokens.fontSize.body,
  },
  body: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: 'flex-end',
    gap: Spacing.three,
  },
  card: {
    borderRadius: Tokens.radius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  cardTitle: {
    fontSize: Tokens.fontSize.title,
    fontWeight: Tokens.fontWeight.bold,
  },
  cardBody: {
    lineHeight: 22,
  },
  actions: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: Tokens.fontSize.caption,
    lineHeight: 20,
    paddingHorizontal: Spacing.two,
  },
});
