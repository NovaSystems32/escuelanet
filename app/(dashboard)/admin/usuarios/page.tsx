'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AppUser, Role } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

const roleColors: Record<Role | string, string> = {
  admin: '#c62828',
  docente: '#1a5276',
  preceptor: '#c9a227',
  estudiante: '#27ae60',
  directivo: '#8e44ad',
  tutor: '#2980b9',
};

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  docente: 'Docente',
  preceptor: 'Preceptor',
  estudiante: 'Estudiante',
  directivo: 'Directivo',
  tutor: 'Tutor',
};

const emptyForm = {
  username: '',
  password: '',
  role: 'estudiante' as Role,
  linkedProfileId: '',
  isActive: true,
};

export default function UsuariosPage() {
  const { appUsers, addAppUser, updateAppUser, deleteAppUser, estudiantes, docentes } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [changePwdId, setChangePwdId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [search, setSearch] = useState('');

  const filtered = appUsers.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm(emptyForm); setEditId(null); setIsOpen(true); };
  const openEdit = (u: AppUser) => {
    setForm({ username: u.username, password: u.password, role: u.role, linkedProfileId: u.linkedProfileId, isActive: u.isActive });
    setEditId(u.id);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (!form.username.trim() || !form.password.trim()) return;
    if (editId) {
      updateAppUser(editId, { username: form.username, role: form.role, linkedProfileId: form.linkedProfileId, isActive: form.isActive });
    } else {
      addAppUser({ ...form, createdAt: new Date().toISOString().split('T')[0] });
    }
    setIsOpen(false);
  };

  const handleChangePwd = () => {
    if (!changePwdId || !newPassword.trim()) return;
    updateAppUser(changePwdId, { password: newPassword });
    setChangePwdId(null);
    setNewPassword('');
  };

  const getLinkedName = (u: AppUser) => {
    if (u.role === 'docente') {
      const d = docentes.find(d => d.id === u.linkedProfileId);
      return d ? `${d.nombre} ${d.apellido}` : u.linkedProfileId || '-';
    }
    if (u.role === 'estudiante') {
      const e = estudiantes.find(e => e.id === u.linkedProfileId);
      return e ? `${e.nombre} ${e.apellido}` : u.linkedProfileId || '-';
    }
    return u.linkedProfileId || '-';
  };

  const profileOptions = () => {
    if (form.role === 'docente') return docentes.map(d => ({ id: d.id, label: `${d.nombre} ${d.apellido}` }));
    if (form.role === 'estudiante') return estudiantes.map(e => ({ id: e.id, label: `${e.nombre} ${e.apellido}` }));
    return [];
  };

  return (
    <div>
      <PageHeader
        title="Gestión de Usuarios"
        description={`${appUsers.filter(u => u.isActive).length} activos de ${appUsers.length} total`}
        action={
          <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#1a5276' }}>
            + Nuevo Usuario
          </button>
        }
      />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por usuario o rol..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
        />
      </div>

      <div className="bg-white rounded-xl border border-[#e8e8ec] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f4f6] border-b border-[#e8e8ec]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Usuario</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Rol</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Perfil Vinculado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ec]">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-[#f4f4f6]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: roleColors[u.role] || '#888888' }}>
                        {u.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111111]">{u.username}</p>
                        <p className="text-xs text-[#888888]">Creado: {new Date(u.createdAt).toLocaleDateString('es-AR')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full font-medium text-white" style={{ backgroundColor: roleColors[u.role] || '#888888' }}>
                      {roleLabels[u.role] || u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#888888]">{getLinkedName(u)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateAppUser(u.id, { isActive: !u.isActive })}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${u.isActive ? 'bg-[#d4edda] text-[#155724] hover:bg-green-200' : 'bg-red-100 text-[#c62828] hover:bg-red-200'}`}
                    >
                      {u.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(u)} className="text-xs text-[#1a5276] hover:underline mr-2">Editar</button>
                    <button onClick={() => { setChangePwdId(u.id); setNewPassword(''); }} className="text-xs text-[#c9a227] hover:underline mr-2">Contraseña</button>
                    <button onClick={() => setConfirmDelete(u.id)} className="text-xs text-[#c62828] hover:underline">Eliminar</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#888888]">No se encontraron usuarios</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editId ? 'Editar Usuario' : 'Nuevo Usuario'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Nombre de usuario *</label>
            <input className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
          </div>
          {!editId && (
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Contraseña *</label>
              <input type="password" className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Rol</label>
            <select className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role, linkedProfileId: '' }))}>
              {Object.entries(roleLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          {profileOptions().length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1">Vincular perfil</label>
              <select className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={form.linkedProfileId} onChange={e => setForm(f => ({ ...f, linkedProfileId: e.target.value }))}>
                <option value="">Sin vincular</option>
                {profileOptions().map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
          )}
          <label className="flex items-center gap-2 text-sm font-medium text-[#111111]">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
            Usuario activo
          </label>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm text-[#111111] hover:bg-[#f4f4f6]">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: '#1a5276' }}>Guardar</button>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={!!changePwdId} onClose={() => setChangePwdId(null)} title="Cambiar Contraseña" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Nueva contraseña</label>
            <input type="password" className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setChangePwdId(null)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm">Cancelar</button>
            <button onClick={handleChangePwd} className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: '#c9a227' }}>Cambiar</button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirmar eliminación" size="sm">
        <p className="text-sm text-[#888888] mb-4">¿Estás seguro de que querés eliminar este usuario?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm">Cancelar</button>
          <button onClick={() => { confirmDelete && deleteAppUser(confirmDelete); setConfirmDelete(null); }} className="px-4 py-2 rounded-lg bg-[#c62828] text-white text-sm">Eliminar</button>
        </div>
      </Modal>
    </div>
  );
}
