'use client';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';
import StatCard from '@/components/StatCard';
import Link from 'next/link';

export default function EstudianteDashboard() {
  const { user } = useAuthStore();
  const { calificaciones, asistencias, disciplina, eventos, materias, cursos } = useAppStore();

  // Student ID from mock data (estudiante user is e1)
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
      <div className="mb-6 bg-gradient-to-r from-[#1a2f5e] to-[#2d4a8a] rounded-2xl p-6 text-white shadow-md">
        <p className="text-white/60 text-sm mb-1">{todayCapitalized}</p>
        <h1 className="text-2xl font-bold">Buenos días, {user?.nombre} 👋</h1>
        <p className="text-white/70 text-sm mt-1">Aquí está el resumen de tu actividad académica</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Promedio General" value={promedio} icon="📊" color="bg-[#e8f0fb] text-[#2d4a8a]" subtitle="Todas las materias" />
        <StatCard title="Inasistencias" value={inasistencias} icon="📅" color="bg-red-50 text-[#e53935]" subtitle={`${pctAsistencia}% de asistencia`} />
        <StatCard title="Próx. Evaluaciones" value={proximosEventos.length} icon="⭐" color="bg-[#fef9c3] text-[#a16207]" subtitle="Este mes" />
        <StatCard title="Materias" value={misMaterias.length} icon="📚" color="bg-[#dcfce7] text-[#15803d]" subtitle="1er Año A" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis materias */}
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm">
          <h2 className="font-semibold text-[#1a2444] mb-4">Mis Materias</h2>
          <div className="space-y-2">
            {misMaterias.map(materia => {
              const cals = misCalificaciones.filter(c => c.materiaId === materia.id);
              const prom = cals.length > 0 ? (cals.reduce((s, c) => s + c.nota, 0) / cals.length).toFixed(1) : '-';
              const promNum = cals.length > 0 ? cals.reduce((s, c) => s + c.nota, 0) / cals.length : null;
              const notaBg = promNum === null ? 'bg-[#eef1f8] text-[#5a6a8a]' : promNum >= 7 ? 'bg-[#dcfce7] text-[#15803d]' : promNum >= 4 ? 'bg-[#fef3c7] text-[#d97706]' : 'bg-red-100 text-[#e53935]';
              return (
                <div key={materia.id} className="flex items-center justify-between p-3 rounded-lg bg-[#f8f9fc] hover:bg-[#e8f0fb] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-[#1a2444]">{materia.nombre}</p>
                    <p className="text-xs text-[#5a6a8a]">{materia.horasSemanal}hs semanales</p>
                  </div>
                  <div className={`text-sm font-bold px-2.5 py-1 rounded-lg ${notaBg}`}>{prom}</div>
                </div>
              );
            })}
          </div>
          <Link href="/estudiante/calificaciones" className="mt-4 text-sm text-[#2d4a8a] hover:text-[#1a2f5e] font-medium hover:underline block">
            Ver todas las calificaciones →
          </Link>
        </div>

        {/* Próximos eventos */}
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm">
          <h2 className="font-semibold text-[#1a2444] mb-4">Próximos Eventos</h2>
          <div className="space-y-2">
            {proximosEventos.map(evento => (
              <div key={evento.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#f8f9fc]">
                <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: evento.color }} />
                <div>
                  <p className="text-sm font-medium text-[#1a2444]">{evento.titulo}</p>
                  <p className="text-xs text-[#5a6a8a]">{new Date(evento.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/estudiante/calendario" className="mt-4 text-sm text-[#2d4a8a] hover:text-[#1a2f5e] font-medium hover:underline block">
            Ver calendario completo →
          </Link>
        </div>

        {/* Últimas calificaciones */}
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm">
          <h2 className="font-semibold text-[#1a2444] mb-4">Últimas Calificaciones</h2>
          <div className="space-y-1">
            {misCalificaciones.slice(-4).reverse().map(cal => {
              const materia = misMaterias.find(m => m.id === cal.materiaId);
              const notaBg = cal.nota >= 7 ? 'bg-[#dcfce7] text-[#15803d]' : cal.nota >= 4 ? 'bg-[#fef3c7] text-[#d97706]' : 'bg-red-100 text-[#e53935]';
              return (
                <div key={cal.id} className="flex items-center justify-between py-2.5 border-b border-[#eef1f8] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#1a2444]">{cal.descripcion}</p>
                    <p className="text-xs text-[#5a6a8a]">{materia?.nombre} • {new Date(cal.fecha).toLocaleDateString('es-AR')}</p>
                  </div>
                  <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${notaBg}`}>{cal.nota}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asistencia */}
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm">
          <h2 className="font-semibold text-[#1a2444] mb-4">Resumen de Asistencia</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#5a6a8a]">Porcentaje de asistencia</span>
              <span className={`text-sm font-bold ${pctAsistencia >= 75 ? 'text-[#34a853]' : pctAsistencia >= 50 ? 'text-[#f59e0b]' : 'text-[#e53935]'}`}>{pctAsistencia}%</span>
            </div>
            <div className="w-full bg-[#eef1f8] rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${pctAsistencia >= 75 ? 'bg-[#34a853]' : pctAsistencia >= 50 ? 'bg-[#f59e0b]' : 'bg-[#e53935]'}`}
                style={{ width: `${pctAsistencia}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#dcfce7] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[#15803d]">{presentes}</p>
              <p className="text-xs text-[#34a853] font-medium mt-0.5">Presentes</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[#e53935]">{inasistencias}</p>
              <p className="text-xs text-[#e53935] font-medium mt-0.5">Ausentes</p>
            </div>
          </div>
          <Link href="/estudiante/inasistencias" className="mt-4 text-sm text-[#2d4a8a] hover:text-[#1a2f5e] font-medium hover:underline block">
            Ver detalle de inasistencias →
          </Link>
        </div>
      </div>
    </div>
  );
}
