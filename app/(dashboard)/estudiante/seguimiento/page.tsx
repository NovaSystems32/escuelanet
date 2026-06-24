'use client';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

type StatusKey = 'Aprobado' | 'AprobadoR1' | 'AprobadoR2' | 'DebeRecuperar' | 'R2Pendiente' | 'NoAprobado' | 'SinCalificar' | 'Ausente';

interface StatusInfo {
  label: string;
  bg: string;
  color: string;
}

const STATUS_INFO: Record<StatusKey, StatusInfo> = {
  Aprobado:      { label: 'Aprobado',               bg: '#d4edda', color: '#27ae60' },
  AprobadoR1:    { label: 'Aprobado en Recup. 1',   bg: '#c8f0da', color: '#1e8449' },
  AprobadoR2:    { label: 'Aprobado en Recup. 2',   bg: '#b7e4cc', color: '#1a7040' },
  DebeRecuperar: { label: 'Debe recuperar',          bg: '#fff3cd', color: '#856404' },
  R2Pendiente:   { label: 'Recuperatorio 2 pend.',  bg: '#ffe0b2', color: '#e65100' },
  NoAprobado:    { label: 'No aprobado',             bg: '#f8d7da', color: '#c62828' },
  SinCalificar:  { label: 'Sin calificar',           bg: '#e8e8ec', color: '#666' },
  Ausente:       { label: 'Ausente',                 bg: '#cdd6e0', color: '#3d566e' },
};

function computeStatus(
  mainGrade: number | null,
  r1Grade: number | null,
  r2Grade: number | null,
  absent: boolean
): StatusKey {
  if (absent) return 'Ausente';
  if (mainGrade === null) return 'SinCalificar';
  if (mainGrade >= 6) return 'Aprobado';
  if (r1Grade !== null) {
    if (r1Grade >= 6) return 'AprobadoR1';
    if (r2Grade !== null) {
      if (r2Grade >= 6) return 'AprobadoR2';
      return 'NoAprobado';
    }
    return 'R2Pendiente';
  }
  return 'DebeRecuperar';
}

function StatusBadge({ statusKey }: { statusKey: StatusKey }) {
  const s = STATUS_INFO[statusKey];
  return (
    <span style={{ backgroundColor: s.bg, color: s.color, borderRadius: 6, padding: '2px 10px', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

export default function EstudianteSeguimientoPage() {
  const { user } = useAuthStore();
  const { estudiantes, materias, learningCores, evaluationGrades, appUsers } = useAppStore();

  const appUser = appUsers.find(u => u.username === user?.email?.split('@')[0]) ||
    appUsers.find(u => u.role === 'estudiante' && user?.email?.includes('estudiante'));
  const studentId = appUser?.linkedProfileId || 'e1';
  const student = estudiantes.find(e => e.id === studentId);
  const studentMaterias = materias.filter(m => m.cursoId === student?.curso);

  // Build per-core status for student
  interface CoreRow {
    coreId: string;
    coreTitle: string;
    mainGrade: number | null;
    r1Grade: number | null;
    r2Grade: number | null;
    statusKey: StatusKey;
    observation: string;
  }

  interface SubjectGroup {
    subjectId: string;
    subjectName: string;
    cores: CoreRow[];
  }

  const subjectGroups: SubjectGroup[] = studentMaterias.map(mat => {
    const cores = learningCores.filter(lc => lc.subjectId === mat.id && lc.courseId === mat.cursoId);
    const coreRows: CoreRow[] = cores.map(core => {
      const grades = evaluationGrades.filter(g => g.studentId === studentId && g.learningCoreId === core.id);
      const main = grades.find(g => g.instanceType === 'evaluacion_principal');
      const r1 = grades.find(g => g.instanceType === 'recuperatorio_1');
      const r2 = grades.find(g => g.instanceType === 'recuperatorio_2');
      const mainGrade = main?.grade ?? null;
      const r1Grade = r1?.grade ?? null;
      const r2Grade = r2?.grade ?? null;
      const statusKey = computeStatus(mainGrade, r1Grade, r2Grade, false);
      const observation = main?.observation || r1?.observation || r2?.observation || '';
      return { coreId: core.id, coreTitle: core.title, mainGrade, r1Grade, r2Grade, statusKey, observation };
    });
    return { subjectId: mat.id, subjectName: mat.nombre, cores: coreRows };
  });

  // Summary counts
  const allCores = subjectGroups.flatMap(sg => sg.cores);
  const totalSubjects = studentMaterias.length;
  const approvedCores = allCores.filter(c => c.statusKey === 'Aprobado' || c.statusKey === 'AprobadoR1' || c.statusKey === 'AprobadoR2').length;
  const pendingCores = allCores.filter(c => c.statusKey === 'DebeRecuperar' || c.statusKey === 'R2Pendiente').length;
  const failedCores = allCores.filter(c => c.statusKey === 'NoAprobado').length;

  const summaryCards = [
    { label: 'Espacios curriculares', value: totalSubjects, bg: 'linear-gradient(135deg, #1a5276, #154360)', textColor: '#fff' },
    { label: 'Núcleos aprobados', value: approvedCores, bg: 'linear-gradient(135deg, #1e8449, #145a32)', textColor: '#fff' },
    { label: 'Núcleos pendientes', value: pendingCores, bg: 'linear-gradient(135deg, #c9a227, #9a7d0a)', textColor: '#fff' },
    { label: 'No aprobados', value: failedCores, bg: 'linear-gradient(135deg, #c62828, #922020)', textColor: '#fff' },
  ];

  const gradeDisplay = (g: number | null) => g !== null ? String(g) : '-';

  return (
    <div style={{ backgroundColor: '#f4f4f6', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '2rem', color: '#1a2940', marginBottom: 4 }}>
            Mi seguimiento académico
          </h1>
          <p style={{ color: '#555', fontSize: '0.95rem' }}>Estado de tus aprendizajes y evaluaciones por espacio curricular</p>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {summaryCards.map(card => (
            <div key={card.label} style={{ background: card.bg, borderRadius: 12, padding: '1.25rem 1.5rem', color: card.textColor, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{card.label}</p>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '2.2rem', lineHeight: 1 }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Subject cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {subjectGroups.map(sg => {
            const subjectStatus = sg.cores.some(c => c.statusKey === 'NoAprobado')
              ? { label: 'Con no aprobados', color: '#c62828', bg: '#fde8e8' }
              : sg.cores.some(c => c.statusKey === 'DebeRecuperar' || c.statusKey === 'R2Pendiente')
              ? { label: 'Con recuperatorios', color: '#856404', bg: '#fff3cd' }
              : sg.cores.every(c => c.statusKey === 'Aprobado' || c.statusKey === 'AprobadoR1' || c.statusKey === 'AprobadoR2')
              ? { label: 'Al día', color: '#27ae60', bg: '#d4edda' }
              : { label: 'En proceso', color: '#1a5276', bg: '#e8f4fd' };

            return (
              <div key={sg.subjectId} style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <div style={{ backgroundColor: 'rgba(26,82,118,0.06)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee' }}>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1.15rem', color: '#1a2940', margin: 0 }}>
                    {sg.subjectName}
                  </h3>
                  <span style={{ backgroundColor: subjectStatus.bg, color: subjectStatus.color, borderRadius: 6, padding: '3px 12px', fontWeight: 700, fontSize: '0.8rem' }}>
                    {subjectStatus.label}
                  </span>
                </div>
                {sg.cores.length === 0 ? (
                  <p style={{ padding: '1rem 1.25rem', color: '#aaa', fontSize: '0.85rem' }}>Sin núcleos de aprendizaje cargados.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#1a5276', color: '#fff' }}>
                          <th style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>Núcleo de aprendizaje</th>
                          <th style={{ padding: '0.65rem 1rem', textAlign: 'center', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>Evaluación</th>
                          <th style={{ padding: '0.65rem 1rem', textAlign: 'center', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>Recup. 1</th>
                          <th style={{ padding: '0.65rem 1rem', textAlign: 'center', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>Recup. 2</th>
                          <th style={{ padding: '0.65rem 1rem', textAlign: 'center', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sg.cores.map((core, i) => (
                          <tr key={core.coreId} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f8f9fa', borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '0.75rem 1rem', color: '#1a2940', fontWeight: 500 }}>{core.coreTitle}</td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                              {core.mainGrade !== null ? (
                                <span style={{ fontWeight: 700, color: core.mainGrade >= 6 ? '#27ae60' : '#c62828' }}>{core.mainGrade}</span>
                              ) : <span style={{ color: '#bbb' }}>-</span>}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                              {core.r1Grade !== null ? (
                                <span style={{ fontWeight: 700, color: core.r1Grade >= 6 ? '#27ae60' : '#c62828' }}>{core.r1Grade}</span>
                              ) : <span style={{ color: '#bbb' }}>-</span>}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                              {core.r2Grade !== null ? (
                                <span style={{ fontWeight: 700, color: core.r2Grade >= 6 ? '#27ae60' : '#c62828' }}>{core.r2Grade}</span>
                              ) : <span style={{ color: '#bbb' }}>-</span>}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                              <StatusBadge statusKey={core.statusKey} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
