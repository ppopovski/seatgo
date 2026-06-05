import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontFamily, Shadows, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/stores/authStore';

export function SignInScreen() {
  const router = useRouter();
  const theme = useTheme();
  const signIn = useAuthStore((s) => s.signIn);
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password.');
      return;
    }
    signIn(email.trim(), password);
    router.replace('/(tabs)/home');
  };

  return (
    <ThemedView style={styles.container}>
      <ScreenHeader title="Welcome back" subtitle="Sign in to unlock your wallet and tickets" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View
            style={[
              styles.formCard,
              Shadows.lg,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}>
            <SegmentControl
              options={[
                { value: 'login' as const, label: 'Login' },
                { value: 'signup' as const, label: 'Sign up' },
              ]}
              value={tab}
              onChange={setTab}
            />

            <ThemedText themeColor="textSecondary" style={styles.hint}>
              {tab === 'login'
                ? 'Use any email and password — auth is mocked for demo.'
                : 'Sign up uses the same demo flow as login.'}
            </ThemedText>

            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.accentSoft },
              ]}
              placeholder="Email"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={[
                styles.input,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.accentSoft },
              ]}
              placeholder="Password"
              placeholderTextColor={theme.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

            <PrimaryButton
              label={tab === 'login' ? 'Sign in' : 'Create account'}
              onPress={handleSignIn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SafeAreaView edges={['bottom']}>
        <PrimaryButton label="Back" variant="ghost" onPress={() => router.back()} />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  scroll: {
    padding: Spacing.four,
    paddingTop: Spacing.three,
  },
  formCard: {
    marginTop: -Spacing.four,
    borderRadius: Tokens.radius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  hint: {
    fontSize: Tokens.fontSize.caption,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: Tokens.radius.lg,
    padding: Spacing.three,
    fontFamily: FontFamily.regular,
    fontSize: Tokens.fontSize.body,
    fontWeight: '400',
  },
  error: {
    color: '#666',
    fontSize: Tokens.fontSize.caption,
  },
});
