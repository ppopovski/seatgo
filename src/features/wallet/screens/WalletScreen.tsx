import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { requireAuthOrShowModal, useAuthGate } from '@/components/providers/AuthGateProvider';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SeatGoCard } from '@/components/ui/SeatGoCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Shadows, Spacing, Tokens } from '@/constants/theme';
import { formatPrice } from '@/services/transitService';
import { useAuthStore } from '@/stores/authStore';
import { useWalletStore } from '@/stores/walletStore';
import { useTheme } from '@/hooks/use-theme';

export function WalletScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { showSignInModal } = useAuthGate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const balance = useWalletStore((s) => s.balance);
  const transactions = useWalletStore((s) => s.transactions);

  const handleTopUp = () => {
    if (!requireAuthOrShowModal(showSignInModal, isAuthenticated)) return;
    router.push('/wallet/top-up');
  };

  return (
    <ThemedView style={styles.container}>
      <ScreenHeader title="Wallet" subtitle="Manage your SeatGo balance" />

      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View
          style={[
            styles.balanceCard,
            Shadows.lg,
            { backgroundColor: theme.primary, borderColor: theme.primary },
          ]}>
          <ThemedText style={[styles.balanceLabel, { color: theme.headerMuted }]}>
            Available balance
          </ThemedText>
          <ThemedText style={[styles.balance, { color: theme.primaryForeground }]}>
            {formatPrice(balance)}
          </ThemedText>
          <Pressable
            onPress={handleTopUp}
            style={[styles.topUpBtn, { backgroundColor: theme.primaryForeground }]}>
            <ThemedText style={[styles.topUpText, { color: theme.primary }]}>Top up</ThemedText>
          </Pressable>
        </View>

        <SectionHeader title="Recent transactions" />
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.txRow, { borderBottomColor: theme.border }]}>
              <View style={[styles.txIcon, { backgroundColor: theme.accentSoft }]}>
                <Ionicons
                  name={
                    item.type === 'topup'
                      ? 'arrow-down-circle-outline'
                      : item.type === 'ticket'
                        ? 'ticket-outline'
                        : 'car-outline'
                  }
                  size={22}
                  color={theme.text}
                />
              </View>
              <View style={styles.txContent}>
                <ThemedText style={styles.txDesc}>{item.description}</ThemedText>
                <ThemedText themeColor="textMuted" style={styles.txDate}>
                  {new Date(item.timestamp as string | Date).toLocaleString()}
                </ThemedText>
              </View>
              <ThemedText
                style={[
                  styles.txAmount,
                  { color: item.amount >= 0 ? theme.text : theme.textSecondary },
                ]}>
                {item.amount >= 0 ? '+' : ''}
                {formatPrice(Math.abs(item.amount))}
              </ThemedText>
            </View>
          )}
          ListEmptyComponent={
            <ThemedText themeColor="textSecondary">No transactions yet</ThemedText>
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: Spacing.four, paddingTop: Spacing.two },
  balanceCard: {
    borderRadius: Tokens.radius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  balanceLabel: {
    fontSize: Tokens.fontSize.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  balance: {
    fontSize: 40,
    fontWeight: Tokens.fontWeight.bold,
    letterSpacing: -1,
  },
  topUpBtn: {
    marginTop: Spacing.two,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two + 2,
    borderRadius: Tokens.radius.lg,
  },
  topUpText: {
    fontWeight: Tokens.fontWeight.bold,
    fontSize: Tokens.fontSize.body,
  },
  list: {
    paddingBottom: Spacing.four,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: Tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txContent: {
    flex: 1,
    gap: 2,
  },
  txDesc: {
    fontWeight: Tokens.fontWeight.semibold,
  },
  txDate: {
    fontSize: Tokens.fontSize.micro,
  },
  txAmount: {
    fontWeight: Tokens.fontWeight.bold,
    fontSize: Tokens.fontSize.body,
  },
});
