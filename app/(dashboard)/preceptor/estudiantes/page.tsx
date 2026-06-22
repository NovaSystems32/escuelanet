'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Estudiante, Asistencia, Disciplina } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import PhotoUpload from '@/components/PhotoUpload';
import ImportStudents from '@/components/ImportStudents';
import { exportStudentsToExcel, downloadTemplateExcel } from '@/lib/excel';

const emptyForm: Omit<Estudiante, 'id'> = {
  nombre: '', apellido: '', dni: '', email: '', telefono: '',
  curso: 'c1', turno: 'mañana', fechaNacimiento: '', activo: true,
  photo: undefined, tutor: '', telefonoTutor: '', direccion: '',
};

type ModalType = 'none' | 'form' | 'delete' | 'asistencia' | 'disciplina' | 'legajo';

export default function PreceptorEstudiantesPage() {
  const { estudiantes, cursos, asistencias, disciplina, addEstudiante, updateEstudiante, deleteEstudiante, addAsistencia, addDisciplina } = useAppStore();
  const [search, setSearch] = useState('');
  const [cursoFilter, setCursoFilter] = useState<string>('all');
  const [modal, setModal] = useState<ModalType>('none');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Estudiante, 'id'>>(emptyForm);
  const [importOpen, setImportOpen] = useState(false);

  // Asistencia form
  const [asistForm, setAsistForm] = useState({ fecha: new Date().toISOString().split('T')[0], presente: true, justificada: false, observacion: '' });
  // Disciplina form
  const [discForm, setDiscForm] = useState({ tipo: 'observacion' as Disciplina['tipo'], descripcion: '', fecha: new Date().toISOString().split('T')[0] });

  const filtered = estudiantes.filter(e => {
    const matchSearch = `${e.nombre} ${e.apellido} ${e.dni}`.toLowerCase().includes(search.toLowerCase());
    const matchCurso = cursoFilter === 'all' || e.curso === cursoFilter;
    return matchSearch && matchCurso;
  });

  const selected = selectedId ? estudiantes.find(e => e.id === selectedId) : null;

  const openNew = () => { setForm(emptyForm); setEditId(null); setModal('form'); };
  const openEdit = (e: Estudiante) => {
    setForm({
      nombre: e.nombre, apellido: e.apellido, dni: e.dni, email: e.email,
      telefono: e.telefono, curso: e.curso, turno: e.turno, fechaNacimiento: e.fechaNacimiento,
      activo: e.activo, photo: e.photo, tutor: e.tutor || '', telefonoTutor: e.telefonoTutor || '',
      direccion: e.direccion || '',
    });
    setEditId(e.id);
    setModal('form');
  };

  const handleSave = () => {
    if (!form.nombre || !form.apellido) return;
    if (editId) updateEstudiante(editId, form);
    else addEstudiante(form);
    setModal('none');
  };

  const handleDelete = () => {
    if (selectedId) deleteEstudiante(selectedId);
    setModal('none');
    setSelectedId(null);
  };

  const handleAsistencia = () => {
    if (!selectedId) return;
    const est = estudiantes.find(e => e.id === selectedId);
    if (!est) return;
    addAsistencia({ estudianteId: selectedId, cursoId: est.curso, fecha: asistForm.fecha, presente: asistForm.presente, justificada: asistForm.justificada, observacion: asistForm.observacion });
    setModal('none');
  };

  const handleDisciplina = () => {
    if (!selectedId) return;
    addDisciplina({ estudianteId: selectedId, tipo: discForm.tipo, descripcion: discForm.descripcion, fecha: discForm.fecha, preceptorId: 'u4', resuelto: false });
    setModal('none');
  };

  return (
    <div>
      <PageHeader
        title="Gestión de Estudiantes"
        description={`${estudiantes.filter(e => e.activo).length} activos de ${estudiantes.length} total`}
        action={
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => downloadTemplateExcel()} className="px-3 py-2 rounded-lg text-sm font-medium text-[#888888] border border-[#e8e8ec] hover:bg-[#f4f4f6]">
              📄 Plantilla
            </button>
            <button onClick={() => setImportOpen(true)} className="px-3 py-2 rounded-lg text-sm font-medium text-[#1a5276] border border-[#1a5276] hover:bg-[#d6eaf8]">
              📥 Importar
            </button>
            <button onClick={() => exportStudentsToExcel(filtered)} className="px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#27ae60' }}>
              📊 Exportar Excel
            </button>
            <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#1a5276' }}>
              + Nuevo Estudiante
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-48 max-w-sm px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
        />
        <select
          value={cursoFilter}
          onChange={e => setCursoFilter(e.target.value)}
          className="px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
        >
          <option value="all">Todos los cursos</option>
          {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e8e8ec] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f4f6] border-b border-[#e8e8ec]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Estudiante</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Curso</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Tutor</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ec]">
              {filtered.map(e => {
                const curso = cursos.find(c => c.id === e.curso);
                const inasist = asistencias.filter(a => a.estudianteId === e.id && !a.presente).length;
                return (
                  <tr key={e.id} className="hover:bg-[#f4f4f6]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-[#e8e8ec]">
                          {e.photo ? (
                            <img src={e.photo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#d6eaf8] text-[#1a5276] flex items-center justify-center text-sm font-semibold">
                              {e.nombre.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#111111]">{e.apellido}, {e.nombre}</p>
                          <p className="text-xs text-[#888888]">{e.dni} · {inasist} inasistencias</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#888888]">{curso ? `${curso.nombre} ${curso.division}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#888888]">{e.tutor || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${e.activo ? 'bg-[#d4edda] text-[#155724]' : 'bg-red-100 text-[#c62828]'}`}>
                        {e.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setSelectedId(e.id); setModal('legajo'); }} className="text-xs text-[#888888] hover:underline mr-2">Legajo</button>
                      <button onClick={() => openEdit(e)} className="text-xs text-[#1a5276] hover:underline mr-2">Editar</button>
                      <button onClick={() => { setSelectedId(e.id); setAsistForm({ fecha: new Date().toISOString().split('T')[0], presente: true, justificada: false, observacion: '' }); setModal('asistencia'); }} className="text-xs text-[#c9a227] hover:underline mr-2">Asistencia</button>
                      <button onClick={() => { setSelectedId(e.id); setDiscForm({ tipo: 'observacion', descripcion: '', fecha: new Date().toISOString().split('T')[0] }); setModal('disciplina'); }} className="text-xs text-[#c62828] hover:underline mr-2">Disciplina</button>
                      <button onClick={() => { setSelectedId(e.id); setModal('delete'); }} className="text-xs text-[#c62828] hover:underline">Eliminar</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#888888]">No se encontraron estudiantes</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <Modal isOpen={modal === 'form'} onClose={() => setModal('none')} title={editId ? 'Editar Estudiante' : 'Nuevo Estudiante'} size="lg">
        <div className="flex justify-center mb-4">
          <PhotoUpload photo={form.photo} onPhotoChange={(p) => setForm(f => ({ ...f, photo: p }))} name={form.nombre} size="lg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Nombre *</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Apellido *</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.apellido} onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">DNI</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.dni} onChange={e => setForm(f => ({ ...f, dni: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Fecha de Nacimiento</label>
            <input type="date" className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.fechaNacimiento} onChange={e => setForm(f => ({ ...f, fechaNacimiento: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Teléfono</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Curso</label>
            <select className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.curso} onChange={e => setForm(f => ({ ...f, curso: e.target.value }))}>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Turno</label>
            <select className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.turno} onChange={e => setForm(f => ({ ...f, turno: e.target.value as 'mañana' | 'tarde' }))}>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Tutor</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.tutor || ''} onChange={e => setForm(f => ({ ...f, tutor: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Tel. Tutor</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.telefonoTutor || ''} onChange={e => setForm(f => ({ ...f, telefonoTutor: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#111111] mb-1">Dirección</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.direccion || ''} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#111111]">
              <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} className="rounded" />
              Estudiante activo
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={() => setModal('none')} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm text-[#111111] hover:bg-[#f4f4f6]">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: '#1a5276' }}>Guardar</button>
        </div>
      </Modal>

      {/* Asistencia Modal */}
      <Modal isOpen={modal === 'asistencia'} onClose={() => setModal('none')} title={`Registrar Asistencia — ${selected ? `${selected.nombre} ${selected.apellido}` : ''}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Fecha</label>
            <input type="date" className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={asistForm.fecha} onChange={e => setAsistForm(f => ({ ...f, fecha: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Estado</label>
            <select className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={asistForm.presente ? (asistForm.justificada ? 'justificada' : 'presente') : 'ausente'} onChange={e => {
              const v = e.target.value;
              setAsistForm(f => ({ ...f, presente: v === 'presente', justificada: v === 'justificada' }));
            }}>
              <option value="presente">Presente</option>
              <option value="ausente">Ausente</option>
              <option value="justificada">Ausente Justificada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Observación</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={asistForm.observacion} onChange={e => setAsistForm(f => ({ ...f, observacion: e.target.value }))} />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setModal('none')} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm">Cancelar</button>
            <button onClick={handleAsistencia} className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: '#c9a227' }}>Registrar</button>
          </div>
        </div>
      </Modal>

      {/* Disciplina Modal */}
      <Modal isOpen={modal === 'disciplina'} onClose={() => setModal('none')} title={`Registro de Disciplina — ${selected ? `${selected.nombre} ${selected.apellido}` : ''}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Tipo</label>
            <select className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={discForm.tipo} onChange={e => setDiscForm(f => ({ ...f, tipo: e.target.value as Disciplina['tipo'] }))}>
              <option value="observacion">Observación</option>
              <option value="apercibimiento">Apercibimiento</option>
              <option value="suspension">Suspensión</option>
              <option value="felicitacion">Felicitación</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Fecha</label>
            <input type="date" className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={discForm.fecha} onChange={e => setDiscForm(f => ({ ...f, fecha: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Descripción / Motivo</label>
            <textarea className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276] resize-none" rows={3} value={discForm.descripcion} onChange={e => setDiscForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setModal('none')} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm">Cancelar</button>
            <button onClick={handleDisciplina} className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: '#c62828' }}>Registrar</button>
          </div>
        </div>
      </Modal>

      {/* Legajo Modal */}
      <Modal isOpen={modal === 'legajo'} onClose={() => setModal('none')} title={`Legajo — ${selected ? `${selected.apellido}, ${selected.nombre}` : ''}`} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-5 pb-4 border-b border-[#e8e8ec]">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#e8e8ec] flex-shrink-0">
                {selected.photo ? (
                  <img src={selected.photo} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#d6eaf8] text-[#1a5276] flex items-center justify-center text-2xl font-bold">
                    {selected.nombre.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#111111]">{selected.apellido}, {selected.nombre}</h3>
                <p className="text-sm text-[#888888]">DNI: {selected.dni}</p>
                <p className="text-sm text-[#888888]">Email: {selected.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-[#888888]">Tel:</span> <span className="text-[#111111]">{selected.telefono || '-'}</span></div>
              <div><span className="text-[#888888]">Nac:</span> <span className="text-[#111111]">{selected.fechaNacimiento ? new Date(selected.fechaNacimiento).toLocaleDateString('es-AR') : '-'}</span></div>
              <div><span className="text-[#888888]">Tutor:</span> <span className="text-[#111111]">{selected.tutor || '-'}</span></div>
              <div><span className="text-[#888888]">Tel. Tutor:</span> <span className="text-[#111111]">{selected.telefonoTutor || '-'}</span></div>
              <div className="col-span-2"><span className="text-[#888888]">Dirección:</span> <span className="text-[#111111]">{selected.direccion || '-'}</span></div>
            </div>
            <div>
              <h4 className="font-semibold text-[#111111] text-sm mb-2">Inasistencias</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {asistencias.filter(a => a.estudianteId === selected.id && !a.presente).map(a => (
                  <div key={a.id} className="text-xs text-[#888888] bg-[#f4f4f6] rounded px-2 py-1">
                    {new Date(a.fecha).toLocaleDateString('es-AR')} · {a.justificada ? 'Justificada' : 'Sin justificar'} {a.observacion && `· ${a.observacion}`}
                  </div>
                ))}
                {asistencias.filter(a => a.estudianteId === selected.id && !a.presente).length === 0 && (
                  <p className="text-xs text-[#888888]">Sin inasistencias registradas</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[#111111] text-sm mb-2">Disciplina</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {disciplina.filter(d => d.estudianteId === selected.id).map(d => (
                  <div key={d.id} className="text-xs bg-[#f4f4f6] rounded px-2 py-1">
                    <span className={`font-medium ${d.tipo === 'felicitacion' ? 'text-green-700' : 'text-[#c62828]'}`}>{d.tipo}</span>
                    <span className="text-[#888888]"> · {d.descripcion}</span>
                  </div>
                ))}
                {disciplina.filter(d => d.estudianteId === selected.id).length === 0 && (
                  <p className="text-xs text-[#888888]">Sin registros de disciplina</p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setModal('none')} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm">Cerrar</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={modal === 'delete'} onClose={() => setModal('none')} title="Confirmar eliminación" size="sm">
        <p className="text-sm text-[#888888] mb-4">¿Estás seguro de que querés eliminar este estudiante?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setModal('none')} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm">Cancelar</button>
          <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-[#c62828] text-white text-sm">Eliminar</button>
        </div>
      </Modal>

      {/* Import Modal */}
      <ImportStudents isOpen={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
