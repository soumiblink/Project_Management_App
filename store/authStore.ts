import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUserResponse } from '@/types/user';

interface AuthState {
  user: IUserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setAuth: (user: IUserResponse, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (user: Partial<IUserResponse>) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isInitialized: false,
      setAuth: (user, accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        set({ user, accessToken, refreshToken, isAuthenticated: true, isInitialized: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('auth-storage');
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isInitialized: true });
      },
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      initialize: () => set({ isInitialized: true }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Mark as initialized after rehydration
        if (state) {
          state.isInitialized = true;
        }
      },
    }
  )
);
