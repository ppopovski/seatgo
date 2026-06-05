import type { Destination } from '@/types/transit';

export const DESTINATIONS: Destination[] = [
  {
    id: 'dest-city-mall',
    name: 'City Mall',
    subtitle: 'Lepenec',
    coordinates: { latitude: 41.9898, longitude: 21.4156 },
  },
  {
    id: 'dest-old-bazaar',
    name: 'Old Bazaar',
    subtitle: 'Centar',
    coordinates: { latitude: 41.9971, longitude: 21.4367 },
  },
  {
    id: 'dest-matka',
    name: 'Matka Canyon',
    subtitle: 'Saraj',
    coordinates: { latitude: 41.9612, longitude: 21.3012 },
  },
  {
    id: 'dest-airport',
    name: 'Skopje Airport',
    subtitle: 'Petrovec',
    coordinates: { latitude: 41.9616, longitude: 21.6214 },
  },
  {
    id: 'dest-karposh',
    name: 'Karposh 4',
    subtitle: 'Karposh',
    coordinates: { latitude: 42.0012, longitude: 21.4189 },
  },
  {
    id: 'dest-gtc',
    name: 'GTC Shopping Center',
    subtitle: 'Centar',
    coordinates: { latitude: 41.9978, longitude: 21.4345 },
  },
  {
    id: 'dest-central-station',
    name: 'Central Station',
    subtitle: 'Centar',
    coordinates: { latitude: 41.9912, longitude: 21.4263 },
  },
  {
    id: 'dest-taftalidze',
    name: 'Taftalidze',
    subtitle: 'Karposh',
    coordinates: { latitude: 42.0056, longitude: 21.4123 },
  },
  {
    id: 'dest-aerodrom',
    name: 'Aerodrom',
    subtitle: 'Aerodrom',
    coordinates: { latitude: 41.9834, longitude: 21.4412 },
  },
  {
    id: 'dest-vodno',
    name: 'Vodno Mountain',
    subtitle: 'Kisela Voda',
    coordinates: { latitude: 41.9765, longitude: 21.4012 },
  },
  {
    id: 'dest-kumanovo',
    name: 'Kumanovo',
    subtitle: 'North',
    coordinates: { latitude: 42.1356, longitude: 21.7145 },
  },
  {
    id: 'dest-debar-maalo',
    name: 'Debar Maalo',
    subtitle: 'Centar',
    coordinates: { latitude: 41.9948, longitude: 21.4098 },
  },
];

export function getDestinationById(id: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.id === id);
}
