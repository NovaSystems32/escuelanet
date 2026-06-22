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

  const barColor = pct >= 75 ? '#27ae60' : pct >= 60 ? '#c9a227' : '#c62828';

  return (
    <div>
      <PageHeader title="Mis inasistencias y justificaciones" description="Registro de inasistencias en el ciclo lectivo actual" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <p className="text-xs mb-1 font-medium" style={{ color: '#888888' }}>Total días</p>
          <p className="text-2xl font-bold" style={{ color: '#111111', fontFamily: "'Barlow Condensed', sans-serif" }}>{misAsistencias.length}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: '#d4edda', border: '1px solid #b8ddc0' }}>
          <p className="text-xs mb-1 font-medium" style={{ color: '#27ae60' }}>Presentes</p>
          <p className="text-2xl font-bold" style={{ color: '#155724', fontFamily: "'Barlow Condensed', sans-serif" }}>{presentes}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: '#d6eaf8', border: '1px solid #a9cce3' }}>
          <p className="text-xs mb-1 font-medium" style={{ color: '#1a5276' }}>Justificadas</p>
          <p className="text-2xl font-bold" style={{ color: '#1a5276', fontFamily: "'Barlow Condensed', sans-serif" }}>{justificadas}</p>
        </div>
        <div className="rounded-xl p-4" style={{ backgroundColor: '#fde8e8', border: '1px solid #f5c6cb' }}>
          <p className="text-xs mb-1 font-medium" style={{ color: '#c62828' }}>Injustificadas</p>
          <p className="text-2xl font-bold" style={{ color: '#c62828', fontFamily: "'Barlow Condensed', sans-serif" }}>{injustificadas}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl p-5 mb-6 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#111111' }}>Porcentaje de Asistencia</h2>
          <span className="text-2xl font-bold" style={{ color: barColor, fontFamily: "'Barlow Condensed', sans-serif" }}>{pct}%</span>
        </div>
        <div className="w-full rounded-full h-3 mb-2" style={{ backgroundColor: '#e8e8ec' }}>
          <div className="h-3 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: barColor }} />
        </div>
        <p className="text-xs" style={{ color: '#888888' }}>
          {pct >= 75
            ? 'Buen nivel de asistencia. Seguí así.'
            : pct >= 60
            ? 'Atención: Tu asistencia está por debajo del promedio ideal.'
            : 'Tu asistencia está en riesgo. Mínimo requerido: 75%'}
        </p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
        <div className="p-4 border-b" style={{ borderColor: '#e8e8ec', backgroundColor: '#f4f4f6' }}>
          <h2 className="font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#111111' }}>Historial Detallado</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#f4f4f6' }}>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#888888' }}>Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#888888' }}>Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#888888' }}>Observación</th>
              </tr>
            </thead>
            <tbody>
              {misAsistencias.map((a, idx) => (
                <tr key={a.id} className="transition-colors" style={{ backgroundColor: idx % 2 !== 0 ? '#f4f4f6' : '#ffffff', borderBottom: '1px solid #e8e8ec' }}>
                  <td className="px-4 py-3 text-sm capitalize" style={{ color: '#3a3a3a' }}>
                    {new Date(a.fecha).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </td>
                  <td className="px-4 py-3">
                    {a.presente ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#d4edda', color: '#155724' }}>
                        ✓ Presente
                      </span>
                    ) : a.justificada ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#d6eaf8', color: '#1a5276' }}>
                        ~ Justificada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#fde8e8', color: '#c62828' }}>
                        ✗ Ausente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#888888' }}>{a.observacion || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
