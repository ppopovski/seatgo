import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SeatGoCard } from '@/components/ui/SeatGoCard';
import { SegmentControl } from '@/components/ui/SegmentControl';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, Tokens } from '@/constants/theme';
import { formatPrice } from '@/services/transitService';
import { useAuthStore } from '@/stores/authStore';
import { useTicketsStore } from '@/stores/ticketsStore';
import { useTheme } from '@/hooks/use-theme';

export function TicketsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isGuest = useAuthStore((s) => s.isGuest);
  const activeTickets = useTicketsStore((s) => s.activeTickets);
  const historyTickets = useTicketsStore((s) => s.historyTickets);
  const [segment, setSegment] = useState<'active' | 'history'>('active');

  const tickets = segment === 'active' ? activeTickets : historyTickets;

  if (!isAuthenticated || isGuest) {
    return (
      <ThemedView style={styles.container}>
        <ScreenHeader title="Tickets" subtitle="Sign in to store QR passes" />
        <SafeAreaView style={styles.empty} edges={['bottom']}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.accentSoft }]}>
            <Ionicons name="qr-code-outline" size={48} color={theme.textMuted} />
          </View>
          <ThemedText themeColor="textSecondary" style={styles.emptyBody}>
            Purchase a route ticket from Home and your QR pass will appear here.
          </ThemedText>
          <PrimaryButton
            label="Sign in to buy tickets"
            onPress={() => router.push('/auth/sign-in')}
          />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScreenHeader title="Tickets" subtitle="Scan at boarding" />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <SegmentControl
          options={[
            { value: 'active' as const, label: 'Active' },
            { value: 'history' as const, label: 'History' },
          ]}
          value={segment}
          onChange={setSegment}
        />

        {tickets.length === 0 ? (
          <View style={styles.emptyList}>
            <ThemedText themeColor="textSecondary">
              No {segment} tickets yet. Plan a route on Home and tap Buy ticket.
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={tickets}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <SeatGoCard
                onPress={() => router.push(`/tickets/${item.id}`)}
                style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.modePill, { backgroundColor: theme.primary }]}>
                    <ThemedText style={[styles.modeText, { color: theme.primaryForeground }]}>
                      {item.mode === 'train' ? 'Train' : 'Bus'}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.price}>{formatPrice(item.price)}</ThemedText>
                </View>
                <ThemedText style={styles.route}>
                  {item.from} → {item.to}
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.meta}>
                  {item.lineNumber ? `${item.lineNumber} · ` : ''}
                  {segment === 'active'
                    ? `Valid until ${new Date(item.validUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : new Date(item.timestamp).toLocaleDateString()}
                </ThemedText>
              </SeatGoCard>
            )}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: Spacing.four, paddingTop: Spacing.two },
  list: { paddingTop: Spacing.four, paddingBottom: Spacing.four },
  card: { marginBottom: Spacing.three, gap: Spacing.two },
  cardTop: {
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
  route: {
    fontWeight: Tokens.fontWeight.bold,
    fontSize: Tokens.fontSize.body,
  },
  price: {
    fontWeight: Tokens.fontWeight.bold,
    fontSize: Tokens.fontSize.title,
  },
  meta: {
    fontSize: Tokens.fontSize.caption,
  },
  empty: {
    flex: 1,
    padding: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: Tokens.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBody: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.four,
  },
  emptyList: { marginTop: Spacing.five },
});
