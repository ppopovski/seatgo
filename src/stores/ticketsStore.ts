import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { RouteOption, Ticket } from '@/types/transit';

type TicketsState = {
  activeTickets: Ticket[];
  historyTickets: Ticket[];
  purchaseTicket: (route: RouteOption, from: string, to: string) => Ticket;
  moveToHistory: (id: string) => void;
};

function makeId(): string {
  return `ticket-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useTicketsStore = create<TicketsState>()(
  persist(
    (set, get) => ({
      activeTickets: [],
      historyTickets: [],
      purchaseTicket: (route, from, to) => {
        const mode = route.modes.includes('train') && !route.modes.includes('bus')
          ? 'train'
          : 'bus';
        const ticket: Ticket = {
          id: makeId(),
          mode,
          from,
          to,
          timestamp: new Date(),
          price: route.price,
          status: 'active',
          qrCodeData: `SEATGO-${makeId()}`,
          lineNumber: route.steps.find((s) => s.lineNumber)?.lineNumber,
          validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000),
        };
        set({ activeTickets: [ticket, ...get().activeTickets] });
        return ticket;
      },
      moveToHistory: (id) => {
        const ticket = get().activeTickets.find((t) => t.id === id);
        if (!ticket) return;
        set({
          activeTickets: get().activeTickets.filter((t) => t.id !== id),
          historyTickets: [{ ...ticket, status: 'used' }, ...get().historyTickets],
        });
      },
    }),
    {
      name: 'seatgo-tickets',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activeTickets: state.activeTickets,
        historyTickets: state.historyTickets,
      }),
    },
  ),
);
