import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, Platform } from 'react-native';
import { Marker, Polyline, PROVIDER_DEFAULT, SeatGoMap } from '@/components/ui/SeatGoMap';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DepartureRow } from '@/components/ui/DepartureRow';
import { DestinationListCard } from '@/components/ui/DestinationListCard';
import { HomeTopBar } from '@/components/ui/HomeTopBar';
import { RouteInputCard } from '@/components/ui/RouteInputCard';
import { RouteOptionCard } from '@/components/ui/RouteOptionCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchField } from '@/components/ui/SearchField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SeatGoCard } from '@/components/ui/SeatGoCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { VehicleModePicker } from '@/components/ui/VehicleModePicker';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DEFAULT_REGION, SKOPJE_CENTER } from '@/constants/map';
import { Spacing, Tokens } from '@/constants/theme';
import { DESTINATIONS } from '@/data/mock/destinations';
import { estimateFare, getTaxis } from '@/services/taxiService';
import {
  formatPrice,
  getDeparturesForStop,
  getNearbyStops,
  getUpcomingDepartures,
} from '@/services/transitService';
import { useAuthStore } from '@/stores/authStore';
import { useRoutingStore } from '@/stores/routingStore';
import type { Coordinates, Departure, ModeFilter, Stop, Taxi } from '@/types/transit';
import { useTheme } from '@/hooks/use-theme';

type VehicleMode = Exclude<ModeFilter, 'all'>;

type SelectedMarker =
  | { type: 'stop'; stop: Stop; departures: Departure[] }
  | { type: 'taxi'; taxi: Taxi; fare?: { min: number; max: number; etaMinutes: number } };

export function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const setModeFilter = useRoutingStore((s) => s.setModeFilter);
  const setDestination = useRoutingStore((s) => s.setDestination);
  const recentDestinations = useRoutingStore((s) => s.recentDestinations);
  const destination = useRoutingStore((s) => s.destination);
  const routeOptions = useRoutingStore((s) => s.routeOptions);
  const loading = useRoutingStore((s) => s.loading);

  const [vehicleMode, setVehicleMode] = useState<VehicleMode | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates>(SKOPJE_CENTER);
  const [stops, setStops] = useState<Stop[]>([]);
  const [taxis, setTaxis] = useState<Taxi[]>([]);
  const [upcoming, setUpcoming] = useState<
    (Departure & { stopName: string; lineNumber: string })[]
  >([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [selected, setSelected] = useState<SelectedMarker | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['24%', '58%', '90%'], []);

  const displayName = user?.name ?? (isGuest ? 'Guest' : 'there');

  const handleSelectVehicle = (mode: VehicleMode) => {
    setModeFilter(mode);
    setVehicleMode(mode);
  };

  const handleRecentDestination = (destId: string) => {
    const dest = DESTINATIONS.find((d) => d.id === destId);
    if (dest) {
      void setDestination(dest, SKOPJE_CENTER);
    }
  };

  const handleChangeVehicle = () => {
    setVehicleMode(null);
    setSelected(null);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const loadData = useCallback(async () => {
    if (!vehicleMode) return;

    setDataLoading(true);
    const [nearbyStops, nearbyTaxis, deps] = await Promise.all([
      getNearbyStops(userLocation, vehicleMode),
      vehicleMode === 'taxi' ? getTaxis(userLocation) : Promise.resolve([]),
      getUpcomingDepartures(userLocation, 5),
    ]);
    setStops(nearbyStops);
    setTaxis(nearbyTaxis);
    setUpcoming(deps);
    setDataLoading(false);
  }, [userLocation, vehicleMode]);

  useEffect(() => {
    if (!vehicleMode) return;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    })();
  }, [vehicleMode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStopPress = async (stop: Stop) => {
    const departures = await getDeparturesForStop(stop.id);
    setSelected({ type: 'stop', stop, departures });
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleTaxiPress = (taxi: Taxi) => {
    const fare = destination
      ? estimateFare(userLocation, destination.coordinates)
      : undefined;
    setSelected({ type: 'taxi', taxi, fare });
    bottomSheetRef.current?.snapToIndex(1);
  };

  const showStops = vehicleMode === 'bus' || vehicleMode === 'train';
  const showTaxis = vehicleMode === 'taxi';
  const filteredStops = stops.filter((s) => s.mode === vehicleMode);

  if (!vehicleMode) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={[
            styles.landingContent,
            { paddingTop: insets.top + Spacing.two, paddingBottom: insets.bottom + Spacing.six },
          ]}
          showsVerticalScrollIndicator={false}>
          <HomeTopBar userName={user?.name} onSearchPress={() => router.push('/home/search')} />

          <ThemedText
            style={styles.hello}
            numberOfLines={2}
            {...(Platform.OS === 'android' ? { includeFontPadding: false } : {})}>
            Hello, {displayName}
          </ThemedText>

          <View style={styles.vehicleSection}>
            <ThemedText style={styles.prompt}>Where to?</ThemedText>
            <VehicleModePicker onSelect={handleSelectVehicle} />
          </View>

          <SectionHeader title="Recent searches" />
          <View style={styles.horizontalScroll}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}>
              {recentDestinations.map((dest) => (
                <DestinationListCard
                  key={dest.id}
                  title={dest.name}
                  subtitle={dest.subtitle}
                  icon="business-outline"
                  onPress={() => handleRecentDestination(dest.id)}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <SeatGoMap
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_DEFAULT}
        initialRegion={{ ...DEFAULT_REGION, ...userLocation }}
        showsUserLocation
        showsMyLocationButton={false}>
        {showStops &&
          filteredStops.map((stop) => (
            <Marker
              key={stop.id}
              coordinate={stop.coordinates}
              title={stop.name}
              pinColor={stop.mode === 'train' ? '#1A1A1A' : '#666666'}
              onPress={() => handleStopPress(stop)}
            />
          ))}
        {showTaxis &&
          taxis.map((taxi) => (
            <Marker
              key={taxi.id}
              coordinate={taxi.coordinates}
              title="Taxi"
              pinColor="#333333"
              onPress={() => handleTaxiPress(taxi)}
            />
          ))}
        {destination && routeOptions[0] && (
          <Polyline
            coordinates={routeOptions[0].polyline}
            strokeColor="#0A0A0A"
            strokeWidth={4}
          />
        )}
      </SeatGoMap>

      <ScreenHeader
        greeting={`Hello, ${displayName}`}
        subtitle="Where will you go?"
        style={styles.headerOverlay}
        dark={false}
        roundedBottom={false}>
        <Pressable onPress={handleChangeVehicle} style={styles.changeVehicle}>
          <ThemedText themeColor="textSecondary">
            ← Change vehicle ({vehicleMode.charAt(0).toUpperCase() + vehicleMode.slice(1)})
          </ThemedText>
        </Pressable>
        <SearchField
          editable={false}
          placeholder="Where to?"
          displayValue={destination?.name}
          onPress={() => router.push('/home/search')}
        />
        {destination ? (
          <RouteInputCard from="Current location" to={destination.name} />
        ) : null}
      </ScreenHeader>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: theme.surface,
          borderTopLeftRadius: Tokens.radius.xl,
          borderTopRightRadius: Tokens.radius.xl,
        }}
        handleIndicatorStyle={{ backgroundColor: theme.border, width: 48 }}>
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          {selected ? (
            <Animated.View entering={FadeIn.duration(Tokens.motion.markerFadeDuration)}>
              <View style={styles.sheetHeaderRow}>
                <ThemedText style={styles.sheetTitle}>
                  {selected.type === 'stop' ? selected.stop.name : 'Nearby taxi'}
                </ThemedText>
                <Pressable onPress={() => setSelected(null)}>
                  <ThemedText themeColor="textSecondary">Close</ThemedText>
                </Pressable>
              </View>
              {selected.type === 'stop' ? (
                <>
                  {selected.departures.slice(0, 5).map((d) => (
                    <DepartureRow key={d.id} departure={d} />
                  ))}
                  <PrimaryButton
                    label="View full schedule"
                    variant="secondary"
                    onPress={() => router.push(`/home/stop/${selected.stop.id}`)}
                    style={styles.sheetBtn}
                  />
                </>
              ) : (
                <>
                  <ThemedText themeColor="textSecondary">
                    ETA ~{selected.fare?.etaMinutes ?? 5} min
                  </ThemedText>
                  {selected.fare && destination ? (
                    <ThemedText style={styles.priceLarge}>
                      {formatPrice(selected.fare.min)} – {formatPrice(selected.fare.max)}
                    </ThemedText>
                  ) : (
                    <ThemedText themeColor="textMuted" style={styles.hint}>
                      Search a destination for a fare estimate
                    </ThemedText>
                  )}
                </>
              )}
            </Animated.View>
          ) : (
            <>
              <SectionHeader title="Next departures" />
              {dataLoading || loading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                upcoming.slice(0, 3).map((d) => <DepartureRow key={d.id} departure={d} />)
              )}

              {destination && routeOptions.length > 0 ? (
                <>
                  <SectionHeader title="Route options" />
                  {routeOptions.map((option) => (
                    <RouteOptionCard
                      key={option.id}
                      option={option}
                      onPress={() => router.push(`/home/route/${option.id}`)}
                      onDetails={() => router.push(`/home/route/${option.id}`)}
                    />
                  ))}
                </>
              ) : null}

              {showStops ? (
                <>
                  <SectionHeader title="Nearby stops" />
                  {filteredStops.map((stop) => (
                    <SeatGoCard
                      key={stop.id}
                      onPress={() => handleStopPress(stop)}
                      style={styles.stopCard}>
                      <ThemedText style={styles.stopName}>{stop.name}</ThemedText>
                      <ThemedText themeColor="textSecondary">
                        {stop.mode === 'train' ? 'Train station' : 'Bus stop'}
                      </ThemedText>
                    </SeatGoCard>
                  ))}
                </>
              ) : null}
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  landingContent: {
    paddingHorizontal: Spacing.four,
  },
  hello: {
    fontSize: Tokens.fontSize.display,
    fontWeight: Tokens.fontWeight.bold,
    letterSpacing: -0.5,
    lineHeight: 44,
    marginBottom: Spacing.four,
  },
  vehicleSection: {
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  prompt: {
    fontSize: Tokens.fontSize.title,
    fontWeight: Tokens.fontWeight.bold,
    lineHeight: 28,
  },
  horizontalScroll: {
    marginHorizontal: -Spacing.four,
  },
  horizontalList: {
    gap: Spacing.two,
    paddingLeft: Spacing.four,
    marginBottom: Spacing.two,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  changeVehicle: {
    alignSelf: 'flex-start',
    marginBottom: Spacing.one,
  },
  sheetContent: {
    padding: Spacing.four,
    paddingBottom: Spacing.seven,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  sheetTitle: {
    fontSize: Tokens.fontSize.title,
    fontWeight: Tokens.fontWeight.bold,
  },
  stopCard: {
    marginBottom: Spacing.two,
  },
  stopName: {
    fontWeight: Tokens.fontWeight.semibold,
    fontSize: Tokens.fontSize.body,
  },
  sheetBtn: {
    marginTop: Spacing.two,
  },
  priceLarge: {
    fontSize: 28,
    fontWeight: Tokens.fontWeight.bold,
    marginTop: Spacing.two,
  },
  hint: {
    marginTop: Spacing.two,
    fontSize: Tokens.fontSize.caption,
  },
});
