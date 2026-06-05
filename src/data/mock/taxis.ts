import type { Coordinates, Taxi, TaxiVehicle } from '@/types/transit';
import { SKOPJE_CENTER } from '@/constants/map';

export const TAXI_VEHICLES: TaxiVehicle[] = [
  { id: 'standard', name: 'Standard', multiplier: 1 },
  { id: 'xl', name: 'XL', multiplier: 1.4 },
];

const OFFSETS: Coordinates[] = [
  { latitude: 0.004, longitude: 0.003 },
  { latitude: -0.003, longitude: 0.005 },
  { latitude: 0.006, longitude: -0.004 },
  { latitude: -0.005, longitude: -0.002 },
  { latitude: 0.002, longitude: 0.007 },
  { latitude: -0.007, longitude: 0.001 },
  { latitude: 0.008, longitude: 0.002 },
  { latitude: -0.001, longitude: -0.006 },
];

export function getNearbyTaxis(center: Coordinates = SKOPJE_CENTER): Taxi[] {
  return OFFSETS.map((offset, i) => ({
    id: `taxi-${i + 1}`,
    coordinates: {
      latitude: center.latitude + offset.latitude,
      longitude: center.longitude + offset.longitude,
    },
    heading: (i * 45) % 360,
  }));
}
