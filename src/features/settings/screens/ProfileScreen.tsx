import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SeatGoCard } from '@/components/ui/SeatGoCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontFamily, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/stores/authStore';

export function ProfileScreen() {
  const router = useRouter();
  const theme = useTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isGuest = useAuthStore((s) => s.isGuest);
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [name, setName] = useState(user?.name ?? '');

  if (!isAuthenticated || isGuest) {
    return (
      <ThemedView style={styles.container}>
        <ScreenHeader title="Profile" subtitle="Your account and settings" />
        <SafeAreaView style={styles.guest} edges={['bottom']}>
          <View style={[styles.avatar, { backgroundColor: theme.accentSoft }]}>
            <Ionicons name="person-outline" size={40} color={theme.textMuted} />
          </View>
          <ThemedText themeColor="textSecondary" style={styles.body}>
            Sign in to keep your balance, store QR tickets, and book taxis from the app.
          </ThemedText>
          <PrimaryButton
            label="Sign in or create account"
            onPress={() => router.push('/auth/sign-in')}
          />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScreenHeader
        greeting={`Hi, ${user?.name ?? 'there'}`}
        title="Profile"
        subtitle={user?.email}
      />

      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <SeatGoCard style={styles.card}>
          <ThemedText themeColor="textMuted" style={styles.label}>
            Display name
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.accentSoft },
            ]}
            value={name}
            onChangeText={setName}
          />
        </SeatGoCard>

        <SeatGoCard style={styles.card}>
          <ThemedText style={styles.settingTitle}>Account benefits</ThemedText>
          <ThemedText themeColor="textSecondary">
            Wallet balance, saved tickets, and in-app taxi booking are enabled on your account.
          </ThemedText>
        </SeatGoCard>

        <PrimaryButton
          label="Log out"
          variant="outline"
          onPress={() => {
            signOut();
            router.replace('/welcome');
          }}
          style={styles.logout}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: Spacing.four, gap: Spacing.three },
  guest: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.two,
  },
  card: { gap: Spacing.two },
  label: {
    fontSize: Tokens.fontSize.micro,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: Tokens.radius.lg,
    padding: Spacing.three,
    fontFamily: FontFamily.regular,
    fontSize: Tokens.fontSize.body,
    fontWeight: '400',
  },
  settingTitle: {
    fontWeight: Tokens.fontWeight.bold,
    fontSize: Tokens.fontSize.body,
  },
  logout: { marginTop: 'auto' },
});
