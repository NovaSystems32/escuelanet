'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Curso } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

const emptyForm: Omit<Curso, 'id'> = {
  nombre: '', division: 'A', turno: 'mañana', nivel: 'Secundario', docenteId: '', estudiantesIds: [],
};

export default function CursosPage() {
  const { cursos, docentes, estudiantes, addCurso, updateCurso, deleteCurso } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Curso, 'id'>>(emptyForm);

  const openNew = () => { setForm(emptyForm); setEditId(null); setIsOpen(true); };
  const openEdit = (c: Curso) => {
    setForm({ nombre: c.nombre, division: c.division, turno: c.turno, nivel: c.nivel, docenteId: c.docenteId, estudiantesIds: c.estudiantesIds });
    setEditId(c.id); setIsOpen(true);
  };

  const handleSave = () => {
    if (!form.nombre) return;
    if (editId) updateCurso(editId, form);
    else addCurso(form);
    setIsOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Cursos"
        description={`${cursos.length} cursos registrados`}
        action={
          <button onClick={openNew} className="bg-[#1a5276] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a5276]">
            + Nuevo Curso
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cursos.map(curso => {
          const docente = docentes.find(d => d.id === curso.docenteId);
          const estudiantesCurso = estudiantes.filter(e => curso.estudiantesIds.includes(e.id));
          return (
            <div key={curso.id} className="bg-white rounded-xl border border-[#e8e8ec] p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-[#111111]">{curso.nombre} - Div. {curso.division}</h3>
                  <p className="text-xs text-[#888888]">{curso.nivel} • Turno {curso.turno}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(curso)} className="text-xs text-[#1a5276] hover:underline">Editar</button>
                  <button onClick={() => deleteCurso(curso.id)} className="text-xs text-[#c62828] hover:underline">Eliminar</button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#888888]">Docente a cargo:</span>
                  <span className="text-[#111111] font-medium">{docente ? `Prof. ${docente.apellido}` : 'Sin asignar'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#888888]">Estudiantes:</span>
                  <span className="text-[#111111] font-medium">{estudiantesCurso.length}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {estudiantesCurso.slice(0, 3).map(e => (
                  <span key={e.id} className="text-xs bg-[#e8e8ec] text-[#888888] px-2 py-0.5 rounded-full">{e.nombre} {e.apellido}</span>
                ))}
                {estudiantesCurso.length > 3 && (
                  <span className="text-xs bg-[#e8e8ec] text-[#888888] px-2 py-0.5 rounded-full">+{estudiantesCurso.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Editar Curso' : 'Nuevo Curso'}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Nombre *</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="ej: 1er Año" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">División</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.division} onChange={e => setForm(f => ({ ...f, division: e.target.value }))} placeholder="A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Turno</label>
            <select className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.turno} onChange={e => setForm(f => ({ ...f, turno: e.target.value as 'mañana' | 'tarde' }))}>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Nivel</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.nivel} onChange={e => setForm(f => ({ ...f, nivel: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#111111] mb-1">Docente a cargo</label>
            <select className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.docenteId ?? ''} onChange={e => setForm(f => ({ ...f, docenteId: e.target.value }))}>
              <option value="">Sin asignar</option>
              {docentes.map(d => <option key={d.id} value={d.id}>{d.apellido}, {d.nombre}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm text-[#111111] hover:bg-[#f4f4f6]">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#1a5276] text-white text-sm hover:bg-[#1a5276]">Guardar</button>
        </div>
      </Modal>
    </div>
  );
}
