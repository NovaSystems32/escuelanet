'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Docente } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

const emptyForm: Omit<Docente, 'id'> = {
  nombre: '', apellido: '', dni: '', email: '', telefono: '', materias: [], activo: true,
};

export default function DocentesPage() {
  const { docentes, materias, addDocente, updateDocente, deleteDocente } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Docente, 'id'>>(emptyForm);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = docentes.filter(d =>
    `${d.nombre} ${d.apellido} ${d.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm(emptyForm); setEditId(null); setIsOpen(true); };
  const openEdit = (d: Docente) => { setForm({ nombre: d.nombre, apellido: d.apellido, dni: d.dni, email: d.email, telefono: d.telefono, materias: d.materias, activo: d.activo }); setEditId(d.id); setIsOpen(true); };

  const handleSave = () => {
    if (!form.nombre || !form.apellido) return;
    if (editId) updateDocente(editId, form);
    else addDocente(form);
    setIsOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Docentes"
        description={`${docentes.filter(d => d.activo).length} activos de ${docentes.length} total`}
        action={
          <button onClick={openNew} className="bg-[#1a5276] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a5276] transition-colors">
            + Nuevo Docente
          </button>
        }
      />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar docente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
        />
      </div>

      <div className="bg-white rounded-xl border border-[#e8e8ec] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f4f6] border-b border-[#e8e8ec]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">DNI</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Espacios curriculares</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ec]">
              {filtered.map(d => {
                const docenteMaterias = materias.filter(m => d.materias.includes(m.id));
                return (
                  <tr key={d.id} className="hover:bg-[#f4f4f6]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold">
                          {d.nombre.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#111111]">{d.apellido}, {d.nombre}</p>
                          <p className="text-xs text-[#888888]">{d.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#888888]">{d.dni}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {docenteMaterias.map(m => (
                          <span key={m.id} className="text-xs bg-[#d6eaf8] text-[#1a5276] px-2 py-0.5 rounded-full">{m.nombre}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${d.activo ? 'bg-[#d4edda] text-[#155724]' : 'bg-red-100 text-[#c62828]'}`}>
                        {d.activo ? 'Habilitado' : 'Deshabilitado'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(d)} className="text-xs text-[#1a5276] hover:underline mr-3">Editar</button>
                      <button onClick={() => setConfirmDelete(d.id)} className="text-xs text-[#c62828] hover:underline">Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Editar Docente' : 'Nuevo Docente'} size="lg">
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
            <label className="block text-sm font-medium text-[#111111] mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Teléfono</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm font-medium text-[#111111]">
              <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} className="rounded" />
              Activo
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm text-[#111111] hover:bg-[#f4f4f6]">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#1a5276] text-white text-sm hover:bg-[#1a5276]">Guardar</button>
        </div>
      </Modal>

      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmar eliminación" size="sm">
        <p className="text-sm text-[#888888] mb-4">¿Estás seguro de que querés eliminar este docente?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm">Cancelar</button>
          <button onClick={() => { if (confirmDelete) { deleteDocente(confirmDelete); setConfirmDelete(null); } }} className="px-4 py-2 rounded-lg bg-[#c62828] text-white text-sm">Eliminar</button>
        </div>
      </Modal>
    </div>
  );
}
