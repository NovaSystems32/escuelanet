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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido, {user?.nombre} 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Panel docente - Gestión de materias y alumnos</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Mis Materias" value={misMaterias.length} icon="📖" color="bg-blue-50 text-blue-600" />
        <StatCard title="Estudiantes" value={estudiantesSet.size} icon="👥" color="bg-green-50 text-green-600" />
        <StatCard title="Calificaciones" value={misCalificaciones.length} icon="📊" color="bg-purple-50 text-purple-600" subtitle="Cargadas" />
        <StatCard title="Actividades" value={misActividades.length} icon="📝" color="bg-orange-50 text-orange-600" subtitle="Publicadas" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis materias */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Mis Materias</h2>
          <div className="space-y-3">
            {misMaterias.map(materia => {
              const curso = cursos.find(c => c.id === materia.cursoId);
              const cals = misCalificaciones.filter(c => c.materiaId === materia.id);
              const acts = misActividades.filter(a => a.materiaId === materia.id);
              return (
                <div key={materia.id} className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{materia.nombre}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{curso ? `${curso.nombre} ${curso.division}` : ''} • {materia.horasSemanal}h/sem</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{cals.length} notas</p>
                      <p className="text-xs text-slate-500">{acts.length} actividades</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/docente/materias" className="mt-4 text-sm text-blue-600 hover:underline block">Ver detalle →</Link>
        </div>

        {/* Últimas actividades */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Últimas Actividades Publicadas</h2>
          <div className="space-y-3">
            {misActividades.slice(0, 4).map(act => {
              const materia = misMaterias.find(m => m.id === act.materiaId);
              return (
                <div key={act.id} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                  <span className="text-lg">{act.tipo === 'tarea' ? '📋' : act.tipo === 'material' ? '📄' : '✏️'}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{act.titulo}</p>
                    <p className="text-xs text-slate-500">{materia?.nombre}</p>
                    {act.fechaEntrega && <p className="text-xs text-orange-500">Entrega: {new Date(act.fechaEntrega).toLocaleDateString('es-AR')}</p>}
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/docente/actividades" className="mt-4 text-sm text-blue-600 hover:underline block">Gestionar actividades →</Link>
        </div>

        {/* Calificaciones recientes */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 lg:col-span-2">
          <h2 className="font-semibold text-slate-900 mb-4">Últimas Calificaciones Cargadas</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left pb-2 text-xs font-semibold text-slate-500 uppercase">Estudiante</th>
                  <th className="text-left pb-2 text-xs font-semibold text-slate-500 uppercase">Materia</th>
                  <th className="text-left pb-2 text-xs font-semibold text-slate-500 uppercase">Descripción</th>
                  <th className="text-left pb-2 text-xs font-semibold text-slate-500 uppercase">Nota</th>
                </tr>
              </thead>
              <tbody>
                {misCalificaciones.slice(-5).reverse().map(c => {
                  const est = estudiantes.find(e => e.id === c.estudianteId);
                  const mat = misMaterias.find(m => m.id === c.materiaId);
                  const color = c.nota >= 7 ? 'bg-green-100 text-green-700' : c.nota >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
                  return (
                    <tr key={c.id} className="border-b border-slate-50 last:border-0">
                      <td className="py-2 text-sm text-slate-900">{est ? `${est.apellido}, ${est.nombre}` : '-'}</td>
                      <td className="py-2 text-sm text-slate-600">{mat?.nombre || '-'}</td>
                      <td className="py-2 text-sm text-slate-500">{c.descripcion}</td>
                      <td className="py-2"><span className={`text-xs font-bold px-2 py-1 rounded-lg ${color}`}>{c.nota}</span></td>
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
