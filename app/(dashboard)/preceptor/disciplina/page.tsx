'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Disciplina } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

const tipoConfig: Record<string, { label: string; color: string; icon: string }> = {
  observacion: { label: 'Observación', color: 'bg-[#fef3c7] text-[#d97706]', icon: '👁️' },
  apercibimiento: { label: 'Apercibimiento', color: 'bg-orange-100 text-[#d97706]', icon: '⚠️' },
  suspension: { label: 'Suspensión', color: 'bg-red-100 text-[#e53935]', icon: '🚫' },
  felicitacion: { label: 'Felicitación', color: 'bg-[#dcfce7] text-[#15803d]', icon: '⭐' },
};

export default function PreceptorDisciplinaPage() {
  const { disciplina, estudiantes, addDisciplina, updateDisciplina, deleteDisciplina } = useAppStore();
  const preceptorId = 'u4';
  const [filterTipo, setFilterTipo] = useState('');
  const [filterResuelto, setFilterResuelto] = useState<'todos' | 'pendiente' | 'resuelto'>('todos');
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Disciplina, 'id'>>({
    estudianteId: 'e1', tipo: 'observacion', descripcion: '',
    fecha: new Date().toISOString().split('T')[0], preceptorId, resuelto: false,
  });

  const filtered = disciplina.filter(d =>
    (!filterTipo || d.tipo === filterTipo) &&
    (filterResuelto === 'todos' || (filterResuelto === 'pendiente' ? !d.resuelto : d.resuelto))
  );

  const openNew = () => {
    setForm({ estudianteId: 'e1', tipo: 'observacion', descripcion: '', fecha: new Date().toISOString().split('T')[0], preceptorId, resuelto: false });
    setEditId(null); setIsOpen(true);
  };

  const openEdit = (d: Disciplina) => {
    setForm({ estudianteId: d.estudianteId, tipo: d.tipo, descripcion: d.descripcion, fecha: d.fecha, preceptorId, resuelto: d.resuelto });
    setEditId(d.id); setIsOpen(true);
  };

  const handleSave = () => {
    if (!form.descripcion) return;
    if (editId) updateDisciplina(editId, form);
    else addDisciplina(form);
    setIsOpen(false);
  };

  const toggleResuelto = (id: string, current: boolean) => {
    updateDisciplina(id, { resuelto: !current });
  };

  return (
    <div>
      <PageHeader
        title="Disciplina"
        description="Registro y gestión de conducta estudiantil"
        action={
          <button onClick={openNew} className="bg-[#2d4a8a] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a2f5e]">
            + Nuevo Registro
          </button>
        }
      />

      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]">
          <option value="">Todos los tipos</option>
          {Object.entries(tipoConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterResuelto} onChange={e => setFilterResuelto(e.target.value as typeof filterResuelto)} className="px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]">
          <option value="todos">Todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="resuelto">Resueltos</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(reg => {
          const est = estudiantes.find(e => e.id === reg.estudianteId);
          const config = tipoConfig[reg.tipo];
          return (
            <div key={reg.id} className={`bg-white rounded-xl border border-[#d8e0ee] p-5 ${reg.resuelto ? 'opacity-70' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xl">{config.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>{config.label}</span>
                      {reg.resuelto
                        ? <span className="text-xs px-2 py-0.5 rounded-full bg-[#eef1f8] text-[#5a6a8a]">✓ Resuelto</span>
                        : <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-500">Pendiente</span>
                      }
                    </div>
                    <p className="text-sm font-semibold text-[#1a2444]">{est ? `${est.apellido}, ${est.nombre}` : '-'}</p>
                    <p className="text-sm text-[#5a6a8a] mt-1">{reg.descripcion}</p>
                    <p className="text-xs text-[#5a6a8a] mt-1">{new Date(reg.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4 flex-col items-end">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(reg)} className="text-xs text-[#2d4a8a] hover:underline">Editar</button>
                    <button onClick={() => deleteDisciplina(reg.id)} className="text-xs text-[#e53935] hover:underline">Eliminar</button>
                  </div>
                  <button
                    onClick={() => toggleResuelto(reg.id, reg.resuelto)}
                    className={`text-xs px-2 py-1 rounded-lg border transition-colors ${reg.resuelto ? 'border-[#d8e0ee] text-[#5a6a8a] hover:bg-[#f8f9fc]' : 'border-green-300 text-[#15803d] hover:bg-green-50'}`}
                  >
                    {reg.resuelto ? 'Reabrir' : 'Resolver'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-[#d8e0ee] p-8 text-center text-[#5a6a8a]">
            No hay registros que coincidan con los filtros
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Editar Registro' : 'Nuevo Registro de Disciplina'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Estudiante</label>
            <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.estudianteId} onChange={e => setForm(f => ({ ...f, estudianteId: e.target.value }))}>
              {estudiantes.map(e => <option key={e.id} value={e.id}>{e.apellido}, {e.nombre}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a2444] mb-1">Tipo</label>
              <select className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as Disciplina['tipo'] }))}>
                {Object.entries(tipoConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a2444] mb-1">Fecha</label>
              <input type="date" className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a]" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a2444] mb-1">Descripción *</label>
            <textarea rows={3} className="w-full px-3 py-2 border border-[#d8e0ee] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d4a8a] resize-none" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#1a2444]">
            <input type="checkbox" checked={form.resuelto} onChange={e => setForm(f => ({ ...f, resuelto: e.target.checked }))} />
            Marcar como resuelto
          </label>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-[#d8e0ee] text-sm text-[#1a2444] hover:bg-[#f8f9fc]">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-[#2d4a8a] text-white text-sm hover:bg-[#1a2f5e]">Guardar</button>
        </div>
      </Modal>
    </div>
  );
}
