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
    { href: '/admin/estudiantes', label: 'Gestionar Estudiantes', icon: '👥', color: 'bg-[#e8f0fb] hover:bg-[#d0e4f7] border-[#d8e0ee] text-[#1a2444]' },
    { href: '/admin/docentes', label: 'Gestionar Docentes', icon: '👨‍🏫', color: 'bg-[#f3e8ff] hover:bg-[#ede0fc] border-[#d8e0ee] text-[#1a2444]' },
    { href: '/admin/cursos', label: 'Gestionar Cursos', icon: '🏫', color: 'bg-[#dcfce7] hover:bg-[#c6f7d7] border-[#d8e0ee] text-[#1a2444]' },
    { href: '/admin/calificaciones', label: 'Ver Calificaciones', icon: '📊', color: 'bg-[#fef9c3] hover:bg-[#fef08a] border-[#d8e0ee] text-[#1a2444]' },
    { href: '/admin/asistencias', label: 'Control Asistencias', icon: '📅', color: 'bg-[#ccfbf1] hover:bg-[#b0f4e9] border-[#d8e0ee] text-[#1a2444]' },
    { href: '/admin/eventos', label: 'Gestionar Eventos', icon: '🗓️', color: 'bg-[#fce7f3] hover:bg-[#f8d0e8] border-[#d8e0ee] text-[#1a2444]' },
  ];

  return (
    <div>
      <div className="mb-6 bg-gradient-to-r from-[#1a2f5e] to-[#2d4a8a] rounded-2xl p-6 text-white shadow-md">
        <h1 className="text-2xl font-bold">Panel Administrativo</h1>
        <p className="text-white/70 text-sm mt-1">Resumen general del sistema escolar</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Estudiantes activos" value={estudiantesActivos} icon="👥" color="bg-[#e8f0fb] text-[#2d4a8a]" subtitle={`${estudiantes.length} total`} />
        <StatCard title="Docentes" value={docentesActivos} icon="👨‍🏫" color="bg-[#f3e8ff] text-[#7e22ce]" subtitle={`${cursos.length} cursos`} />
        <StatCard title="Inasistencias" value={inasistencias} icon="📅" color="bg-[#fef3c7] text-[#d97706]" subtitle="Registradas" />
        <StatCard title="Sanciones pendientes" value={sanciones} icon="⚠️" color="bg-red-50 text-[#e53935]" subtitle="Sin resolver" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {quickLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${link.color}`}
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="font-semibold text-sm">{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cursos overview */}
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm">
          <h2 className="font-semibold text-[#1a2444] mb-4">Cursos</h2>
          <div className="space-y-2">
            {cursos.map(curso => {
              const docenteCurso = docentes.find(d => d.id === curso.docenteId);
              return (
                <div key={curso.id} className="flex items-center justify-between p-3 bg-[#f8f9fc] rounded-lg hover:bg-[#e8f0fb] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[#1a2444]">{curso.nombre} - División {curso.division}</p>
                    <p className="text-xs text-[#5a6a8a]">{curso.turno} • {curso.estudiantesIds.length} estudiantes</p>
                    {docenteCurso && <p className="text-xs text-[#5a6a8a]/70">Prof. {docenteCurso.apellido}</p>}
                  </div>
                  <span className="text-xs bg-[#e8f0fb] text-[#2d4a8a] px-2.5 py-1 rounded-full font-medium">{curso.nivel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Materias overview */}
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm">
          <h2 className="font-semibold text-[#1a2444] mb-4">Materias ({materias.length})</h2>
          <div className="space-y-1">
            {materias.map((materia, idx) => {
              const docenteM = docentes.find(d => d.id === materia.docenteId);
              const curso = cursos.find(c => c.id === materia.cursoId);
              return (
                <div key={materia.id} className={`flex items-center justify-between py-2.5 px-3 rounded-lg ${idx % 2 === 0 ? '' : 'bg-[#f8f9fc]'}`}>
                  <div>
                    <p className="text-sm text-[#1a2444] font-medium">{materia.nombre}</p>
                    <p className="text-xs text-[#5a6a8a]">{curso?.nombre} {curso?.division} • Prof. {docenteM?.apellido}</p>
                  </div>
                  <span className="text-xs text-[#5a6a8a] font-medium">{materia.horasSemanal}h/sem</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
