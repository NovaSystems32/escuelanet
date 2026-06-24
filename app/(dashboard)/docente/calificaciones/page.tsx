'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';

// ── helpers ────────────────────────────────────────────────────────────────

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

function statusBadgeStyle(status: string): React.CSSProperties {
  if (status.startsWith('Aprobado')) return { background: '#d4edda', color: '#27ae60', border: '1px solid #c3e6cb' };
  if (status === 'Debe recuperar' || status === 'R2 pendiente') return { background: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' };
  if (status === 'No aprobado') return { background: '#f8d7da', color: '#c62828', border: '1px solid #f5c6cb' };
  if (status === 'Sin calificar') return { background: '#e8e8ec', color: '#888', border: '1px solid #d8d8dc' };
  return { background: '#e8f0fb', color: '#1a5276', border: '1px solid #d6e4f0' };
}

// ── sub-components ─────────────────────────────────────────────────────────

function GradeSelect({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      style={{
        width: '72px',
        padding: '4px 2px',
        fontSize: '13px',
        textAlign: 'center',
        border: '1px solid #d8e0ee',
        borderRadius: '6px',
        background: disabled ? '#f0f0f0' : 'white',
        color: disabled ? '#aaa' : '#111',
        cursor: disabled ? 'not-allowed' : 'pointer',
        outline: 'none',
      }}
    >
      <option value="">-</option>
      <option value="ausente">Aus.</option>
      {['1','2','3','4','5','6','7','8','9','10'].map(n => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
  );
}

// ── main page ──────────────────────────────────────────────────────────────

export default function DocenteCalificacionesPage() {
  const { user } = useAuthStore();
  const { estudiantes, materias, cursos, docentes, simpleGrades, upsertSimpleGrade } = useAppStore();

  // Determine teacher id from logged-in user
  const teacherProfile = docentes.find(d => d.email === user?.email);
  const teacherId = teacherProfile?.id || 'd1';

  // Selection state
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [searched, setSearched] = useState(false);
  const [activeTab, setActiveTab] = useState<'eval1-4' | 'eval5-8' | 'estado'>('eval1-4');
  const [pendingChanges, setPendingChanges] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local grade edits: key = `${studentId}-${evalNum}-${field}` where field is 'n','r1','r2','obs'
  const [localGrades, setLocalGrades] = useState<Record<string, string>>({});

  // Derived data
  const teacherSubjects = materias.filter(m => m.docenteId === teacherId);
  const teacherCourseIds = [...new Set(teacherSubjects.map(m => m.cursoId))];
  const teacherCourses = cursos.filter(c => teacherCourseIds.includes(c.id));
  const subjectsForCourse = selectedCourse
    ? teacherSubjects.filter(m => m.cursoId === selectedCourse)
    : [];

  // Students filtered by selected course
  const selectedCourseData = cursos.find(c => c.id === selectedCourse);
  const filteredStudents = searched && selectedCourseData
    ? estudiantes.filter(e => selectedCourseData.estudiantesIds.includes(e.id) && e.activo)
    : [];

  // Grade access helpers
  const getGradeFromStore = (studentId: string, evalNum: number, field: 'n' | 'r1' | 'r2'): string => {
    const stored = simpleGrades.find(g =>
      g.studentId === studentId && g.courseId === selectedCourse &&
      g.subjectId === selectedSubject && g.schoolYear === parseInt(selectedYear) &&
      g.evaluationNumber === evalNum
    );
    if (!stored) return '';
    return field === 'n' ? stored.grade : field === 'r1' ? stored.recoveryOneGrade : stored.recoveryTwoGrade;
  };

  const getGrade = (studentId: string, evalNum: number, field: 'n' | 'r1' | 'r2'): string => {
    const key = `${studentId}-${evalNum}-${field}`;
    if (key in localGrades) return localGrades[key];
    return getGradeFromStore(studentId, evalNum, field);
  };

  const setGrade = (studentId: string, evalNum: number, field: 'n' | 'r1' | 'r2', value: string) => {
    const key = `${studentId}-${evalNum}-${field}`;
    setLocalGrades(prev => ({ ...prev, [key]: value }));
    setPendingChanges(prev => prev + 1);
    setSaveSuccess(false);
  };

  const handleSave = () => {
    const processed = new Set<string>();
    Object.keys(localGrades).forEach(key => {
      const parts = key.split('-');
      const studentId = parts[0];
      const evalNum = parseInt(parts[1]);
      const storeKey = `${studentId}-${evalNum}`;
      if (processed.has(storeKey)) return;
      processed.add(storeKey);

      const grade = localGrades[`${studentId}-${evalNum}-n`] ?? getGradeFromStore(studentId, evalNum, 'n');
      const r1 = localGrades[`${studentId}-${evalNum}-r1`] ?? getGradeFromStore(studentId, evalNum, 'r1');
      const r2 = localGrades[`${studentId}-${evalNum}-r2`] ?? getGradeFromStore(studentId, evalNum, 'r2');

      upsertSimpleGrade({
        id: `sg-${studentId}-${selectedSubject}-${evalNum}`,
        studentId,
        courseId: selectedCourse,
        subjectId: selectedSubject,
        teacherId,
        schoolYear: parseInt(selectedYear),
        evaluationNumber: evalNum,
        grade,
        recoveryOneGrade: r1,
        recoveryTwoGrade: r2,
        observation: localGrades[`${studentId}-${evalNum}-obs`] || '',
        updatedAt: new Date().toISOString().split('T')[0],
      });
    });
    setPendingChanges(0);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const selectedCourseObj = cursos.find(c => c.id === selectedCourse);
  const selectedSubjectObj = materias.find(m => m.id === selectedSubject);

  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: '#f4f4f6',
    border: '1px solid #d8e0ee',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    color: '#111',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#3a3a3a',
    marginBottom: '6px',
  };

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '28px', fontWeight: 800, color: '#111111', margin: 0 }}>
          Carga de calificaciones
        </h1>
        <p style={{ color: '#5a6a8a', fontSize: '14px', marginTop: '4px', margin: '4px 0 0 0' }}>
          Seleccioná el curso y espacio curricular para cargar las calificaciones del ciclo lectivo.
        </p>
      </div>

      {/* Info banner */}
      <div style={{ background: 'rgba(26,82,118,0.08)', border: '1px solid rgba(26,82,118,0.20)', borderRadius: '12px', padding: '12px 20px', marginBottom: '20px' }}>
        <p style={{ color: '#1a5276', fontSize: '14px', margin: 0 }}>
          <strong>Aviso:</strong> Recuerde guardar las calificaciones luego de completar la carga. Las notas se asociarán al curso, espacio curricular y ciclo lectivo seleccionado.
        </p>
      </div>

      {/* Selection panel */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '18px', fontWeight: 700, color: '#1a5276', marginBottom: '16px', marginTop: 0 }}>
          Selección de curso y espacio curricular
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: '16px' }}>
          <div>
            <label style={labelStyle}>Curso</label>
            <select
              value={selectedCourse}
              onChange={e => { setSelectedCourse(e.target.value); setSelectedSubject(''); setSearched(false); setLocalGrades({}); setPendingChanges(0); }}
              style={selectStyle}
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
              value={selectedSubject}
              onChange={e => { setSelectedSubject(e.target.value); setSearched(false); setLocalGrades({}); setPendingChanges(0); }}
              disabled={!selectedCourse}
              style={{ ...selectStyle, opacity: !selectedCourse ? 0.6 : 1 }}
            >
              <option value="">Seleccionar espacio...</option>
              {subjectsForCourse.map(m => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Ciclo lectivo</label>
            <select value={selectedYear} onChange={e => { setSelectedYear(e.target.value); setSearched(false); setLocalGrades({}); setPendingChanges(0); }} style={selectStyle}>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { if (selectedCourse && selectedSubject) { setSearched(true); setActiveTab('eval1-4'); } }}
            disabled={!selectedCourse || !selectedSubject}
            style={{ backgroundColor: '#c62828', color: 'white', padding: '10px 24px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: (!selectedCourse || !selectedSubject) ? 'not-allowed' : 'pointer', opacity: (!selectedCourse || !selectedSubject) ? 0.5 : 1 }}
          >
            Buscar
          </button>
          {searched && (
            <button
              onClick={() => { setSearched(false); setLocalGrades({}); setPendingChanges(0); }}
              style={{ backgroundColor: 'white', color: '#1a5276', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', border: '2px solid #1a5276', cursor: 'pointer' }}
            >
              Editar filtros
            </button>
          )}
        </div>
      </div>

      {/* Study plan info card */}
      {searched && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '20px', borderLeft: '4px solid #c9a227' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#3a3a3a', marginBottom: '4px', margin: '0 0 4px 0' }}>Detalle del plan de estudios</p>
          <p style={{ fontSize: '13px', color: '#5a6a8a', margin: 0 }}>
            {selectedCourseObj ? `${selectedCourseObj.nombre} ${selectedCourseObj.division}` : ''}{selectedSubjectObj ? ` · ${selectedSubjectObj.nombre}` : ''} · Instituto Santiago Ramón y Cajal · Ciclo lectivo {selectedYear}
          </p>
        </div>
      )}

      {/* Tabs + Table */}
      {searched && filteredStudents.length > 0 && (
        <div>
          {/* Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', borderBottom: '2px solid #e8e8ec' }}>
            {(['eval1-4', 'eval5-8', 'estado'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ padding: '8px 14px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer', borderBottom: activeTab === tab ? '2px solid #c62828' : '2px solid transparent', marginBottom: '-2px', backgroundColor: 'transparent', color: activeTab === tab ? '#c62828' : '#888' }}
              >
                {tab === 'eval1-4' ? 'Evaluaciones 1–4' : tab === 'eval5-8' ? 'Evaluaciones 5–8' : 'Estado académico'}
              </button>
            ))}
          </div>

          {/* Grade table (eval1-4 and eval5-8 tabs) */}
          {(activeTab === 'eval1-4' || activeTab === 'eval5-8') && (
            <div style={{ overflowX: 'auto', background: 'white', borderRadius: '0 0 16px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <p className="scroll-hint">Deslizá la tabla para ver todas las evaluaciones.</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '900px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1a5276', color: 'white' }}>
                    <th rowSpan={2} style={{ padding: '10px 12px', textAlign: 'left', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.2)' }}>N° Doc.</th>
                    <th rowSpan={2} style={{ padding: '10px 8px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Apellido</th>
                    <th rowSpan={2} style={{ padding: '10px 8px', textAlign: 'left', borderRight: '1px solid rgba(255,255,255,0.2)' }}>Nombre</th>
                    {(activeTab === 'eval1-4' ? [1,2,3,4] : [5,6,7,8]).map(n => (
                      <th key={n} colSpan={3} style={{ padding: '8px 4px', textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.15)', borderLeft: '1px solid rgba(255,255,255,0.15)' }}>
                        Evaluación {n}
                      </th>
                    ))}
                  </tr>
                  <tr style={{ backgroundColor: '#2d4a8a', color: 'white' }}>
                    {(activeTab === 'eval1-4' ? [1,2,3,4] : [5,6,7,8]).map(n => (
                      <React.Fragment key={n}>
                        <th style={{ padding: '6px 4px', textAlign: 'center', fontSize: '11px', fontWeight: 600, borderLeft: '1px solid rgba(255,255,255,0.15)' }}>N</th>
                        <th style={{ padding: '6px 4px', textAlign: 'center', fontSize: '11px', fontWeight: 600 }}>R1</th>
                        <th style={{ padding: '6px 4px', textAlign: 'center', fontSize: '11px', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.15)' }}>R2</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, idx) => (
                    <tr key={student.id} style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#f4f4f6' }}>
                      <td style={{ padding: '8px 12px', whiteSpace: 'nowrap', color: '#5a6a8a', fontSize: '12px' }}>{student.dni || '-'}</td>
                      <td style={{ padding: '8px', fontWeight: 600, color: '#111' }}>{student.apellido}</td>
                      <td style={{ padding: '8px', color: '#3a3a3a' }}>{student.nombre}</td>
                      {(activeTab === 'eval1-4' ? [1,2,3,4] : [5,6,7,8]).map(evalNum => {
                        const n = getGrade(student.id, evalNum, 'n');
                        const r1 = getGrade(student.id, evalNum, 'r1');
                        const r2 = getGrade(student.id, evalNum, 'r2');
                        const nApproved = n && n !== 'ausente' && parseInt(n) >= 6;
                        const r1Approved = r1 && r1 !== 'ausente' && parseInt(r1) >= 6;
                        return (
                          <React.Fragment key={evalNum}>
                            <td style={{ padding: '4px', textAlign: 'center', borderLeft: '1px solid #e8e8ec' }}>
                              <GradeSelect value={n} onChange={v => setGrade(student.id, evalNum, 'n', v)} />
                            </td>
                            <td style={{ padding: '4px', textAlign: 'center' }}>
                              <GradeSelect value={r1} onChange={v => setGrade(student.id, evalNum, 'r1', v)} disabled={!!nApproved || !n} />
                            </td>
                            <td style={{ padding: '4px', textAlign: 'center', borderRight: '1px solid #e8e8ec' }}>
                              <GradeSelect value={r2} onChange={v => setGrade(student.id, evalNum, 'r2', v)} disabled={!!nApproved || !!r1Approved || !r1} />
                            </td>
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Estado académico tab */}
          {activeTab === 'estado' && (
            <div style={{ background: 'white', borderRadius: '0 0 16px 16px', padding: '0', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1a5276', color: 'white' }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>N° Doc.</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>Apellido</th>
                    <th style={{ padding: '10px 12px', textAlign: 'left' }}>Nombre</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>Eval. aprobadas</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>Pendientes</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center' }}>No aprobadas</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Estado general</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, idx) => {
                    const statuses = [1,2,3,4,5,6,7,8].map(en =>
                      computeEvalStatus(getGrade(student.id, en, 'n'), getGrade(student.id, en, 'r1'), getGrade(student.id, en, 'r2'))
                    );
                    const approved = statuses.filter(s => s.startsWith('Aprobado')).length;
                    const pending = statuses.filter(s => s === 'Debe recuperar' || s === 'R2 pendiente').length;
                    const noApproved = statuses.filter(s => s === 'No aprobado').length;
                    const ungraded = statuses.filter(s => s === 'Sin calificar').length;
                    let generalStatus = 'Al día';
                    if (ungraded === 8) generalStatus = 'Sin calificaciones';
                    else if (noApproved > 0 || pending > 2) generalStatus = 'En riesgo académico';
                    else if (pending > 0) generalStatus = 'Debe recuperar';

                    return (
                      <tr key={student.id} style={{ backgroundColor: idx % 2 === 0 ? 'white' : '#f4f4f6' }}>
                        <td style={{ padding: '10px 12px', color: '#5a6a8a', fontSize: '12px' }}>{student.dni || '-'}</td>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{student.apellido}</td>
                        <td style={{ padding: '10px 12px', color: '#3a3a3a' }}>{student.nombre}</td>
                        <td style={{ textAlign: 'center', padding: '10px 8px' }}><span style={{ fontWeight: 700, color: '#27ae60' }}>{approved}</span></td>
                        <td style={{ textAlign: 'center', padding: '10px 8px' }}><span style={{ fontWeight: 700, color: '#856404' }}>{pending}</span></td>
                        <td style={{ textAlign: 'center', padding: '10px 8px' }}><span style={{ fontWeight: 700, color: '#c62828' }}>{noApproved}</span></td>
                        <td style={{ textAlign: 'center', padding: '8px' }}>
                          <span style={{ ...statusBadgeStyle(generalStatus), padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                            {generalStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Save section */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '16px', padding: '16px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div>
              {saveSuccess ? (
                <span style={{ color: '#27ae60', fontWeight: 600, fontSize: '14px' }}>✓ Calificaciones guardadas correctamente</span>
              ) : (
                <span style={{ color: '#888', fontSize: '14px' }}>{pendingChanges > 0 ? `${pendingChanges} cambio(s) sin guardar` : 'Sin cambios pendientes'}</span>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={pendingChanges === 0}
              style={{ backgroundColor: pendingChanges === 0 ? '#ccc' : '#c62828', color: 'white', padding: '10px 28px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: pendingChanges === 0 ? 'default' : 'pointer' }}
              onMouseEnter={e => { if (pendingChanges > 0) (e.currentTarget as HTMLElement).style.backgroundColor = '#7a1515'; }}
              onMouseLeave={e => { if (pendingChanges > 0) (e.currentTarget as HTMLElement).style.backgroundColor = '#c62828'; }}
            >
              Guardar calificaciones
            </button>
          </div>
        </div>
      )}

      {/* Empty state after search */}
      {searched && filteredStudents.length === 0 && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '48px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <p style={{ color: '#888', fontSize: '15px' }}>No hay estudiantes registrados en el curso seleccionado.</p>
        </div>
      )}
    </div>
  );
}
