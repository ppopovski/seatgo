import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DepartureRow } from '@/components/ui/DepartureRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getStopById } from '@/data/mock/stops';
import { getLineById } from '@/data/mock/lines';
import { getDeparturesForStop } from '@/services/transitService';
import type { Departure } from '@/types/transit';

export function StopDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const stop = getStopById(id ?? '');
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getDeparturesForStop(id).then((deps) => {
      setDepartures(deps);
      setLoading(false);
    });
  }, [id]);

  if (!stop) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Stop not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScreenHeader
        title={stop.name}
        subtitle={stop.mode === 'train' ? 'Train station · Skopje' : 'Bus stop · Skopje'}
      />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <FlatList
            data={departures}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <ThemedText style={styles.listTitle}>Choose schedule</ThemedText>
            }
            renderItem={({ item }) => (
              <DepartureRow
                departure={item}
                lineNumber={getLineById(item.lineId)?.number}
              />
            )}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  safe: { flex: 1, paddingHorizontal: Spacing.four },
  list: {
    paddingBottom: Spacing.four,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.two,
    marginTop: Spacing.two,
  },
});
