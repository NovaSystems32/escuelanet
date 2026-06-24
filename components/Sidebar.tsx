'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Role } from '@/types';
import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: Record<Role, NavItem[]> = {
  directivo: [
    { href: '/admin', label: 'Inicio institucional', icon: '🏠' },
  ],
  tutor: [
    { href: '/estudiante', label: 'Inicio', icon: '🏠' },
  ],
  estudiante: [
    { href: '/estudiante', label: 'Inicio', icon: '🏠' },
    { href: '/estudiante/aulas', label: 'Mis espacios curriculares', icon: '📚' },
    { href: '/estudiante/calificaciones', label: 'Mis calificaciones', icon: '📊' },
    { href: '/estudiante/evaluaciones', label: 'Mis evaluaciones', icon: '📋' },
    { href: '/estudiante/seguimiento', label: 'Mi seguimiento académico', icon: '📈' },
    { href: '/estudiante/inasistencias', label: 'Mis inasistencias', icon: '📅' },
    { href: '/estudiante/disciplina', label: 'Observaciones e intervenciones', icon: '⚖️' },
    { href: '/estudiante/calendario', label: 'Mi calendario institucional', icon: '🗓️' },
  ],
  admin: [
    { href: '/admin', label: 'Inicio institucional', icon: '🏠' },
    { href: '/admin/estudiantes', label: 'Gestión de estudiantes', icon: '👥' },
    { href: '/admin/docentes', label: 'Gestión de docentes', icon: '👨‍🏫' },
    { href: '/admin/cursos', label: 'Cursos y divisiones', icon: '🏫' },
    { href: '/admin/materias', label: 'Espacios curriculares', icon: '📖' },
    { href: '/admin/calificaciones', label: 'Calificaciones', icon: '📊' },
    { href: '/admin/evaluaciones', label: 'Evaluaciones por núcleo', icon: '📋' },
    { href: '/admin/asistencias', label: 'Inasistencias', icon: '📅' },
    { href: '/admin/disciplina', label: 'Observaciones e intervenciones', icon: '⚖️' },
    { href: '/admin/eventos', label: 'Calendario institucional', icon: '🗓️' },
    { href: '/admin/usuarios', label: 'Accesos al sistema', icon: '🔑' },
    { href: '/admin/contenidos', label: 'Contenidos priorizados', icon: '📋' },
  ],
  docente: [
    { href: '/docente', label: 'Inicio', icon: '🏠' },
    { href: '/docente/materias', label: 'Mis espacios curriculares', icon: '📖' },
    { href: '/docente/calificaciones', label: 'Carga de calificaciones', icon: '📊' },
    { href: '/docente/actividades', label: 'Actividades y entregas', icon: '📝' },
    { href: '/docente/contenidos', label: 'Contenidos y aprendizajes', icon: '📋' },
  ],
  preceptor: [
    { href: '/preceptor', label: 'Inicio', icon: '🏠' },
    { href: '/preceptor/estudiantes', label: 'Gestión de estudiantes', icon: '👥' },
    { href: '/preceptor/asistencias', label: 'Registro de inasistencias', icon: '📅' },
    { href: '/preceptor/disciplina', label: 'Observaciones e intervenciones', icon: '⚖️' },
    { href: '/preceptor/seguimiento', label: 'Trayectorias escolares', icon: '📈' },
  ],
};

const roleLabels: Record<Role, string> = {
  admin: 'Administrador',
  docente: 'Docente',
  estudiante: 'Estudiante',
  preceptor: 'Preceptor',
  directivo: 'Directivo',
  tutor: 'Tutor',
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  const items = navItems[user.rol] || [];

  return (
    <>
      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 shadow-sm" style={{ backgroundColor: '#1a5276' }}>
        <div className="flex items-center gap-2">
          <img src="https://novasystems32.github.io/Cajal-Web/logo.jpeg" className="w-8 h-8 rounded-full object-cover" alt="Instituto Cajal" />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: 'white', fontSize: '16px' }}>Instituto Cajal</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          style={{ color: 'white', background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
          aria-label="Abrir menú"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Overlay backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col h-screen transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: '#1a5276' }}
      >
        {/* Close button on mobile */}
        <button
          className="lg:hidden absolute top-4 right-4 text-white/60 hover:text-white text-xl leading-none"
          onClick={() => setMobileOpen(false)}
          aria-label="Cerrar menú"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          ✕
        </button>

        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="https://novasystems32.github.io/Cajal-Web/logo.jpeg"
              alt="Instituto Cajal"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h1 className="text-sm font-bold text-white leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.01em' }}>
                Instituto Cajal
              </h1>
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
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'text-white/75 hover:text-white'
                    }`}
                    style={isActive ? { backgroundColor: 'rgba(255,255,255,0.15)' } : undefined}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.10)'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full" style={{ backgroundColor: '#c9a227' }} />
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
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ring-2 ring-white/20" style={{ backgroundColor: '#c62828' }}>
              {user.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.nombre}</p>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: '#c62828' }}>
                {roleLabels[user.rol]}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white/60 transition-all duration-200 hover:text-red-300"
            style={{ transition: 'background-color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(198,40,40,0.20)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
          >
            <span className="text-sm">🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
