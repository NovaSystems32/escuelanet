'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Disciplina } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

const tipoConfig: Record<string, { label: string; color: string }> = {
  observacion: { label: 'Observación', color: 'bg-yellow-100 text-yellow-700' },
  apercibimiento: { label: 'Apercibimiento', color: 'bg-orange-100 text-orange-700' },
  suspension: { label: 'Suspensión', color: 'bg-red-100 text-red-700' },
  felicitacion: { label: 'Felicitación', color: 'bg-green-100 text-green-700' },
};

const emptyForm: Omit<Disciplina, 'id'> = {
  estudianteId: 'e1', tipo: 'observacion', descripcion: '',
  fecha: new Date().toISOString().split('T')[0], resuelto: false,
};

export default function DisciplinaAdminPage() {
  const { disciplina, estudiantes, docentes, addDisciplina, updateDisciplina, deleteDisciplina } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Disciplina, 'id'>>(emptyForm);
  const [filterTipo, setFilterTipo] = useState('');

  const filtered = filterTipo ? disciplina.filter(d => d.tipo === filterTipo) : disciplina;

  const openNew = () => { setForm(emptyForm); setEditId(null); setIsOpen(true); };
  const openEdit = (d: Disciplina) => {
    setForm({ estudianteId: d.estudianteId, tipo: d.tipo, descripcion: d.descripcion, fecha: d.fecha, docenteId: d.docenteId, resuelto: d.resuelto });
    setEditId(d.id); setIsOpen(true);
  };

  const handleSave = () => {
    if (!form.descripcion) return;
    if (editId) updateDisciplina(editId, form);
    else addDisciplina(form);
    setIsOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Disciplina"
        description={`${disciplina.length} registros`}
        action={
          <button onClick={openNew} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            + Nuevo Registro
          </button>
        }
      />

      <div className="flex gap-2 mb-4 flex-wrap">
        {['', 'observacion', 'apercibimiento', 'suspension', 'felicitacion'].map(tipo => (
          <button
            key={tipo}
            onClick={() => setFilterTipo(tipo)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filterTipo === tipo ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {tipo === '' ? 'Todos' : tipoConfig[tipo].label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(reg => {
          const est = estudiantes.find(e => e.id === reg.estudianteId);
          const docente = docentes.find(d => d.id === reg.docenteId);
          const config = tipoConfig[reg.tipo];
          return (
            <div key={reg.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>{config.label}</span>
                    {reg.resuelto && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Resuelto</span>}
                    <span className="text-xs text-slate-400">{new Date(reg.fecha).toLocaleDateString('es-AR')}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 mb-1">{est ? `${est.apellido}, ${est.nombre}` : '-'}</p>
                  <p className="text-sm text-slate-600">{reg.descripcion}</p>
                  {docente && <p className="text-xs text-slate-400 mt-1">Por: Prof. {docente.apellido}</p>}
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => openEdit(reg)} className="text-xs text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => deleteDisciplina(reg.id)} className="text-xs text-red-600 hover:underline">Eliminar</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Editar Registro' : 'Nuevo Registro'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Estudiante</label>
            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.estudianteId} onChange={e => setForm(f => ({ ...f, estudianteId: e.target.value }))}>
              {estudiantes.map(e => <option key={e.id} value={e.id}>{e.apellido}, {e.nombre}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value as Disciplina['tipo'] }))}>
                {Object.entries(tipoConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
              <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción *</label>
            <textarea rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.resuelto} onChange={e => setForm(f => ({ ...f, resuelto: e.target.checked }))} />
            Marcar como resuelto
          </label>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">Guardar</button>
        </div>
      </Modal>
    </div>
  );
}
