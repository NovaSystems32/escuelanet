'use client';
import { create } from 'zustand';
import { User, Role } from '@/types';
import { supabase } from '@/lib/supabase/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  initAuth: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (profile) {
        set({
          user: { id: session.user.id, nombre: profile.nombre, email: profile.email, rol: profile.rol as Role },
          isAuthenticated: true,
          loading: false,
        });
        return;
      }
    }
    set({ loading: false });
  },

  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const msg = error.message.includes('Invalid login') ? 'Email o contraseña incorrectos' : error.message;
      return { success: false, error: msg };
    }
    if (!data.user) return { success: false, error: 'Error interno' };

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (!profile) return { success: false, error: 'Perfil no encontrado' };

    set({
      user: { id: data.user.id, nombre: profile.nombre, email: profile.email, rol: profile.rol as Role },
      isAuthenticated: true,
    });
    return { success: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));
