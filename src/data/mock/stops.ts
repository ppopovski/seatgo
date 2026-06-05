import type { Stop } from '@/types/transit';

export const STOPS: Stop[] = [
  {
    id: 'stop-central-station',
    name: 'Skopje Central Station',
    coordinates: { latitude: 41.9912, longitude: 21.4263 },
    mode: 'train',
  },
  {
    id: 'stop-ilinden',
    name: 'Ilinden',
    coordinates: { latitude: 41.9965, longitude: 21.4312 },
    mode: 'bus',
  },
  {
    id: 'stop-karposh4',
    name: 'Karposh 4',
    coordinates: { latitude: 42.0012, longitude: 21.4189 },
    mode: 'bus',
  },
  {
    id: 'stop-debar-maalo',
    name: 'Debar Maalo',
    coordinates: { latitude: 41.9948, longitude: 21.4098 },
    mode: 'bus',
  },
  {
    id: 'stop-aerodrom',
    name: 'Aerodrom',
    coordinates: { latitude: 41.9834, longitude: 21.4412 },
    mode: 'bus',
  },
  {
    id: 'stop-gtc',
    name: 'GTC',
    coordinates: { latitude: 41.9978, longitude: 21.4345 },
    mode: 'bus',
  },
  {
    id: 'stop-taftalidze',
    name: 'Taftalidze',
    coordinates: { latitude: 42.0056, longitude: 21.4123 },
    mode: 'bus',
  },
  {
    id: 'stop-kumanovo-gate',
    name: 'Kumanovo Gate',
    coordinates: { latitude: 42.0123, longitude: 21.4289 },
    mode: 'train',
  },
  {
    id: 'stop-old-bazaar',
    name: 'Old Bazaar',
    coordinates: { latitude: 41.9971, longitude: 21.4367 },
    mode: 'bus',
  },
  {
    id: 'stop-city-mall',
    name: 'City Mall',
    coordinates: { latitude: 41.9898, longitude: 21.4156 },
    mode: 'bus',
  },
];

export function getStopById(id: string): Stop | undefined {
  return STOPS.find((s) => s.id === id);
}
