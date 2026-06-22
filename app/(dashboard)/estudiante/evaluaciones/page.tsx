'use client';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';
import { CoreStatus } from '@/types';

const STUDENT_ID = 'e1';
const COURSE_ID = 'c1';

const statusStyle: Record<CoreStatus, { bg: string; text: string; label: string }> = {
  'Aprobado': { bg: '#d4edda', text: '#155724', label: 'Aprobado' },
  'En proceso': { bg: '#d6eaf8', text: '#1a5276', label: 'En proceso' },
  'Debe recuperar': { bg: '#fef3c7', text: '#856404', label: 'Debe recuperar' },
  'Recuperatorio 1 pendiente': { bg: '#fef3c7', text: '#856404', label: 'Recuperatorio 1 pendiente' },
  'Recuperatorio 2 pendiente': { bg: '#fde8e8', text: '#c62828', label: 'Recuperatorio 2 pendiente' },
  'No aprobado': { bg: '#f8d7da', text: '#721c24', label: 'No aprobado' },
};

const periodColors: Record<string, { bg: string; text: string }> = {
  'Primer cuatrimestre': { bg: '#d6eaf8', text: '#1a5276' },
  'Segundo cuatrimestre': { bg: '#d4edda', text: '#155724' },
  'Anual': { bg: '#fef9c3', text: '#856404' },
};

const getNotaBg = (nota: number) => nota >= 6 ? '#d4edda' : nota >= 4 ? '#fef3c7' : '#fde8e8';
const getNotaColor = (nota: number) => nota >= 6 ? '#155724' : nota >= 4 ? '#856404' : '#c62828';

export default function EstudianteEvaluacionesPage() {
  const { materias, learningCores, evaluations, evaluationGrades, getCoreStatus } = useAppStore();

  const misMaterias = materias.filter(m => m.cursoId === COURSE_ID);

  const myGrades = evaluationGrades.filter(g => g.studentId === STUDENT_ID);

  return (
    <div>
      <PageHeader title="Mis evaluaciones por núcleo" description="Seguimiento de instancias evaluativas por espacio curricular" />

      {misMaterias.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e8e8ec] p-12 text-center">
          <p className="text-[#888888]">Aún no hay evaluaciones registradas para tus espacios curriculares.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {misMaterias.map(materia => {
            const mCores = learningCores.filter(lc => lc.subjectId === materia.id).sort((a, b) => a.order - b.order);
            if (mCores.length === 0) return null;

            return (
              <div key={materia.id} className="bg-white rounded-xl shadow-sm border border-[#e8e8ec] overflow-hidden">
                {/* Materia header */}
                <div className="px-5 py-4 border-b border-[#e8e8ec]" style={{ background: 'linear-gradient(135deg, #1a5276 0%, #154360 100%)' }}>
                  <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{materia.nombre}</h2>
                </div>

                <div className="p-5 space-y-4">
                  {mCores.map(core => {
                    const status = getCoreStatus(STUDENT_ID, core.id);
                    const st = statusStyle[status];
                    const pStyle = periodColors[core.period] || { bg: '#f4f4f6', text: '#888888' };
                    const coreEvals = evaluations.filter(e => e.learningCoreId === core.id);

                    const mainEval = coreEvals.find(e => e.type === 'Evaluación');
                    const r1Eval = coreEvals.find(e => e.type === 'Recuperatorio 1');
                    const r2Eval = coreEvals.find(e => e.type === 'Recuperatorio 2');

                    const mainGrade = mainEval ? myGrades.find(g => g.evaluationId === mainEval.id && g.instanceType === 'evaluacion_principal') : undefined;
                    const r1Grade = r1Eval ? myGrades.find(g => g.evaluationId === r1Eval.id && g.instanceType === 'recuperatorio_1') : undefined;
                    const r2Grade = r2Eval ? myGrades.find(g => g.evaluationId === r2Eval.id && g.instanceType === 'recuperatorio_2') : undefined;

                    return (
                      <div key={core.id} className="rounded-xl border border-[#e8e8ec] overflow-hidden">
                        {/* Core header */}
                        <div className="flex items-start justify-between px-4 py-3" style={{ backgroundColor: '#f9f9fb' }}>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: pStyle.bg, color: pStyle.text }}>
                                {core.period}
                              </span>
                            </div>
                            <h3 className="font-semibold text-[#111111]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{core.title}</h3>
                            <p className="text-xs text-[#888888] mt-0.5">{core.description}</p>
                          </div>
                          <span className="text-xs px-3 py-1 rounded-full font-semibold shrink-0 ml-4" style={{ backgroundColor: st.bg, color: st.text }}>
                            {st.label}
                          </span>
                        </div>

                        {/* Grades table */}
                        {coreEvals.length === 0 ? (
                          <p className="text-sm text-[#888888] px-4 py-3 italic">Sin instancias evaluativas programadas.</p>
                        ) : (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-t border-[#e8e8ec]" style={{ backgroundColor: '#f4f4f6' }}>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-[#888888] uppercase">Instancia</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-[#888888] uppercase">Fecha</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-[#888888] uppercase">Calificación</th>
                                <th className="text-left px-4 py-2 text-xs font-semibold text-[#888888] uppercase">Observación</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8e8ec]">
                              {mainEval && (
                                <tr className="hover:bg-[#f9f9fb]">
                                  <td className="px-4 py-3 font-medium text-[#333333]">Evaluación principal</td>
                                  <td className="px-4 py-3 text-[#888888]">{new Date(mainEval.date).toLocaleDateString('es-AR')}</td>
                                  <td className="px-4 py-3">
                                    {mainGrade ? (
                                      <span className="font-bold px-2.5 py-1 rounded-lg text-sm" style={{ backgroundColor: getNotaBg(mainGrade.grade), color: getNotaColor(mainGrade.grade) }}>
                                        {mainGrade.grade}
                                      </span>
                                    ) : (
                                      <span className="text-[#888888] italic text-xs">Pendiente</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-[#888888] text-xs">{mainGrade?.observation || '-'}</td>
                                </tr>
                              )}
                              {r1Eval && (
                                <tr className="hover:bg-[#f9f9fb]">
                                  <td className="px-4 py-3 font-medium text-[#333333]">Recuperatorio 1</td>
                                  <td className="px-4 py-3 text-[#888888]">{new Date(r1Eval.date).toLocaleDateString('es-AR')}</td>
                                  <td className="px-4 py-3">
                                    {r1Grade ? (
                                      <span className="font-bold px-2.5 py-1 rounded-lg text-sm" style={{ backgroundColor: getNotaBg(r1Grade.grade), color: getNotaColor(r1Grade.grade) }}>
                                        {r1Grade.grade}
                                      </span>
                                    ) : (
                                      <span className="text-[#888888] italic text-xs">Pendiente</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-[#888888] text-xs">{r1Grade?.observation || '-'}</td>
                                </tr>
                              )}
                              {r2Eval && (
                                <tr className="hover:bg-[#f9f9fb]">
                                  <td className="px-4 py-3 font-medium text-[#333333]">Recuperatorio 2</td>
                                  <td className="px-4 py-3 text-[#888888]">{new Date(r2Eval.date).toLocaleDateString('es-AR')}</td>
                                  <td className="px-4 py-3">
                                    {r2Grade ? (
                                      <span className="font-bold px-2.5 py-1 rounded-lg text-sm" style={{ backgroundColor: getNotaBg(r2Grade.grade), color: getNotaColor(r2Grade.grade) }}>
                                        {r2Grade.grade}
                                      </span>
                                    ) : (
                                      <span className="text-[#888888] italic text-xs">Pendiente</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-[#888888] text-xs">{r2Grade?.observation || '-'}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
