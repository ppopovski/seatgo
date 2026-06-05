import { SKOPJE_CENTER } from '@/constants/map';
import type { Coordinates, Destination, ModeFilter, RouteOption } from '@/types/transit';

const MOCK_DELAY_MS = 500;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function lerpPolyline(from: Coordinates, to: Coordinates, points = 8): Coordinates[] {
  const result: Coordinates[] = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    result.push({
      latitude: from.latitude + (to.latitude - from.latitude) * t,
      longitude: from.longitude + (to.longitude - from.longitude) * t,
    });
  }
  return result;
}

function buildRouteOptions(origin: Coordinates, destination: Destination): RouteOption[] {
  const dest = destination.coordinates;
  const now = new Date();

  const taxiPolyline = lerpPolyline(origin, dest, 12);
  const busPolyline = [
    ...lerpPolyline(origin, { latitude: 41.9978, longitude: 21.4345 }, 4),
    ...lerpPolyline({ latitude: 41.9978, longitude: 21.4345 }, dest, 6),
  ];
  const trainPolyline = [
    ...lerpPolyline(origin, { latitude: 41.9912, longitude: 21.4263 }, 4),
    ...lerpPolyline({ latitude: 41.9912, longitude: 21.4263 }, dest, 6),
  ];
  const mixedPolyline = [
    ...lerpPolyline(origin, { latitude: 41.9978, longitude: 21.4345 }, 3),
    ...lerpPolyline({ latitude: 41.9978, longitude: 21.4345 }, { latitude: 41.9912, longitude: 21.4263 }, 3),
    ...lerpPolyline({ latitude: 41.9912, longitude: 21.4263 }, dest, 4),
  ];

  return [
    {
      id: 'route-taxi',
      label: 'Taxi',
      modes: ['taxi'],
      totalTimeMinutes: 12,
      price: 8.5,
      eta: addMinutes(now, 12),
      isFastest: false,
      polyline: taxiPolyline,
      steps: [
        { id: 's1', type: 'walk', description: 'Walk to pickup point', durationMinutes: 2 },
        { id: 's2', type: 'ride', description: `Taxi to ${destination.name}`, durationMinutes: 10, mode: 'taxi' },
      ],
    },
    {
      id: 'route-bus',
      label: 'Bus only',
      modes: ['bus'],
      totalTimeMinutes: 35,
      price: 0.6,
      eta: addMinutes(now, 35),
      polyline: busPolyline,
      steps: [
        { id: 's1', type: 'walk', description: 'Walk 4 min to GTC stop', durationMinutes: 4 },
        { id: 's2', type: 'board', description: 'Bus L-12, 14 stops', durationMinutes: 22, mode: 'bus', lineNumber: 'L-12' },
        { id: 's3', type: 'walk', description: `Walk 2 min to ${destination.name}`, durationMinutes: 2 },
      ],
    },
    {
      id: 'route-train',
      label: 'Train only',
      modes: ['train'],
      totalTimeMinutes: 30,
      price: 1.5,
      eta: addMinutes(now, 30),
      polyline: trainPolyline,
      steps: [
        { id: 's1', type: 'walk', description: 'Walk 5 min to Central Station', durationMinutes: 5 },
        { id: 's2', type: 'board', description: 'Train T-1, 3 stops', durationMinutes: 18, mode: 'train', lineNumber: 'T-1' },
        { id: 's3', type: 'walk', description: `Walk 3 min to ${destination.name}`, durationMinutes: 3 },
      ],
    },
    {
      id: 'route-mixed',
      label: 'Bus + Train',
      modes: ['bus', 'train'],
      totalTimeMinutes: 28,
      price: 2.1,
      eta: addMinutes(now, 28),
      isFastest: true,
      polyline: mixedPolyline,
      steps: [
        { id: 's1', type: 'walk', description: 'Walk 3 min to GTC stop', durationMinutes: 3 },
        { id: 's2', type: 'board', description: 'Bus L-2, 4 stops (8 min)', durationMinutes: 8, mode: 'bus', lineNumber: 'L-2' },
        { id: 's3', type: 'transfer', description: 'Transfer at Central Station', durationMinutes: 5 },
        { id: 's4', type: 'board', description: 'Train T-3, 2 stops (10 min)', durationMinutes: 10, mode: 'train', lineNumber: 'T-3' },
        { id: 's5', type: 'walk', description: `Walk 2 min to ${destination.name}`, durationMinutes: 2 },
      ],
    },
  ];
}

export async function getRouteOptions(
  origin: Coordinates,
  destination: Destination,
  modeFilter: ModeFilter = 'all',
): Promise<RouteOption[]> {
  await delay(MOCK_DELAY_MS);
  const options = buildRouteOptions(origin, destination);
  if (modeFilter === 'all') return options;
  return options.filter((o) => o.modes.includes(modeFilter as 'bus' | 'train' | 'taxi'));
}

export async function getRouteById(
  routeId: string,
  destination: Destination,
  origin: Coordinates = SKOPJE_CENTER,
): Promise<RouteOption | undefined> {
  const options = await getRouteOptions(origin, destination);
  return options.find((o) => o.id === routeId);
}

export function searchDestinations(query: string, destinations: Destination[]): Destination[] {
  const q = query.trim().toLowerCase();
  if (!q) return destinations.slice(0, 6);
  return destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      (d.subtitle?.toLowerCase().includes(q) ?? false),
  );
}
