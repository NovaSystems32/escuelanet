'use client';
import { useState, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

type StatusKey = 'Aprobado' | 'AprobadoR1' | 'AprobadoR2' | 'DebeRecuperar' | 'R2Pendiente' | 'NoAprobado' | 'SinCalificar';

interface StatusInfo { label: string; bg: string; color: string; }

const STATUS_INFO: Record<StatusKey, StatusInfo> = {
  Aprobado:      { label: 'Aprobado',              bg: '#d4edda', color: '#27ae60' },
  AprobadoR1:    { label: 'Aprobado Recup. 1',     bg: '#c8f0da', color: '#1e8449' },
  AprobadoR2:    { label: 'Aprobado Recup. 2',     bg: '#b7e4cc', color: '#1a7040' },
  DebeRecuperar: { label: 'Debe recuperar',         bg: '#fff3cd', color: '#856404' },
  R2Pendiente:   { label: 'Recup. 2 pendiente',    bg: '#ffe0b2', color: '#e65100' },
  NoAprobado:    { label: 'No aprobado',            bg: '#f8d7da', color: '#c62828' },
  SinCalificar:  { label: 'Sin calificar',          bg: '#e8e8ec', color: '#666' },
};

function computeStatus(mainGrade: number | null, r1Grade: number | null, r2Grade: number | null): StatusKey {
  if (mainGrade === null) return 'SinCalificar';
  if (mainGrade >= 6) return 'Aprobado';
  if (r1Grade !== null) {
    if (r1Grade >= 6) return 'AprobadoR1';
    if (r2Grade !== null) {
      return r2Grade >= 6 ? 'AprobadoR2' : 'NoAprobado';
    }
    return 'R2Pendiente';
  }
  return 'DebeRecuperar';
}

function StatusBadge({ statusKey }: { statusKey: StatusKey }) {
  const s = STATUS_INFO[statusKey];
  return <span style={{ backgroundColor: s.bg, color: s.color, borderRadius: 6, padding: '2px 9px', fontWeight: 700, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{s.label}</span>;
}

export default function PreceptorSeguimientoPage() {
  const { estudiantes, cursos, materias, learningCores, evaluationGrades } = useAppStore();
  const [filterCurso, setFilterCurso] = useState('');
  const [filterMateria, setFilterMateria] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterName, setFilterName] = useState('');

  // Build full table rows
  interface TableRow {
    studentId: string;
    studentName: string;
    courseId: string;
    courseName: string;
    subjectId: string;
    subjectName: string;
    coreId: string;
    coreTitle: string;
    mainGrade: number | null;
    r1Grade: number | null;
    r2Grade: number | null;
    statusKey: StatusKey;
    observation: string;
  }

  const allRows = useMemo((): TableRow[] => {
    const rows: TableRow[] = [];
    estudiantes.filter(e => e.activo).forEach(est => {
      const curso = cursos.find(c => c.id === est.curso);
      if (!curso) return;
      const estMaterias = materias.filter(m => m.cursoId === est.curso);
      estMaterias.forEach(mat => {
        const cores = learningCores.filter(lc => lc.subjectId === mat.id && lc.courseId === mat.cursoId);
        cores.forEach(core => {
          const grades = evaluationGrades.filter(g => g.studentId === est.id && g.learningCoreId === core.id);
          const main = grades.find(g => g.instanceType === 'evaluacion_principal');
          const r1 = grades.find(g => g.instanceType === 'recuperatorio_1');
          const r2 = grades.find(g => g.instanceType === 'recuperatorio_2');
          const mainGrade = main?.grade ?? null;
          const r1Grade = r1?.grade ?? null;
          const r2Grade = r2?.grade ?? null;
          const statusKey = computeStatus(mainGrade, r1Grade, r2Grade);
          rows.push({
            studentId: est.id,
            studentName: `${est.apellido}, ${est.nombre}`,
            courseId: est.curso,
            courseName: `${curso.nombre} ${curso.division}`,
            subjectId: mat.id,
            subjectName: mat.nombre,
            coreId: core.id,
            coreTitle: core.title,
            mainGrade,
            r1Grade,
            r2Grade,
            statusKey,
            observation: main?.observation || r1?.observation || r2?.observation || '',
          });
        });
      });
    });
    return rows;
  }, [estudiantes, cursos, materias, learningCores, evaluationGrades]);

  const filteredRows = allRows.filter(r => {
    if (filterCurso && r.courseId !== filterCurso) return false;
    if (filterMateria && r.subjectId !== filterMateria) return false;
    if (filterStatus && r.statusKey !== filterStatus) return false;
    if (filterName && !r.studentName.toLowerCase().includes(filterName.toLowerCase())) return false;
    return true;
  });

  // Summary counts (based on unique student-core pairs)
  const allStudents = [...new Set(allRows.map(r => r.studentId))];
  const totalStudents = allStudents.length;

  const studentStatuses = allStudents.map(sid => {
    const srows = allRows.filter(r => r.studentId === sid);
    const hasNoApproved = srows.some(r => r.statusKey === 'NoAprobado');
    const hasRecup = srows.some(r => r.statusKey === 'DebeRecuperar' || r.statusKey === 'R2Pendiente');
    const hasTwoPlus = srows.filter(r => r.statusKey === 'NoAprobado').length >= 2;
    const hasSinCalif = srows.some(r => r.statusKey === 'SinCalificar');
    return { sid, hasNoApproved, hasRecup, hasTwoPlus, hasSinCalif };
  });

  const studentsOk = studentStatuses.filter(s => !s.hasNoApproved && !s.hasRecup).length;
  const studentsRecup = studentStatuses.filter(s => s.hasRecup).length;
  const studentsRisk = studentStatuses.filter(s => s.hasTwoPlus).length;
  const sinCalifCount = allRows.filter(r => r.statusKey === 'SinCalificar').length;

  const summaryCards = [
    { label: 'Total estudiantes', value: totalStudents, bg: 'linear-gradient(135deg, #1a5276, #154360)', textColor: '#fff' },
    { label: 'Estudiantes al día', value: studentsOk, bg: 'linear-gradient(135deg, #1e8449, #145a32)', textColor: '#fff' },
    { label: 'Con recuperatorios', value: studentsRecup, bg: 'linear-gradient(135deg, #c9a227, #9a7d0a)', textColor: '#fff' },
    { label: 'En riesgo académico', value: studentsRisk, bg: 'linear-gradient(135deg, #c62828, #922020)', textColor: '#fff' },
    { label: 'Núcleos sin calificar', value: sinCalifCount, bg: 'linear-gradient(135deg, #666, #444)', textColor: '#fff' },
  ];

  // Alert sections
  const studentsWithRecup = studentStatuses.filter(s => s.hasRecup).map(s => {
    const e = estudiantes.find(e => e.id === s.sid);
    return e ? `${e.apellido}, ${e.nombre}` : s.sid;
  });
  const studentsWithNoApproved = studentStatuses.filter(s => s.hasNoApproved).map(s => {
    const e = estudiantes.find(e => e.id === s.sid);
    return e ? `${e.apellido}, ${e.nombre}` : s.sid;
  });

  const availableMaterias = filterCurso
    ? materias.filter(m => m.cursoId === filterCurso)
    : materias;

  return (
    <div style={{ backgroundColor: '#f4f4f6', minHeight: '100vh', padding: '1rem' }}>
      <div style={{ maxWidth: 1300, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 'clamp(22px, 5vw, 32px)', color: '#1a2940', marginBottom: 4 }}>
            Seguimiento de trayectorias escolares
          </h1>
          <p style={{ color: '#555', fontSize: '0.95rem' }}>Estado académico de los estudiantes por núcleo de aprendizaje</p>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {summaryCards.map(card => (
            <div key={card.label} style={{ background: card.bg, borderRadius: 12, padding: '1.1rem 1.25rem', color: card.textColor, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 5 }}>{card.label}</p>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '2rem', lineHeight: 1 }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Alert section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
          {studentsWithRecup.length > 0 && (
            <div style={{ backgroundColor: '#fff8e1', border: '1px solid #c9a227', borderRadius: 10, padding: '1rem 1.25rem' }}>
              <p style={{ fontWeight: 700, color: '#856404', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                Estudiantes con recuperatorios pendientes: {studentsWithRecup.length}
              </p>
              <ul style={{ margin: 0, padding: '0 0 0 1.1rem', fontSize: '0.82rem', color: '#6d4c06' }}>
                {studentsWithRecup.slice(0, 5).map(n => <li key={n}>{n}</li>)}
                {studentsWithRecup.length > 5 && <li>...y {studentsWithRecup.length - 5} más</li>}
              </ul>
            </div>
          )}
          {studentsWithNoApproved.length > 0 && (
            <div style={{ backgroundColor: '#fde8e8', border: '1px solid #c62828', borderRadius: 10, padding: '1rem 1.25rem' }}>
              <p style={{ fontWeight: 700, color: '#c62828', fontSize: '0.88rem', marginBottom: '0.5rem' }}>
                Estudiantes con núcleos no aprobados: {studentsWithNoApproved.length}
              </p>
              <ul style={{ margin: 0, padding: '0 0 0 1.1rem', fontSize: '0.82rem', color: '#8e1c1c' }}>
                {studentsWithNoApproved.slice(0, 5).map(n => <li key={n}>{n}</li>)}
                {studentsWithNoApproved.length > 5 && <li>...y {studentsWithNoApproved.length - 5} más</li>}
              </ul>
            </div>
          )}
          {sinCalifCount > 0 && (
            <div style={{ backgroundColor: '#f0f0f0', border: '1px solid #aaa', borderRadius: 10, padding: '1rem 1.25rem' }}>
              <p style={{ fontWeight: 700, color: '#555', fontSize: '0.88rem' }}>
                Núcleos sin calificar: {sinCalifCount}
              </p>
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: '1.1rem 1.25rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: 3 }}>Curso</label>
            <select
              value={filterCurso}
              onChange={e => { setFilterCurso(e.target.value); setFilterMateria(''); }}
              style={{ padding: '0.4rem 0.65rem', borderRadius: 7, border: '1px solid #ddd', fontSize: '0.85rem', minWidth: 140 }}
            >
              <option value="">Todos</option>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: 3 }}>Espacio curricular</label>
            <select
              value={filterMateria}
              onChange={e => setFilterMateria(e.target.value)}
              style={{ padding: '0.4rem 0.65rem', borderRadius: 7, border: '1px solid #ddd', fontSize: '0.85rem', minWidth: 160 }}
            >
              <option value="">Todos</option>
              {availableMaterias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: 3 }}>Estado</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ padding: '0.4rem 0.65rem', borderRadius: 7, border: '1px solid #ddd', fontSize: '0.85rem', minWidth: 160 }}
            >
              <option value="">Todos</option>
              {(Object.keys(STATUS_INFO) as StatusKey[]).map(k => (
                <option key={k} value={k}>{STATUS_INFO[k].label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#555', marginBottom: 3 }}>Buscar estudiante</label>
            <input
              type="text"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              placeholder="Apellido o nombre..."
              style={{ padding: '0.4rem 0.65rem', borderRadius: 7, border: '1px solid #ddd', fontSize: '0.85rem', minWidth: 180 }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.845rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a5276', color: '#fff' }}>
                {['Estudiante', 'Curso', 'Espacio curricular', 'Núcleo', 'Eval.', 'Recup. 1', 'Recup. 2', 'Estado', 'Observaciones'].map(h => (
                  <th key={h} style={{ padding: '0.8rem 0.9rem', textAlign: 'left', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No se encontraron registros.</td></tr>
              ) : (
                filteredRows.map((row, i) => (
                  <tr key={`${row.studentId}-${row.coreId}`} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '0.65rem 0.9rem', fontWeight: 600, color: '#1a2940', whiteSpace: 'nowrap' }}>{row.studentName}</td>
                    <td style={{ padding: '0.65rem 0.9rem', whiteSpace: 'nowrap' }}>{row.courseName}</td>
                    <td style={{ padding: '0.65rem 0.9rem' }}>{row.subjectName}</td>
                    <td style={{ padding: '0.65rem 0.9rem', color: '#444', maxWidth: 220 }}>{row.coreTitle}</td>
                    <td style={{ padding: '0.65rem 0.9rem', textAlign: 'center' }}>
                      {row.mainGrade !== null ? <span style={{ fontWeight: 700, color: row.mainGrade >= 6 ? '#27ae60' : '#c62828' }}>{row.mainGrade}</span> : <span style={{ color: '#ccc' }}>-</span>}
                    </td>
                    <td style={{ padding: '0.65rem 0.9rem', textAlign: 'center' }}>
                      {row.r1Grade !== null ? <span style={{ fontWeight: 700, color: row.r1Grade >= 6 ? '#27ae60' : '#c62828' }}>{row.r1Grade}</span> : <span style={{ color: '#ccc' }}>-</span>}
                    </td>
                    <td style={{ padding: '0.65rem 0.9rem', textAlign: 'center' }}>
                      {row.r2Grade !== null ? <span style={{ fontWeight: 700, color: row.r2Grade >= 6 ? '#27ae60' : '#c62828' }}>{row.r2Grade}</span> : <span style={{ color: '#ccc' }}>-</span>}
                    </td>
                    <td style={{ padding: '0.65rem 0.9rem' }}><StatusBadge statusKey={row.statusKey} /></td>
                    <td style={{ padding: '0.65rem 0.9rem', color: '#666', fontSize: '0.8rem', maxWidth: 200 }}>{row.observation || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredRows.length > 0 && (
          <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.75rem', textAlign: 'right' }}>
            Mostrando {filteredRows.length} registros
          </p>
        )}
      </div>
    </div>
  );
}
