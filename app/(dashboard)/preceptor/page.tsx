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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido, {user?.nombre} 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Panel de Preceptoría</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Estudiantes" value={estudiantes.filter(e => e.activo).length} icon="👥" color="bg-blue-50 text-blue-600" />
        <StatCard title="Inasistencias" value={inasistencias} icon="📅" color="bg-orange-50 text-orange-600" subtitle={`${injustificadas} injustificadas`} />
        <StatCard title="Sanciones pendientes" value={sancionesPendientes} icon="⚠️" color="bg-red-50 text-red-600" />
        <StatCard title="Cursos" value={cursos.length} icon="🏫" color="bg-green-50 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estudiantes con más inasistencias */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Estudiantes con Inasistencias</h2>
          <div className="space-y-2">
            {estudiantesConInasistencias.map(eId => {
              const est = estudiantes.find(e => e.id === eId);
              if (!est) return null;
              const ausencias = asistencias.filter(a => a.estudianteId === eId && !a.presente).length;
              const total = asistencias.filter(a => a.estudianteId === eId).length;
              const pct = total > 0 ? Math.round((ausencias / total) * 100) : 0;
              return (
                <div key={eId} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-semibold">
                      {est.nombre.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-900">{est.apellido}, {est.nombre}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-orange-600">{ausencias} ausencias</span>
                    <p className="text-xs text-slate-500">{pct}% del tiempo</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/preceptor/asistencias" className="mt-4 text-sm text-blue-600 hover:underline block">
            Ver registro completo →
          </Link>
        </div>

        {/* Sanciones sin resolver */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Sanciones Pendientes de Resolución</h2>
          {sancionesPendientes === 0 ? (
            <p className="text-sm text-slate-400">No hay sanciones pendientes</p>
          ) : (
            <div className="space-y-3">
              {disciplina.filter(d => d.tipo !== 'felicitacion' && !d.resuelto).map(d => {
                const est = estudiantes.find(e => e.id === d.estudianteId);
                const tipoColors: Record<string, string> = {
                  observacion: 'text-yellow-600 bg-yellow-50',
                  apercibimiento: 'text-orange-600 bg-orange-50',
                  suspension: 'text-red-600 bg-red-50',
                };
                return (
                  <div key={d.id} className={`p-3 rounded-lg ${tipoColors[d.tipo]}`}>
                    <p className="text-sm font-medium">{est ? `${est.apellido}, ${est.nombre}` : '-'}</p>
                    <p className="text-xs opacity-80 mt-0.5">{d.tipo} • {new Date(d.fecha).toLocaleDateString('es-AR')}</p>
                    <p className="text-xs mt-1">{d.descripcion}</p>
                  </div>
                );
              })}
            </div>
          )}
          <Link href="/preceptor/disciplina" className="mt-4 text-sm text-blue-600 hover:underline block">
            Gestionar disciplina →
          </Link>
        </div>
      </div>
    </div>
  );
}
