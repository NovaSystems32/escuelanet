'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

const DEMO_USERS = [
  { email: 'admin@escuelanet.edu', password: 'admin123', role: 'Administrador', color: 'bg-purple-100 text-purple-700' },
  { email: 'docente@escuelanet.edu', password: 'docente123', role: 'Docente', color: 'bg-blue-100 text-blue-700' },
  { email: 'estudiante@escuelanet.edu', password: 'estudiante123', role: 'Estudiante', color: 'bg-green-100 text-green-700' },
  { email: 'preceptor@escuelanet.edu', password: 'preceptor123', role: 'Preceptor', color: 'bg-orange-100 text-orange-700' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace(`/${user.rol}`);
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = login(email, password);
    if (!result.success) {
      setError(result.error || 'Error de inicio de sesión');
    }
    setLoading(false);
  };

  const fillCredentials = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side */}
        <div className="hidden lg:block">
          <div className="mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">E</div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">EscuelaNet</h1>
            <p className="text-lg text-slate-600">Sistema de Gestión Escolar</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-600">
              <span className="text-xl">📚</span>
              <span>Gestión completa de aulas virtuales</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <span className="text-xl">📊</span>
              <span>Calificaciones y seguimiento académico</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <span className="text-xl">👥</span>
              <span>Panel multi-rol para toda la comunidad</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <span className="text-xl">🗓️</span>
              <span>Calendario de eventos y actividades</span>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="lg:hidden text-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">E</div>
            <h1 className="text-2xl font-bold text-slate-900">EscuelaNet</h1>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Iniciar sesión</h2>
          <p className="text-sm text-slate-500 mb-6">Ingresá tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-6">
            <p className="text-xs text-slate-500 font-medium mb-3 text-center uppercase tracking-wide">Accesos de demostración</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  onClick={() => fillCredentials(u.email, u.password)}
                  className={`text-left px-3 py-2 rounded-lg border border-transparent hover:border-slate-200 transition-colors ${u.color}`}
                >
                  <p className="text-xs font-semibold">{u.role}</p>
                  <p className="text-xs opacity-75 truncate">{u.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
