import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteInputCard } from '@/components/ui/RouteInputCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Shadows, Spacing, Tokens } from '@/constants/theme';
import { formatPrice } from '@/services/transitService';
import { useTicketsStore } from '@/stores/ticketsStore';
import { useTheme } from '@/hooks/use-theme';

export function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const activeTickets = useTicketsStore((s) => s.activeTickets);
  const historyTickets = useTicketsStore((s) => s.historyTickets);
  const ticket = [...activeTickets, ...historyTickets].find((t) => t.id === id);
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    if (!ticket) return;
    const update = () => {
      const diff = new Date(ticket.validUntil).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining('Expired');
        return;
      }
      const mins = Math.floor(diff / 60000);
      setRemaining(`${mins} min remaining`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [ticket]);

  if (!ticket) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Ticket not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScreenHeader title="Ticket" subtitle={remaining} />

      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View
          style={[
            styles.ticketCard,
            Shadows.lg,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}>
          <RouteInputCard from={ticket.from} to={ticket.to} />

          <View style={styles.qrRow}>
            <View style={styles.meta}>
              <ThemedText themeColor="textMuted" style={styles.metaLabel}>
                Mode
              </ThemedText>
              <ThemedText style={styles.metaValue}>
                {ticket.mode === 'train' ? 'Train' : 'Bus'}
                {ticket.lineNumber ? ` ${ticket.lineNumber}` : ''}
              </ThemedText>
              <ThemedText themeColor="textMuted" style={[styles.metaLabel, styles.metaSpaced]}>
                Paid
              </ThemedText>
              <ThemedText style={styles.price}>{formatPrice(ticket.price)}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.timestamp}>
                {new Date(ticket.timestamp as string | Date).toLocaleString()}
              </ThemedText>
            </View>
            <View style={styles.qrWrap}>
              <QRCode value={ticket.qrCodeData} size={140} color="#0A0A0A" backgroundColor="#FFFFFF" />
            </View>
          </View>

          <View style={[styles.notch, { backgroundColor: theme.background }]} />
        </View>

        <ThemedText themeColor="textMuted" style={styles.scanHint}>
          Scan this code when boarding bus or train
        </ThemedText>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  safe: {
    flex: 1,
    padding: Spacing.four,
    paddingTop: Spacing.two,
  },
  ticketCard: {
    borderRadius: Tokens.radius.xl,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.four,
    overflow: 'hidden',
  },
  qrRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
  },
  meta: {
    flex: 1,
    gap: Spacing.one,
  },
  metaLabel: {
    fontSize: Tokens.fontSize.micro,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaSpaced: {
    marginTop: Spacing.two,
  },
  metaValue: {
    fontSize: Tokens.fontSize.body,
    fontWeight: Tokens.fontWeight.bold,
  },
  price: {
    fontSize: 28,
    fontWeight: Tokens.fontWeight.bold,
  },
  timestamp: {
    fontSize: Tokens.fontSize.caption,
  },
  qrWrap: {
    padding: Spacing.two,
    backgroundColor: '#FFFFFF',
    borderRadius: Tokens.radius.md,
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  notch: {
    position: 'absolute',
    bottom: -12,
    left: '50%',
    marginLeft: -24,
    width: 48,
    height: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scanHint: {
    textAlign: 'center',
    marginTop: Spacing.four,
    fontSize: Tokens.fontSize.caption,
  },
});
