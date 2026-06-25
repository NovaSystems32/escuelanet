'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Role } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

interface SystemUser {
  id: string;
  nombre: string;
  email: string;
  rol: Role;
  linked_profile_id: string | null;
  is_active: boolean;
  created_at: string;
}

const roleColors: Record<string, string> = {
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
  tutor: 'Tutor / Responsable',
};

const emptyForm = {
  email: '',
  password: '',
  nombre: '',
  rol: 'estudiante' as Role,
  linkedProfileId: '',
};

export default function UsuariosPage() {
  const { estudiantes, docentes } = useAppStore();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [editUser, setEditUser] = useState<SystemUser | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<SystemUser | null>(null);
  const [changePwdUser, setChangePwdUser] = useState<SystemUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(u => {
    const matchSearch = u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || u.rol === filterRole;
    return matchSearch && matchRole;
  });

  const profileOptions = (rol: string) => {
    if (rol === 'docente') return docentes.map(d => ({ id: d.id, label: `${d.nombre} ${d.apellido}` }));
    if (rol === 'estudiante') return estudiantes.map(e => ({ id: e.id, label: `${e.nombre} ${e.apellido}` }));
    return [];
  };

  const getLinkedName = (u: SystemUser) => {
    if (!u.linked_profile_id) return '—';
    if (u.rol === 'docente') {
      const d = docentes.find(d => d.id === u.linked_profile_id);
      return d ? `${d.nombre} ${d.apellido}` : u.linked_profile_id;
    }
    if (u.rol === 'estudiante') {
      const e = estudiantes.find(e => e.id === u.linked_profile_id);
      return e ? `${e.nombre} ${e.apellido}` : u.linked_profile_id;
    }
    return u.linked_profile_id;
  };

  const openNew = () => { setForm(emptyForm); setEditUser(null); setError(''); setIsOpen(true); };
  const openEdit = (u: SystemUser) => {
    setForm({ email: u.email, password: '', nombre: u.nombre, rol: u.rol, linkedProfileId: u.linked_profile_id ?? '' });
    setEditUser(u);
    setError('');
    setIsOpen(true);
  };

  const handleSave = async () => {
    setError('');
    if (!editUser) {
      if (!form.email.trim() || !form.password.trim() || !form.nombre.trim()) {
        setError('Completá todos los campos obligatorios');
        return;
      }
    }
    setSaving(true);
    if (editUser) {
      const body: any = { nombre: form.nombre, linkedProfileId: form.linkedProfileId };
      const res = await fetch(`/api/admin/users/${editUser.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error al actualizar'); setSaving(false); return; }
    } else {
      const res = await fetch('/api/admin/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, nombre: form.nombre, rol: form.rol, linkedProfileId: form.linkedProfileId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Error al crear usuario'); setSaving(false); return; }
    }
    setSaving(false);
    setIsOpen(false);
    fetchUsers();
  };

  const handleToggleActive = async (u: SystemUser) => {
    await fetch(`/api/admin/users/${u.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !u.is_active }),
    });
    fetchUsers();
  };

  const handleChangePwd = async () => {
    if (!changePwdUser || !newPassword.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/admin/users/${changePwdUser.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword }),
    });
    setSaving(false);
    if (res.ok) { setChangePwdUser(null); setNewPassword(''); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await fetch(`/api/admin/users/${confirmDelete.id}`, { method: 'DELETE' });
    setConfirmDelete(null);
    fetchUsers();
  };

  const activeCount = users.filter(u => u.is_active).length;

  return (
    <div>
      <PageHeader
        title="Accesos al sistema"
        description={`${activeCount} habilitados · ${users.length} total`}
        action={
          <button onClick={openNew} className="px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: '#1a5276' }}>
            + Crear acceso
          </button>
        }
      />

      {/* Info box */}
      <div className="mb-5 rounded-xl px-4 py-3 text-sm flex items-start gap-3" style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af' }}>
        <span className="text-lg leading-none mt-0.5">ℹ️</span>
        <div>
          <strong>Sistema de usuarios reales.</strong> Cada persona debe tener su propio acceso individual. El login se realiza con email y contraseña. Los usuarios se crean y autentican a través de Supabase Auth.
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] max-w-sm px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
        />
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
        >
          <option value="">Todos los roles</option>
          {Object.entries(roleLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#1a5276] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e8e8ec] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f4f4f6] border-b border-[#e8e8ec]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Persona</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Rol</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Perfil vinculado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Estado</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e8ec]">
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-[#f4f4f6]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: roleColors[u.rol] || '#888888' }}>
                          {u.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111111]">{u.nombre}</p>
                          <p className="text-xs text-[#888888]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full font-medium text-white" style={{ backgroundColor: roleColors[u.rol] || '#888888' }}>
                        {roleLabels[u.rol] || u.rol}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u.linked_profile_id ? (
                        <span className="text-sm text-[#111111]">{getLinkedName(u)}</span>
                      ) : (
                        <span className="text-xs text-[#c9a227] font-medium bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">Sin vincular</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${u.is_active ? 'bg-[#d4edda] text-[#155724] hover:bg-green-200' : 'bg-red-100 text-[#c62828] hover:bg-red-200'}`}
                      >
                        {u.is_active ? '✓ Habilitado' : '✗ Deshabilitado'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEdit(u)} className="text-xs text-[#1a5276] hover:underline mr-3">Editar</button>
                      <button onClick={() => { setChangePwdUser(u); setNewPassword(''); }} className="text-xs text-[#c9a227] hover:underline mr-3">Contraseña</button>
                      <button onClick={() => setConfirmDelete(u)} className="text-xs text-[#c62828] hover:underline">Eliminar</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-sm text-[#888888]">
                    {users.length === 0 ? 'No hay accesos creados aún. Creá el primer usuario.' : 'No se encontraron usuarios con ese criterio.'}
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Crear / Editar modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editUser ? 'Editar acceso' : 'Crear acceso al sistema'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-1">Nombre completo *</label>
            <input
              className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
              placeholder="Ej: Juan Pérez"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
            />
          </div>
          {!editUser && (
            <>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1">Email institucional *</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                  placeholder="juan.perez@escuelanet.edu"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1">Contraseña provisoria *</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <p className="text-xs text-[#888888] mt-1">El usuario deberá cambiarla en su primer ingreso.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1">Rol</label>
                <select
                  className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                  value={form.rol}
                  onChange={e => setForm(f => ({ ...f, rol: e.target.value as Role, linkedProfileId: '' }))}
                >
                  {Object.entries(roleLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </>
          )}
          {profileOptions(editUser ? editUser.rol : form.rol).length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-1">Vincular con perfil institucional</label>
              <select
                className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                value={form.linkedProfileId}
                onChange={e => setForm(f => ({ ...f, linkedProfileId: e.target.value }))}
              >
                <option value="">— Sin vincular —</option>
                {profileOptions(editUser ? editUser.rol : form.rol).map(o => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
              <p className="text-xs text-[#888888] mt-1">Vinculá este acceso con el perfil real en el sistema.</p>
            </div>
          )}
          {error && (
            <div className="rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: '#fde8e8', color: '#c62828', border: '1px solid #f5c6cb' }}>
              {error}
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm text-[#111111] hover:bg-[#f4f4f6]">Cancelar</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-white text-sm disabled:opacity-50"
            style={{ backgroundColor: '#1a5276' }}
          >
            {saving ? 'Guardando...' : (editUser ? 'Guardar cambios' : 'Crear acceso')}
          </button>
        </div>
      </Modal>

      {/* Cambiar contraseña */}
      <Modal isOpen={!!changePwdUser} onClose={() => setChangePwdUser(null)} title="Cambiar contraseña" size="sm">
        {changePwdUser && (
          <div className="space-y-4">
            <p className="text-sm text-[#888888]">
              Cambiando contraseña de <strong className="text-[#111111]">{changePwdUser.nombre}</strong> ({changePwdUser.email})
            </p>
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-1">Nueva contraseña</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setChangePwdUser(null)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm">Cancelar</button>
              <button
                onClick={handleChangePwd}
                disabled={saving || !newPassword.trim()}
                className="px-4 py-2 rounded-lg text-white text-sm disabled:opacity-50"
                style={{ backgroundColor: '#c9a227' }}
              >
                {saving ? 'Cambiando...' : 'Cambiar contraseña'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmar eliminación */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Eliminar acceso" size="sm">
        {confirmDelete && (
          <>
            <p className="text-sm text-[#888888] mb-1">¿Seguro que querés eliminar el acceso de:</p>
            <p className="text-sm font-semibold text-[#111111] mb-1">{confirmDelete.nombre}</p>
            <p className="text-xs text-[#888888] mb-4">{confirmDelete.email}</p>
            <p className="text-xs text-[#c62828] mb-5">Esta acción no se puede deshacer. El usuario no podrá volver a ingresar al sistema.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm">Cancelar</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-[#c62828] text-white text-sm">Sí, eliminar</button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
