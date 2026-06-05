import MapViewBase, {
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
  type MapViewProps,
} from 'react-native-maps';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MAPS_ENABLED } from '@/constants/mapsConfig';
import { Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export { Marker, Polyline, PROVIDER_DEFAULT };

function MapFallback({ style }: { style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.fallback,
        { backgroundColor: theme.backgroundElement },
        style,
      ]}>
      <View style={[StyleSheet.absoluteFill, styles.grid, { borderColor: theme.border }]} />
      <ThemedText themeColor="textSecondary" style={styles.fallbackTitle}>
        Skopje · map preview
      </ThemedText>
      <ThemedText themeColor="textMuted" style={styles.fallbackBody}>
        Android native builds need a Google Maps API key. Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to
        .env, then run npx expo prebuild --clean and npx expo run:android.
      </ThemedText>
    </View>
  );
}

export function SeatGoMap({ children, style, ...props }: MapViewProps) {
  if (!MAPS_ENABLED) {
    return <MapFallback style={style} />;
  }

  return (
    <MapViewBase style={style} {...props}>
      {children}
    </MapViewBase>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  grid: {
    borderWidth: 1,
    margin: Spacing.four,
    borderRadius: Tokens.radius.lg,
    opacity: 0.35,
  },
  fallbackTitle: {
    fontSize: Tokens.fontSize.title,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  fallbackBody: {
    textAlign: 'center',
    lineHeight: 20,
    fontSize: Tokens.fontSize.caption,
    maxWidth: 280,
  },
});
