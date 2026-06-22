'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import StatCard from '@/components/StatCard';
import Link from 'next/link';

export default function PreceptorDashboard() {
  const { user } = useAuthStore();
  const { asistencias, disciplina, estudiantes, cursos } = useAppStore();

  const inasistencias = asistencias.filter(a => !a.presente).length;
  const injustificadas = asistencias.filter(a => !a.presente && !a.justificada).length;
  const sancionesPendientes = disciplina.filter(d => d.tipo !== 'felicitacion' && !d.resuelto).length;

  const estudiantesConInasistencias = [...new Set(asistencias.filter(a => !a.presente).map(a => a.estudianteId))];

  const tipoColors: Record<string, { bg: string; color: string }> = {
    observacion: { bg: '#d6eaf8', color: '#1a5276' },
    apercibimiento: { bg: '#fef3c7', color: '#856404' },
    suspension: { bg: '#fde8e8', color: '#c62828' },
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl p-6 text-white shadow-md" style={{ background: 'linear-gradient(135deg, #1a5276 0%, #154360 100%)' }}>
        <div className="flex items-center gap-3 mb-3">
          <img
            src="https://novasystems32.github.io/Cajal-Web/logo.jpeg"
            alt="Instituto Cajal"
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: '2px solid #c9a227' }}
          />
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c9a227', fontFamily: "'Barlow Condensed', sans-serif" }}>
            Instituto Santiago Ramón y Cajal
          </p>
        </div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Buenos días, {user?.nombre}</h1>
        <p className="text-white/70 text-sm mt-1">Inicio del preceptor</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Estudiantes" value={estudiantes.filter(e => e.activo).length} icon="👥" color="bg-[#d6eaf8] text-[#1a5276]" />
        <StatCard title="Inasistencias" value={inasistencias} icon="📅" color="bg-[#fef3c7] text-[#856404]" subtitle={`${injustificadas} sin justificar`} />
        <StatCard title="Observaciones pendientes" value={sancionesPendientes} icon="⚠️" color="bg-[#fde8e8] text-[#c62828]" />
        <StatCard title="Cursos y divisiones" value={cursos.length} icon="🏫" color="bg-[#d4edda] text-[#155724]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estudiantes con más inasistencias */}
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', color: '#111111' }}>Estudiantes con inasistencias registradas</h2>
          <div className="space-y-2">
            {estudiantesConInasistencias.map(eId => {
              const est = estudiantes.find(e => e.id === eId);
              if (!est) return null;
              const ausencias = asistencias.filter(a => a.estudianteId === eId && !a.presente).length;
              const total = asistencias.filter(a => a.estudianteId === eId).length;
              const pct = total > 0 ? Math.round((ausencias / total) * 100) : 0;
              return (
                <div key={eId} className="flex items-center justify-between p-3 rounded-lg transition-colors"
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#d6eaf8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#fef3c7', color: '#856404' }}>
                      {est.nombre.charAt(0)}
                    </div>
                    <span className="text-sm" style={{ color: '#3a3a3a' }}>{est.apellido}, {est.nombre}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold" style={{ color: '#c9a227' }}>{ausencias} inasistencias</span>
                    <p className="text-xs" style={{ color: '#888888' }}>{pct}% del tiempo</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/preceptor/asistencias" className="mt-4 text-sm font-medium hover:underline block" style={{ color: '#c62828' }}>
            Ver registro completo →
          </Link>
        </div>

        {/* Sanciones sin resolver */}
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', color: '#111111' }}>Observaciones e intervenciones pendientes</h2>
          {sancionesPendientes === 0 ? (
            <p className="text-sm" style={{ color: '#888888' }}>No hay observaciones o intervenciones pendientes</p>
          ) : (
            <div className="space-y-2">
              {disciplina.filter(d => d.tipo !== 'felicitacion' && !d.resuelto).map(d => {
                const est = estudiantes.find(e => e.id === d.estudianteId);
                const tc = tipoColors[d.tipo] || { bg: '#f4f4f6', color: '#3a3a3a' };
                return (
                  <div key={d.id} className="p-3 rounded-lg" style={{ backgroundColor: tc.bg }}>
                    <p className="text-sm font-semibold" style={{ color: tc.color }}>{est ? `${est.apellido}, ${est.nombre}` : '-'}</p>
                    <p className="text-xs mt-0.5 capitalize" style={{ color: tc.color, opacity: 0.8 }}>{d.tipo} · {new Date(d.fecha).toLocaleDateString('es-AR')}</p>
                    <p className="text-xs mt-1" style={{ color: tc.color }}>{d.descripcion}</p>
                  </div>
                );
              })}
            </div>
          )}
          <Link href="/preceptor/disciplina" className="mt-4 text-sm font-medium hover:underline block" style={{ color: '#c62828' }}>
            Gestionar observaciones e intervenciones →
          </Link>
        </div>
      </div>
    </div>
  );
}
