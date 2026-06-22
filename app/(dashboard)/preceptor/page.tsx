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

  return (
    <div>
      <div className="mb-6 bg-gradient-to-r from-[#1a2f5e] to-[#2d4a8a] rounded-2xl p-6 text-white shadow-md">
        <h1 className="text-2xl font-bold">Buenos días, {user?.nombre} 👋</h1>
        <p className="text-white/70 text-sm mt-1">Panel de Preceptoría</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Estudiantes" value={estudiantes.filter(e => e.activo).length} icon="👥" color="bg-[#e8f0fb] text-[#2d4a8a]" />
        <StatCard title="Inasistencias" value={inasistencias} icon="📅" color="bg-[#fef3c7] text-[#d97706]" subtitle={`${injustificadas} injustificadas`} />
        <StatCard title="Sanciones pendientes" value={sancionesPendientes} icon="⚠️" color="bg-red-50 text-[#e53935]" />
        <StatCard title="Cursos" value={cursos.length} icon="🏫" color="bg-[#dcfce7] text-[#15803d]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estudiantes con más inasistencias */}
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm">
          <h2 className="font-semibold text-[#1a2444] mb-4">Estudiantes con Inasistencias</h2>
          <div className="space-y-2">
            {estudiantesConInasistencias.map(eId => {
              const est = estudiantes.find(e => e.id === eId);
              if (!est) return null;
              const ausencias = asistencias.filter(a => a.estudianteId === eId && !a.presente).length;
              const total = asistencias.filter(a => a.estudianteId === eId).length;
              const pct = total > 0 ? Math.round((ausencias / total) * 100) : 0;
              return (
                <div key={eId} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#e8f0fb] transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#fef3c7] text-[#d97706] flex items-center justify-center text-xs font-semibold">
                      {est.nombre.charAt(0)}
                    </div>
                    <span className="text-sm text-[#1a2444]">{est.apellido}, {est.nombre}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#f59e0b]">{ausencias} ausencias</span>
                    <p className="text-xs text-[#5a6a8a]">{pct}% del tiempo</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/preceptor/asistencias" className="mt-4 text-sm text-[#2d4a8a] hover:text-[#1a2f5e] font-medium hover:underline block">
            Ver registro completo →
          </Link>
        </div>

        {/* Sanciones sin resolver */}
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm">
          <h2 className="font-semibold text-[#1a2444] mb-4">Sanciones Pendientes de Resolución</h2>
          {sancionesPendientes === 0 ? (
            <p className="text-sm text-[#5a6a8a]">No hay sanciones pendientes</p>
          ) : (
            <div className="space-y-2">
              {disciplina.filter(d => d.tipo !== 'felicitacion' && !d.resuelto).map(d => {
                const est = estudiantes.find(e => e.id === d.estudianteId);
                const tipoColors: Record<string, string> = {
                  observacion: 'text-[#2d4a8a] bg-[#e8f0fb]',
                  apercibimiento: 'text-[#d97706] bg-[#fef3c7]',
                  suspension: 'text-[#e53935] bg-red-50',
                };
                return (
                  <div key={d.id} className={`p-3 rounded-lg ${tipoColors[d.tipo] || 'bg-[#f8f9fc] text-[#1a2444]'}`}>
                    <p className="text-sm font-semibold">{est ? `${est.apellido}, ${est.nombre}` : '-'}</p>
                    <p className="text-xs opacity-80 mt-0.5 capitalize">{d.tipo} • {new Date(d.fecha).toLocaleDateString('es-AR')}</p>
                    <p className="text-xs mt-1">{d.descripcion}</p>
                  </div>
                );
              })}
            </div>
          )}
          <Link href="/preceptor/disciplina" className="mt-4 text-sm text-[#2d4a8a] hover:text-[#1a2f5e] font-medium hover:underline block">
            Gestionar disciplina →
          </Link>
        </div>
      </div>
    </div>
  );
}
