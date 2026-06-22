import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Role } from '@/types';
import { MOCK_USERS, MOCK_CREDENTIALS } from '@/lib/mockData';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, password: string) => {
        const expectedPassword = MOCK_CREDENTIALS[email];
        if (!expectedPassword) {
          return { success: false, error: 'Usuario no encontrado' };
        }
        if (expectedPassword !== password) {
          return { success: false, error: 'Contraseña incorrecta' };
        }
        const user = MOCK_USERS.find(u => u.email === email);
        if (!user) {
          return { success: false, error: 'Error interno' };
        }
        set({ user, isAuthenticated: true });
        return { success: true };
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'escuelanet-auth',
    }
  )
);
