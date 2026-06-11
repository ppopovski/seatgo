import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { User } from '@/types/transit';

type AuthState = {
  isAuthenticated: boolean;
  isGuest: boolean;
  hasOnboarded: boolean;
  user: User | null;
  hydrated: boolean;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  continueAsGuest: () => void;
  setHasOnboarded: (value: boolean) => void;
  setHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isGuest: false,
      hasOnboarded: false,
      user: null,
      hydrated: false,
      signIn: (email, _password) => {
        const name = email.split('@')[0] || 'User';
        set({
          isAuthenticated: true,
          isGuest: false,
          hasOnboarded: true,
          user: { name: name.charAt(0).toUpperCase() + name.slice(1), email },
        });
      },
      signOut: () =>
        set({
          isAuthenticated: false,
          isGuest: false,
          user: null,
        }),
      continueAsGuest: () =>
        set({
          isAuthenticated: false,
          isGuest: true,
          hasOnboarded: true,
          user: null,
        }),
      setHasOnboarded: (value) => set({ hasOnboarded: value }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: 'seatgo-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest,
        hasOnboarded: state.hasOnboarded,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
