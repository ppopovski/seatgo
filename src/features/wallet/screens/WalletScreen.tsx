import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { requireAuthOrShowModal, useAuthGate } from '@/components/providers/AuthGateProvider';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SeatGoCard } from '@/components/ui/SeatGoCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Shadows, Spacing, Tokens } from '@/constants/theme';
import { formatPrice } from '@/services/transitService';
import { useAuthStore } from '@/stores/authStore';
import { useTicketsStore } from '@/stores/ticketsStore';
import { useWalletStore } from '@/stores/walletStore';
import { useTheme } from '@/hooks/use-theme';

export function WalletScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { showSignInModal } = useAuthGate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isGuest = useAuthStore((s) => s.isGuest);
  const balance = useWalletStore((s) => s.balance);
  const transactions = useWalletStore((s) => s.transactions);
  const activeTickets = useTicketsStore((s) => s.activeTickets);
  const historyTickets = useTicketsStore((s) => s.historyTickets);
  const [segment, setSegment] = useState<'active' | 'history'>('active');

  const tickets = segment === 'active' ? activeTickets : historyTickets;

  const handleTopUp = () => {
    if (!requireAuthOrShowModal(showSignInModal, isAuthenticated)) return;
    router.push('/wallet/top-up');
  };

  if (!isAuthenticated || isGuest) {
    return (
      <ThemedView style={styles.container}>
        <ScreenHeader title="Wallet" subtitle="Sign in to view your wallet" />
        <SafeAreaView style={styles.guest} edges={['bottom']}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.accentSoft }]}>
            <Ionicons name="wallet-outline" size={48} color={theme.textMuted} />
          </View>
          <ThemedText style={styles.emptyTitle}>Sign in to view your wallet</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.emptyBody}>
            Create an account to see your balance, saved tickets, and recent activity in one place.
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
      <ScreenHeader title="Wallet" subtitle="Balance, tickets, and activity" />

      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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

          <SectionHeader title="Tickets" />
          <SegmentControl
            options={[
              { value: 'active' as const, label: 'Active' },
              { value: 'history' as const, label: 'History' },
            ]}
            value={segment}
            onChange={setSegment}
          />
          <View style={styles.ticketList}>
            {tickets.length === 0 ? (
              <ThemedText themeColor="textSecondary">
                No {segment} tickets yet. Plan a route on Home and tap Buy ticket.
              </ThemedText>
            ) : (
              tickets.map((ticket) => (
                <SeatGoCard
                  key={ticket.id}
                  onPress={() => router.push(`/tickets/${ticket.id}`)}
                  style={styles.ticketCard}>
                  <View style={styles.ticketTop}>
                    <View style={[styles.modePill, { backgroundColor: theme.primary }]}>
                      <ThemedText style={[styles.modeText, { color: theme.primaryForeground }]}>
                        {ticket.mode === 'train' ? 'Train' : 'Bus'}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.ticketPrice}>{formatPrice(ticket.price)}</ThemedText>
                  </View>
                  <ThemedText style={styles.ticketRoute}>
                    {ticket.from} to {ticket.to}
                  </ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.ticketMeta}>
                    {ticket.lineNumber ? `${ticket.lineNumber} · ` : ''}
                    {segment === 'active'
                      ? `Valid until ${new Date(ticket.validUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : new Date(ticket.timestamp as string | Date).toLocaleDateString()}
                  </ThemedText>
                </SeatGoCard>
              ))
            )}
          </View>

          <SectionHeader title="Recent transactions" />
          <View style={styles.list}>
            {transactions.length === 0 ? (
              <ThemedText themeColor="textSecondary">No transactions yet</ThemedText>
            ) : (
              transactions.map((item) => (
                <View key={item.id} style={[styles.txRow, { borderBottomColor: theme.border }]}>
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
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  content: { padding: Spacing.four, paddingTop: Spacing.two, paddingBottom: Spacing.four },
  guest: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
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
  ticketList: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  ticketCard: {
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  ticketTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modePill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Tokens.radius.pill,
  },
  modeText: {
    fontSize: Tokens.fontSize.micro,
    fontWeight: Tokens.fontWeight.bold,
  },
  ticketRoute: {
    fontWeight: Tokens.fontWeight.bold,
    fontSize: Tokens.fontSize.body,
  },
  ticketPrice: {
    fontWeight: Tokens.fontWeight.bold,
    fontSize: Tokens.fontSize.title,
  },
  ticketMeta: {
    fontSize: Tokens.fontSize.caption,
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
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: Tokens.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: Tokens.fontSize.title,
    fontWeight: Tokens.fontWeight.bold,
    textAlign: 'center',
  },
  emptyBody: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.four,
  },
});
