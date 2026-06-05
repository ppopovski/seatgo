import type { Coordinates } from '@/types/transit';

export const SKOPJE_CENTER: Coordinates = {
  latitude: 41.9981,
  longitude: 21.4254,
};

export const DEFAULT_REGION = {
  ...SKOPJE_CENTER,
  latitudeDelta: 0.06,
  longitudeDelta: 0.06,
};

export const MARKER_COLORS = {
  bus: '#404040',
  train: '#1A1A1A',
  taxi: '#666666',
  user: '#000000',
};
