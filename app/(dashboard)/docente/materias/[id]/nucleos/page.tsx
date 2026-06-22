'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { LearningCore, Evaluation, EvaluationGrade } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

const TEACHER_ID = 'd1';

type ModalType = 'core' | 'evaluation' | 'grade' | null;

const periodColors: Record<string, { bg: string; text: string }> = {
  'Primer cuatrimestre': { bg: '#d6eaf8', text: '#1a5276' },
  'Segundo cuatrimestre': { bg: '#d4edda', text: '#155724' },
  'Anual': { bg: '#fef9c3', text: '#856404' },
};

const statusColors: Record<string, { bg: string; text: string }> = {
  'Programada': { bg: '#fef9c3', text: '#856404' },
  'Realizada': { bg: '#d4edda', text: '#155724' },
  'Cancelada': { bg: '#f8d7da', text: '#721c24' },
};

export default function NucleosPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    materias, cursos, estudiantes,
    learningCores, evaluations, evaluationGrades,
    addLearningCore, updateLearningCore, deleteLearningCore,
    addEvaluation, updateEvaluation,
    addEvaluationGrade, updateEvaluationGrade,
  } = useAppStore();

  const materia = materias.find(m => m.id === id);
  const curso = cursos.find(c => c.id === materia?.cursoId);
  const estudiantesCurso = estudiantes.filter(e => curso?.estudiantesIds.includes(e.id) ?? false);
  const subjectCores = learningCores.filter(lc => lc.subjectId === id).sort((a, b) => a.order - b.order);

  const [modalType, setModalType] = useState<ModalType>(null);
  const [editCoreId, setEditCoreId] = useState<string | null>(null);
  const [selectedCoreId, setSelectedCoreId] = useState<string>('');
  const [selectedEvalId, setSelectedEvalId] = useState<string>('');

  const [coreForm, setCoreForm] = useState({ title: '', description: '', period: 'Primer cuatrimestre' as LearningCore['period'], order: 1 });
  const [evalForm, setEvalForm] = useState({ title: '', description: '', date: '', type: 'Evaluación' as Evaluation['type'], status: 'Programada' as Evaluation['status'] });
  const [gradeForm, setGradeForm] = useState({ studentId: '', grade: 7, observation: '', instanceType: 'evaluacion_principal' as EvaluationGrade['instanceType'] });

  const [confirmDeleteCore, setConfirmDeleteCore] = useState<string | null>(null);

  if (!materia) {
    return (
      <div className="text-center py-12">
        <p className="text-[#888888]">Materia no encontrada.</p>
        <button onClick={() => router.back()} className="mt-3 text-sm text-[#1a5276] hover:underline">Volver</button>
      </div>
    );
  }

  const openNewCore = () => {
    setCoreForm({ title: '', description: '', period: 'Primer cuatrimestre', order: subjectCores.length + 1 });
    setEditCoreId(null);
    setModalType('core');
  };

  const openEditCore = (core: LearningCore) => {
    setCoreForm({ title: core.title, description: core.description, period: core.period, order: core.order });
    setEditCoreId(core.id);
    setModalType('core');
  };

  const handleSaveCore = () => {
    if (!coreForm.title.trim()) return;
    if (editCoreId) {
      updateLearningCore(editCoreId, coreForm);
    } else {
      addLearningCore({ ...coreForm, subjectId: id, courseId: materia.cursoId, teacherId: TEACHER_ID, isActive: true });
    }
    setModalType(null);
  };

  const openNewEval = (coreId: string) => {
    setSelectedCoreId(coreId);
    setEvalForm({ title: '', description: '', date: '', type: 'Evaluación', status: 'Programada' });
    setModalType('evaluation');
  };

  const handleSaveEval = () => {
    if (!evalForm.title.trim() || !evalForm.date) return;
    addEvaluation({
      ...evalForm,
      learningCoreId: selectedCoreId,
      subjectId: id,
      courseId: materia.cursoId,
      teacherId: TEACHER_ID,
    });
    setModalType(null);
  };

  const openGradeModal = (coreId: string, evalId: string) => {
    setSelectedCoreId(coreId);
    setSelectedEvalId(evalId);
    setGradeForm({ studentId: estudiantesCurso[0]?.id || '', grade: 7, observation: '', instanceType: 'evaluacion_principal' });
    setModalType('grade');
  };

  const handleSaveGrade = () => {
    if (!gradeForm.studentId) return;
    const existing = evaluationGrades.find(
      g => g.studentId === gradeForm.studentId && g.evaluationId === selectedEvalId && g.instanceType === gradeForm.instanceType
    );
    if (existing) {
      updateEvaluationGrade(existing.id, { grade: gradeForm.grade, observation: gradeForm.observation });
    } else {
      addEvaluationGrade({
        studentId: gradeForm.studentId,
        subjectId: id,
        courseId: materia.cursoId,
        learningCoreId: selectedCoreId,
        evaluationId: selectedEvalId,
        instanceType: gradeForm.instanceType,
        grade: gradeForm.grade,
        date: new Date().toISOString().split('T')[0],
        observation: gradeForm.observation,
        teacherId: TEACHER_ID,
        visibleForStudent: true,
      });
    }
    setModalType(null);
  };

  return (
    <div>
      <PageHeader
        title={`Núcleos de aprendizaje — ${materia.nombre}`}
        description={`${curso ? `${curso.nombre} ${curso.division}` : ''} · ${materia.horasSemanal}h/sem`}
        action={
          <div className="flex gap-2">
            <button onClick={() => router.back()} className="text-sm text-[#1a5276] hover:underline">← Volver</button>
            <button
              onClick={openNewCore}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: '#c62828' }}
            >
              + Nuevo núcleo
            </button>
          </div>
        }
      />

      {subjectCores.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e8e8ec] p-12 text-center">
          <p className="text-[#888888] text-sm mb-3">No hay núcleos de aprendizaje para este espacio curricular.</p>
          <button
            onClick={openNewCore}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: '#c62828' }}
          >
            + Crear primer núcleo
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {subjectCores.map(core => {
            const coreEvals = evaluations.filter(e => e.learningCoreId === core.id);
            const periodStyle = periodColors[core.period] || { bg: '#f4f4f6', text: '#888888' };
            return (
              <div key={core.id} className="bg-white rounded-xl shadow-sm border border-[#e8e8ec] overflow-hidden">
                {/* Core header */}
                <div className="flex items-start justify-between p-5 border-b border-[#e8e8ec]" style={{ backgroundColor: '#f9f9fb' }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: periodStyle.bg, color: periodStyle.text }}>
                        {core.period}
                      </span>
                      <span className="text-xs text-[#888888]">Orden {core.order}</span>
                    </div>
                    <h3 className="font-bold text-[#111111] text-base" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{core.title}</h3>
                    <p className="text-sm text-[#555555] mt-1">{core.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => openEditCore(core)} className="text-xs text-[#1a5276] hover:underline">Editar</button>
                    <button onClick={() => setConfirmDeleteCore(core.id)} className="text-xs text-[#c62828] hover:underline">Eliminar</button>
                  </div>
                </div>

                {/* Evaluations */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-[#333333]">Instancias evaluativas</h4>
                    <button
                      onClick={() => openNewEval(core.id)}
                      className="text-xs px-3 py-1.5 rounded-lg text-white font-medium"
                      style={{ backgroundColor: '#1a5276' }}
                    >
                      + Agregar evaluación
                    </button>
                  </div>

                  {coreEvals.length === 0 ? (
                    <p className="text-sm text-[#888888] italic">Sin evaluaciones registradas para este núcleo.</p>
                  ) : (
                    <div className="space-y-2">
                      {coreEvals.map(ev => {
                        const statusStyle = statusColors[ev.status] || { bg: '#f4f4f6', text: '#888888' };
                        return (
                          <div key={ev.id} className="flex items-center justify-between p-3 rounded-lg border border-[#e8e8ec]">
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-[#111111]">{ev.title}</span>
                                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}>
                                    {ev.status}
                                  </span>
                                </div>
                                <p className="text-xs text-[#888888] mt-0.5">{ev.description} · {new Date(ev.date).toLocaleDateString('es-AR')}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => openGradeModal(core.id, ev.id)}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium border border-[#c9a227] text-[#c9a227] hover:bg-[#fef9c3] transition-colors"
                            >
                              Cargar calificaciones
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Core Modal */}
      <Modal isOpen={modalType === 'core'} onClose={() => setModalType(null)} title={editCoreId ? 'Editar núcleo' : 'Nuevo núcleo de aprendizaje'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Título *</label>
            <input
              className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
              value={coreForm.title}
              onChange={e => setCoreForm(f => ({ ...f, title: e.target.value }))}
              placeholder="ej: Núcleo 1: Números reales"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Descripción</label>
            <textarea
              className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276] resize-none"
              rows={3}
              value={coreForm.description}
              onChange={e => setCoreForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Descripción breve de los contenidos del núcleo..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Período</label>
              <select
                className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                value={coreForm.period}
                onChange={e => setCoreForm(f => ({ ...f, period: e.target.value as LearningCore['period'] }))}
              >
                <option value="Primer cuatrimestre">Primer cuatrimestre</option>
                <option value="Segundo cuatrimestre">Segundo cuatrimestre</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Orden</label>
              <input
                type="number"
                min={1}
                className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                value={coreForm.order}
                onChange={e => setCoreForm(f => ({ ...f, order: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalType(null)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm text-[#111111] hover:bg-[#f4f4f6]">Cancelar</button>
            <button onClick={handleSaveCore} className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: '#c62828' }}>
              {editCoreId ? 'Guardar cambios' : 'Crear núcleo'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Evaluation Modal */}
      <Modal isOpen={modalType === 'evaluation'} onClose={() => setModalType(null)} title="Agregar evaluación" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Título *</label>
            <input
              className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
              value={evalForm.title}
              onChange={e => setEvalForm(f => ({ ...f, title: e.target.value }))}
              placeholder="ej: Evaluación - Núcleo 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Descripción</label>
            <textarea
              className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276] resize-none"
              rows={2}
              value={evalForm.description}
              onChange={e => setEvalForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Fecha *</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                value={evalForm.date}
                onChange={e => setEvalForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Tipo</label>
              <select
                className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                value={evalForm.type}
                onChange={e => setEvalForm(f => ({ ...f, type: e.target.value as Evaluation['type'] }))}
              >
                <option value="Evaluación">Evaluación</option>
                <option value="Recuperatorio 1">Recuperatorio 1</option>
                <option value="Recuperatorio 2">Recuperatorio 2</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Estado</label>
            <select
              className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
              value={evalForm.status}
              onChange={e => setEvalForm(f => ({ ...f, status: e.target.value as Evaluation['status'] }))}
            >
              <option value="Programada">Programada</option>
              <option value="Realizada">Realizada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalType(null)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm text-[#111111] hover:bg-[#f4f4f6]">Cancelar</button>
            <button onClick={handleSaveEval} className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: '#c62828' }}>
              Agregar evaluación
            </button>
          </div>
        </div>
      </Modal>

      {/* Grade Modal */}
      <Modal isOpen={modalType === 'grade'} onClose={() => setModalType(null)} title="Cargar calificación" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Estudiante *</label>
            <select
              className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
              value={gradeForm.studentId}
              onChange={e => setGradeForm(f => ({ ...f, studentId: e.target.value }))}
            >
              <option value="">Seleccionar estudiante...</option>
              {estudiantesCurso.map(est => (
                <option key={est.id} value={est.id}>{est.apellido}, {est.nombre}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Instancia</label>
              <select
                className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                value={gradeForm.instanceType}
                onChange={e => setGradeForm(f => ({ ...f, instanceType: e.target.value as EvaluationGrade['instanceType'] }))}
              >
                <option value="evaluacion_principal">Evaluación principal</option>
                <option value="recuperatorio_1">Recuperatorio 1</option>
                <option value="recuperatorio_2">Recuperatorio 2</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Calificación (1-10)</label>
              <input
                type="number"
                min={1}
                max={10}
                className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                value={gradeForm.grade}
                onChange={e => setGradeForm(f => ({ ...f, grade: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Observación</label>
            <textarea
              className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276] resize-none"
              rows={2}
              value={gradeForm.observation}
              onChange={e => setGradeForm(f => ({ ...f, observation: e.target.value }))}
              placeholder="Observaciones sobre el desempeño..."
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setModalType(null)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm text-[#111111] hover:bg-[#f4f4f6]">Cancelar</button>
            <button onClick={handleSaveGrade} className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: '#c62828' }}>
              Guardar calificación
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm delete core */}
      <Modal isOpen={!!confirmDeleteCore} onClose={() => setConfirmDeleteCore(null)} title="Eliminar núcleo" size="sm">
        <p className="text-sm text-[#888888] mb-4">¿Estás seguro de que querés eliminar este núcleo de aprendizaje? También se eliminarán sus evaluaciones asociadas.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setConfirmDeleteCore(null)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm">Cancelar</button>
          <button onClick={() => { confirmDeleteCore && deleteLearningCore(confirmDeleteCore); setConfirmDeleteCore(null); }} className="px-4 py-2 rounded-lg bg-[#c62828] text-white text-sm">Eliminar</button>
        </div>
      </Modal>
    </div>
  );
}
