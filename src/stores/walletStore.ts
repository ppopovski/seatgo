import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { WalletTransaction, WalletTransactionType } from '@/types/transit';

type WalletState = {
  balance: number;
  transactions: WalletTransaction[];
  topUp: (amount: number, method: string) => void;
  deduct: (amount: number, description: string, type: WalletTransactionType) => boolean;
};

function makeId(): string {
  return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: 25.0,
      transactions: [
        {
          id: 'tx-welcome',
          type: 'topup',
          amount: 25,
          timestamp: new Date(Date.now() - 86400000 * 3),
          description: 'Welcome bonus',
        },
      ],
      topUp: (amount, method) => {
        if (amount <= 0) return;
        const tx: WalletTransaction = {
          id: makeId(),
          type: 'topup',
          amount,
          timestamp: new Date(),
          description: `Top up via ${method}`,
        };
        set({
          balance: get().balance + amount,
          transactions: [tx, ...get().transactions],
        });
      },
      deduct: (amount, description, type) => {
        if (get().balance < amount) return false;
        const tx: WalletTransaction = {
          id: makeId(),
          type,
          amount: -amount,
          timestamp: new Date(),
          description,
        };
        set({
          balance: get().balance - amount,
          transactions: [tx, ...get().transactions],
        });
        return true;
      },
    }),
    {
      name: 'seatgo-wallet',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        balance: state.balance,
        transactions: state.transactions,
      }),
    },
  ),
);
