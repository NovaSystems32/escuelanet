'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import StatCard from '@/components/StatCard';
import Link from 'next/link';

export default function EstudianteDashboard() {
  const { user } = useAuthStore();
  const { calificaciones, asistencias, disciplina, eventos, materias, cursos } = useAppStore();

  const estudianteId = 'e1';
  const cursoId = 'c1';

  const misCalificaciones = calificaciones.filter(c => c.estudianteId === estudianteId);
  const misAsistencias = asistencias.filter(a => a.estudianteId === estudianteId);
  const misDisciplina = disciplina.filter(d => d.estudianteId === estudianteId);
  const misMaterias = materias.filter(m => m.cursoId === cursoId);

  const promedio = misCalificaciones.length > 0
    ? (misCalificaciones.reduce((s, c) => s + c.nota, 0) / misCalificaciones.length).toFixed(1)
    : '-';

  const inasistencias = misAsistencias.filter(a => !a.presente).length;
  const presentes = misAsistencias.filter(a => a.presente).length;
  const pctAsistencia = misAsistencias.length > 0
    ? Math.round((presentes / misAsistencias.length) * 100)
    : 100;

  const proximosEventos = eventos.slice(0, 3);

  const today = new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  const todayCapitalized = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <div>
      {/* Welcome header */}
      <div className="mb-6 rounded-2xl p-6 text-white shadow-md" style={{ background: 'linear-gradient(135deg, #1a5276 0%, #1a3f5e 100%)' }}>
        {/* Institutional strip */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://novasystems32.github.io/Cajal-Web/logo.jpeg"
            alt="Instituto Cajal"
            className="w-10 h-10 rounded-full object-cover"
            style={{ border: '2px solid #c9a227' }}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#c9a227', fontFamily: "'Barlow Condensed', sans-serif" }}>
              Instituto Santiago Ramón y Cajal
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Educamos hoy, formamos el mañana</p>
          </div>
        </div>
        <p className="text-white/60 text-sm mb-1">{todayCapitalized}</p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Buenos días, {user?.nombre}</h1>
        <p className="text-white/70 text-sm mt-1">Aquí está el resumen de tu actividad académica</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border-l-4" style={{ borderColor: '#1a5276', border: '1px solid #e8e8ec', borderLeft: '4px solid #1a5276' }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: '#888888', fontFamily: "'Inter', sans-serif" }}>Promedio General</p>
          <p className="text-3xl font-bold" style={{ color: '#1a5276', fontFamily: "'Barlow Condensed', sans-serif" }}>{promedio}</p>
          <p className="text-xs mt-1" style={{ color: '#888888' }}>Todas las materias</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec', borderLeft: '4px solid #c62828' }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: '#888888', fontFamily: "'Inter', sans-serif" }}>Inasistencias</p>
          <p className="text-3xl font-bold" style={{ color: '#c62828', fontFamily: "'Barlow Condensed', sans-serif" }}>{inasistencias}</p>
          <p className="text-xs mt-1" style={{ color: '#888888' }}>{pctAsistencia}% de asistencia</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec', borderLeft: '4px solid #c9a227' }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: '#888888', fontFamily: "'Inter', sans-serif" }}>Próx. Evaluaciones</p>
          <p className="text-3xl font-bold" style={{ color: '#c9a227', fontFamily: "'Barlow Condensed', sans-serif" }}>{proximosEventos.length}</p>
          <p className="text-xs mt-1" style={{ color: '#888888' }}>Este mes</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec', borderLeft: '4px solid #27ae60' }}>
          <p className="text-xs font-medium uppercase tracking-wide mb-2" style={{ color: '#888888', fontFamily: "'Inter', sans-serif" }}>Espacios curriculares</p>
          <p className="text-3xl font-bold" style={{ color: '#27ae60', fontFamily: "'Barlow Condensed', sans-serif" }}>{misMaterias.length}</p>
          <p className="text-xs mt-1" style={{ color: '#888888' }}>1er Año A</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis materias */}
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', color: '#111111' }}>Mis espacios curriculares</h2>
          <div className="space-y-2">
            {misMaterias.map(materia => {
              const cals = misCalificaciones.filter(c => c.materiaId === materia.id);
              const prom = cals.length > 0 ? (cals.reduce((s, c) => s + c.nota, 0) / cals.length).toFixed(1) : '-';
              const promNum = cals.length > 0 ? cals.reduce((s, c) => s + c.nota, 0) / cals.length : null;
              const notaBg = promNum === null ? '#f4f4f6' : promNum >= 7 ? '#d4edda' : promNum >= 4 ? '#fef3c7' : '#fde8e8';
              const notaColor = promNum === null ? '#888888' : promNum >= 7 ? '#155724' : promNum >= 4 ? '#856404' : '#c62828';
              return (
                <div key={materia.id} className="flex items-center justify-between p-3 rounded-lg transition-colors" style={{ backgroundColor: '#f4f4f6' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#d6eaf8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#f4f4f6'; }}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{materia.nombre}</p>
                    <p className="text-xs" style={{ color: '#888888' }}>{materia.horasSemanal}hs semanales</p>
                  </div>
                  <div className="text-sm font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: notaBg, color: notaColor }}>{prom}</div>
                </div>
              );
            })}
          </div>
          <Link href="/estudiante/calificaciones" className="mt-4 text-sm font-medium hover:underline block" style={{ color: '#c62828' }}>
            Ver todas las calificaciones del período →
          </Link>
        </div>

        {/* Próximos eventos */}
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', color: '#111111' }}>Próximos eventos institucionales</h2>
          <div className="space-y-2">
            {proximosEventos.map(evento => (
              <div key={evento.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f4f4f6' }}>
                <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: evento.color }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{evento.titulo}</p>
                  <p className="text-xs" style={{ color: '#888888' }}>{new Date(evento.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/estudiante/calendario" className="mt-4 text-sm font-medium hover:underline block" style={{ color: '#c62828' }}>
            Ver calendario institucional completo →
          </Link>
        </div>

        {/* Últimas calificaciones */}
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', color: '#111111' }}>Últimas calificaciones registradas</h2>
          <div className="space-y-1">
            {misCalificaciones.slice(-4).reverse().map(cal => {
              const materia = misMaterias.find(m => m.id === cal.materiaId);
              const notaBg = cal.nota >= 7 ? '#d4edda' : cal.nota >= 4 ? '#fef3c7' : '#fde8e8';
              const notaColor = cal.nota >= 7 ? '#155724' : cal.nota >= 4 ? '#856404' : '#c62828';
              return (
                <div key={cal.id} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: '#e8e8ec' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{cal.descripcion}</p>
                    <p className="text-xs" style={{ color: '#888888' }}>{materia?.nombre} · {new Date(cal.fecha).toLocaleDateString('es-AR')}</p>
                  </div>
                  <span className="text-sm font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: notaBg, color: notaColor }}>{cal.nota}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asistencia */}
        <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <h2 className="font-semibold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.2rem', color: '#111111' }}>Resumen de inasistencias</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: '#888888' }}>Porcentaje de asistencia</span>
              <span className="text-sm font-bold" style={{ color: pctAsistencia >= 75 ? '#27ae60' : pctAsistencia >= 50 ? '#c9a227' : '#c62828' }}>{pctAsistencia}%</span>
            </div>
            <div className="w-full rounded-full h-2.5" style={{ backgroundColor: '#e8e8ec' }}>
              <div
                className="h-2.5 rounded-full transition-all"
                style={{ width: `${pctAsistencia}%`, backgroundColor: pctAsistencia >= 75 ? '#27ae60' : pctAsistencia >= 50 ? '#c9a227' : '#c62828' }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#d4edda' }}>
              <p className="text-2xl font-bold" style={{ color: '#155724', fontFamily: "'Barlow Condensed', sans-serif" }}>{presentes}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: '#27ae60' }}>Presentes</p>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ backgroundColor: '#fde8e8' }}>
              <p className="text-2xl font-bold" style={{ color: '#c62828', fontFamily: "'Barlow Condensed', sans-serif" }}>{inasistencias}</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: '#c62828' }}>Ausentes</p>
            </div>
          </div>
          <Link href="/estudiante/inasistencias" className="mt-4 text-sm font-medium hover:underline block" style={{ color: '#c62828' }}>
            Ver registro completo de inasistencias →
          </Link>
        </div>
      </div>
    </div>
  );
}
