import { LINES, getLineById } from '@/data/mock/lines';
import { STOPS } from '@/data/mock/stops';
import type { Coordinates, Departure, ModeFilter, Stop } from '@/types/transit';

const MOCK_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function generateDeparturesForStop(stopId: string): Departure[] {
  const stop = STOPS.find((s) => s.id === stopId);
  if (!stop) return [];

  const relevantLines = LINES.filter(
    (l) => l.mode === stop.mode && l.stopIds.includes(stopId),
  );

  const now = new Date();
  const offsets = [3, 8, 15, 22, 35];

  return relevantLines.flatMap((line, lineIndex) =>
    offsets.slice(0, 3).map((offset, i) => ({
      id: `dep-${stopId}-${line.id}-${i}`,
      lineId: line.id,
      stopId,
      time: addMinutes(now, offset + lineIndex),
      destination: line.name.includes('Kumanovo')
        ? 'Kumanovo'
        : line.name.includes('Veles')
          ? 'Veles'
          : STOPS.find((s) => s.id === line.stopIds[line.stopIds.length - 1])?.name ?? 'Centar',
      price: line.basePrice,
    })),
  );
}

export async function getNearbyStops(
  _center: Coordinates,
  modeFilter: ModeFilter = 'all',
): Promise<Stop[]> {
  await delay(MOCK_DELAY_MS);
  if (modeFilter === 'all') return STOPS;
  if (modeFilter === 'taxi') return [];
  return STOPS.filter((s) => s.mode === modeFilter);
}

export async function getDeparturesForStop(stopId: string): Promise<Departure[]> {
  await delay(MOCK_DELAY_MS);
  return generateDeparturesForStop(stopId).sort(
    (a, b) => a.time.getTime() - b.time.getTime(),
  );
}

export async function getUpcomingDepartures(
  center: Coordinates,
  limit = 5,
): Promise<(Departure & { stopName: string; lineNumber: string })[]> {
  await delay(MOCK_DELAY_MS);
  const nearby = await getNearbyStops(center);
  const all = nearby.flatMap((stop) => {
    const deps = generateDeparturesForStop(stop.id);
    return deps.map((d) => ({
      ...d,
      stopName: stop.name,
      lineNumber: getLineById(d.lineId)?.number ?? '',
    }));
  });
  return all.sort((a, b) => a.time.getTime() - b.time.getTime()).slice(0, limit);
}

export function formatDepartureTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatPrice(price: number): string {
  return `€${price.toFixed(2)}`;
}
