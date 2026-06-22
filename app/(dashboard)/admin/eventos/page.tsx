'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Evento } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

const tipoOpts = [
  { value: 'examen', label: 'Examen', color: '#ef4444' },
  { value: 'reunion', label: 'Reunión', color: '#3b82f6' },
  { value: 'feriado', label: 'Feriado', color: '#6b7280' },
  { value: 'actividad', label: 'Actividad', color: '#f59e0b' },
  { value: 'entrega', label: 'Entrega', color: '#10b981' },
];

const emptyForm: Omit<Evento, 'id'> = {
  titulo: '', descripcion: '', fecha: new Date().toISOString().split('T')[0],
  tipo: 'actividad', color: '#f59e0b',
};

export default function EventosAdminPage() {
  const { eventos, cursos, addEvento, updateEvento, deleteEvento } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Evento, 'id'>>(emptyForm);

  const sorted = [...eventos].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const openNew = () => { setForm(emptyForm); setEditId(null); setIsOpen(true); };
  const openEdit = (e: Evento) => {
    setForm({ titulo: e.titulo, descripcion: e.descripcion, fecha: e.fecha, fechaFin: e.fechaFin, tipo: e.tipo, cursoId: e.cursoId, color: e.color });
    setEditId(e.id); setIsOpen(true);
  };

  const handleTipoChange = (tipo: string) => {
    const opt = tipoOpts.find(t => t.value === tipo);
    setForm(f => ({ ...f, tipo: tipo as Evento['tipo'], color: opt?.color || '#6b7280' }));
  };

  const handleSave = () => {
    if (!form.titulo) return;
    if (editId) updateEvento(editId, form);
    else addEvento(form);
    setIsOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Eventos"
        description={`${eventos.length} eventos registrados`}
        action={
          <button onClick={openNew} className="bg-[#2d4a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a2f5e]">
            + Nuevo Evento
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-[#d8e0ee] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8f9fc] border-b border-[#d8e0ee]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Evento</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Tipo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Curso</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#5a6a8a] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef1f8]">
              {sorted.map(e => {
                const curso = cursos.find(c => c.id === e.cursoId);
                const tipoOpt = tipoOpts.find(t => t.value === e.tipo);
                return (
                  <tr key={e.id} className="hover:bg-[#f8f9fc]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: e.color }} />
                        <div>
                          <p className="text-sm font-medium text-[#1a2444]">{e.titulo}</p>
                          <p className="text-xs text-[#5a6a8a] truncate max-w-xs">{e.descripcion}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{new Date(e.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#eef1f8] text-[#5a6a8a] font-medium">{tipoOpt?.label}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5a6a8a]">{curso ? `${curso.nombre} ${curso.division}` : 'General'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(e)} className="text-xs text-[#2d4a8a] hover:underline mr-3">Editar</button>
                      <button onClick={() => deleteEvento(e.id)} className="text-xs text-[#e53935] hover:underline">Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Editar Evento' : 'Nuevo Evento'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Título *</label>
            <input className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Descripción</label>
            <textarea rows={2} className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a] resize-none" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a2444] mb-1">Fecha inicio</label>
              <input type="date" className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a2444] mb-1">Fecha fin (opcional)</label>
              <input type="date" className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.fechaFin ?? ''} onChange={e => setForm(f => ({ ...f, fechaFin: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a2444] mb-1">Tipo</label>
              <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.tipo} onChange={e => handleTipoChange(e.target.value)}>
                {tipoOpts.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a2444] mb-1">Curso (opcional)</label>
              <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.cursoId ?? ''} onChange={e => setForm(f => ({ ...f, cursoId: e.target.value || undefined }))}>
                <option value="">General</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} {c.division}</option>)}
              </select>
            </div>
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
