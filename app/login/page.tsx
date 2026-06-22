'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

const DEMO_USERS = [
  { email: 'admin@escuelanet.edu', password: 'admin123', role: 'Administrador', icon: '⚙️', color: 'border-[#d8e0ee] hover:border-[#f0a500] hover:bg-[#fef9c3]/30 text-[#1a2444]' },
  { email: 'docente@escuelanet.edu', password: 'docente123', role: 'Docente', icon: '👨‍🏫', color: 'border-[#d8e0ee] hover:border-[#4a90d9] hover:bg-[#e8f0fb] text-[#1a2444]' },
  { email: 'estudiante@escuelanet.edu', password: 'estudiante123', role: 'Estudiante', icon: '🎒', color: 'border-[#d8e0ee] hover:border-[#34a853] hover:bg-[#dcfce7]/50 text-[#1a2444]' },
  { email: 'preceptor@escuelanet.edu', password: 'preceptor123', role: 'Preceptor', icon: '📋', color: 'border-[#d8e0ee] hover:border-[#f59e0b] hover:bg-[#fef3c7]/50 text-[#1a2444]' },
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
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-3/5 bg-[#1a2f5e] flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2d4a8a] rounded-full -translate-y-1/2 translate-x-1/2 opacity-40" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2d4a8a] rounded-full translate-y-1/2 -translate-x-1/2 opacity-30" />
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-[#f0a500] rounded-full opacity-10" />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 bg-[#f0a500] rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-xl">🎓</div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">EscuelaNet</h1>
          <p className="text-[#4a90d9] text-xl font-medium mb-2">Plataforma Educativa Digital</p>
          <p className="text-white/50 text-sm mb-10">Sistema integral de gestión escolar</p>

          <div className="space-y-4 text-left">
            {[
              { icon: '📚', text: 'Gestión completa de aulas virtuales' },
              { icon: '📊', text: 'Calificaciones y seguimiento académico' },
              { icon: '👥', text: 'Panel multi-rol para toda la comunidad' },
              { icon: '🗓️', text: 'Calendario de eventos y actividades' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-4 bg-white/5 rounded-xl px-4 py-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-white/80 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-[#1a2f5e] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">🎓</div>
            <h1 className="text-2xl font-bold text-[#1a2444]">EscuelaNet</h1>
            <p className="text-[#5a6a8a] text-sm">Plataforma Educativa Digital</p>
          </div>

          <h2 className="text-2xl font-bold text-[#1a2444] mb-1">Bienvenido</h2>
          <p className="text-[#5a6a8a] text-sm mb-8">Ingresá tus credenciales para acceder</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#1a2444] mb-1.5">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#d8e0ee] rounded-xl text-sm text-[#1a2444] bg-[#f8f9fc] focus:outline-none focus:ring-2 focus:ring-[#2d4a8a] focus:border-transparent placeholder-[#5a6a8a]/60 transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1a2444] mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#d8e0ee] rounded-xl text-sm text-[#1a2444] bg-[#f8f9fc] focus:outline-none focus:ring-2 focus:ring-[#2d4a8a] focus:border-transparent placeholder-[#5a6a8a]/60 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-[#e53935]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2d4a8a] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#1a2f5e] disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {loading ? 'Ingresando...' : 'Ingresar al sistema'}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-xs text-[#5a6a8a] font-semibold mb-3 text-center uppercase tracking-widest">Accesos de demostración</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  onClick={() => fillCredentials(u.email, u.password)}
                  className={`text-left px-3 py-3 rounded-xl border transition-all duration-200 ${u.color}`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-base">{u.icon}</span>
                    <p className="text-xs font-bold">{u.role}</p>
                  </div>
                  <p className="text-xs text-[#5a6a8a] truncate ml-6">{u.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
