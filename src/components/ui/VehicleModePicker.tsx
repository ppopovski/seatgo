import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { SeatGoCard } from '@/components/ui/SeatGoCard';
import { FontFamily, Shadows, Spacing, Tokens } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ModeFilter } from '@/types/transit';

type VehicleMode = Exclude<ModeFilter, 'all'>;

const MODES: VehicleMode[] = ['bus', 'train', 'taxi'];

const MODE_CONFIG: Record<
  VehicleMode,
  { label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  bus: { label: 'Bus', icon: 'bus-outline' },
  train: { label: 'Train', icon: 'train-outline' },
  taxi: { label: 'Taxi', icon: 'car-outline' },
};

type VehicleModePickerProps = {
  onSelect: (mode: VehicleMode) => void;
  selected?: VehicleMode | null;
};

export function VehicleModePicker({ onSelect, selected }: VehicleModePickerProps) {
  return (
    <SeatGoCard style={styles.card} variant="elevated">
      <View style={styles.row}>
        {MODES.map((mode) => (
          <VehicleModeButton
            key={mode}
            mode={mode}
            selected={selected === mode}
            onPress={() => onSelect(mode)}
          />
        ))}
      </View>
    </SeatGoCard>
  );
}

type VehicleModeButtonProps = {
  mode: VehicleMode;
  selected?: boolean;
  onPress: () => void;
};

function VehicleModeButton({ mode, selected, onPress }: VehicleModeButtonProps) {
  const theme = useTheme();
  const config = MODE_CONFIG[mode];
  const circleBg = selected ? theme.text : theme.primary;
  const iconColor = theme.primaryForeground;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, { opacity: pressed ? 0.85 : 1 }]}>
      <View
        style={[
          styles.circle,
          Shadows.sm,
          { backgroundColor: circleBg, borderColor: selected ? theme.text : 'transparent' },
          selected && styles.circleSelected,
        ]}>
        <Ionicons name={config.icon} size={26} color={iconColor} />
      </View>
      <ThemedText style={[styles.label, { color: theme.text }]}>{config.label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    borderRadius: Tokens.radius.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.two,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  circleSelected: {
    transform: [{ scale: 1.04 }],
  },
  label: {
    width: 64,
    fontFamily: FontFamily.light,
    fontSize: Tokens.fontSize.caption,
    fontWeight: '300',
    textAlign: 'center',
  },
});
