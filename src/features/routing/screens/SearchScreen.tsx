import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchField } from '@/components/ui/SearchField';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, Tokens } from '@/constants/theme';
import { DESTINATIONS } from '@/data/mock/destinations';
import { searchDestinations } from '@/services/routingService';
import { useRoutingStore } from '@/stores/routingStore';
import { SKOPJE_CENTER } from '@/constants/map';
import { useTheme } from '@/hooks/use-theme';

export function SearchScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const recentDestinations = useRoutingStore((s) => s.recentDestinations);
  const setDestination = useRoutingStore((s) => s.setDestination);

  const results = useMemo(() => searchDestinations(query, DESTINATIONS), [query]);

  const handleSelect = async (dest: (typeof DESTINATIONS)[0]) => {
    await setDestination(dest, SKOPJE_CENTER);
    router.back();
  };

  const renderRow = (item: (typeof DESTINATIONS)[0]) => (
    <Pressable
      style={[styles.row, { borderBottomColor: theme.border }]}
      onPress={() => handleSelect(item)}>
      <View style={[styles.iconWrap, { backgroundColor: theme.accentSoft }]}>
        <Ionicons name="location-outline" size={20} color={theme.text} />
      </View>
      <View style={styles.rowText}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText themeColor="textSecondary">{item.subtitle}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <SearchField
          placeholder="Where to?"
          autoFocus
          value={query}
          onChangeText={setQuery}
        />

        {!query && recentDestinations.length > 0 ? (
          <>
            <SectionHeader title="Recent" />
            {recentDestinations.map((dest) => (
              <View key={dest.id}>{renderRow(dest)}</View>
            ))}
          </>
        ) : null}

        <SectionHeader title={query ? 'Results' : 'Popular in Skopje'} />
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderRow(item)}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1, padding: Spacing.four },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontWeight: Tokens.fontWeight.semibold,
    fontSize: Tokens.fontSize.body,
  },
});
