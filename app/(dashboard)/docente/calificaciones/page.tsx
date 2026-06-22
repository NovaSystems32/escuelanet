'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Calificacion } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

const tipoOpts = [
  { value: 'parcial', label: 'Parcial' },
  { value: 'trabajo_practico', label: 'Trabajo Práctico' },
  { value: 'examen_final', label: 'Examen Final' },
  { value: 'oral', label: 'Oral' },
];

export default function DocenteCalificacionesPage() {
  const { calificaciones, materias, estudiantes, cursos, addCalificacion, updateCalificacion, deleteCalificacion } = useAppStore();
  const docenteId = 'd1';
  const misMaterias = materias.filter(m => m.docenteId === docenteId);
  const misCalificaciones = calificaciones.filter(c => c.docenteId === docenteId);
  const [filterMateria, setFilterMateria] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Calificacion, 'id'>>({
    estudianteId: 'e1', materiaId: misMaterias[0]?.id || 'm1', nota: 7, tipo: 'parcial',
    fecha: new Date().toISOString().split('T')[0], trimestre: 1, descripcion: '', docenteId,
  });

  const filtered = filterMateria ? misCalificaciones.filter(c => c.materiaId === filterMateria) : misCalificaciones;

  const openNew = () => {
    setForm({ estudianteId: 'e1', materiaId: misMaterias[0]?.id || 'm1', nota: 7, tipo: 'parcial', fecha: new Date().toISOString().split('T')[0], trimestre: 1, descripcion: '', docenteId });
    setEditId(null); setIsOpen(true);
  };

  const openEdit = (c: Calificacion) => {
    setForm({ estudianteId: c.estudianteId, materiaId: c.materiaId, nota: c.nota, tipo: c.tipo, fecha: c.fecha, trimestre: c.trimestre, descripcion: c.descripcion, docenteId });
    setEditId(c.id); setIsOpen(true);
  };

  const handleSave = () => {
    if (editId) updateCalificacion(editId, form);
    else addCalificacion(form);
    setIsOpen(false);
  };

  const getNotaColor = (nota: number) => nota >= 7 ? 'bg-[#dcfce7] text-[#15803d]' : nota >= 4 ? 'bg-[#fef3c7] text-[#d97706]' : 'bg-red-100 text-[#e53935]';

  // Get students for currently selected materia in form
  const materiaForm = misMaterias.find(m => m.id === form.materiaId);
  const cursForm = cursos.find(c => c.id === materiaForm?.cursoId);
  const estudiantesForm = estudiantes.filter(e => cursForm?.estudiantesIds.includes(e.id) ?? false);

  return (
    <div>
      <PageHeader
        title="Calificaciones"
        description={`${misCalificaciones.length} notas cargadas`}
        action={
          <button onClick={openNew} className="bg-[#2d4a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a2f5e]">
            + Nueva Nota
          </button>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={filterMateria} onChange={e => setFilterMateria(e.target.value)} className="px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]">
          <option value="">Todas mis materias</option>
          {misMaterias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[#d8e0ee] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-[#d8e0ee]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Estudiante</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Materia</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Descripción</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Trim.</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Nota</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef1f8]">
              {filtered.map(c => {
                const est = estudiantes.find(e => e.id === c.estudianteId);
                const mat = materias.find(m => m.id === c.materiaId);
                return (
                  <tr key={c.id} className="hover:bg-[#f8f9fc]">
                    <td className="px-4 py-3 text-sm text-[#1a2444]">{est ? `${est.apellido}, ${est.nombre}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{mat?.nombre || '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{c.descripcion || '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{tipoOpts.find(t => t.value === c.tipo)?.label}</td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{c.trimestre}°</td>
                    <td className="px-4 py-3"><span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${getNotaColor(c.nota)}`}>{c.nota}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(c)} className="text-xs text-[#2d4a8a] hover:underline mr-3">Editar</button>
                      <button onClick={() => deleteCalificacion(c.id)} className="text-xs text-[#e53935] hover:underline">Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Editar Calificación' : 'Nueva Calificación'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Materia</label>
            <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.materiaId} onChange={e => setForm(f => ({ ...f, materiaId: e.target.value, estudianteId: '' }))}>
              {misMaterias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Estudiante</label>
            <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.estudianteId} onChange={e => setForm(f => ({ ...f, estudianteId: e.target.value }))}>
              <option value="">Seleccionar...</option>
              {estudiantesForm.map(e => <option key={e.id} value={e.id}>{e.apellido}, {e.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Nota (1-10)</label>
            <input type="number" min={1} max={10} className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.nota} onChange={e => setForm(f => ({ ...f, nota: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Tipo</label>
            <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as Calificacion['tipo'] }))}>
              {tipoOpts.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Trimestre</label>
            <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.trimestre} onChange={e => setForm(f => ({ ...f, trimestre: Number(e.target.value) as 1|2|3 }))}>
              <option value={1}>1° Trimestre</option>
              <option value={2}>2° Trimestre</option>
              <option value={3}>3° Trimestre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Fecha</label>
            <input type="date" className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Descripción</label>
            <input className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.descripcion ?? ''} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="ej: 1er Parcial" />
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
