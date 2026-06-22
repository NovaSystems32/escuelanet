'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Actividad } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

const tipoConfig: Record<string, { label: string; icon: string; color: string }> = {
  tarea: { label: 'Tarea', icon: '📋', color: 'bg-[#d6eaf8] text-[#1a5276]' },
  material: { label: 'Material', icon: '📄', color: 'bg-[#d4edda] text-[#155724]' },
  actividad: { label: 'Actividad', icon: '✏️', color: 'bg-purple-100 text-purple-700' },
};

export default function ActividadesPage() {
  const { actividades, materias, addActividad, updateActividad, deleteActividad } = useAppStore();
  const docenteId = 'd1';
  const misMaterias = materias.filter(m => m.docenteId === docenteId);
  const misActividades = actividades.filter(a => a.docenteId === docenteId);
  const [filterMateria, setFilterMateria] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Actividad, 'id'>>({
    titulo: '', descripcion: '', materiaId: misMaterias[0]?.id || 'm1',
    docenteId, tipo: 'tarea', fechaPublicacion: new Date().toISOString().split('T')[0],
  });

  const filtered = misActividades.filter(a =>
    (!filterMateria || a.materiaId === filterMateria) &&
    (!filterTipo || a.tipo === filterTipo)
  );

  const openNew = () => {
    setForm({ titulo: '', descripcion: '', materiaId: misMaterias[0]?.id || 'm1', docenteId, tipo: 'tarea', fechaPublicacion: new Date().toISOString().split('T')[0] });
    setEditId(null); setIsOpen(true);
  };

  const openEdit = (a: Actividad) => {
    setForm({ titulo: a.titulo, descripcion: a.descripcion, materiaId: a.materiaId, docenteId, tipo: a.tipo, fechaEntrega: a.fechaEntrega, fechaPublicacion: a.fechaPublicacion });
    setEditId(a.id); setIsOpen(true);
  };

  const handleSave = () => {
    if (!form.titulo) return;
    if (editId) updateActividad(editId, form);
    else addActividad(form);
    setIsOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Actividades y Materiales"
        description={`${misActividades.length} publicaciones`}
        action={
          <button onClick={openNew} className="bg-[#1a5276] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a5276]">
            + Nueva Publicación
          </button>
        }
      />

      <div className="flex gap-3 mb-6 flex-wrap">
        <select value={filterMateria} onChange={e => setFilterMateria(e.target.value)} className="px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]">
          <option value="">Todas las materias</option>
          {misMaterias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
        <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className="px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]">
          <option value="">Todos los tipos</option>
          {Object.entries(tipoConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e8e8ec] p-8 text-center text-[#888888]">
          No hay actividades publicadas
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => {
            const materia = misMaterias.find(m => m.id === a.materiaId);
            const config = tipoConfig[a.tipo];
            return (
              <div key={a.id} className="bg-white rounded-xl border border-[#e8e8ec] p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>{config.label}</span>
                        <span className="text-xs bg-[#e8e8ec] text-[#888888] px-2 py-0.5 rounded-full">{materia?.nombre}</span>
                        {a.fechaEntrega && (
                          <span className="text-xs text-[#d97706] bg-orange-50 px-2 py-0.5 rounded-full">
                            Entrega: {new Date(a.fechaEntrega).toLocaleDateString('es-AR')}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-[#111111]">{a.titulo}</h3>
                      <p className="text-sm text-[#888888] mt-1">{a.descripcion}</p>
                      <p className="text-xs text-[#888888] mt-2">
                        Publicado: {new Date(a.fechaPublicacion).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => openEdit(a)} className="text-xs text-[#1a5276] hover:underline">Editar</button>
                    <button onClick={() => deleteActividad(a.id)} className="text-xs text-[#c62828] hover:underline">Eliminar</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Editar Publicación' : 'Nueva Publicación'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Título *</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Descripción</label>
            <textarea rows={3} className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276] resize-none" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Materia</label>
              <select className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.materiaId} onChange={e => setForm(f => ({ ...f, materiaId: e.target.value }))}>
                {misMaterias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Tipo</label>
              <select className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as Actividad['tipo'] }))}>
                {Object.entries(tipoConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Fecha de publicación</label>
              <input type="date" className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.fechaPublicacion} onChange={e => setForm(f => ({ ...f, fechaPublicacion: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Fecha de entrega (opcional)</label>
              <input type="date" className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.fechaEntrega ?? ''} onChange={e => setForm(f => ({ ...f, fechaEntrega: e.target.value || undefined }))} />
            </div>
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
