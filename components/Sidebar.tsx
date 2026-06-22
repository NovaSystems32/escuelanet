'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Role } from '@/types';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: Record<Role, NavItem[]> = {
  estudiante: [
    { href: '/estudiante', label: 'Dashboard', icon: '🏠' },
    { href: '/estudiante/aulas', label: 'Aulas Virtuales', icon: '📚' },
    { href: '/estudiante/calificaciones', label: 'Calificaciones', icon: '📊' },
    { href: '/estudiante/inasistencias', label: 'Inasistencias', icon: '📅' },
    { href: '/estudiante/disciplina', label: 'Disciplina', icon: '⚖️' },
    { href: '/estudiante/calendario', label: 'Calendario', icon: '🗓️' },
  ],
  admin: [
    { href: '/admin', label: 'Dashboard', icon: '🏠' },
    { href: '/admin/estudiantes', label: 'Estudiantes', icon: '👥' },
    { href: '/admin/docentes', label: 'Docentes', icon: '👨‍🏫' },
    { href: '/admin/cursos', label: 'Cursos', icon: '🏫' },
    { href: '/admin/materias', label: 'Materias', icon: '📖' },
    { href: '/admin/calificaciones', label: 'Calificaciones', icon: '📊' },
    { href: '/admin/asistencias', label: 'Asistencias', icon: '📅' },
    { href: '/admin/disciplina', label: 'Disciplina', icon: '⚖️' },
    { href: '/admin/eventos', label: 'Eventos', icon: '🗓️' },
  ],
  docente: [
    { href: '/docente', label: 'Dashboard', icon: '🏠' },
    { href: '/docente/materias', label: 'Mis Materias', icon: '📖' },
    { href: '/docente/calificaciones', label: 'Calificaciones', icon: '📊' },
    { href: '/docente/actividades', label: 'Actividades y Materiales', icon: '📝' },
  ],
  preceptor: [
    { href: '/preceptor', label: 'Dashboard', icon: '🏠' },
    { href: '/preceptor/asistencias', label: 'Asistencias', icon: '📅' },
    { href: '/preceptor/disciplina', label: 'Disciplina', icon: '⚖️' },
  ],
};

const roleLabels: Record<Role, string> = {
  admin: 'Administrador',
  docente: 'Docente',
  estudiante: 'Estudiante',
  preceptor: 'Preceptor',
};

const roleAccents: Record<Role, string> = {
  admin: 'bg-[#f0a500] text-[#1a2444]',
  docente: 'bg-[#4a90d9] text-white',
  estudiante: 'bg-[#34a853] text-white',
  preceptor: 'bg-[#f59e0b] text-[#1a2444]',
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const items = navItems[user.rol] || [];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0 bg-[#1a2f5e]">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f0a500] rounded-xl flex items-center justify-center text-[#1a2444] font-bold text-xl shadow-md">
            🎓
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">EscuelaNet</h1>
            <p className="text-xs text-white/50">Plataforma Educativa</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/${user.rol}` && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'bg-[#e8f0fb] text-[#2d4a8a] font-semibold'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#f0a500] rounded-r-full" />
                  )}
                  <span className="text-base leading-none ml-1">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#2d4a8a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2 ring-white/20">
            {user.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.nombre}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleAccents[user.rol]}`}>
              {roleLabels[user.rol]}
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white/60 hover:bg-[#e53935]/20 hover:text-red-300 transition-all duration-200"
        >
          <span className="text-sm">🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
