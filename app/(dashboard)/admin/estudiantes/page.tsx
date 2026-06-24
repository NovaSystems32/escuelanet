'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Estudiante } from '@/types';
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

export default function EstudiantesPage() {
  const { estudiantes, cursos, addEstudiante, updateEstudiante, deleteEstudiante } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Estudiante, 'id'>>(emptyForm);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const filtered = estudiantes.filter(e =>
    `${e.nombre} ${e.apellido} ${e.dni}`.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm(emptyForm); setEditId(null); setIsOpen(true); };
  const openEdit = (e: Estudiante) => {
    setForm({
      nombre: e.nombre, apellido: e.apellido, dni: e.dni, email: e.email,
      telefono: e.telefono, curso: e.curso, turno: e.turno, fechaNacimiento: e.fechaNacimiento,
      activo: e.activo, photo: e.photo, tutor: e.tutor || '', telefonoTutor: e.telefonoTutor || '',
      direccion: e.direccion || '',
    });
    setEditId(e.id);
    setIsOpen(true);
  };

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
        title="Nómina de estudiantes"
        description={`${estudiantes.filter(e => e.activo).length} activos de ${estudiantes.length} total`}
        action={
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => downloadTemplateExcel()} className="px-3 py-2 rounded-lg text-sm font-medium text-[#888888] border border-[#e8e8ec] hover:bg-[#f4f4f6]">
              📄 Descargar plantilla de carga
            </button>
            <button onClick={() => setImportOpen(true)} className="px-3 py-2 rounded-lg text-sm font-medium text-[#1a5276] border border-[#1a5276] hover:bg-[#d6eaf8]">
              📥 Importar desde Excel
            </button>
            <button onClick={() => exportStudentsToExcel(estudiantes)} className="px-3 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#27ae60' }}>
              📊 Exportar nómina
            </button>
            <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#1a5276' }}>
              + Nuevo Estudiante
            </button>
          </div>
        }
      />

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e8e8ec] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f4f6] border-b border-[#e8e8ec]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">DNI</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Curso</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Turno</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ec]">
              {filtered.map(e => {
                const curso = cursos.find(c => c.id === e.curso);
                return (
                  <tr key={e.id} className="hover:bg-[#f4f4f6]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-[#e8e8ec]">
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
                          <p className="text-xs text-[#888888]">{e.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#888888]">{e.dni}</td>
                    <td className="px-4 py-3 text-sm text-[#888888]">{curso ? `${curso.nombre} ${curso.division}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#888888] capitalize">{e.turno}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${e.activo ? 'bg-[#d4edda] text-[#155724]' : 'bg-red-100 text-[#c62828]'}`}>
                        {e.activo ? 'Habilitado' : 'Deshabilitado'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(e)} className="text-xs text-[#1a5276] hover:underline mr-3">Editar</button>
                      <button onClick={() => setConfirmDelete(e.id)} className="text-xs text-[#c62828] hover:underline">Eliminar</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-[#888888]">No se encontraron estudiantes</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Editar Estudiante' : 'Nuevo Estudiante'} size="lg">
        <div className="flex justify-center mb-4">
          <PhotoUpload
            photo={form.photo}
            onPhotoChange={(p) => setForm(f => ({ ...f, photo: p }))}
            name={form.nombre}
            size="lg"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium text-[#111111] mb-1">Teléfono del Tutor</label>
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
        <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-end">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm text-[#111111] hover:bg-[#f4f4f6]">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: '#1a5276' }}>Guardar</button>
        </div>
      </Modal>

      {/* Confirm delete modal */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmar eliminación" size="sm">
        <p className="text-sm text-[#888888] mb-4">¿Estás seguro de que querés eliminar este estudiante?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm text-[#111111] hover:bg-[#f4f4f6]">Cancelar</button>
          <button onClick={() => confirmDelete && handleDelete(confirmDelete)} className="px-4 py-2 rounded-lg bg-[#c62828] text-white text-sm hover:bg-[#7a1515]">Eliminar</button>
        </div>
      </Modal>

      {/* Import Modal */}
      <ImportStudents isOpen={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
