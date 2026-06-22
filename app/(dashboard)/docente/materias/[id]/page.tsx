'use client';
import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Post } from '@/types';
import PageHeader from '@/components/PageHeader';
import Modal from '@/components/Modal';

const TEACHER_ID = 'd1';

type Tab = 'publicaciones' | 'estudiantes' | 'actividades';

export default function DocenteMateriaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { materias, cursos, estudiantes, calificaciones, actividades, posts, addPost, updatePost, deletePost } = useAppStore();

  const materia = materias.find(m => m.id === id);
  const curso = cursos.find(c => c.id === materia?.cursoId);
  const estudiantesCurso = estudiantes.filter(e => curso?.estudiantesIds.includes(e.id) ?? false);
  const calsMateria = calificaciones.filter(c => c.materiaId === id && c.docenteId === TEACHER_ID);
  const actsMateria = actividades.filter(a => a.materiaId === id);
  const subjectPosts = posts.filter(p => p.subjectId === id);

  const [tab, setTab] = useState<Tab>('publicaciones');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    content: '',
    images: [] as string[],
    status: 'published' as Post['status'],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!materia) {
    return (
      <div className="text-center py-12">
        <p className="text-[#888888]">Materia no encontrada.</p>
        <button onClick={() => router.back()} className="mt-3 text-sm text-[#1a5276] hover:underline">Volver</button>
      </div>
    );
  }

  const filteredPosts = statusFilter === 'all' ? subjectPosts : subjectPosts.filter(p => p.status === statusFilter);

  const openNew = () => {
    setForm({ title: '', content: '', images: [], status: 'published' });
    setEditId(null);
    setIsModalOpen(true);
  };

  const openEdit = (post: Post) => {
    setForm({ title: post.title, content: post.content, images: post.images, status: post.status });
    setEditId(post.id);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    if (editId) {
      updatePost(editId, { title: form.title, content: form.content, images: form.images, status: form.status });
    } else {
      addPost({
        subjectId: id,
        courseId: materia.cursoId,
        teacherId: TEACHER_ID,
        title: form.title,
        content: form.content,
        images: form.images,
        createdAt: new Date().toISOString().split('T')[0],
        status: form.status,
      });
    }
    setIsModalOpen(false);
  };

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setForm(f => ({ ...f, images: [...f.images, reader.result as string] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const statusBadge = (status: Post['status']) => {
    const map = {
      published: { label: 'Publicado', cls: 'bg-green-100 text-green-700' },
      draft: { label: 'Borrador', cls: 'bg-yellow-100 text-yellow-700' },
      archived: { label: 'Archivado', cls: 'bg-[#f4f4f6] text-[#888888]' },
    };
    const s = map[status];
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>;
  };

  return (
    <div>
      <PageHeader
        title={materia.nombre}
        description={`${curso ? `${curso.nombre} ${curso.division}` : ''} · ${materia.horasSemanal}h/sem`}
        action={
          <button onClick={() => router.back()} className="text-sm text-[#1a5276] hover:underline">← Volver</button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#e8e8ec]">
        {(['publicaciones', 'estudiantes', 'actividades'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? 'border-[#1a5276] text-[#1a5276]' : 'border-transparent text-[#888888] hover:text-[#111111]'}`}
          >
            {t === 'publicaciones' ? 'Comunicados' : t === 'estudiantes' ? 'Estudiantes' : 'Actividades y entregas'}
          </button>
        ))}
      </div>

      {/* Publicaciones Tab */}
      {tab === 'publicaciones' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {['all', 'published', 'draft', 'archived'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${statusFilter === s ? 'bg-[#1a5276] text-white' : 'bg-[#f4f4f6] text-[#888888] hover:bg-[#e8e8ec]'}`}
                >
                  {s === 'all' ? 'Todos' : s === 'published' ? 'Publicados' : s === 'draft' ? 'Borradores' : 'Archivados'}
                </button>
              ))}
            </div>
            <button
              onClick={openNew}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: '#c62828' }}
            >
              + Nuevo comunicado
            </button>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#e8e8ec] p-10 text-center">
              <p className="text-[#888888] text-sm">No hay comunicados publicados en este espacio curricular.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-xl border border-[#e8e8ec] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {statusBadge(post.status)}
                        <span className="text-xs text-[#888888]">{new Date(post.createdAt).toLocaleDateString('es-AR')}</span>
                      </div>
                      <h3 className="font-semibold text-[#111111] mb-2">{post.title}</h3>
                      <p className="text-sm text-[#555555] leading-relaxed">{post.content}</p>
                      {post.images.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {post.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt=""
                              className="w-20 h-20 object-cover rounded-lg border border-[#e8e8ec] cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => setLightboxImg(img)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEdit(post)} className="text-xs text-[#1a5276] hover:underline">Editar</button>
                      <button onClick={() => setConfirmDelete(post.id)} className="text-xs text-[#c62828] hover:underline">Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Estudiantes Tab */}
      {tab === 'estudiantes' && (
        <div className="bg-white rounded-xl border border-[#e8e8ec] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f4f4f6]">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Estudiante</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Promedio</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#888888] uppercase">Calificaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e8ec]">
              {estudiantesCurso.map(est => {
                const cals = calsMateria.filter(c => c.estudianteId === est.id);
                const prom = cals.length > 0 ? (cals.reduce((s, c) => s + c.nota, 0) / cals.length).toFixed(1) : '-';
                return (
                  <tr key={est.id} className="hover:bg-[#f4f4f6]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#d6eaf8] text-[#1a5276] flex items-center justify-center text-sm font-semibold">
                          {est.nombre.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-[#111111]">{est.apellido}, {est.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-[#1a5276]">{prom}</td>
                    <td className="px-4 py-3 text-sm text-[#888888]">{cals.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Actividades Tab */}
      {tab === 'actividades' && (
        <div className="space-y-3">
          {actsMateria.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#e8e8ec] p-10 text-center">
              <p className="text-[#888888] text-sm">No hay actividades ni entregas para este espacio curricular.</p>
            </div>
          ) : (
            actsMateria.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-[#e8e8ec] p-4">
                <p className="font-medium text-[#111111]">{a.titulo}</p>
                <p className="text-sm text-[#888888] mt-1">{a.descripcion}</p>
                <p className="text-xs text-[#888888] mt-1">{a.tipo} {a.fechaEntrega && `· Entrega: ${new Date(a.fechaEntrega).toLocaleDateString('es-AR')}`}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Post Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? 'Editar comunicado' : 'Nuevo comunicado'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Título *</label>
            <input
              className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Título del comunicado"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Contenido *</label>
            <textarea
              className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276] resize-none"
              rows={4}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Escribí el contenido del comunicado..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Imágenes</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
              className="block w-full text-sm text-[#888888] file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#f4f4f6] file:text-[#1a5276] hover:file:bg-[#e8e8ec] cursor-pointer"
            />
            {form.images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {form.images.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-[#e8e8ec]" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#c62828] text-white rounded-full text-xs flex items-center justify-center hover:bg-[#7a1515]"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1">Estado</label>
            <select
              className="w-full px-3 py-2 border border-[#e8e8ec] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5276]"
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as Post['status'] }))}
            >
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
              <option value="archived">Archivado</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm text-[#111111] hover:bg-[#f4f4f6]">Cancelar</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: '#c62828' }}>
              {editId ? 'Guardar cambios' : 'Publicar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Confirm delete */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Eliminar comunicado" size="sm">
        <p className="text-sm text-[#888888] mb-4">¿Estás seguro de que querés eliminar este comunicado?</p>
        <div className="flex gap-3 justify-end">
          <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg border border-[#e8e8ec] text-sm">Cancelar</button>
          <button onClick={() => { confirmDelete && deletePost(confirmDelete); setConfirmDelete(null); }} className="px-4 py-2 rounded-lg bg-[#c62828] text-white text-sm">Eliminar</button>
        </div>
      </Modal>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <img src={lightboxImg} alt="" className="max-w-full max-h-full rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  );
}
