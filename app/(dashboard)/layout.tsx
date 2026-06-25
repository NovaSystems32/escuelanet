'use client';
import Sidebar from '@/components/Sidebar';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, loading: authLoading } = useAuthStore();
  const { dataLoaded } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user)) {
      router.replace('/login');
    }
  }, [isAuthenticated, user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: '#f4f4f6' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#c62828] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: '#888888' }}>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  if (!dataLoaded) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: '#f4f4f6' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1a5276] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium" style={{ color: '#888888' }}>Cargando datos institucionales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#f4f4f6' }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
