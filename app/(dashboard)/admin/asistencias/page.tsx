'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';
import { Asistencia } from '@/types';

export default function AsistenciasAdminPage() {
  const { asistencias, estudiantes, cursos, addAsistencia, updateAsistencia } = useAppStore();
  const [filterCurso, setFilterCurso] = useState('');
  const [filterFecha, setFilterFecha] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<Omit<Asistencia, 'id'>>({
    estudianteId: 'e1', cursoId: 'c1', fecha: new Date().toISOString().split('T')[0],
    presente: true, justificada: false, observacion: '',
  });
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = asistencias.filter(a =>
    (!filterCurso || a.cursoId === filterCurso) &&
    (!filterFecha || a.fecha === filterFecha)
  );

  const totalPresentes = filtered.filter(a => a.presente).length;
  const totalAusentes = filtered.filter(a => !a.presente).length;

  const openEdit = (a: Asistencia) => {
    setForm({ estudianteId: a.estudianteId, cursoId: a.cursoId, fecha: a.fecha, presente: a.presente, justificada: a.justificada, observacion: a.observacion });
    setEditId(a.id);
    setIsOpen(true);
  };

  const openNew = () => {
    setForm({ estudianteId: estudiantes[0]?.id || 'e1', cursoId: cursos[0]?.id || 'c1', fecha: new Date().toISOString().split('T')[0], presente: true, justificada: false, observacion: '' });
    setEditId(null);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editId) updateAsistencia(editId, form);
    else addAsistencia(form);
    setIsOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Asistencias"
        description={`${asistencias.length} registros totales`}
        action={
          <button onClick={openNew} className="bg-[#1a5276] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a5276]">
            + Registrar Asistencia
          </button>
        }
      />

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={filterCurso} onChange={e => setFilterCurso(e.target.value)} className="px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]">
          <option value="">Todos los cursos</option>
          {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>)}
        </select>
        <input type="date" value={filterFecha} onChange={e => setFilterFecha(e.target.value)} className="px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" />
        {(filterCurso || filterFecha) && (
          <button onClick={() => { setFilterCurso(''); setFilterFecha(''); }} className="text-sm text-[#888888] hover:text-[#111111] underline">Limpiar filtros</button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-xl border border-[#e8e8ec] p-4 text-center">
          <p className="text-2xl font-bold text-[#111111]">{filtered.length}</p>
          <p className="text-xs text-[#888888]">Total registros</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
          <p className="text-2xl font-bold text-[#155724]">{totalPresentes}</p>
          <p className="text-xs text-green-600">Presentes</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
          <p className="text-2xl font-bold text-[#c62828]">{totalAusentes}</p>
          <p className="text-xs text-[#c62828]">Ausentes</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#e8e8ec] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f4f6] border-b border-[#e8e8ec]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Estudiante</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Curso</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Observación</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ec]">
              {filtered.map(a => {
                const est = estudiantes.find(e => e.id === a.estudianteId);
                const curso = cursos.find(c => c.id === a.cursoId);
                return (
                  <tr key={a.id} className="hover:bg-[#f4f4f6]">
                    <td className="px-4 py-3 text-sm text-[#111111]">{est ? `${est.apellido}, ${est.nombre}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#888888]">{curso ? `${curso.nombre} ${curso.division}` : '-'}</td>
                    <td className="px-4 py-3 text-sm text-[#888888]">{new Date(a.fecha).toLocaleDateString('es-AR')}</td>
                    <td className="px-4 py-3">
                      {a.presente ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-[#d4edda] text-[#155724] font-medium">Presente</span>
                      ) : a.justificada ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-[#d97706] font-medium">Justificada</span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-[#c62828] font-medium">Ausente</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#888888]">{a.observacion || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(a)} className="text-xs text-[#1a5276] hover:underline">Editar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Editar Asistencia' : 'Registrar Asistencia'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Estudiante</label>
              <select className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.estudianteId} onChange={e => setForm(f => ({ ...f, estudianteId: e.target.value }))}>
                {estudiantes.map(e => <option key={e.id} value={e.id}>{e.apellido}, {e.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Curso</label>
              <select className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.cursoId} onChange={e => setForm(f => ({ ...f, cursoId: e.target.value }))}>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Fecha</label>
            <input type="date" className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-[#111111]">
              <input type="checkbox" checked={form.presente} onChange={e => setForm(f => ({ ...f, presente: e.target.checked }))} />
              Presente
            </label>
            <label className="flex items-center gap-2 text-sm text-[#111111]">
              <input type="checkbox" checked={!!form.justificada} onChange={e => setForm(f => ({ ...f, justificada: e.target.checked }))} />
              Justificada
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Observación</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.observacion ?? ''} onChange={e => setForm(f => ({ ...f, observacion: e.target.value }))} />
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
