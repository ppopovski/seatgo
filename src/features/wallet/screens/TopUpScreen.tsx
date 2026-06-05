import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, ChipRow } from '@/components/ui/Chip';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SeatGoCard } from '@/components/ui/SeatGoCard';
import { Toast } from '@/components/ui/Toast';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontFamily, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useWalletStore } from '@/stores/walletStore';

const AMOUNTS = [5, 10, 20, 50];
const METHODS = ['Card', 'Apple Pay'];

export function TopUpScreen() {
  const router = useRouter();
  const theme = useTheme();
  const topUp = useWalletStore((s) => s.topUp);
  const [amount, setAmount] = useState('10');
  const [method, setMethod] = useState('Card');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;
    topUp(value, method);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.back();
    }, 1500);
  };

  return (
    <ThemedView style={styles.container}>
      <ScreenHeader title="Top up" subtitle="Add funds to your wallet" dark={false} roundedBottom={false} />

      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <SeatGoCard style={styles.card}>
          <ThemedText themeColor="textMuted" style={styles.label}>
            Enter amount (€)
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.border, backgroundColor: theme.accentSoft },
            ]}
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          <ChipRow>
            {AMOUNTS.map((a) => (
              <Chip
                key={a}
                label={`€${a}`}
                selected={amount === String(a)}
                onPress={() => setAmount(String(a))}
              />
            ))}
          </ChipRow>
        </SeatGoCard>

        <ThemedText style={styles.section}>Payment method</ThemedText>
        <ChipRow>
          {METHODS.map((m) => (
            <Chip key={m} label={m} selected={method === m} onPress={() => setMethod(m)} />
          ))}
        </ChipRow>

        <View style={styles.methods}>
          {METHODS.map((m) => (
            <SeatGoCard key={m} style={styles.methodCard}>
              <ThemedText style={[styles.methodTitle, method === m && styles.methodSelected]}>
                {m}
              </ThemedText>
              <ThemedText themeColor="textMuted">Balance: —</ThemedText>
            </SeatGoCard>
          ))}
        </View>

        <PrimaryButton label="Confirm top up" onPress={handleSubmit} style={styles.btn} />
      </SafeAreaView>
      <Toast visible={showToast} message="Top up successful!" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: Spacing.four, gap: Spacing.three },
  card: { gap: Spacing.three },
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
    fontSize: 32,
    fontWeight: '400',
  },
  section: {
    fontWeight: Tokens.fontWeight.bold,
    fontSize: Tokens.fontSize.body,
  },
  methods: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  methodCard: {
    flex: 1,
    gap: Spacing.one,
  },
  methodTitle: {
    fontWeight: Tokens.fontWeight.semibold,
  },
  methodSelected: {
    fontWeight: Tokens.fontWeight.bold,
  },
  btn: { marginTop: 'auto' },
});
