import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Marker, Polyline, PROVIDER_DEFAULT, SeatGoMap } from '@/components/ui/SeatGoMap';
import { useRouter } from 'expo-router';

import { requireAuthOrShowModal, useAuthGate } from '@/components/providers/AuthGateProvider';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { RouteInputCard } from '@/components/ui/RouteInputCard';
import { SeatGoCard } from '@/components/ui/SeatGoCard';
import { StickyBottomBar } from '@/components/ui/StickyBottomBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DEFAULT_REGION, SKOPJE_CENTER } from '@/constants/map';
import { Spacing, Tokens } from '@/constants/theme';
import { TAXI_VEHICLES } from '@/data/mock/taxis';
import { estimateFare, interpolatePolyline } from '@/services/taxiService';
import { formatPrice } from '@/services/transitService';
import { useAuthStore } from '@/stores/authStore';
import { useRoutingStore } from '@/stores/routingStore';
import { useTaxiStore } from '@/stores/taxiStore';
import { useWalletStore } from '@/stores/walletStore';
import { useTheme } from '@/hooks/use-theme';

export function TaxiBookingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { showSignInModal } = useAuthGate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const destination = useRoutingStore((s) => s.destination);
  const status = useTaxiStore((s) => s.status);
  const driver = useTaxiStore((s) => s.driver);
  const etaSeconds = useTaxiStore((s) => s.etaSeconds);
  const routePolyline = useTaxiStore((s) => s.routePolyline);
  const startBooking = useTaxiStore((s) => s.startBooking);
  const confirmBooking = useTaxiStore((s) => s.confirmBooking);
  const cancelRide = useTaxiStore((s) => s.cancelRide);
  const reset = useTaxiStore((s) => s.reset);
  const tickEta = useTaxiStore((s) => s.tickEta);
  const deduct = useWalletStore((s) => s.deduct);

  const [progress, setProgress] = useState(0);
  const [vehicle, setVehicle] = useState('standard');

  useEffect(() => {
    if (destination) {
      startBooking(SKOPJE_CENTER, destination, vehicle);
    }
  }, [destination, startBooking, vehicle]);

  useEffect(() => {
    if (status !== 'assigned') return;
    const interval = setInterval(() => {
      tickEta();
      setProgress((p) => Math.min(1, p + 0.02));
    }, 1000);
    return () => clearInterval(interval);
  }, [status, tickEta]);

  const fare = destination
    ? estimateFare(
        SKOPJE_CENTER,
        destination.coordinates,
        TAXI_VEHICLES.find((v) => v.id === vehicle)?.multiplier ?? 1,
      )
    : null;

  const taxiPosition =
    routePolyline.length > 0 ? interpolatePolyline(routePolyline, progress) : SKOPJE_CENTER;

  const handleConfirm = async () => {
    if (!requireAuthOrShowModal(showSignInModal, isAuthenticated)) return;
    await confirmBooking();
    if (fare) {
      deduct(fare.min, `Taxi to ${destination?.name}`, 'taxi');
    }
  };

  const handleCancel = () => {
    Alert.alert('Cancel ride', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, cancel',
        style: 'destructive',
        onPress: () => {
          cancelRide();
          reset();
          router.back();
        },
      },
    ]);
  };

  const formatEta = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.mapWrap}>
        <SeatGoMap style={StyleSheet.absoluteFill} provider={PROVIDER_DEFAULT} initialRegion={DEFAULT_REGION}>
          {destination ? (
            <Marker coordinate={destination.coordinates} title={destination.name} />
          ) : null}
          {status === 'assigned' ? (
            <>
              <Polyline coordinates={routePolyline} strokeColor="#0A0A0A" strokeWidth={4} />
              <Marker coordinate={taxiPosition} title="Your taxi" pinColor="#333" />
            </>
          ) : null}
        </SeatGoMap>
      </View>

      <ScrollView
        style={[styles.panel, { backgroundColor: theme.background }]}
        contentContainerStyle={styles.panelContent}>
        <RouteInputCard from="Current location" to={destination?.name} />

        {status === 'idle' ? (
          <>
            <ThemedText style={styles.sectionTitle}>Vehicle type</ThemedText>
            <ChipRow>
              {TAXI_VEHICLES.map((v) => (
                <Chip
                  key={v.id}
                  label={v.name}
                  selected={vehicle === v.id}
                  onPress={() => setVehicle(v.id)}
                />
              ))}
            </ChipRow>
            {fare ? (
              <SeatGoCard style={styles.fareCard}>
                <ThemedText themeColor="textMuted" style={styles.fareLabel}>
                  Estimated fare
                </ThemedText>
                <ThemedText style={styles.fare}>
                  {formatPrice(fare.min)} – {formatPrice(fare.max)}
                </ThemedText>
                <ThemedText themeColor="textSecondary">Pickup in ~{fare.etaMinutes} min</ThemedText>
              </SeatGoCard>
            ) : null}
          </>
        ) : null}

        {status === 'searching' ? (
          <SeatGoCard style={styles.fareCard}>
            <ThemedText style={styles.searching}>Searching for a driver…</ThemedText>
          </SeatGoCard>
        ) : null}

        {status === 'assigned' && driver ? (
          <SeatGoCard style={styles.driverCard}>
            <ThemedText themeColor="textMuted" style={styles.fareLabel}>
              Driver assigned
            </ThemedText>
            <ThemedText style={styles.driverName}>{driver.name}</ThemedText>
            <ThemedText themeColor="textSecondary">
              {driver.carModel} · {driver.plateNumber} · ★ {driver.rating}
            </ThemedText>
            <ThemedText style={styles.eta}>Arriving in {formatEta(etaSeconds)}</ThemedText>
          </SeatGoCard>
        ) : null}
      </ScrollView>

      {status === 'idle' ? (
        <StickyBottomBar
          priceLabel="From"
          price={fare ? formatPrice(fare.min) : undefined}
          label="Confirm taxi"
          onPress={handleConfirm}
        />
      ) : null}

      {status === 'assigned' ? (
        <View style={[styles.cancelBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <PrimaryButton label="Cancel ride" variant="outline" onPress={handleCancel} />
        </View>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapWrap: { height: '42%' },
  panel: {
    flex: 1,
    borderTopLeftRadius: Tokens.radius.xl,
    borderTopRightRadius: Tokens.radius.xl,
    marginTop: -Spacing.four,
  },
  panelContent: {
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  sectionTitle: {
    fontSize: Tokens.fontSize.body,
    fontWeight: Tokens.fontWeight.bold,
  },
  fareCard: {
    gap: Spacing.one,
  },
  fareLabel: {
    fontSize: Tokens.fontSize.micro,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fare: {
    fontSize: 32,
    fontWeight: Tokens.fontWeight.bold,
    letterSpacing: -1,
  },
  searching: {
    fontSize: Tokens.fontSize.body,
    fontWeight: Tokens.fontWeight.semibold,
    textAlign: 'center',
    paddingVertical: Spacing.three,
  },
  driverCard: {
    gap: Spacing.one,
  },
  driverName: {
    fontSize: Tokens.fontSize.title,
    fontWeight: Tokens.fontWeight.bold,
  },
  eta: {
    fontSize: 28,
    fontWeight: Tokens.fontWeight.bold,
    marginTop: Spacing.two,
  },
  cancelBar: {
    padding: Spacing.four,
    borderTopWidth: 1,
  },
});
