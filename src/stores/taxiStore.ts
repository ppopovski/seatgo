import { create } from 'zustand';

import { getMockDriver } from '@/services/taxiService';
import type { Coordinates, Destination, TaxiBookingStatus, TaxiDriver } from '@/types/transit';

type TaxiState = {
  status: TaxiBookingStatus;
  pickup: Coordinates | null;
  dropoff: Destination | null;
  vehicleType: string;
  driver: TaxiDriver | null;
  etaSeconds: number;
  routePolyline: Coordinates[];
  startBooking: (pickup: Coordinates, dropoff: Destination, vehicleType: string) => void;
  confirmBooking: () => Promise<void>;
  cancelRide: () => void;
  reset: () => void;
  tickEta: () => void;
};

export const useTaxiStore = create<TaxiState>((set, get) => ({
  status: 'idle',
  pickup: null,
  dropoff: null,
  vehicleType: 'standard',
  driver: null,
  etaSeconds: 0,
  routePolyline: [],
  startBooking: (pickup, dropoff, vehicleType) =>
    set({ pickup, dropoff, vehicleType, status: 'idle', driver: null, routePolyline: [] }),
  confirmBooking: async () => {
    set({ status: 'searching' });
    await new Promise((r) => setTimeout(r, 2000));
    const { pickup, dropoff } = get();
    if (!pickup || !dropoff) return;
    const polyline = [
      pickup,
      {
        latitude: (pickup.latitude + dropoff.coordinates.latitude) / 2,
        longitude: (pickup.longitude + dropoff.coordinates.longitude) / 2,
      },
      dropoff.coordinates,
    ];
    set({
      status: 'assigned',
      driver: getMockDriver(),
      etaSeconds: 300,
      routePolyline: polyline,
    });
  },
  cancelRide: () => set({ status: 'cancelled', driver: null, etaSeconds: 0 }),
  reset: () =>
    set({
      status: 'idle',
      pickup: null,
      dropoff: null,
      driver: null,
      etaSeconds: 0,
      routePolyline: [],
    }),
  tickEta: () => {
    const { etaSeconds } = get();
    if (etaSeconds > 0) set({ etaSeconds: etaSeconds - 1 });
  },
}));
