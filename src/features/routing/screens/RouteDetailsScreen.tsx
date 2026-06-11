import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SeatGoMap, Polyline, PROVIDER_DEFAULT } from '@/components/ui/SeatGoMap';

import { requireAuthOrShowModal, useAuthGate } from '@/components/providers/AuthGateProvider';
import { RouteInputCard } from '@/components/ui/RouteInputCard';
import { SeatGoCard } from '@/components/ui/SeatGoCard';
import { StickyBottomBar } from '@/components/ui/StickyBottomBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DEFAULT_REGION } from '@/constants/map';
import { Spacing, Tokens } from '@/constants/theme';
import { formatPrice } from '@/services/transitService';
import { useAuthStore } from '@/stores/authStore';
import { useRoutingStore } from '@/stores/routingStore';
import { useTicketsStore } from '@/stores/ticketsStore';
import { useWalletStore } from '@/stores/walletStore';
import { useTheme } from '@/hooks/use-theme';

export function RouteDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const { showSignInModal } = useAuthGate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const destination = useRoutingStore((s) => s.destination);
  const routeOptions = useRoutingStore((s) => s.routeOptions);
  const purchaseTicket = useTicketsStore((s) => s.purchaseTicket);
  const deduct = useWalletStore((s) => s.deduct);

  const route = routeOptions.find((r) => r.id === id);

  if (!route || !destination) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Route not found</ThemedText>
      </ThemedView>
    );
  }

  const isTaxi = route.modes.includes('taxi') && route.modes.length === 1;

  const handleAction = () => {
    if (!requireAuthOrShowModal(showSignInModal, isAuthenticated)) return;

    if (isTaxi) {
      router.push('/home/taxi');
      return;
    }

    if (deduct(route.price, `Ticket: ${destination.name}`, 'ticket')) {
      const ticket = purchaseTicket(route, 'Current location', destination.name);
      router.push(`/tickets/${ticket.id}`);
    } else {
      Alert.alert('Insufficient balance', 'Top up your wallet to buy this ticket.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.mapWrap}>
        <SeatGoMap
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_DEFAULT}
          initialRegion={{
            ...DEFAULT_REGION,
            latitude: route.polyline[0]?.latitude ?? DEFAULT_REGION.latitude,
            longitude: route.polyline[0]?.longitude ?? DEFAULT_REGION.longitude,
          }}>
          <Polyline coordinates={route.polyline} strokeColor="#0A0A0A" strokeWidth={4} />
        </SeatGoMap>
      </View>

      <View style={[styles.panel, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <RouteInputCard from="Current location" to={destination.name} />

          <View style={styles.statsRow}>
            <View>
              <ThemedText themeColor="textMuted" style={styles.statLabel}>
                Duration
              </ThemedText>
              <ThemedText style={styles.statValue}>{route.totalTimeMinutes} min</ThemedText>
            </View>
            <View>
              <ThemedText themeColor="textMuted" style={styles.statLabel}>
                Arrives
              </ThemedText>
              <ThemedText style={styles.statValue}>
                {route.eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </ThemedText>
            </View>
            <View>
              <ThemedText themeColor="textMuted" style={styles.statLabel}>
                Mode
              </ThemedText>
              <ThemedText style={styles.statValue}>{route.label}</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.stepsTitle}>Step-by-step</ThemedText>
          {route.steps.map((step, index) => (
            <SeatGoCard key={step.id} style={styles.step}>
              <View style={styles.stepRow}>
                <View style={[styles.stepNum, { backgroundColor: theme.primary }]}>
                  <ThemedText style={[styles.stepNumText, { color: theme.primaryForeground }]}>
                    {index + 1}
                  </ThemedText>
                </View>
                <View style={styles.stepContent}>
                  <ThemedText style={styles.stepText}>{step.description}</ThemedText>
                  <ThemedText themeColor="textSecondary">{step.durationMinutes} min</ThemedText>
                </View>
              </View>
            </SeatGoCard>
          ))}
        </ScrollView>
      </View>

      <StickyBottomBar
        priceLabel="Total"
        price={formatPrice(route.price)}
        label={isTaxi ? 'Call taxi' : 'Buy ticket'}
        onPress={handleAction}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mapWrap: { height: '38%' },
  panel: {
    flex: 1,
    borderTopLeftRadius: Tokens.radius.xl,
    borderTopRightRadius: Tokens.radius.xl,
    marginTop: -Spacing.four,
    overflow: 'hidden',
  },
  scroll: {
    padding: Spacing.four,
    paddingBottom: Spacing.two,
    gap: Spacing.three,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  statLabel: {
    fontSize: Tokens.fontSize.micro,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: Tokens.fontSize.body,
    fontWeight: Tokens.fontWeight.bold,
    marginTop: Spacing.one,
  },
  stepsTitle: {
    fontSize: Tokens.fontSize.title,
    fontWeight: Tokens.fontWeight.bold,
  },
  step: {
    paddingVertical: Spacing.two,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'center',
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: Tokens.fontSize.caption,
    fontWeight: Tokens.fontWeight.bold,
  },
  stepContent: {
    flex: 1,
    gap: 2,
  },
  stepText: {
    fontWeight: Tokens.fontWeight.semibold,
  },
});
