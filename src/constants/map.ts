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
