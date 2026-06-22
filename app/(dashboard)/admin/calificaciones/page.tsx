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

const emptyForm: Omit<Calificacion, 'id'> = {
  estudianteId: 'e1', materiaId: 'm1', nota: 7, tipo: 'parcial',
  fecha: new Date().toISOString().split('T')[0], trimestre: 1, descripcion: '', docenteId: 'd1',
};

export default function CalificacionesAdminPage() {
  const { calificaciones, estudiantes, materias, docentes, addCalificacion, updateCalificacion, deleteCalificacion } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Calificacion, 'id'>>(emptyForm);
  const [filterEstudiante, setFilterEstudiante] = useState('');
  const [filterMateria, setFilterMateria] = useState('');

  const filtered = calificaciones.filter(c => {
    const est = estudiantes.find(e => e.id === c.estudianteId);
    const mat = materias.find(m => m.id === c.materiaId);
    return (
      (!filterEstudiante || c.estudianteId === filterEstudiante) &&
      (!filterMateria || c.materiaId === filterMateria)
    );
  });

  const openNew = () => { setForm(emptyForm); setEditId(null); setIsOpen(true); };
  const openEdit = (c: Calificacion) => {
    setForm({ estudianteId: c.estudianteId, materiaId: c.materiaId, nota: c.nota, tipo: c.tipo, fecha: c.fecha, trimestre: c.trimestre, descripcion: c.descripcion, docenteId: c.docenteId });
    setEditId(c.id); setIsOpen(true);
  };

  const handleSave = () => {
    if (editId) updateCalificacion(editId, form);
    else addCalificacion(form);
    setIsOpen(false);
  };

  const getNotaColor = (nota: number) => {
    if (nota >= 7) return 'bg-green-100 text-green-700';
    if (nota >= 4) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div>
      <PageHeader
        title="Calificaciones"
        description={`${calificaciones.length} registros`}
        action={
          <button onClick={openNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            + Nueva Calificación
          </button>
        }
      />

      <div className="flex gap-3 mb-4">
        <select value={filterEstudiante} onChange={e => setFilterEstudiante(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todos los estudiantes</option>
          {estudiantes.map(e => <option key={e.id} value={e.id}>{e.apellido}, {e.nombre}</option>)}
        </select>
        <select value={filterMateria} onChange={e => setFilterMateria(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Todas las materias</option>
          {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Estudiante</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Materia</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Descripción</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Trimestre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Nota</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => {
                const est = estudiantes.find(e => e.id === c.estudianteId);
                const mat = materias.find(m => m.id === c.materiaId);
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{est ? `${est.apellido}, ${est.nombre}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{mat?.nombre || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.descripcion || '-'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 capitalize">{tipoOpts.find(t => t.value === c.tipo)?.label}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.trimestre}°</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{new Date(c.fecha).toLocaleDateString('es-AR')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${getNotaColor(c.nota)}`}>{c.nota}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(c)} className="text-xs text-blue-600 hover:underline mr-3">Editar</button>
                      <button onClick={() => deleteCalificacion(c.id)} className="text-xs text-red-600 hover:underline">Eliminar</button>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Estudiante</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.estudianteId} onChange={e => setForm(f => ({ ...f, estudianteId: e.target.value }))}>
              {estudiantes.map(e => <option key={e.id} value={e.id}>{e.apellido}, {e.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Materia</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.materiaId} onChange={e => setForm(f => ({ ...f, materiaId: e.target.value }))}>
              {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nota (1-10)</label>
            <input type="number" min={1} max={10} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.nota} onChange={e => setForm(f => ({ ...f, nota: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as Calificacion['tipo'] }))}>
              {tipoOpts.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Trimestre</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.trimestre} onChange={e => setForm(f => ({ ...f, trimestre: Number(e.target.value) as 1|2|3 }))}>
              <option value={1}>1° Trimestre</option>
              <option value={2}>2° Trimestre</option>
              <option value={3}>3° Trimestre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
            <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <input className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.descripcion ?? ''} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} placeholder="ej: 1er Parcial" />
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
