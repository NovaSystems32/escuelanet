'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import StatCard from '@/components/StatCard';
import Link from 'next/link';

export default function DocenteDashboard() {
  const { user } = useAuthStore();
  const { materias, calificaciones, actividades, estudiantes, cursos } = useAppStore();

  // Docente user is d1
  const docenteId = 'd1';
  const misMaterias = materias.filter(m => m.docenteId === docenteId);
  const misCalificaciones = calificaciones.filter(c => c.docenteId === docenteId);
  const misActividades = actividades.filter(a => a.docenteId === docenteId);

  const estudiantesSet = new Set<string>();
  misMaterias.forEach(m => {
    const curso = cursos.find(c => c.id === m.cursoId);
    curso?.estudiantesIds.forEach(id => estudiantesSet.add(id));
  });

  return (
    <div>
      <div className="mb-6 bg-gradient-to-r from-[#1a2f5e] to-[#2d4a8a] rounded-2xl p-6 text-white shadow-md">
        <h1 className="text-2xl font-bold">Buenos días, {user?.nombre} 👋</h1>
        <p className="text-white/70 text-sm mt-1">Panel docente — Gestión de materias y alumnos</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Mis Materias" value={misMaterias.length} icon="📖" color="bg-[#e8f0fb] text-[#2d4a8a]" />
        <StatCard title="Estudiantes" value={estudiantesSet.size} icon="👥" color="bg-[#dcfce7] text-[#15803d]" />
        <StatCard title="Calificaciones" value={misCalificaciones.length} icon="📊" color="bg-[#f3e8ff] text-[#7e22ce]" subtitle="Cargadas" />
        <StatCard title="Actividades" value={misActividades.length} icon="📝" color="bg-[#fef3c7] text-[#d97706]" subtitle="Publicadas" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis materias */}
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm">
          <h2 className="font-semibold text-[#1a2444] mb-4">Mis Materias</h2>
          <div className="space-y-2">
            {misMaterias.map(materia => {
              const curso = cursos.find(c => c.id === materia.cursoId);
              const cals = misCalificaciones.filter(c => c.materiaId === materia.id);
              const acts = misActividades.filter(a => a.materiaId === materia.id);
              return (
                <div key={materia.id} className="p-3 rounded-lg bg-[#f8f9fc] hover:bg-[#e8f0fb] transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#1a2444]">{materia.nombre}</p>
                      <p className="text-xs text-[#5a6a8a] mt-0.5">{curso ? `${curso.nombre} ${curso.division}` : ''} • {materia.horasSemanal}h/sem</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#5a6a8a]">{cals.length} notas</p>
                      <p className="text-xs text-[#5a6a8a]">{acts.length} actividades</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/docente/materias" className="mt-4 text-sm text-[#2d4a8a] hover:text-[#1a2f5e] font-medium hover:underline block">Ver detalle →</Link>
        </div>

        {/* Últimas actividades */}
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm">
          <h2 className="font-semibold text-[#1a2444] mb-4">Últimas Actividades Publicadas</h2>
          <div className="space-y-2">
            {misActividades.slice(0, 4).map(act => {
              const materia = misMaterias.find(m => m.id === act.materiaId);
              return (
                <div key={act.id} className="flex items-start gap-3 py-2.5 border-b border-[#eef1f8] last:border-0">
                  <span className="text-lg flex-shrink-0">{act.tipo === 'tarea' ? '📋' : act.tipo === 'material' ? '📄' : '✏️'}</span>
                  <div>
                    <p className="text-sm font-medium text-[#1a2444]">{act.titulo}</p>
                    <p className="text-xs text-[#5a6a8a]">{materia?.nombre}</p>
                    {act.fechaEntrega && <p className="text-xs text-[#f59e0b] font-medium">Entrega: {new Date(act.fechaEntrega).toLocaleDateString('es-AR')}</p>}
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/docente/actividades" className="mt-4 text-sm text-[#2d4a8a] hover:text-[#1a2f5e] font-medium hover:underline block">Gestionar actividades →</Link>
        </div>

        {/* Calificaciones recientes */}
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm lg:col-span-2">
          <h2 className="font-semibold text-[#1a2444] mb-4">Últimas Calificaciones Cargadas</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8f9fc]">
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-[#5a6a8a] uppercase tracking-wide">Estudiante</th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-[#5a6a8a] uppercase tracking-wide">Materia</th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-[#5a6a8a] uppercase tracking-wide">Descripción</th>
                  <th className="text-left px-3 py-2.5 text-xs font-semibold text-[#5a6a8a] uppercase tracking-wide">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef1f8]">
                {misCalificaciones.slice(-5).reverse().map((c, idx) => {
                  const est = estudiantes.find(e => e.id === c.estudianteId);
                  const mat = misMaterias.find(m => m.id === c.materiaId);
                  const notaBg = c.nota >= 7 ? 'bg-[#dcfce7] text-[#15803d]' : c.nota >= 4 ? 'bg-[#fef3c7] text-[#d97706]' : 'bg-red-100 text-[#e53935]';
                  return (
                    <tr key={c.id} className={`hover:bg-[#e8f0fb] transition-colors ${idx % 2 === 0 ? '' : 'bg-[#f8f9fc]'}`}>
                      <td className="px-3 py-2.5 text-sm text-[#1a2444] font-medium">{est ? `${est.apellido}, ${est.nombre}` : '-'}</td>
                      <td className="px-3 py-2.5 text-sm text-[#5a6a8a]">{mat?.nombre || '-'}</td>
                      <td className="px-3 py-2.5 text-sm text-[#5a6a8a]">{c.descripcion}</td>
                      <td className="px-3 py-2.5"><span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${notaBg}`}>{c.nota}</span></td>
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
