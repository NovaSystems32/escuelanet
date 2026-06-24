'use client';
import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
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

function computeEvalStatus(grade: string, r1: string, r2: string): string {
  if (!grade) return 'Sin calificar';
  if (grade === 'ausente') return 'Ausente';
  const n = parseInt(grade);
  if (n >= 6) return 'Aprobado';
  if (!r1) return 'Debe recuperar';
  if (r1 === 'ausente') return 'Ausente en R1';
  const r = parseInt(r1);
  if (r >= 6) return 'Aprobado en R1';
  if (!r2) return 'R2 pendiente';
  if (r2 === 'ausente') return 'Ausente en R2';
  const r2v = parseInt(r2);
  if (r2v >= 6) return 'Aprobado en R2';
  return 'No aprobado';
}

function evalStatusStyle(status: string): React.CSSProperties {
  if (status.startsWith('Aprobado')) return { background: '#d4edda', color: '#27ae60', border: '1px solid #c3e6cb' };
  if (status === 'Debe recuperar' || status === 'R2 pendiente') return { background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' };
  if (status === 'No aprobado') return { background: '#f8d7da', color: '#c62828', border: '1px solid #f5c6cb' };
  if (status === 'Sin calificar') return { background: '#e8e8ec', color: '#888', border: '1px solid #d8d8dc' };
  return { background: '#e8f0fb', color: '#1a5276', border: '1px solid #d6e4f0' };
}

export default function CalificacionesPage() {
  const { user } = useAuthStore();
  const { calificaciones, materias, simpleGrades, estudiantes, appUsers } = useAppStore();
  const [selectedTrimestre, setSelectedTrimestre] = useState<1|2|3|'todos'>('todos');

  const appUser = appUsers.find(u => u.username === user?.email?.split('@')[0]) ||
    appUsers.find(u => u.role === 'estudiante' && user?.email?.includes('estudiante'));
  const estudianteId = appUser?.linkedProfileId || 'e1';
  const student = estudiantes.find(e => e.id === estudianteId);
  const misMaterias = materias.filter(m => m.cursoId === (student?.curso || 'c1'));
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

      {/* SimpleGrades - Evaluaciones 1-8 */}
      {(() => {
        const mySimpleGrades = simpleGrades.filter(g => g.studentId === estudianteId);
        if (mySimpleGrades.length === 0) return null;
        const subjectIds = [...new Set(mySimpleGrades.map(g => g.subjectId))];
        return (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '20px', fontWeight: 700, color: '#1a5276', marginBottom: '12px' }}>
              Calificaciones por evaluación
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {subjectIds.map(subjectId => {
                const materia = misMaterias.find(m => m.id === subjectId);
                if (!materia) return null;
                const subjectGrades = mySimpleGrades.filter(g => g.subjectId === subjectId);
                const rows = subjectGrades.filter(g => g.grade || g.recoveryOneGrade || g.recoveryTwoGrade);
                if (rows.length === 0) return null;
                return (
                  <div key={subjectId} className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #e8e8ec' }}>
                    <div style={{ backgroundColor: '#f4f4f6', padding: '12px 16px', borderBottom: '1px solid #e8e8ec' }}>
                      <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '16px', fontWeight: 700, color: '#111', margin: 0 }}>{materia.nombre}</h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#1a5276', color: 'white' }}>
                            <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600 }}>Evaluación</th>
                            <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600 }}>Nota</th>
                            <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600 }}>R1</th>
                            <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600 }}>R2</th>
                            <th style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 600 }}>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.sort((a, b) => a.evaluationNumber - b.evaluationNumber).map((g, i) => {
                            const status = computeEvalStatus(g.grade, g.recoveryOneGrade, g.recoveryTwoGrade);
                            return (
                              <tr key={g.id} style={{ backgroundColor: i % 2 === 0 ? 'white' : '#f4f4f6', borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '8px 12px', fontWeight: 500, color: '#1a2940' }}>Evaluación {g.evaluationNumber}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: g.grade ? (g.grade === 'ausente' ? '#1a5276' : parseInt(g.grade) >= 6 ? '#27ae60' : '#c62828') : '#bbb' }}>
                                  {g.grade ? (g.grade === 'ausente' ? 'Aus.' : g.grade) : '-'}
                                </td>
                                <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: g.recoveryOneGrade ? (g.recoveryOneGrade === 'ausente' ? '#1a5276' : parseInt(g.recoveryOneGrade) >= 6 ? '#27ae60' : '#c62828') : '#bbb' }}>
                                  {g.recoveryOneGrade ? (g.recoveryOneGrade === 'ausente' ? 'Aus.' : g.recoveryOneGrade) : '-'}
                                </td>
                                <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: g.recoveryTwoGrade ? (g.recoveryTwoGrade === 'ausente' ? '#1a5276' : parseInt(g.recoveryTwoGrade) >= 6 ? '#27ae60' : '#c62828') : '#bbb' }}>
                                  {g.recoveryTwoGrade ? (g.recoveryTwoGrade === 'ausente' ? 'Aus.' : g.recoveryTwoGrade) : '-'}
                                </td>
                                <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                  <span style={{ ...evalStatusStyle(status), padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                                    {status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

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
