'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { PriorityContent } from '@/types';

export default function AdminContenidosPage() {
  const { materias, cursos, docentes, priorityContents, workedLearnings, learningCores } = useAppStore();

  const [filterYear, setFilterYear] = useState('');
  const [filterCurso, setFilterCurso] = useState('');
  const [filterMateria, setFilterMateria] = useState('');
  const [filterDocente, setFilterDocente] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [detailModal, setDetailModal] = useState<{ courseId: string; subjectId: string; teacherId: string } | null>(null);

  // Build summary rows: group by courseId+subjectId
  const grouped = new Map<string, {
    courseId: string; subjectId: string; teacherId: string;
    contents: PriorityContent[];
  }>();

  priorityContents.forEach(pc => {
    const key = `${pc.courseId}__${pc.subjectId}`;
    if (!grouped.has(key)) {
      grouped.set(key, { courseId: pc.courseId, subjectId: pc.subjectId, teacherId: pc.teacherId, contents: [] });
    }
    grouped.get(key)!.contents.push(pc);
  });

  const rows = Array.from(grouped.values()).filter(row => {
    const materia = materias.find(m => m.id === row.subjectId);
    const curso = cursos.find(c => c.id === row.courseId);
    if (filterCurso && row.courseId !== filterCurso) return false;
    if (filterMateria && row.subjectId !== filterMateria) return false;
    if (filterDocente && row.teacherId !== filterDocente) return false;
    if (filterYear && !row.contents.some(c => c.schoolYear === Number(filterYear))) return false;
    if (filterPeriod && !row.contents.some(c => c.period === filterPeriod)) return false;
    return true;
  });

  const getLastUpdate = (contents: PriorityContent[]) => {
    const dates = contents.map(c => c.createdAt).sort().reverse();
    return dates[0] || '-';
  };

  const detailContents = detailModal
    ? priorityContents.filter(pc => pc.courseId === detailModal.courseId && pc.subjectId === detailModal.subjectId)
    : [];

  return (
    <div style={{ backgroundColor: '#f4f4f6', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '2rem', color: '#1a2940', marginBottom: 4 }}>
            Contenidos priorizados — Vista general
          </h1>
          <p style={{ color: '#555', fontSize: '0.95rem' }}>Resumen institucional de contenidos y aprendizajes trabajados por espacio curricular</p>
        </div>

        {/* Filters */}
        <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Ciclo lectivo', value: filterYear, onChange: setFilterYear, options: [{ v: '2026', l: '2026' }, { v: '2025', l: '2025' }] },
              { label: 'Curso', value: filterCurso, onChange: setFilterCurso, options: cursos.map(c => ({ v: c.id, l: `${c.nombre} ${c.division}` })) },
              { label: 'Espacio curricular', value: filterMateria, onChange: setFilterMateria, options: materias.map(m => ({ v: m.id, l: m.nombre })) },
              { label: 'Docente', value: filterDocente, onChange: setFilterDocente, options: docentes.map(d => ({ v: d.id, l: `${d.nombre} ${d.apellido}` })) },
              { label: 'Período', value: filterPeriod, onChange: setFilterPeriod, options: [{ v: 'Primer cuatrimestre', l: 'Primer cuatrimestre' }, { v: 'Segundo cuatrimestre', l: 'Segundo cuatrimestre' }, { v: 'Anual', l: 'Anual' }] },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>{f.label}</label>
                <select
                  value={f.value}
                  onChange={e => f.onChange(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.85rem' }}
                >
                  <option value="">Todos</option>
                  {f.options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a5276', color: '#fff' }}>
                {['Curso', 'Espacio curricular', 'Docente', 'Contenidos priorizados', 'Aprendizajes trabajados', 'Última actualización', 'Acciones'].map(h => (
                  <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No se encontraron registros.</td>
                </tr>
              ) : (
                rows.map((row, i) => {
                  const materia = materias.find(m => m.id === row.subjectId);
                  const curso = cursos.find(c => c.id === row.courseId);
                  const docente = docentes.find(d => d.id === row.teacherId);
                  const wlCount = workedLearnings.filter(wl => wl.subjectId === row.subjectId && wl.courseId === row.courseId).length;
                  return (
                    <tr key={`${row.courseId}-${row.subjectId}`} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '0.8rem 1rem' }}>{curso ? `${curso.nombre} ${curso.division}` : '-'}</td>
                      <td style={{ padding: '0.8rem 1rem', fontWeight: 600, color: '#1a2940' }}>{materia?.nombre || '-'}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>{docente ? `${docente.nombre} ${docente.apellido}` : '-'}</td>
                      <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                        <span style={{ backgroundColor: '#e8f4fd', color: '#1a5276', borderRadius: 6, padding: '2px 10px', fontWeight: 700, fontSize: '0.9rem' }}>
                          {row.contents.length}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', textAlign: 'center' }}>
                        <span style={{ backgroundColor: '#e9f7ef', color: '#1e8449', borderRadius: 6, padding: '2px 10px', fontWeight: 700, fontSize: '0.9rem' }}>
                          {wlCount}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 1rem', color: '#777', fontSize: '0.82rem' }}>{getLastUpdate(row.contents)}</td>
                      <td style={{ padding: '0.8rem 1rem' }}>
                        <button
                          onClick={() => setDetailModal({ courseId: row.courseId, subjectId: row.subjectId, teacherId: row.teacherId })}
                          style={{ backgroundColor: '#1a5276', color: '#fff', border: 'none', borderRadius: 6, padding: '0.35rem 0.9rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: '2rem', width: '100%', maxWidth: 650, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#1a2940', margin: 0 }}>
                  {materias.find(m => m.id === detailModal.subjectId)?.nombre} — {(() => { const c = cursos.find(c => c.id === detailModal.courseId); return c ? `${c.nombre} ${c.division}` : ''; })()}
                </h3>
                <p style={{ color: '#777', fontSize: '0.82rem', marginTop: 2 }}>
                  {(() => { const d = docentes.find(d => d.id === detailModal.teacherId); return d ? `Prof. ${d.nombre} ${d.apellido}` : ''; })()}
                </p>
              </div>
              <button onClick={() => setDetailModal(null)} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#888' }}>✕</button>
            </div>
            {detailContents.sort((a, b) => a.order - b.order).map(pc => {
              const pcWLs = workedLearnings.filter(wl => wl.priorityContentId === pc.id).sort((a, b) => a.order - b.order);
              const core = learningCores.find(lc => lc.id === pc.learningCoreId);
              return (
                <div key={pc.id} style={{ marginBottom: '1rem', border: '1px solid #eee', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ backgroundColor: 'rgba(26,82,118,0.07)', padding: '0.65rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ backgroundColor: '#1a5276', color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>{pc.order}</span>
                    <span style={{ fontWeight: 700, color: '#1a2940', flex: 1 }}>{pc.title}</span>
                    <span style={{ fontSize: '0.75rem', color: '#1a5276', backgroundColor: '#e8f4fd', borderRadius: 5, padding: '1px 7px' }}>{pc.period}</span>
                    {core && <span style={{ fontSize: '0.72rem', color: '#c9a227', backgroundColor: '#fef9e7', borderRadius: 5, padding: '1px 7px', border: '1px solid #c9a227' }}>{core.title}</span>}
                  </div>
                  <div style={{ padding: '0.6rem 1rem' }}>
                    {pcWLs.length === 0 ? (
                      <p style={{ color: '#bbb', fontSize: '0.82rem' }}>Sin aprendizajes trabajados.</p>
                    ) : (
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {pcWLs.map(wl => (
                          <li key={wl.id} style={{ fontSize: '0.85rem', color: '#444', padding: '0.3rem 0', display: 'flex', gap: '0.5rem' }}>
                            <span style={{ color: '#1a5276', fontWeight: 700 }}>{wl.order}.</span>
                            <span>{wl.description}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button
                onClick={() => setDetailModal(null)}
                style={{ backgroundColor: '#1a5276', color: '#fff', border: 'none', borderRadius: 8, padding: '0.55rem 1.5rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
