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

  const statusColor = pct >= 75 ? 'text-[#34a853]' : pct >= 60 ? 'text-[#f59e0b]' : 'text-[#e53935]';
  const barColor = pct >= 75 ? 'bg-[#34a853]' : pct >= 60 ? 'bg-[#f59e0b]' : 'bg-[#e53935]';

  return (
    <div>
      <PageHeader title="Inasistencias" description="Registro de asistencias y ausencias" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-4 shadow-sm">
          <p className="text-xs text-[#5a6a8a] mb-1 font-medium">Total días</p>
          <p className="text-2xl font-bold text-[#1a2444]">{misAsistencias.length}</p>
        </div>
        <div className="bg-[#dcfce7] rounded-xl border border-green-200 p-4">
          <p className="text-xs text-[#34a853] mb-1 font-medium">Presentes</p>
          <p className="text-2xl font-bold text-[#15803d]">{presentes}</p>
        </div>
        <div className="bg-[#e8f0fb] rounded-xl border border-[#d8e0ee] p-4">
          <p className="text-xs text-[#2d4a8a] mb-1 font-medium">Justificadas</p>
          <p className="text-2xl font-bold text-[#2d4a8a]">{justificadas}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <p className="text-xs text-[#e53935] mb-1 font-medium">Injustificadas</p>
          <p className="text-2xl font-bold text-[#e53935]">{injustificadas}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#1a2444]">Porcentaje de Asistencia</h2>
          <span className={`text-2xl font-bold ${statusColor}`}>{pct}%</span>
        </div>
        <div className="w-full bg-[#eef1f8] rounded-full h-3 mb-2">
          <div className={`h-3 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-[#5a6a8a]">
          {pct >= 75
            ? '✅ Buen nivel de asistencia. Seguí así.'
            : pct >= 60
            ? '⚠️ Atención: Tu asistencia está por debajo del promedio ideal.'
            : '🚨 Tu asistencia está en riesgo. Mínimo requerido: 75%'}
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-[#d8e0ee] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#eef1f8] bg-[#f8f9fc]">
          <h2 className="font-semibold text-[#1a2444]">Historial Detallado</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fc]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase tracking-wide">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase tracking-wide">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase tracking-wide">Observación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef1f8]">
              {misAsistencias.map((a, idx) => (
                <tr key={a.id} className={`hover:bg-[#e8f0fb] transition-colors ${idx % 2 === 0 ? '' : 'bg-[#f8f9fc]'}`}>
                  <td className="px-4 py-3 text-sm text-[#1a2444] capitalize">
                    {new Date(a.fecha).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </td>
                  <td className="px-4 py-3">
                    {a.presente ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#dcfce7] text-[#15803d]">
                        ✓ Presente
                      </span>
                    ) : a.justificada ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e8f0fb] text-[#2d4a8a]">
                        ~ Justificada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-[#e53935]">
                        ✗ Ausente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#5a6a8a]">{a.observacion || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
