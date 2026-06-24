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
    { href: '/admin/estudiantes', label: 'Gestión de estudiantes', icon: '👥', bg: '#d6eaf8', hoverBg: '#a9cce3' },
    { href: '/admin/docentes', label: 'Gestión de docentes', icon: '👨‍🏫', bg: '#fde8e8', hoverBg: '#f5c6cb' },
    { href: '/admin/cursos', label: 'Cursos y divisiones', icon: '🏫', bg: '#d4edda', hoverBg: '#b8ddc0' },
    { href: '/admin/calificaciones', label: 'Ver calificaciones', icon: '📊', bg: '#fef9c3', hoverBg: '#fde68a' },
    { href: '/admin/asistencias', label: 'Registro de inasistencias', icon: '📅', bg: '#d6eaf8', hoverBg: '#a9cce3' },
    { href: '/admin/eventos', label: 'Calendario institucional', icon: '🗓️', bg: '#f4f4f6', hoverBg: '#e8e8ec' },
  ];

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
        <h1 className="font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(20px, 4vw, 32px)' }}>Inicio institucional — Instituto Santiago Ramón y Cajal</h1>
        <p className="text-white/70 text-sm mt-1">Resumen general del sistema escolar</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Estudiantes activos" value={estudiantesActivos} icon="👥" color="bg-[#d6eaf8] text-[#1a5276]" subtitle={`${estudiantes.length} total`} />
        <StatCard title="Docentes" value={docentesActivos} icon="👨‍🏫" color="bg-[#d4edda] text-[#155724]" subtitle={`${cursos.length} cursos`} />
        <StatCard title="Inasistencias" value={inasistencias} icon="📅" color="bg-[#fef3c7] text-[#856404]" subtitle="Registradas" />
        <StatCard title="Sanciones pendientes" value={sanciones} icon="⚠️" color="bg-[#fde8e8] text-[#c62828]" subtitle="Sin resolver" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {quickLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:shadow-sm"
            style={{ backgroundColor: link.bg, border: '1px solid #e8e8ec', color: '#111111' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = link.hoverBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = link.bg; }}
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="font-semibold text-sm" style={{ color: '#3a3a3a' }}>{link.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cursos overview */}
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#111111', fontSize: '1.2rem' }}>Cursos y divisiones</h2>
          <div className="space-y-2">
            {cursos.map(curso => {
              const docenteCurso = docentes.find(d => d.id === curso.docenteId);
              return (
                <div key={curso.id} className="flex items-center justify-between p-3 rounded-lg transition-colors" style={{ backgroundColor: '#f4f4f6' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#d6eaf8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f4f4f6'; }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{curso.nombre} - División {curso.division}</p>
                    <p className="text-xs" style={{ color: '#888888' }}>{curso.turno} · {curso.estudiantesIds.length} estudiantes</p>
                    {docenteCurso && <p className="text-xs" style={{ color: '#aaaaaa' }}>Prof. {docenteCurso.apellido}</p>}
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#d6eaf8', color: '#1a5276' }}>{curso.nivel}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Materias overview */}
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#111111', fontSize: '1.2rem' }}>Espacios curriculares ({materias.length})</h2>
          <div className="space-y-1">
            {materias.map((materia, idx) => {
              const docenteM = docentes.find(d => d.id === materia.docenteId);
              const curso = cursos.find(c => c.id === materia.cursoId);
              return (
                <div key={materia.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg" style={{ backgroundColor: idx % 2 !== 0 ? '#f4f4f6' : '#ffffff' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{materia.nombre}</p>
                    <p className="text-xs" style={{ color: '#888888' }}>{curso?.nombre} {curso?.division} · Prof. {docenteM?.apellido}</p>
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#888888' }}>{materia.horasSemanal}h/sem</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
