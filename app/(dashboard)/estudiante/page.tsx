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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bienvenido, {user?.nombre} 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Aquí está el resumen de tu actividad académica</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Promedio General" value={promedio} icon="📊" color="bg-blue-50 text-blue-600" subtitle="Todas las materias" />
        <StatCard title="Inasistencias" value={inasistencias} icon="📅" color="bg-orange-50 text-orange-600" subtitle={`${pctAsistencia}% de asistencia`} />
        <StatCard title="Materias" value={misMaterias.length} icon="📚" color="bg-green-50 text-green-600" subtitle="1er Año A" />
        <StatCard title="Registros Disciplina" value={misDisciplina.length} icon="⚖️" color="bg-purple-50 text-purple-600" subtitle={`${misDisciplina.filter(d => d.tipo === 'felicitacion').length} felicitaciones`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis materias */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Mis Materias</h2>
          <div className="space-y-3">
            {misMaterias.map(materia => {
              const cals = misCalificaciones.filter(c => c.materiaId === materia.id);
              const prom = cals.length > 0 ? (cals.reduce((s, c) => s + c.nota, 0) / cals.length).toFixed(1) : '-';
              const promNum = cals.length > 0 ? cals.reduce((s, c) => s + c.nota, 0) / cals.length : null;
              const color = promNum === null ? 'text-slate-400' : promNum >= 7 ? 'text-green-600' : promNum >= 4 ? 'text-yellow-600' : 'text-red-600';
              return (
                <div key={materia.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{materia.nombre}</p>
                    <p className="text-xs text-slate-500">{materia.horasSemanal}hs semanales</p>
                  </div>
                  <div className={`text-lg font-bold ${color}`}>{prom}</div>
                </div>
              );
            })}
          </div>
          <Link href="/estudiante/calificaciones" className="mt-4 text-sm text-blue-600 hover:underline block">
            Ver todas las calificaciones →
          </Link>
        </div>

        {/* Próximos eventos */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Próximos Eventos</h2>
          <div className="space-y-3">
            {proximosEventos.map(evento => (
              <div key={evento.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: evento.color }} />
                <div>
                  <p className="text-sm font-medium text-slate-900">{evento.titulo}</p>
                  <p className="text-xs text-slate-500">{new Date(evento.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
            ))}
          </div>
          <Link href="/estudiante/calendario" className="mt-4 text-sm text-blue-600 hover:underline block">
            Ver calendario completo →
          </Link>
        </div>

        {/* Últimas calificaciones */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Últimas Calificaciones</h2>
          <div className="space-y-2">
            {misCalificaciones.slice(-4).reverse().map(cal => {
              const materia = misMaterias.find(m => m.id === cal.materiaId);
              const color = cal.nota >= 7 ? 'bg-green-100 text-green-700' : cal.nota >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';
              return (
                <div key={cal.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{cal.descripcion}</p>
                    <p className="text-xs text-slate-500">{materia?.nombre} • {new Date(cal.fecha).toLocaleDateString('es-AR')}</p>
                  </div>
                  <span className={`text-sm font-bold px-2 py-1 rounded-lg ${color}`}>{cal.nota}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asistencia reciente */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Asistencia Reciente</h2>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Porcentaje de asistencia</span>
              <span className="text-sm font-bold text-slate-900">{pctAsistencia}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${pctAsistencia >= 75 ? 'bg-green-500' : pctAsistencia >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${pctAsistencia}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-700">{presentes}</p>
              <p className="text-xs text-green-600">Presentes</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-700">{inasistencias}</p>
              <p className="text-xs text-red-600">Ausentes</p>
            </div>
          </div>
          <Link href="/estudiante/inasistencias" className="mt-4 text-sm text-blue-600 hover:underline block">
            Ver detalle de inasistencias →
          </Link>
        </div>
      </div>
    </div>
  );
}
