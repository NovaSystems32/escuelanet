'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Materia } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

const emptyForm: Omit<Materia, 'id'> = {
  nombre: '', cursoId: 'c1', docenteId: 'd1', horasSemanal: 3, descripcion: '',
};

export default function MateriasPage() {
  const { materias, cursos, docentes, addMateria, updateMateria, deleteMateria } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Materia, 'id'>>(emptyForm);

  const openNew = () => { setForm(emptyForm); setEditId(null); setIsOpen(true); };
  const openEdit = (m: Materia) => {
    setForm({ nombre: m.nombre, cursoId: m.cursoId, docenteId: m.docenteId, horasSemanal: m.horasSemanal, descripcion: m.descripcion });
    setEditId(m.id); setIsOpen(true);
  };

  const handleSave = () => {
    if (!form.nombre) return;
    if (editId) updateMateria(editId, form);
    else addMateria(form);
    setIsOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Materias"
        description={`${materias.length} materias registradas`}
        action={
          <button onClick={openNew} className="bg-[#2d4a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a2f5e]">
            + Nueva Materia
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-[#d8e0ee] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-[#d8e0ee]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Materia</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Curso</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Docente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Horas/sem</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef1f8]">
              {materias.map(m => {
                const curso = cursos.find(c => c.id === m.cursoId);
                const docente = docentes.find(d => d.id === m.docenteId);
                return (
                  <tr key={m.id} className="hover:bg-[#f8f9fc]">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-[#1a2444]">{m.nombre}</p>
                      {m.descripcion && <p className="text-xs text-[#5a6a8a] truncate max-w-xs">{m.descripcion}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{curso ? `${curso.nombre} ${curso.division}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{docente ? `${docente.apellido}, ${docente.nombre}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{m.horasSemanal}h</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(m)} className="text-xs text-[#2d4a8a] hover:underline mr-3">Editar</button>
                      <button onClick={() => deleteMateria(m.id)} className="text-xs text-[#e53935] hover:underline">Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Editar Materia' : 'Nueva Materia'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Nombre *</label>
            <input className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a2444] mb-1">Curso</label>
              <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.cursoId} onChange={e => setForm(f => ({ ...f, cursoId: e.target.value }))}>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a2444] mb-1">Horas semanales</label>
              <input type="number" min={1} max={10} className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.horasSemanal} onChange={e => setForm(f => ({ ...f, horasSemanal: Number(e.target.value) }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Docente</label>
            <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.docenteId} onChange={e => setForm(f => ({ ...f, docenteId: e.target.value }))}>
              {docentes.map(d => <option key={d.id} value={d.id}>{d.apellido}, {d.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Descripción</label>
            <textarea rows={2} className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a] resize-none" value={form.descripcion ?? ''} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-[#d8e0ee] text-sm text-[#1a2444] hover:bg-[#f8f9fc]">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#2d4a8a] text-white text-sm hover:bg-[#1a2f5e]">Guardar</button>
        </div>
      </Modal>
    </div>
  );
}
