'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

const DEMO_USERS = [
  { email: 'admin@escuelanet.edu', password: 'admin123', role: 'Administrador', icon: '⚙️',
    color: 'border-[#e8e8ec] hover:border-[#c9a227] hover:bg-[#fef9c3]/30 text-[#111111]' },
  { email: 'docente@escuelanet.edu', password: 'docente123', role: 'Docente', icon: '👨‍🏫',
    color: 'border-[#e8e8ec] hover:border-[#1a5276] hover:bg-[#d6eaf8]/40 text-[#111111]' },
  { email: 'estudiante@escuelanet.edu', password: 'estudiante123', role: 'Estudiante', icon: '🎒',
    color: 'border-[#e8e8ec] hover:border-[#27ae60] hover:bg-[#d4edda]/50 text-[#111111]' },
  { email: 'preceptor@escuelanet.edu', password: 'preceptor123', role: 'Preceptor', icon: '📋',
    color: 'border-[#e8e8ec] hover:border-[#c9a227] hover:bg-[#fef3c7]/50 text-[#111111]' },
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
      {/* Left panel — institutional branding */}
      <div
        className="hidden lg:flex lg:w-3/5 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ backgroundColor: '#1a5276' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20" style={{ backgroundColor: '#c62828' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full translate-y-1/2 -translate-x-1/2 opacity-15" style={{ backgroundColor: '#c9a227' }} />
        <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: '#c9a227' }} />

        <div className="relative z-10 text-center max-w-md">
          <img
            src="https://novasystems32.github.io/Cajal-Web/logo.jpeg"
            alt="Instituto Santiago Ramón y Cajal"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-6 shadow-2xl"
            style={{ border: '4px solid #c9a227' }}
          />
          <h1
            className="text-4xl font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
          >
            Instituto Santiago Ramón y Cajal
          </h1>
          <p className="text-xl italic mb-4" style={{ color: '#c9a227', fontFamily: "'Inter', sans-serif" }}>
            &ldquo;Educamos hoy, formamos el mañana&rdquo;
          </p>
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-10" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            Escuela Precursora 2026
          </div>

          <div className="space-y-4 text-left">
            {[
              { icon: '📚', text: 'Gestión completa de aulas virtuales' },
              { icon: '📊', text: 'Calificaciones y seguimiento académico' },
              { icon: '👥', text: 'Panel multi-rol para toda la comunidad' },
              { icon: '🗓️', text: 'Calendario de eventos y actividades' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-4 rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(255,255,255,0.07)' }}>
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.80)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="absolute bottom-6 text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>
          Plataforma Educativa Digital · EscuelaNet
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <img
              src="https://novasystems32.github.io/Cajal-Web/logo.jpeg"
              alt="Instituto Cajal"
              className="w-16 h-16 rounded-full object-cover mx-auto mb-3 shadow-md"
              style={{ border: '3px solid #c9a227' }}
            />
            <h1 className="text-xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#111111' }}>
              Instituto Santiago Ramón y Cajal
            </h1>
            <p className="text-sm mt-1" style={{ color: '#888888' }}>Plataforma Educativa Digital</p>
          </div>

          <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#111111' }}>
            Iniciar Sesión
          </h2>
          <p className="text-sm mb-8" style={{ color: '#888888' }}>Ingresá tus credenciales para acceder al sistema</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3a3a3a' }}>
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl text-sm bg-[#f4f4f6] transition-all outline-none"
                style={{ borderColor: '#e8e8ec', color: '#3a3a3a' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#c62828'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(198,40,40,0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e8e8ec'; e.currentTarget.style.boxShadow = 'none'; }}
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: '#3a3a3a' }}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl text-sm bg-[#f4f4f6] transition-all outline-none"
                style={{ borderColor: '#e8e8ec', color: '#3a3a3a' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#c62828'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(198,40,40,0.15)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e8e8ec'; e.currentTarget.style.boxShadow = 'none'; }}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#fde8e8', borderColor: '#f5c6cb', border: '1px solid', color: '#c62828' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
              style={{ backgroundColor: '#c62828' }}
              onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.backgroundColor = '#7a1515'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#c62828'; }}
            >
              {loading ? 'Ingresando...' : 'Ingresar al sistema'}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-xs font-semibold mb-3 text-center uppercase tracking-widest" style={{ color: '#888888' }}>
              Accesos de demostración
            </p>
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
                  <p className="text-xs truncate ml-6" style={{ color: '#888888' }}>{u.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
