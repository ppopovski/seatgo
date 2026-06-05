import type { Line } from '@/types/transit';

export const LINES: Line[] = [
  {
    id: 'line-bus-2',
    name: 'Line 2',
    number: 'L-2',
    mode: 'bus',
    stopIds: ['stop-ilinden', 'stop-gtc', 'stop-old-bazaar', 'stop-karposh4'],
    basePrice: 0.6,
  },
  {
    id: 'line-bus-5',
    name: 'Line 5',
    number: 'L-5',
    mode: 'bus',
    stopIds: ['stop-debar-maalo', 'stop-city-mall', 'stop-karposh4', 'stop-taftalidze'],
    basePrice: 0.6,
  },
  {
    id: 'line-bus-12',
    name: 'Line 12',
    number: 'L-12',
    mode: 'bus',
    stopIds: ['stop-aerodrom', 'stop-gtc', 'stop-ilinden', 'stop-central-station'],
    basePrice: 0.8,
  },
  {
    id: 'line-bus-24',
    name: 'Line 24',
    number: 'L-24',
    mode: 'bus',
    stopIds: ['stop-city-mall', 'stop-old-bazaar', 'stop-gtc', 'stop-aerodrom'],
    basePrice: 0.7,
  },
  {
    id: 'line-train-kumanovo',
    name: 'Skopje – Kumanovo',
    number: 'T-1',
    mode: 'train',
    stopIds: ['stop-central-station', 'stop-kumanovo-gate'],
    basePrice: 1.5,
  },
  {
    id: 'line-train-veles',
    name: 'Skopje – Veles',
    number: 'T-3',
    mode: 'train',
    stopIds: ['stop-central-station', 'stop-aerodrom'],
    basePrice: 2.2,
  },
];

export function getLineById(id: string): Line | undefined {
  return LINES.find((l) => l.id === id);
}
