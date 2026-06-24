'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import type { EvaluationGrade } from '@/types';

// ── helpers ────────────────────────────────────────────────────────────────

function computeStatus(main: string, r1: string, r2: string): string {
  if (!main || main === '') return 'Sin calificar';
  if (main === 'ausente') return 'Ausente';
  const m = parseInt(main);
  if (m >= 6) return 'Aprobado';
  if (!r1 || r1 === '') return 'Debe recuperar';
  if (r1 === 'ausente') return 'Ausente en R1';
  const r = parseInt(r1);
  if (r >= 6) return 'Aprobado en Recuperatorio 1';
  if (!r2 || r2 === '') return 'Recuperatorio 2 pendiente';
  if (r2 === 'ausente') return 'Ausente en R2';
  const r2v = parseInt(r2);
  if (r2v >= 6) return 'Aprobado en Recuperatorio 2';
  return 'No aprobado';
}

// ── sub-components ─────────────────────────────────────────────────────────

interface GradeSelectProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

function GradeSelect({ value, onChange, disabled = false }: GradeSelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        border: '1px solid #d8e0ee',
        borderRadius: '8px',
        padding: '6px 4px',
        width: '90px',
        textAlign: 'center',
        fontSize: '13px',
        backgroundColor: disabled ? '#f0f0f4' : '#fff',
        color: disabled ? '#aaa' : '#111',
        cursor: disabled ? 'not-allowed' : 'pointer',
        outline: 'none',
      }}
    >
      <option value="">Sin calificar</option>
      <option value="ausente">Ausente</option>
      {['1','2','3','4','5','6','7','8','9','10'].map(n => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  );
}

function StatusBadge({ status }: { status: string }) {
  let bg = '#e8e8ec', color = '#888', border = '#d8d8dc';

  if (status === 'Aprobado' || status.startsWith('Aprobado en Recuperatorio')) {
    bg = '#d4edda'; color = '#27ae60'; border = '#c3e6cb';
  } else if (status === 'Debe recuperar' || status === 'Recuperatorio 2 pendiente') {
    bg = '#fff3cd'; color = '#856404'; border = '#ffeeba';
  } else if (status === 'No aprobado') {
    bg = '#f8d7da'; color = '#c62828'; border = '#f5c6cb';
  } else if (status.startsWith('Ausente')) {
    bg = '#e8f0fb'; color = '#1a5276'; border = '#d6e4f0';
  }

  return (
    <span style={{
      backgroundColor: bg, color, border: `1px solid ${border}`,
      borderRadius: '999px', padding: '3px 10px', fontSize: '11px', fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}

const selectStyle: React.CSSProperties = {
  backgroundColor: '#f4f4f6',
  border: '1px solid #d8e0ee',
  borderRadius: '12px',
  padding: '10px 14px',
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  color: '#111',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: '#5a6a8a',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

// ── main page ──────────────────────────────────────────────────────────────

const TEACHER_ID = 'd1';
const PERIODS = ['Primer cuatrimestre', 'Segundo cuatrimestre', 'Anual'] as const;

interface GradeEntry {
  main: string;
  r1: string;
  r2: string;
  obs: string;
}

export default function DocenteCalificacionesPage() {
  const { estudiantes, materias, cursos, learningCores, evaluationGrades, addEvaluationGrade, updateEvaluationGrade } = useAppStore();

  // Selection state
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedCore, setSelectedCore] = useState('');
  const [searched, setSearched] = useState(false);

  // Filter state
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  // Grade state
  const [grades, setGrades] = useState<Record<string, GradeEntry>>({});
  const [pendingChanges, setPendingChanges] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Derived data: teacher's courses and subjects
  const teacherSubjects = materias.filter(m => m.docenteId === TEACHER_ID);
  const teacherCourseIds = [...new Set(teacherSubjects.map(m => m.cursoId))];
  const teacherCourses = cursos.filter(c => teacherCourseIds.includes(c.id));

  const subjectsForCourse = selectedCourse
    ? teacherSubjects.filter(m => m.cursoId === selectedCourse)
    : teacherSubjects;

  const coresForSubjectAndCourse = learningCores.filter(lc =>
    lc.teacherId === TEACHER_ID &&
    (!selectedSubject || lc.subjectId === selectedSubject) &&
    (!selectedCourse || lc.courseId === selectedCourse) &&
    (!selectedPeriod || lc.period === selectedPeriod)
  );

  // Students for selected course
  const selectedCourseData = cursos.find(c => c.id === selectedCourse);
  const courseStudents = selectedCourseData
    ? estudiantes.filter(e => selectedCourseData.estudiantesIds.includes(e.id))
    : [];

  const handleSearch = () => {
    if (!selectedCourse || !selectedSubject || !selectedPeriod || !selectedCore) return;

    // Pre-populate grades from existing evaluationGrades
    const newGrades: Record<string, GradeEntry> = {};
    courseStudents.forEach(st => {
      const main = evaluationGrades.find(
        g => g.studentId === st.id && g.learningCoreId === selectedCore && g.instanceType === 'evaluacion_principal'
      );
      const r1 = evaluationGrades.find(
        g => g.studentId === st.id && g.learningCoreId === selectedCore && g.instanceType === 'recuperatorio_1'
      );
      const r2 = evaluationGrades.find(
        g => g.studentId === st.id && g.learningCoreId === selectedCore && g.instanceType === 'recuperatorio_2'
      );
      newGrades[st.id] = {
        main: main ? (main.grade === -1 ? 'ausente' : String(main.grade)) : '',
        r1: r1 ? (r1.grade === -1 ? 'ausente' : String(r1.grade)) : '',
        r2: r2 ? (r2.grade === -1 ? 'ausente' : String(r2.grade)) : '',
        obs: main?.observation || '',
      };
    });

    setGrades(newGrades);
    setPendingChanges(0);
    setSaveSuccess(false);
    setSearched(true);
  };

  const updateGrade = (studentId: string, field: keyof GradeEntry, value: string) => {
    setGrades(prev => ({
      ...prev,
      [studentId]: { ...(prev[studentId] || { main: '', r1: '', r2: '', obs: '' }), [field]: value },
    }));
    setPendingChanges(c => c + 1);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    const coreData = learningCores.find(lc => lc.id === selectedCore);
    if (!coreData) return;

    const today = new Date().toISOString().split('T')[0];

    Object.entries(grades).forEach(([studentId, entry]) => {
      const save = (instanceType: EvaluationGrade['instanceType'], gradeStr: string) => {
        if (!gradeStr) return;
        const grade = gradeStr === 'ausente' ? -1 : parseInt(gradeStr);
        const existing = evaluationGrades.find(
          g => g.studentId === studentId && g.learningCoreId === selectedCore && g.instanceType === instanceType
        );
        if (existing) {
          updateEvaluationGrade(existing.id, { grade, observation: entry.obs, date: today });
        } else {
          addEvaluationGrade({
            studentId,
            subjectId: selectedSubject,
            courseId: selectedCourse,
            learningCoreId: selectedCore,
            evaluationId: '',
            instanceType,
            grade,
            date: today,
            observation: instanceType === 'evaluacion_principal' ? entry.obs : '',
            teacherId: TEACHER_ID,
            visibleForStudent: true,
          });
        }
      };
      save('evaluacion_principal', entry.main);
      save('recuperatorio_1', entry.r1);
      save('recuperatorio_2', entry.r2);
    });

    setPendingChanges(0);
    setSaveSuccess(true);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setStatusFilter('');
    setShowOnlyPending(false);
  };

  // Filtered students for the table
  const filteredStudents = courseStudents.filter(st => {
    const entry = grades[st.id] || { main: '', r1: '', r2: '', obs: '' };
    const status = computeStatus(entry.main, entry.r1, entry.r2);

    if (searchText) {
      const q = searchText.toLowerCase();
      if (!st.nombre.toLowerCase().includes(q) && !st.apellido.toLowerCase().includes(q)) return false;
    }

    if (statusFilter && status !== statusFilter) return false;

    if (showOnlyPending) {
      const isPending = status === 'Sin calificar' || status === 'Debe recuperar' || status === 'Recuperatorio 2 pendiente';
      if (!isPending) return false;
    }

    return true;
  });

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '28px', fontWeight: 800, color: '#111111', margin: 0 }}>
          Carga de calificaciones
        </h1>
        <p style={{ color: '#5a6a8a', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>
          Seleccioná el curso y espacio curricular para cargar las calificaciones del núcleo de aprendizaje correspondiente.
        </p>
      </div>

      {/* Info banner */}
      <div style={{ background: 'rgba(26,82,118,0.08)', border: '1px solid rgba(26,82,118,0.20)', borderRadius: '12px', padding: '12px 20px', marginBottom: '24px' }}>
        <p style={{ color: '#1a5276', fontSize: '14px', margin: 0 }}>
          <strong>Aviso:</strong> Recuerde guardar las calificaciones luego de completar la carga.
          Las notas se asociarán al núcleo de aprendizaje seleccionado y serán visibles para los estudiantes.
        </p>
      </div>

      {/* Selection panel */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8e8ec', padding: '24px', marginBottom: '20px' }}>
        <p style={{ fontWeight: 700, fontSize: '15px', color: '#111', margin: '0 0 16px 0' }}>Seleccionar criterios</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>Curso y división</label>
            <select
              style={selectStyle}
              value={selectedCourse}
              onChange={e => { setSelectedCourse(e.target.value); setSelectedSubject(''); setSelectedCore(''); setSearched(false); }}
            >
              <option value="">Seleccionar curso...</option>
              {teacherCourses.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} {c.division} – {c.turno}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Espacio curricular</label>
            <select
              style={selectStyle}
              value={selectedSubject}
              onChange={e => { setSelectedSubject(e.target.value); setSelectedCore(''); setSearched(false); }}
              disabled={!selectedCourse}
            >
              <option value="">Seleccionar materia...</option>
              {subjectsForCourse.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Período</label>
            <select
              style={selectStyle}
              value={selectedPeriod}
              onChange={e => { setSelectedPeriod(e.target.value); setSelectedCore(''); setSearched(false); }}
            >
              <option value="">Seleccionar período...</option>
              {PERIODS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Núcleo de aprendizaje</label>
            <select
              style={selectStyle}
              value={selectedCore}
              onChange={e => { setSelectedCore(e.target.value); setSearched(false); }}
              disabled={!selectedSubject || !selectedPeriod}
            >
              <option value="">Seleccionar núcleo...</option>
              {coresForSubjectAndCourse.map(lc => (
                <option key={lc.id} value={lc.id}>{lc.title}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={!selectedCourse || !selectedSubject || !selectedPeriod || !selectedCore}
          style={{
            backgroundColor: (!selectedCourse || !selectedSubject || !selectedPeriod || !selectedCore) ? '#e0e0e0' : '#c62828',
            color: (!selectedCourse || !selectedSubject || !selectedPeriod || !selectedCore) ? '#999' : '#fff',
            padding: '10px 24px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: (!selectedCourse || !selectedSubject || !selectedPeriod || !selectedCore) ? 'not-allowed' : 'pointer',
          }}
        >
          Buscar estudiantes
        </button>
      </div>

      {searched && (
        <>
          {/* Filter bar */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e8e8ec', padding: '16px 20px', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Buscar estudiante por nombre o apellido..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ border: '1px solid #d8e0ee', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', minWidth: '220px', flex: '1', outline: 'none' }}
            />

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ border: '1px solid #d8e0ee', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', backgroundColor: '#f4f4f6', outline: 'none' }}
            >
              <option value="">Todos los estados</option>
              <option value="Sin calificar">Sin calificar</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Debe recuperar">Debe recuperar</option>
              <option value="No aprobado">No aprobado</option>
              <option value="Ausente">Ausente</option>
            </select>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#5a6a8a', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={showOnlyPending}
                onChange={e => setShowOnlyPending(e.target.checked)}
                style={{ accentColor: '#1a5276' }}
              />
              Mostrar solo pendientes
            </label>

            <button
              onClick={handleClearFilters}
              style={{ border: '1px solid #d8e0ee', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', backgroundColor: '#f4f4f6', color: '#5a6a8a', cursor: 'pointer' }}
            >
              Limpiar filtros
            </button>
          </div>

          {/* Grade entry table */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e8e8ec', overflow: 'hidden', marginBottom: '16px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1a5276' }}>
                    {['DNI', 'Apellido', 'Nombre', 'Evaluación', 'Recuperatorio 1', 'Recuperatorio 2', 'Estado', 'Observaciones'].map(col => (
                      <th key={col} style={{ padding: '12px 14px', color: '#fff', fontWeight: 600, fontSize: '12px', textAlign: 'left', whiteSpace: 'nowrap' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
                        No se encontraron estudiantes con los filtros aplicados.
                      </td>
                    </tr>
                  ) : filteredStudents.map((student, idx) => {
                    const entry = grades[student.id] || { main: '', r1: '', r2: '', obs: '' };
                    const mainNum = entry.main && entry.main !== 'ausente' ? parseInt(entry.main) : -1;
                    const r1Num = entry.r1 && entry.r1 !== 'ausente' ? parseInt(entry.r1) : -1;
                    const status = computeStatus(entry.main, entry.r1, entry.r2);

                    const r1Disabled = mainNum >= 6 || !entry.main;
                    const r2Disabled = r1Num >= 6 || !entry.r1 || mainNum >= 6 || !entry.main;

                    return (
                      <tr key={student.id} style={{ backgroundColor: idx % 2 === 0 ? '#fff' : '#f4f4f6', borderBottom: '1px solid #e8e8ec' }}>
                        <td style={{ padding: '10px 14px', fontSize: '13px', color: '#5a6a8a', whiteSpace: 'nowrap' }}>{student.dni}</td>
                        <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#111' }}>{student.apellido}</td>
                        <td style={{ padding: '10px 14px', fontSize: '13px', color: '#111' }}>{student.nombre}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <GradeSelect value={entry.main} onChange={v => updateGrade(student.id, 'main', v)} />
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <GradeSelect value={entry.r1} onChange={v => updateGrade(student.id, 'r1', v)} disabled={r1Disabled} />
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <GradeSelect value={entry.r2} onChange={v => updateGrade(student.id, 'r2', v)} disabled={r2Disabled} />
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <StatusBadge status={status} />
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <input
                            type="text"
                            placeholder="Observación..."
                            value={entry.obs}
                            onChange={e => updateGrade(student.id, 'obs', e.target.value)}
                            style={{ border: '1px solid #d8e0ee', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', width: '150px', outline: 'none' }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save area */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              {saveSuccess && (
                <p style={{ color: '#27ae60', fontSize: '13px', fontWeight: 600, margin: 0 }}>
                  ✓ Calificaciones guardadas correctamente.
                </p>
              )}
              {!saveSuccess && (
                <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>
                  {pendingChanges} cambio(s) sin guardar
                </p>
              )}
            </div>
            <button
              onClick={handleSave}
              style={{ backgroundColor: '#c62828', color: 'white', padding: '10px 28px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#7a1515')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#c62828')}
            >
              Guardar calificaciones
            </button>
          </div>
        </>
      )}
    </div>
  );
}

