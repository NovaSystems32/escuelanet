'use client';
import { useAppStore } from '@/store/useAppStore';
import StatCard from '@/components/StatCard';
import Link from 'next/link';

export default function AdminDashboard() {
  const { estudiantes, docentes, cursos, materias, calificaciones, asistencias, disciplina, eventos } = useAppStore();

  const estudiantesActivos = estudiantes.filter(e => e.activo).length;
  const docentesActivos = docentes.filter(d => d.activo).length;
  const inasistencias = asistencias.filter(a => !a.presente).length;
  const sanciones = disciplina.filter(d => d.tipo !== 'felicitacion' && !d.resuelto).length;

  const quickLinks = [
    { href: '/admin/estudiantes', label: 'Gestionar Estudiantes', icon: '👥', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
    { href: '/admin/docentes', label: 'Gestionar Docentes', icon: '👨‍🏫', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
    { href: '/admin/cursos', label: 'Gestionar Cursos', icon: '🏫', color: 'bg-green-50 hover:bg-green-100 border-green-200' },
    { href: '/admin/calificaciones', label: 'Ver Calificaciones', icon: '📊', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
    { href: '/admin/asistencias', label: 'Control Asistencias', icon: '📅', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
    { href: '/admin/eventos', label: 'Gestionar Eventos', icon: '🗓️', color: 'bg-pink-50 hover:bg-pink-100 border-pink-200' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Panel Administrativo</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen general del sistema escolar</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Estudiantes activos" value={estudiantesActivos} icon="👥" color="bg-blue-50 text-blue-600" subtitle={`${estudiantes.length} total`} />
        <StatCard title="Docentes" value={docentesActivos} icon="👨‍🏫" color="bg-purple-50 text-purple-600" subtitle={`${cursos.length} cursos`} />
        <StatCard title="Inasistencias" value={inasistencias} icon="📅" color="bg-orange-50 text-orange-600" subtitle="Registradas" />
        <StatCard title="Sanciones pendientes" value={sanciones} icon="⚠️" color="bg-red-50 text-red-600" subtitle="Sin resolver" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {quickLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${link.color}`}
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="font-medium text-slate-800 text-sm">{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cursos overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Cursos</h2>
          <div className="space-y-3">
            {cursos.map(curso => {
              const docenteCurso = docentes.find(d => d.id === curso.docenteId);
              return (
                <div key={curso.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{curso.nombre} - División {curso.division}</p>
                    <p className="text-xs text-slate-500">{curso.turno} • {curso.estudiantesIds.length} estudiantes</p>
                    {docenteCurso && <p className="text-xs text-slate-400">Prof. {docenteCurso.apellido}</p>}
                  </div>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">{curso.nivel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Materias overview */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Materias ({materias.length})</h2>
          <div className="space-y-2">
            {materias.map(materia => {
              const docenteM = docentes.find(d => d.id === materia.docenteId);
              const curso = cursos.find(c => c.id === materia.cursoId);
              return (
                <div key={materia.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm text-slate-900">{materia.nombre}</p>
                    <p className="text-xs text-slate-500">{curso?.nombre} {curso?.division} • Prof. {docenteM?.apellido}</p>
                  </div>
                  <span className="text-xs text-slate-500">{materia.horasSemanal}h/sem</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
