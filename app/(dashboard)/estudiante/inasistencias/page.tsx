'use client';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';

export default function InasistenciasPage() {
  const { asistencias } = useAppStore();

  const estudianteId = 'e1';
  const misAsistencias = asistencias
    .filter(a => a.estudianteId === estudianteId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const presentes = misAsistencias.filter(a => a.presente).length;
  const ausentes = misAsistencias.filter(a => !a.presente).length;
  const justificadas = misAsistencias.filter(a => !a.presente && a.justificada).length;
  const injustificadas = misAsistencias.filter(a => !a.presente && !a.justificada).length;
  const pct = misAsistencias.length > 0 ? Math.round((presentes / misAsistencias.length) * 100) : 100;

  const statusColor = pct >= 75 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600';
  const barColor = pct >= 75 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div>
      <PageHeader title="Inasistencias" description="Registro de asistencias y ausencias" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">Total días</p>
          <p className="text-2xl font-bold text-slate-900">{misAsistencias.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-600 mb-1">Presentes</p>
          <p className="text-2xl font-bold text-green-700">{presentes}</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
          <p className="text-xs text-orange-600 mb-1">Justificadas</p>
          <p className="text-2xl font-bold text-orange-700">{justificadas}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-xs text-red-600 mb-1">Injustificadas</p>
          <p className="text-2xl font-bold text-red-700">{injustificadas}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Porcentaje de Asistencia</h2>
          <span className={`text-2xl font-bold ${statusColor}`}>{pct}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
          <div className={`h-3 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-slate-500">
          {pct >= 75
            ? '✅ Buen nivel de asistencia. Seguí así.'
            : pct >= 60
            ? '⚠️ Atención: Tu asistencia está por debajo del promedio ideal.'
            : '🚨 Tu asistencia está en riesgo. Mínimo requerido: 75%'}
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Historial Detallado</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Observación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {misAsistencias.map(a => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-900">
                    {new Date(a.fecha).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </td>
                  <td className="px-4 py-3">
                    {a.presente ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        ✓ Presente
                      </span>
                    ) : a.justificada ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                        ~ Justificada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        ✗ Ausente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{a.observacion || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
