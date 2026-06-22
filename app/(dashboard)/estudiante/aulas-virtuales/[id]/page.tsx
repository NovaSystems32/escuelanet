'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';

export default function EstudianteAulaVirtualPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { materias, cursos, docentes, posts, calificaciones, eventos } = useAppStore();
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const materia = materias.find(m => m.id === id);
  const curso = cursos.find(c => c.id === materia?.cursoId);
  const docente = docentes.find(d => d.id === materia?.docenteId);

  const publishedPosts = posts.filter(p => p.subjectId === id && p.status === 'published')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const nextEval = eventos
    .filter(e => e.cursoId === materia?.cursoId && e.tipo === 'examen' && new Date(e.fecha) >= new Date())
    .sort((a, b) => a.fecha.localeCompare(b.fecha))[0];

  if (!materia) {
    return (
      <div className="text-center py-12">
        <p className="text-[#888888]">Materia no encontrada.</p>
        <button onClick={() => router.back()} className="mt-3 text-sm text-[#1a5276] hover:underline">Volver</button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={materia.nombre}
        description={`${curso ? `${curso.nombre} ${curso.division}` : ''}`}
        action={
          <button onClick={() => router.back()} className="text-sm text-[#1a5276] hover:underline">← Volver</button>
        }
      />

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#e8e8ec] p-4">
          <p className="text-xs text-[#888888] uppercase font-semibold mb-1">Docente</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#1a5276' }}>
              {docente ? docente.nombre.charAt(0) : '?'}
            </div>
            <p className="text-sm font-medium text-[#111111]">
              {docente ? `${docente.nombre} ${docente.apellido}` : 'Sin docente'}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#e8e8ec] p-4">
          <p className="text-xs text-[#888888] uppercase font-semibold mb-1">Horas semanales</p>
          <p className="text-2xl font-bold text-[#1a5276]">{materia.horasSemanal}h</p>
        </div>
        <div className="bg-white rounded-xl border border-[#e8e8ec] p-4">
          <p className="text-xs text-[#888888] uppercase font-semibold mb-1">Próxima evaluación</p>
          {nextEval ? (
            <>
              <p className="text-sm font-medium text-[#111111]">{nextEval.titulo}</p>
              <p className="text-xs text-[#c62828] mt-0.5">{new Date(nextEval.fecha).toLocaleDateString('es-AR')}</p>
            </>
          ) : (
            <p className="text-sm text-[#888888]">Sin evaluaciones próximas</p>
          )}
        </div>
      </div>

      {/* Posts */}
      <h2 className="text-lg font-semibold text-[#111111] mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        Publicaciones ({publishedPosts.length})
      </h2>

      {publishedPosts.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e8e8ec] p-10 text-center">
          <p className="text-[#888888]">El docente aún no ha publicado contenido para esta materia.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {publishedPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl border border-[#e8e8ec] p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#111111] text-base mb-1">{post.title}</h3>
                  <p className="text-xs text-[#888888] mb-3">{new Date(post.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-sm text-[#444444] leading-relaxed">{post.content}</p>
                  {post.images.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {post.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className="w-24 h-24 object-cover rounded-lg border border-[#e8e8ec] cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setLightboxImg(img)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
