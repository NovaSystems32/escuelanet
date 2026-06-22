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

const roleColors: Record<Role, string> = {
  admin: 'bg-purple-100 text-purple-700',
  docente: 'bg-blue-100 text-blue-700',
  estudiante: 'bg-green-100 text-green-700',
  preceptor: 'bg-orange-100 text-orange-700',
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const items = navItems[user.rol] || [];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">E</div>
          <div>
            <h1 className="text-base font-bold text-slate-900">EscuelaNet</h1>
            <p className="text-xs text-slate-500">Sistema Escolar</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm">
            {user.nombre.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.nombre}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.rol]}`}>
              {roleLabels[user.rol]}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/${user.rol}` && pathname.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="text-base leading-none">🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
