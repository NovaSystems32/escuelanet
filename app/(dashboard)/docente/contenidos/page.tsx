'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { PriorityContent, WorkedLearning } from '@/types';

const genId = () => Math.random().toString(36).substr(2, 9);

export default function DocenteContenidosPage() {
  const { user } = useAuthStore();
  const {
    materias, cursos, learningCores,
    priorityContents, workedLearnings,
    addPriorityContent, updatePriorityContent, deletePriorityContent,
    addWorkedLearning, updateWorkedLearning, deleteWorkedLearning,
  } = useAppStore();

  const [selectedCurso, setSelectedCurso] = useState('');
  const [selectedMateria, setSelectedMateria] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [searched, setSearched] = useState(false);

  // Modal states
  const [showPCModal, setShowPCModal] = useState(false);
  const [editingPC, setEditingPC] = useState<PriorityContent | null>(null);
  const [showWLModal, setShowWLModal] = useState(false);
  const [editingWL, setEditingWL] = useState<WorkedLearning | null>(null);
  const [wlParentId, setWlParentId] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'pc' | 'wl'; id: string } | null>(null);

  // PC form state
  const [pcTitle, setPcTitle] = useState('');
  const [pcOrder, setPcOrder] = useState(1);
  const [pcPeriod, setPcPeriod] = useState<PriorityContent['period']>('Primer cuatrimestre');
  const [pcCoreId, setPcCoreId] = useState('');

  // WL form state
  const [wlDesc, setWlDesc] = useState('');
  const [wlOrder, setWlOrder] = useState(1);

  // Get teacher id
  const docentes = useAppStore(s => s.docentes);
  const teacherProfile = docentes.find(d => d.email === user?.email);
  const teacherId = teacherProfile?.id || '';

  const teacherMaterias = materias.filter(m => m.docenteId === teacherId);
  const teacherCursoIds = [...new Set(teacherMaterias.map(m => m.cursoId))];
  const teacherCursos = cursos.filter(c => teacherCursoIds.includes(c.id));

  const filteredMaterias = selectedCurso
    ? teacherMaterias.filter(m => m.cursoId === selectedCurso)
    : [];

  const availableCores = learningCores.filter(
    lc => lc.subjectId === selectedMateria && lc.courseId === selectedCurso
  );

  const canSearch = selectedCurso && selectedMateria && selectedYear && selectedPeriod;

  const filteredPCs = searched
    ? priorityContents.filter(
        pc =>
          pc.courseId === selectedCurso &&
          pc.subjectId === selectedMateria &&
          pc.schoolYear === Number(selectedYear) &&
          pc.period === selectedPeriod
      )
    : [];

  const openCreatePC = () => {
    setEditingPC(null);
    setPcTitle('');
    setPcOrder(filteredPCs.length + 1);
    setPcPeriod(selectedPeriod as PriorityContent['period']);
    setPcCoreId('');
    setShowPCModal(true);
  };

  const openEditPC = (pc: PriorityContent) => {
    setEditingPC(pc);
    setPcTitle(pc.title);
    setPcOrder(pc.order);
    setPcPeriod(pc.period);
    setPcCoreId(pc.learningCoreId || '');
    setShowPCModal(true);
  };

  const savePC = () => {
    if (!pcTitle.trim()) return;
    if (editingPC) {
      updatePriorityContent(editingPC.id, { title: pcTitle, order: pcOrder, period: pcPeriod, learningCoreId: pcCoreId || undefined });
    } else {
      addPriorityContent({
        id: 'pc-' + genId(),
        courseId: selectedCurso,
        subjectId: selectedMateria,
        teacherId,
        schoolYear: Number(selectedYear),
        period: pcPeriod,
        learningCoreId: pcCoreId || undefined,
        title: pcTitle,
        order: pcOrder,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
    setShowPCModal(false);
  };

  const openCreateWL = (pcId: string) => {
    setEditingWL(null);
    setWlParentId(pcId);
    setWlDesc('');
    const existing = workedLearnings.filter(wl => wl.priorityContentId === pcId);
    setWlOrder(existing.length + 1);
    setShowWLModal(true);
  };

  const openEditWL = (wl: WorkedLearning) => {
    setEditingWL(wl);
    setWlParentId(wl.priorityContentId);
    setWlDesc(wl.description);
    setWlOrder(wl.order);
    setShowWLModal(true);
  };

  const saveWL = () => {
    if (!wlDesc.trim()) return;
    if (editingWL) {
      updateWorkedLearning(editingWL.id, { description: wlDesc, order: wlOrder });
    } else {
      addWorkedLearning({
        id: 'wl-' + genId(),
        priorityContentId: wlParentId,
        courseId: selectedCurso,
        subjectId: selectedMateria,
        teacherId,
        description: wlDesc,
        order: wlOrder,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
    setShowWLModal(false);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'pc') {
      deletePriorityContent(deleteTarget.id);
      // also delete related WLs
      workedLearnings
        .filter(wl => wl.priorityContentId === deleteTarget.id)
        .forEach(wl => deleteWorkedLearning(wl.id));
    } else {
      deleteWorkedLearning(deleteTarget.id);
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const sortedPCs = [...filteredPCs].sort((a, b) => a.order - b.order);

  const selectedMateriaName = materias.find(m => m.id === selectedMateria)?.nombre || '';
  const selectedCursoData = cursos.find(c => c.id === selectedCurso);

  return (
    <div style={{ backgroundColor: '#f4f4f6', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '2rem', color: '#1a2940', marginBottom: 4 }}>
            Contenidos priorizados y aprendizajes trabajados
          </h1>
          <p style={{ color: '#555', fontSize: '0.95rem' }}>Gestión del seguimiento pedagógico por espacio curricular</p>
        </div>

        {/* Info banner */}
        <div style={{ backgroundColor: 'rgba(26,82,118,0.08)', border: '1px solid #1a5276', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#1a5276', fontSize: '0.9rem' }}>
          <strong>Recordá:</strong> los contenidos priorizados y aprendizajes trabajados forman parte del seguimiento académico del ciclo lectivo y deben mantenerse actualizados por espacio curricular.
        </div>

        {/* Selection panel */}
        <div style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#1a5276', marginBottom: '1rem' }}>
            Seleccionar espacio curricular
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>Curso</label>
              <select
                value={selectedCurso}
                onChange={e => { setSelectedCurso(e.target.value); setSelectedMateria(''); setSearched(false); }}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.9rem' }}
              >
                <option value="">Seleccionar...</option>
                {teacherCursos.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>Espacio curricular</label>
              <select
                value={selectedMateria}
                onChange={e => { setSelectedMateria(e.target.value); setSearched(false); }}
                disabled={!selectedCurso}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.9rem', opacity: !selectedCurso ? 0.5 : 1 }}
              >
                <option value="">Seleccionar...</option>
                {filteredMaterias.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>Ciclo lectivo</label>
              <select
                value={selectedYear}
                onChange={e => { setSelectedYear(e.target.value); setSearched(false); }}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.9rem' }}
              >
                <option value="">Seleccionar...</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>Período</label>
              <select
                value={selectedPeriod}
                onChange={e => { setSelectedPeriod(e.target.value); setSearched(false); }}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.9rem' }}
              >
                <option value="">Seleccionar...</option>
                <option value="Primer cuatrimestre">Primer cuatrimestre</option>
                <option value="Segundo cuatrimestre">Segundo cuatrimestre</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => setSearched(true)}
            disabled={!canSearch}
            style={{
              backgroundColor: canSearch ? '#c62828' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '0.6rem 1.5rem',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: canSearch ? 'pointer' : 'not-allowed',
            }}
          >
            Buscar / Ver aprendizajes
          </button>
        </div>

        {/* Content list */}
        {searched && (
          <div>
            {/* List header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '1.3rem', color: '#1a2940' }}>
                  {selectedMateriaName} — {selectedCursoData?.nombre} {selectedCursoData?.division}
                </h2>
                <p style={{ color: '#777', fontSize: '0.85rem' }}>{selectedPeriod} {selectedYear}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={openCreatePC}
                  style={{ backgroundColor: '#c62828', color: '#fff', border: 'none', borderRadius: 8, padding: '0.55rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  + Nuevo contenido
                </button>
                <button
                  onClick={() => alert('Función de exportación PDF disponible próximamente.')}
                  style={{ backgroundColor: '#fff', color: '#1a5276', border: '1.5px solid #1a5276', borderRadius: 8, padding: '0.55rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Exportar informe
                </button>
              </div>
            </div>

            {sortedPCs.length === 0 ? (
              <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: '3rem', textAlign: 'center', color: '#888', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
                <p style={{ fontSize: '1rem' }}>No hay contenidos priorizados cargados para este espacio curricular y período.</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Comenzá creando el primer contenido priorizado.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {sortedPCs.map(pc => {
                  const pcLearnings = workedLearnings
                    .filter(wl => wl.priorityContentId === pc.id)
                    .sort((a, b) => a.order - b.order);
                  const core = learningCores.find(lc => lc.id === pc.learningCoreId);
                  return (
                    <div key={pc.id} style={{ backgroundColor: '#fff', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                      {/* Card header */}
                      <div style={{ backgroundColor: 'rgba(26,82,118,0.06)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #eee' }}>
                        <span style={{ backgroundColor: '#1a5276', color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                          {pc.order}
                        </span>
                        <span style={{ fontWeight: 700, color: '#1a2940', flex: 1, fontSize: '1rem' }}>{pc.title}</span>
                        <span style={{ fontSize: '0.75rem', backgroundColor: '#e8f4fd', color: '#1a5276', borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>
                          {pc.period}
                        </span>
                        {core && (
                          <span style={{ fontSize: '0.75rem', backgroundColor: '#fef9e7', color: '#c9a227', borderRadius: 6, padding: '2px 8px', fontWeight: 600, border: '1px solid #c9a227' }}>
                            {core.title}
                          </span>
                        )}
                        <button
                          onClick={() => openEditPC(pc)}
                          style={{ backgroundColor: 'transparent', border: '1px solid #1a5276', borderRadius: 6, padding: '3px 10px', color: '#1a5276', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => { setDeleteTarget({ type: 'pc', id: pc.id }); setShowDeleteModal(true); }}
                          style={{ backgroundColor: 'transparent', border: '1px solid #c62828', borderRadius: 6, padding: '3px 10px', color: '#c62828', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Eliminar
                        </button>
                      </div>
                      {/* Worked learnings */}
                      <div style={{ padding: '0.75rem 1.25rem 1rem' }}>
                        {pcLearnings.length === 0 ? (
                          <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Sin aprendizajes trabajados cargados.</p>
                        ) : (
                          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                            {pcLearnings.map(wl => (
                              <li key={wl.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.4rem 0', borderBottom: '1px solid #f5f5f5' }}>
                                <span style={{ color: '#1a5276', fontWeight: 700, minWidth: 24, fontSize: '0.9rem' }}>{wl.order}.</span>
                                <span style={{ flex: 1, color: '#333', fontSize: '0.9rem' }}>{wl.description}</span>
                                <button
                                  onClick={() => openEditWL(wl)}
                                  style={{ backgroundColor: 'transparent', border: 'none', color: '#1a5276', cursor: 'pointer', fontSize: '0.8rem', padding: '2px 6px' }}
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => { setDeleteTarget({ type: 'wl', id: wl.id }); setShowDeleteModal(true); }}
                                  style={{ backgroundColor: 'transparent', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '0.8rem', padding: '2px 6px' }}
                                >
                                  🗑️
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        <button
                          onClick={() => openCreateWL(pc.id)}
                          style={{ backgroundColor: 'transparent', border: 'none', color: '#1a5276', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.5rem', padding: 0 }}
                        >
                          + Agregar aprendizaje trabajado
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PC Modal */}
      {showPCModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: '2rem', width: '100%', maxWidth: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#1a2940', marginBottom: '1.25rem' }}>
              {editingPC ? 'Editar contenido priorizado' : 'Nuevo contenido priorizado'}
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>Título *</label>
              <input
                type="text"
                value={pcTitle}
                onChange={e => setPcTitle(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.9rem', boxSizing: 'border-box' }}
                placeholder="Título del contenido priorizado"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>Orden</label>
                <input
                  type="number"
                  value={pcOrder}
                  onChange={e => setPcOrder(Number(e.target.value))}
                  min={1}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.9rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>Período</label>
                <select
                  value={pcPeriod}
                  onChange={e => setPcPeriod(e.target.value as PriorityContent['period'])}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  <option value="Primer cuatrimestre">Primer cuatrimestre</option>
                  <option value="Segundo cuatrimestre">Segundo cuatrimestre</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>
            </div>
            {availableCores.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>Núcleo de aprendizaje (opcional)</label>
                <select
                  value={pcCoreId}
                  onChange={e => setPcCoreId(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.9rem' }}
                >
                  <option value="">Sin núcleo asociado</option>
                  {availableCores.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowPCModal(false)}
                style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: 8, padding: '0.55rem 1.25rem', fontWeight: 600, cursor: 'pointer', color: '#555' }}
              >
                Cancelar
              </button>
              <button
                onClick={savePC}
                disabled={!pcTitle.trim()}
                style={{ backgroundColor: pcTitle.trim() ? '#c62828' : '#ccc', color: '#fff', border: 'none', borderRadius: 8, padding: '0.55rem 1.25rem', fontWeight: 700, cursor: pcTitle.trim() ? 'pointer' : 'not-allowed' }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WL Modal */}
      {showWLModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: '2rem', width: '100%', maxWidth: 480, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#1a2940', marginBottom: '1.25rem' }}>
              {editingWL ? 'Editar aprendizaje trabajado' : 'Nuevo aprendizaje trabajado'}
            </h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>Descripción *</label>
              <textarea
                value={wlDesc}
                onChange={e => setWlDesc(e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' }}
                placeholder="Describe el aprendizaje trabajado..."
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#555', marginBottom: 4 }}>Orden</label>
              <input
                type="number"
                value={wlOrder}
                onChange={e => setWlOrder(Number(e.target.value))}
                min={1}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowWLModal(false)}
                style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: 8, padding: '0.55rem 1.25rem', fontWeight: 600, cursor: 'pointer', color: '#555' }}
              >
                Cancelar
              </button>
              <button
                onClick={saveWL}
                disabled={!wlDesc.trim()}
                style={{ backgroundColor: wlDesc.trim() ? '#c62828' : '#ccc', color: '#fff', border: 'none', borderRadius: 8, padding: '0.55rem 1.25rem', fontWeight: 700, cursor: wlDesc.trim() ? 'pointer' : 'not-allowed' }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 14, padding: '2rem', width: '100%', maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '1.2rem', color: '#c62828', marginBottom: '0.75rem' }}>
              Confirmar eliminación
            </h3>
            <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {deleteTarget?.type === 'pc'
                ? '¿Estás seguro/a de que querés eliminar este contenido priorizado y todos sus aprendizajes trabajados?'
                : '¿Estás seguro/a de que querés eliminar este aprendizaje trabajado?'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                style={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: 8, padding: '0.55rem 1.25rem', fontWeight: 600, cursor: 'pointer', color: '#555' }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                style={{ backgroundColor: '#c62828', color: '#fff', border: 'none', borderRadius: 8, padding: '0.55rem 1.25rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
