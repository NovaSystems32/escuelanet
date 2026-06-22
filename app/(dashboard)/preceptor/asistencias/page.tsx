'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Asistencia } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

export default function PreceptorAsistenciasPage() {
  const { asistencias, estudiantes, cursos, addAsistencia, updateAsistencia } = useAppStore();
  const [filterCurso, setFilterCurso] = useState('');
  const [filterEstudiante, setFilterEstudiante] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Asistencia, 'id'>>({
    estudianteId: estudiantes[0]?.id || 'e1', cursoId: cursos[0]?.id || 'c1',
    fecha: new Date().toISOString().split('T')[0], presente: false, justificada: false, observacion: '',
  });

  const filtered = asistencias.filter(a =>
    !a.presente &&
    (!filterCurso || a.cursoId === filterCurso) &&
    (!filterEstudiante || a.estudianteId === filterEstudiante)
  );

  const openNew = () => { setEditId(null); setIsOpen(true); };
  const openEdit = (a: Asistencia) => {
    setForm({ estudianteId: a.estudianteId, cursoId: a.cursoId, fecha: a.fecha, presente: a.presente, justificada: a.justificada, observacion: a.observacion });
    setEditId(a.id); setIsOpen(true);
  };

  const handleSave = () => {
    if (editId) updateAsistencia(editId, form);
    else addAsistencia(form);
    setIsOpen(false);
  };

  const justificar = (id: string) => {
    updateAsistencia(id, { justificada: true });
  };

  return (
    <div>
      <PageHeader
        title="Control de Asistencias"
        description="Gestión de inasistencias y justificaciones"
        action={
          <button onClick={openNew} className="bg-[#2d4a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a2f5e]">
            + Registrar
          </button>
        }
      />

      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={filterCurso} onChange={e => setFilterCurso(e.target.value)} className="px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]">
          <option value="">Todos los cursos</option>
          {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>)}
        </select>
        <select value={filterEstudiante} onChange={e => setFilterEstudiante(e.target.value)} className="px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]">
          <option value="">Todos los estudiantes</option>
          {estudiantes.map(e => <option key={e.id} value={e.id}>{e.apellido}, {e.nombre}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[#d8e0ee] overflow-hidden">
        <div className="p-4 border-b border-[#d8e0ee] bg-orange-50">
          <p className="text-sm font-medium text-orange-800">Mostrando solo inasistencias ({filtered.length})</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-[#d8e0ee]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Estudiante</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Curso</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Observación</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef1f8]">
              {filtered.map(a => {
                const est = estudiantes.find(e => e.id === a.estudianteId);
                const curso = cursos.find(c => c.id === a.cursoId);
                return (
                  <tr key={a.id} className="hover:bg-[#f8f9fc]">
                    <td className="px-4 py-3 text-sm text-[#1a2444]">{est ? `${est.apellido}, ${est.nombre}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{curso ? `${curso.nombre} ${curso.division}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{new Date(a.fecha).toLocaleDateString('es-AR')}</td>
                    <td className="px-4 py-3">
                      {a.justificada ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-[#d97706]">Justificada</span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-[#e53935]">Injustificada</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{a.observacion || '-'}</td>
                    <td className="px-4 py-3 text-right flex gap-2 justify-end">
                      {!a.justificada && (
                        <button onClick={() => justificar(a.id)} className="text-xs text-green-600 hover:underline">Justificar</button>
                      )}
                      <button onClick={() => openEdit(a)} className="text-xs text-[#2d4a8a] hover:underline">Editar</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-[#5a6a8a]">No hay inasistencias registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Registrar Inasistencia">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Estudiante</label>
            <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.estudianteId} onChange={e => setForm(f => ({ ...f, estudianteId: e.target.value }))}>
              {estudiantes.map(e => <option key={e.id} value={e.id}>{e.apellido}, {e.nombre}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a2444] mb-1">Curso</label>
              <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.cursoId} onChange={e => setForm(f => ({ ...f, cursoId: e.target.value }))}>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a2444] mb-1">Fecha</label>
              <input type="date" className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-[#1a2444]">
              <input type="checkbox" checked={!!form.justificada} onChange={e => setForm(f => ({ ...f, justificada: e.target.checked }))} />
              Justificada
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Observación</label>
            <input className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.observacion ?? ''} onChange={e => setForm(f => ({ ...f, observacion: e.target.value }))} />
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
