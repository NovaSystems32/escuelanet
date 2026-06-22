'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import StatCard from '@/components/StatCard';
import Link from 'next/link';

export default function DocenteDashboard() {
  const { user } = useAuthStore();
  const { materias, calificaciones, actividades, estudiantes, cursos } = useAppStore();

  const docenteId = 'd1';
  const misMaterias = materias.filter(m => m.docenteId === docenteId);
  const misCalificaciones = calificaciones.filter(c => c.docenteId === docenteId);
  const misActividades = actividades.filter(a => a.docenteId === docenteId);

  const estudiantesSet = new Set<string>();
  misMaterias.forEach(m => {
    const curso = cursos.find(c => c.id === m.cursoId);
    curso?.estudiantesIds.forEach(id => estudiantesSet.add(id));
  });

  const getNotaBg = (nota: number) => nota >= 7 ? '#d4edda' : nota >= 4 ? '#fef3c7' : '#fde8e8';
  const getNotaColor = (nota: number) => nota >= 7 ? '#155724' : nota >= 4 ? '#856404' : '#c62828';

  return (
    <div>
      <div className="mb-6 rounded-2xl p-6 text-white shadow-md" style={{ background: 'linear-gradient(135deg, #1a5276 0%, #154360 100%)' }}>
        <div className="flex items-center gap-3 mb-3">
          <img
            src="https://novasystems32.github.io/Cajal-Web/logo.jpeg"
            alt="Instituto Cajal"
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: '2px solid #c9a227' }}
          />
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c9a227', fontFamily: "'Barlow Condensed', sans-serif" }}>
            Instituto Santiago Ramón y Cajal
          </p>
        </div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Inicio del docente — {user?.nombre}</h1>
        <p className="text-white/70 text-sm mt-1">Panel del docente — Gestión de espacios curriculares</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Mis espacios curriculares" value={misMaterias.length} icon="📖" color="bg-[#d6eaf8] text-[#1a5276]" />
        <StatCard title="Estudiantes" value={estudiantesSet.size} icon="👥" color="bg-[#d4edda] text-[#155724]" />
        <StatCard title="Calificaciones" value={misCalificaciones.length} icon="📊" color="bg-[#fde8e8] text-[#c62828]" subtitle="Registradas" />
        <StatCard title="Actividades y entregas" value={misActividades.length} icon="📝" color="bg-[#fef3c7] text-[#856404]" subtitle="Publicadas" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis materias */}
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', color: '#111111' }}>Mis espacios curriculares</h2>
          <div className="space-y-2">
            {misMaterias.map(materia => {
              const curso = cursos.find(c => c.id === materia.cursoId);
              const cals = misCalificaciones.filter(c => c.materiaId === materia.id);
              const acts = misActividades.filter(a => a.materiaId === materia.id);
              return (
                <div key={materia.id} className="p-3 rounded-lg transition-colors" style={{ backgroundColor: '#f4f4f6' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#d6eaf8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f4f4f6'; }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#3a3a3a' }}>{materia.nombre}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#888888' }}>{curso ? `${curso.nombre} ${curso.division}` : ''} · {materia.horasSemanal}h/sem</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs" style={{ color: '#888888' }}>{cals.length} calificaciones</p>
                      <p className="text-xs" style={{ color: '#888888' }}>{acts.length} actividades</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/docente/materias" className="mt-4 text-sm font-medium hover:underline block" style={{ color: '#c62828' }}>Ver detalle de espacios curriculares →</Link>
        </div>

        {/* Últimas actividades */}
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', color: '#111111' }}>Últimas actividades y entregas publicadas</h2>
          <div className="space-y-2">
            {misActividades.slice(0, 4).map(act => {
              const materia = misMaterias.find(m => m.id === act.materiaId);
              return (
                <div key={act.id} className="flex items-start gap-3 py-2.5 border-b last:border-0" style={{ borderColor: '#e8e8ec' }}>
                  <span className="text-lg flex-shrink-0">{act.tipo === 'tarea' ? '📋' : act.tipo === 'material' ? '📄' : '✏️'}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{act.titulo}</p>
                    <p className="text-xs" style={{ color: '#888888' }}>{materia?.nombre}</p>
                    {act.fechaEntrega && <p className="text-xs font-medium" style={{ color: '#c9a227' }}>Entrega: {new Date(act.fechaEntrega).toLocaleDateString('es-AR')}</p>}
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/docente/actividades" className="mt-4 text-sm font-medium hover:underline block" style={{ color: '#c62828' }}>Gestionar actividades y entregas →</Link>
        </div>

        {/* Calificaciones recientes */}
        <div className="bg-white rounded-xl p-5 shadow-sm lg:col-span-2" style={{ border: '1px solid #e8e8ec' }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', color: '#111111' }}>Últimas calificaciones registradas</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#f4f4f6' }}>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: '#888888' }}>Estudiante</th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: '#888888' }}>Espacio curricular</th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: '#888888' }}>Descripción</th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: '#888888' }}>Nota</th>
                </tr>
              </thead>
              <tbody>
                {misCalificaciones.slice(-5).reverse().map((c, idx) => {
                  const est = estudiantes.find(e => e.id === c.estudianteId);
                  const mat = misMaterias.find(m => m.id === c.materiaId);
                  return (
                    <tr key={c.id} className="transition-colors" style={{ backgroundColor: idx % 2 !== 0 ? '#f4f4f6' : '#ffffff', borderBottom: '1px solid #e8e8ec' }}>
                      <td className="px-3 py-2.5 text-sm font-medium" style={{ color: '#3a3a3a' }}>{est ? `${est.apellido}, ${est.nombre}` : '-'}</td>
                      <td className="px-3 py-2.5 text-sm" style={{ color: '#888888' }}>{mat?.nombre || '-'}</td>
                      <td className="px-3 py-2.5 text-sm" style={{ color: '#888888' }}>{c.descripcion}</td>
                      <td className="px-3 py-2.5"><span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: getNotaBg(c.nota), color: getNotaColor(c.nota) }}>{c.nota}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
