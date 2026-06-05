import { getNearbyTaxis, TAXI_VEHICLES } from '@/data/mock/taxis';
import type { Coordinates, Taxi, TaxiDriver, TaxiVehicle } from '@/types/transit';

const MOCK_DELAY_MS = 300;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export async function getTaxis(center: Coordinates): Promise<Taxi[]> {
  await delay(MOCK_DELAY_MS);
  return getNearbyTaxis(center);
}

export function getVehicleOptions(): TaxiVehicle[] {
  return TAXI_VEHICLES;
}

export function estimateFare(
  origin: Coordinates,
  destination: Coordinates,
  vehicleMultiplier = 1,
): { min: number; max: number; etaMinutes: number } {
  const distance = haversineKm(origin, destination);
  const base = 1.5 + distance * 0.85;
  const min = base * vehicleMultiplier;
  const max = min * 1.25;
  const etaMinutes = Math.max(4, Math.round(distance * 3 + 3));
  return { min, max, etaMinutes };
}

export function getMockDriver(): TaxiDriver {
  return {
    name: 'Nikola Petrovski',
    carModel: 'Skoda Octavia',
    plateNumber: 'SK-1234-AB',
    rating: 4.9,
  };
}

export function interpolatePolyline(
  polyline: Coordinates[],
  progress: number,
): Coordinates {
  if (polyline.length === 0) return { latitude: 0, longitude: 0 };
  if (polyline.length === 1) return polyline[0];

  const clamped = Math.max(0, Math.min(1, progress));
  const totalSegments = polyline.length - 1;
  const scaled = clamped * totalSegments;
  const index = Math.floor(scaled);
  const fraction = scaled - index;

  if (index >= totalSegments) return polyline[polyline.length - 1];

  const start = polyline[index];
  const end = polyline[index + 1];
  return {
    latitude: start.latitude + (end.latitude - start.latitude) * fraction,
    longitude: start.longitude + (end.longitude - start.longitude) * fraction,
  };
}
