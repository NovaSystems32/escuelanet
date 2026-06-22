'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';

const tipoLabels: Record<string, string> = {
  'Evaluación': 'Evaluación',
  'Evaluación oral': 'Evaluación oral',
  'Trabajo práctico': 'Trabajo práctico',
  'Actividad áulica': 'Actividad áulica',
  'Proyecto': 'Proyecto',
  'Participación': 'Participación',
  'Instancia de recuperación': 'Instancia de recuperación',
  'Coloquio': 'Coloquio',
};

const tipoBadge: Record<string, { bg: string; color: string }> = {
  'Evaluación': { bg: '#d6eaf8', color: '#1a5276' },
  'Evaluación oral': { bg: '#fef9c3', color: '#856404' },
  'Trabajo práctico': { bg: '#d4edda', color: '#155724' },
  'Actividad áulica': { bg: '#e8e8ec', color: '#555555' },
  'Proyecto': { bg: '#e8d5f5', color: '#6a1b9a' },
  'Participación': { bg: '#d5f5e3', color: '#1a5276' },
  'Instancia de recuperación': { bg: '#fde8e8', color: '#c62828' },
  'Coloquio': { bg: '#cce5ff', color: '#0d47a1' },
};

export default function CalificacionesPage() {
  const { calificaciones, materias } = useAppStore();
  const [selectedTrimestre, setSelectedTrimestre] = useState<1|2|3|'todos'>('todos');

  const estudianteId = 'e1';
  const misMaterias = materias.filter(m => m.cursoId === 'c1');
  const misCalificaciones = calificaciones.filter(c => c.estudianteId === estudianteId);

  const filtered = selectedTrimestre === 'todos'
    ? misCalificaciones
    : misCalificaciones.filter(c => c.trimestre === selectedTrimestre);

  const promedioGeneral = misCalificaciones.length > 0
    ? (misCalificaciones.reduce((s, c) => s + c.nota, 0) / misCalificaciones.length).toFixed(1)
    : '-';

  const getNotaBg = (nota: number) => nota >= 7 ? '#d4edda' : nota >= 4 ? '#fef3c7' : '#fde8e8';
  const getNotaColor = (nota: number) => nota >= 7 ? '#155724' : nota >= 4 ? '#856404' : '#c62828';

  return (
    <div>
      <PageHeader title="Mis calificaciones" description="Historial de calificaciones por espacio curricular" />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="text-white rounded-xl p-4 shadow-md" style={{ background: 'linear-gradient(135deg, #1a5276 0%, #154360 100%)' }}>
          <p className="text-white/60 text-xs mb-1 font-medium uppercase tracking-wide">Promedio General</p>
          <p className="text-3xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{promedioGeneral}</p>
        </div>
        {[1, 2, 3].map(t => {
          const cals = misCalificaciones.filter(c => c.trimestre === t);
          const prom = cals.length > 0 ? (cals.reduce((s, c) => s + c.nota, 0) / cals.length).toFixed(1) : '-';
          const promNum = cals.length > 0 ? cals.reduce((s, c) => s + c.nota, 0) / cals.length : null;
          return (
            <div key={t} className="bg-white rounded-xl p-4 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
              <p className="text-xs mb-1 font-medium" style={{ color: '#888888' }}>{t === 3 ? 'Recuperación' : `${t}° Cuatrimestre`}</p>
              <p className="text-2xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: promNum !== null ? (promNum >= 7 ? '#27ae60' : promNum >= 4 ? '#c9a227' : '#c62828') : '#111111' }}>{prom}</p>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {(['todos', 1, 2, 3] as const).map(t => (
          <button
            key={t}
            onClick={() => setSelectedTrimestre(t)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
            style={selectedTrimestre === t
              ? { backgroundColor: '#c62828', color: '#ffffff', boxShadow: '0 1px 3px rgba(198,40,40,0.3)' }
              : { backgroundColor: '#ffffff', border: '1px solid #e8e8ec', color: '#888888' }
            }
          >
            {t === 'todos' ? 'Todos los períodos' : t === 3 ? 'Instancia de recuperación' : `${t}° Cuatrimestre`}
          </button>
        ))}
      </div>

      {/* Por materia */}
      <div className="space-y-4">
        {misMaterias.map(materia => {
          const cals = filtered.filter(c => c.materiaId === materia.id);
          if (cals.length === 0 && selectedTrimestre !== 'todos') return null;
          const promMateria = cals.length > 0 ? (cals.reduce((s, c) => s + c.nota, 0) / cals.length).toFixed(1) : '-';
          const promNum = cals.length > 0 ? cals.reduce((s, c) => s + c.nota, 0) / cals.length : null;

          return (
            <div key={materia.id} className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #e8e8ec' }}>
              <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#e8e8ec', backgroundColor: '#f4f4f6' }}>
                <h3 className="font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif', fontSize: '1.1rem", color: '#111111' }}>{materia.nombre}</h3>
                <div className="text-lg font-bold px-3 py-1 rounded-lg" style={{ backgroundColor: promNum !== null ? getNotaBg(promNum) : '#f4f4f6', color: promNum !== null ? getNotaColor(promNum) : '#888888', fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {promMateria}
                </div>
              </div>
              {cals.length === 0 ? (
                <p className="text-sm p-4" style={{ color: '#888888' }}>Aún no se registraron calificaciones para este período.</p>
              ) : (
                <div className="divide-y" style={{ borderColor: '#e8e8ec' }}>
                  {cals.map((cal, idx) => (
                    <div key={cal.id} className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: idx % 2 !== 0 ? '#f4f4f6' : '#ffffff' }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{cal.descripcion}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: tipoBadge[cal.tipo]?.bg || '#f4f4f6', color: tipoBadge[cal.tipo]?.color || '#888888' }}>
                            {tipoLabels[cal.tipo]}
                          </span>
                          <span className="text-xs" style={{ color: '#888888' }}>{new Date(cal.fecha).toLocaleDateString('es-AR')} · {cal.trimestre === 3 ? 'Instancia de recuperación' : `${cal.trimestre}° Cuatrimestre`}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: getNotaBg(cal.nota), color: getNotaColor(cal.nota) }}>
                        {cal.nota}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
