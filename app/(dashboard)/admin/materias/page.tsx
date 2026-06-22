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
          <button onClick={openNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            + Nueva Materia
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Materia</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Curso</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Docente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Horas/sem</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materias.map(m => {
                const curso = cursos.find(c => c.id === m.cursoId);
                const docente = docentes.find(d => d.id === m.docenteId);
                return (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">{m.nombre}</p>
                      {m.descripcion && <p className="text-xs text-slate-500 truncate max-w-xs">{m.descripcion}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{curso ? `${curso.nombre} ${curso.division}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{docente ? `${docente.apellido}, ${docente.nombre}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{m.horasSemanal}h</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(m)} className="text-xs text-blue-600 hover:underline mr-3">Editar</button>
                      <button onClick={() => deleteMateria(m.id)} className="text-xs text-red-600 hover:underline">Eliminar</button>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
            <input className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Curso</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.cursoId} onChange={e => setForm(f => ({ ...f, cursoId: e.target.value }))}>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Horas semanales</label>
              <input type="number" min={1} max={10} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.horasSemanal} onChange={e => setForm(f => ({ ...f, horasSemanal: Number(e.target.value) }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Docente</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.docenteId} onChange={e => setForm(f => ({ ...f, docenteId: e.target.value }))}>
              {docentes.map(d => <option key={d.id} value={d.id}>{d.apellido}, {d.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" value={form.descripcion ?? ''} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">Guardar</button>
        </div>
      </Modal>
    </div>
  );
}
