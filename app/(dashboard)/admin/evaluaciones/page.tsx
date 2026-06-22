'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';
import { CoreStatus } from '@/types';

const ALL_STATUSES: CoreStatus[] = ['Aprobado', 'En proceso', 'Debe recuperar', 'Recuperatorio 1 pendiente', 'Recuperatorio 2 pendiente', 'No aprobado'];

const statusStyle: Record<CoreStatus, { bg: string; text: string }> = {
  'Aprobado': { bg: '#d4edda', text: '#155724' },
  'En proceso': { bg: '#d6eaf8', text: '#1a5276' },
  'Debe recuperar': { bg: '#fef3c7', text: '#856404' },
  'Recuperatorio 1 pendiente': { bg: '#fef3c7', text: '#856404' },
  'Recuperatorio 2 pendiente': { bg: '#fde8e8', text: '#c62828' },
  'No aprobado': { bg: '#f8d7da', text: '#721c24' },
};

export default function AdminEvaluacionesPage() {
  const { materias, cursos, estudiantes, learningCores, evaluations, evaluationGrades, getCoreStatus } = useAppStore();
  const [filterCurso, setFilterCurso] = useState('');
  const [filterMateria, setFilterMateria] = useState('');

  const filteredMaterias = materias.filter(m =>
    (!filterCurso || m.cursoId === filterCurso) &&
    (!filterMateria || m.id === filterMateria)
  );

  const filteredCores = learningCores.filter(lc =>
    filteredMaterias.some(m => m.id === lc.subjectId)
  );

  // Summary stats
  const totalCores = filteredCores.length;
  const allStats = filteredCores.map(core => {
    const materia = materias.find(m => m.id === core.subjectId);
    const curso = cursos.find(c => c.id === core.courseId);
    const courseStudents = estudiantes.filter(e => curso?.estudiantesIds.includes(e.id) ?? false);
    const counts: Record<CoreStatus, number> = { 'Aprobado': 0, 'En proceso': 0, 'Debe recuperar': 0, 'Recuperatorio 1 pendiente': 0, 'Recuperatorio 2 pendiente': 0, 'No aprobado': 0 };
    courseStudents.forEach(est => {
      const st = getCoreStatus(est.id, core.id);
      counts[st]++;
    });
    return { core, materia, curso, counts, total: courseStudents.length };
  });

  const totalAprobados = allStats.reduce((s, x) => s + x.counts['Aprobado'], 0);
  const totalDebeRecuperar = allStats.reduce((s, x) => s + x.counts['Debe recuperar'] + x.counts['Recuperatorio 1 pendiente'] + x.counts['Recuperatorio 2 pendiente'], 0);
  const totalNoAprobados = allStats.reduce((s, x) => s + x.counts['No aprobado'], 0);

  return (
    <div>
      <PageHeader title="Seguimiento de evaluaciones por núcleo" description="Resumen institucional de núcleos de aprendizaje" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8e8ec]">
          <p className="text-xs text-[#888888] font-medium uppercase tracking-wide mb-1">Núcleos activos</p>
          <p className="text-3xl font-bold text-[#1a5276]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{totalCores}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8e8ec]">
          <p className="text-xs text-[#888888] font-medium uppercase tracking-wide mb-1">Instancias aprobadas</p>
          <p className="text-3xl font-bold text-[#155724]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{totalAprobados}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8e8ec]">
          <p className="text-xs text-[#888888] font-medium uppercase tracking-wide mb-1">Con recuperatorio</p>
          <p className="text-3xl font-bold text-[#856404]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{totalDebeRecuperar}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8e8ec]">
          <p className="text-xs text-[#888888] font-medium uppercase tracking-wide mb-1">No aprobados</p>
          <p className="text-3xl font-bold" style={{ color: '#c62828', fontFamily: "'Barlow Condensed', sans-serif" }}>{totalNoAprobados}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <select
          value={filterCurso}
          onChange={e => { setFilterCurso(e.target.value); setFilterMateria(''); }}
          className="px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
        >
          <option value="">Todos los cursos</option>
          {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>)}
        </select>
        <select
          value={filterMateria}
          onChange={e => setFilterMateria(e.target.value)}
          className="px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
        >
          <option value="">Todos los espacios curriculares</option>
          {filteredMaterias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e8e8ec] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f4f6] border-b border-[#e8e8ec]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Espacio curricular</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Núcleo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Período</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Aprobados</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#888888] uppercase">En proceso</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Debe recuperar</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#888888] uppercase">No aprobados</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ec]">
              {allStats.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[#888888] text-sm">No hay núcleos registrados para el filtro seleccionado.</td>
                </tr>
              ) : (
                allStats.map(({ core, materia, counts, total }) => (
                  <tr key={core.id} className="hover:bg-[#f9f9fb]">
                    <td className="px-4 py-3 text-sm font-medium text-[#111111]">{materia?.nombre || '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#333333]">{core.title}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{
                        backgroundColor: core.period === 'Primer cuatrimestre' ? '#d6eaf8' : core.period === 'Segundo cuatrimestre' ? '#d4edda' : '#fef9c3',
                        color: core.period === 'Primer cuatrimestre' ? '#1a5276' : core.period === 'Segundo cuatrimestre' ? '#155724' : '#856404',
                      }}>
                        {core.period}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {counts['Aprobado'] > 0 ? (
                        <span className="font-bold text-sm px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#d4edda', color: '#155724' }}>{counts['Aprobado']}</span>
                      ) : <span className="text-[#888888] text-sm">0</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {counts['En proceso'] > 0 ? (
                        <span className="font-bold text-sm px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#d6eaf8', color: '#1a5276' }}>{counts['En proceso']}</span>
                      ) : <span className="text-[#888888] text-sm">0</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {(counts['Debe recuperar'] + counts['Recuperatorio 1 pendiente'] + counts['Recuperatorio 2 pendiente']) > 0 ? (
                        <span className="font-bold text-sm px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#fef3c7', color: '#856404' }}>
                          {counts['Debe recuperar'] + counts['Recuperatorio 1 pendiente'] + counts['Recuperatorio 2 pendiente']}
                        </span>
                      ) : <span className="text-[#888888] text-sm">0</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {counts['No aprobado'] > 0 ? (
                        <span className="font-bold text-sm px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>{counts['No aprobado']}</span>
                      ) : <span className="text-[#888888] text-sm">0</span>}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-[#888888]">{total}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
