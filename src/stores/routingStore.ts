import { create } from 'zustand';

import { DESTINATIONS } from '@/data/mock/destinations';
import { getRouteOptions } from '@/services/routingService';
import type { Coordinates, Destination, ModeFilter, RouteOption } from '@/types/transit';

type RoutingState = {
  destination: Destination | null;
  modeFilter: ModeFilter;
  routeOptions: RouteOption[];
  selectedRouteId: string | null;
  recentDestinations: Destination[];
  origin: Coordinates | null;
  loading: boolean;
  setModeFilter: (filter: ModeFilter) => void;
  setDestination: (destination: Destination, origin: Coordinates) => Promise<void>;
  selectRoute: (routeId: string) => void;
  clearDestination: () => void;
  addRecentDestination: (destination: Destination) => void;
  getSelectedRoute: () => RouteOption | undefined;
};

export const useRoutingStore = create<RoutingState>((set, get) => ({
  destination: null,
  modeFilter: 'all',
  routeOptions: [],
  selectedRouteId: null,
  recentDestinations: DESTINATIONS.slice(0, 3),
  origin: null,
  loading: false,
  setModeFilter: (filter) => {
    set({ modeFilter: filter });
    const { destination, origin } = get();
    if (destination && origin) {
      getRouteOptions(origin, destination, filter).then((options) =>
        set({
          routeOptions: options,
          selectedRouteId: options.find((o) => o.isFastest)?.id ?? options[0]?.id ?? null,
        }),
      );
    }
  },
  setDestination: async (destination, origin) => {
    set({ loading: true, destination, origin });
    const options = await getRouteOptions(origin, destination, get().modeFilter);
    set({
      routeOptions: options,
      selectedRouteId: options.find((o) => o.isFastest)?.id ?? options[0]?.id ?? null,
      loading: false,
    });
    get().addRecentDestination(destination);
  },
  selectRoute: (routeId) => set({ selectedRouteId: routeId }),
  clearDestination: () =>
    set({ destination: null, routeOptions: [], selectedRouteId: null }),
  addRecentDestination: (destination) => {
    const current = get().recentDestinations.filter((d) => d.id !== destination.id);
    set({ recentDestinations: [destination, ...current].slice(0, 5) });
  },
  getSelectedRoute: () => {
    const { routeOptions, selectedRouteId } = get();
    return routeOptions.find((o) => o.id === selectedRouteId);
  },
}));
