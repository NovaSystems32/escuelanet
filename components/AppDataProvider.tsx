'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initAuth } = useAuthStore();
  const { loadAllData, dataLoaded } = useAppStore();

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated && !dataLoaded) {
      loadAllData();
    }
  }, [isAuthenticated, dataLoaded]);

  return <>{children}</>;
}
