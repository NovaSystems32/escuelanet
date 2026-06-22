'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Estudiante } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

const emptyForm: Omit<Estudiante, 'id'> = {
  nombre: '', apellido: '', dni: '', email: '', telefono: '',
  curso: 'c1', turno: 'mañana', fechaNacimiento: '', activo: true,
};

export default function EstudiantesPage() {
  const { estudiantes, cursos, addEstudiante, updateEstudiante, deleteEstudiante } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Estudiante, 'id'>>(emptyForm);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = estudiantes.filter(e =>
    `${e.nombre} ${e.apellido} ${e.dni}`.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm(emptyForm); setEditId(null); setIsOpen(true); };
  const openEdit = (e: Estudiante) => { setForm({ nombre: e.nombre, apellido: e.apellido, dni: e.dni, email: e.email, telefono: e.telefono, curso: e.curso, turno: e.turno, fechaNacimiento: e.fechaNacimiento, activo: e.activo }); setEditId(e.id); setIsOpen(true); };

  const handleSave = () => {
    if (!form.nombre || !form.apellido) return;
    if (editId) updateEstudiante(editId, form);
    else addEstudiante(form);
    setIsOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteEstudiante(id);
    setConfirmDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Estudiantes"
        description={`${estudiantes.filter(e => e.activo).length} activos de ${estudiantes.length} total`}
        action={
          <button onClick={openNew} className="bg-[#2d4a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a2f5e] transition-colors">
            + Nuevo Estudiante
          </button>
        }
      />

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#d8e0ee] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-[#d8e0ee]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">DNI</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Curso</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Turno</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef1f8]">
              {filtered.map(e => {
                const curso = cursos.find(c => c.id === e.curso);
                return (
                  <tr key={e.id} className="hover:bg-[#f8f9fc]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#e8f0fb] text-[#2d4a8a] flex items-center justify-center text-sm font-semibold">
                          {e.nombre.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1a2444]">{e.apellido}, {e.nombre}</p>
                          <p className="text-xs text-[#5a6a8a]">{e.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{e.dni}</td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{curso ? `${curso.nombre} ${curso.division}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a] capitalize">{e.turno}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${e.activo ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-red-100 text-[#e53935]'}`}>
                        {e.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(e)} className="text-xs text-[#2d4a8a] hover:underline mr-3">Editar</button>
                      <button onClick={() => setConfirmDelete(e.id)} className="text-xs text-[#e53935] hover:underline">Eliminar</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-[#5a6a8a]">No se encontraron estudiantes</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Editar Estudiante' : 'Nuevo Estudiante'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Nombre *</label>
            <input className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Apellido *</label>
            <input className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.apellido} onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">DNI</label>
            <input className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.dni} onChange={e => setForm(f => ({ ...f, dni: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Teléfono</label>
            <input className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Fecha de Nacimiento</label>
            <input type="date" className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.fechaNacimiento} onChange={e => setForm(f => ({ ...f, fechaNacimiento: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Curso</label>
            <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.curso} onChange={e => setForm(f => ({ ...f, curso: e.target.value }))}>
              {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Turno</label>
            <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.turno} onChange={e => setForm(f => ({ ...f, turno: e.target.value as 'mañana' | 'tarde' }))}>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#1a2444]">
              <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} className="rounded" />
              Estudiante activo
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-[#d8e0ee] text-sm text-[#1a2444] hover:bg-[#f8f9fc]">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#2d4a8a] text-white text-sm hover:bg-[#1a2f5e]">Guardar</button>
        </div>
      </Modal>

      {/* Confirm delete modal */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmar eliminación" size="sm">
        <p className="text-sm text-[#5a6a8a] mb-4">¿Estás seguro de que querés eliminar este estudiante? Esta acción no se puede deshacer.</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg border border-[#d8e0ee] text-sm text-[#1a2444] hover:bg-[#f8f9fc]">Cancelar</button>
          <button onClick={() => confirmDelete && handleDelete(confirmDelete)} className="px-4 py-2 rounded-lg bg-[#e53935] text-white text-sm hover:bg-[#c62828]">Eliminar</button>
        </div>
      </Modal>
    </div>
  );
}
