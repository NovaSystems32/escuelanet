'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';

export default function DocenteMateriasPage() {
  const { materias, cursos, calificaciones, actividades, estudiantes } = useAppStore();
  const docenteId = 'd1';
  const misMaterias = materias.filter(m => m.docenteId === docenteId);
  const [selected, setSelected] = useState(misMaterias[0]?.id ?? '');

  const materiaSeleccionada = misMaterias.find(m => m.id === selected);
  const curso = cursos.find(c => c.id === materiaSeleccionada?.cursoId);
  const estudiantesCurso = estudiantes.filter(e => curso?.estudiantesIds.includes(e.id) ?? false);
  const calsMateria = calificaciones.filter(c => c.materiaId === selected && c.docenteId === docenteId);
  const actsMateria = actividades.filter(a => a.materiaId === selected);

  return (
    <div>
      <PageHeader title="Mis espacios curriculares" description="Detalle de cada espacio curricular que dictás" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-xl border border-[#e8e8ec] overflow-hidden h-fit">
          <div className="p-3 border-b border-[#e8e8ec]">
            <p className="text-xs font-semibold text-[#888888] uppercase">Espacios curriculares</p>
          </div>
          {misMaterias.map(m => {
            const c = cursos.find(c => c.id === m.cursoId);
            return (
              <div key={m.id} className={`border-b border-[#e8e8ec] last:border-0 ${selected === m.id ? 'bg-[#d6eaf8]' : ''}`}>
                <button
                  onClick={() => setSelected(m.id)}
                  className={`w-full text-left p-4 transition-colors hover:bg-[#f4f4f6]`}
                >
                  <p className={`text-sm font-medium ${selected === m.id ? 'text-[#1a5276]' : 'text-[#111111]'}`}>{m.nombre}</p>
                  <p className="text-xs text-[#888888]">{c ? `${c.nombre} ${c.division}` : ''}</p>
                </button>
                <div className="px-4 pb-2">
                  <Link href={`/docente/materias/${m.id}`} className="text-xs text-[#c62828] hover:underline">Ver comunicados →</Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 space-y-4">
          {materiaSeleccionada && (
            <>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
                <h2 className="text-xl font-bold">{materiaSeleccionada.nombre}</h2>
                <p className="text-blue-100 text-sm mt-1">{materiaSeleccionada.descripcion}</p>
                <div className="flex gap-4 mt-3 text-sm text-blue-200">
                  <span>📚 {materiaSeleccionada.horasSemanal}h/sem</span>
                  <span>👥 {estudiantesCurso.length} estudiantes</span>
                  <span>📊 {calsMateria.length} calificaciones registradas</span>
                </div>
              </div>

              {/* Students */}
              <div className="bg-white rounded-xl border border-[#e8e8ec] p-5">
                <h3 className="font-semibold text-[#111111] mb-3">Estudiantes del curso y división</h3>
                <div className="space-y-2">
                  {estudiantesCurso.map(est => {
                    const cals = calsMateria.filter(c => c.estudianteId === est.id);
                    const prom = cals.length > 0 ? (cals.reduce((s, c) => s + c.nota, 0) / cals.length).toFixed(1) : '-';
                    const promNum = cals.length > 0 ? cals.reduce((s, c) => s + c.nota, 0) / cals.length : null;
                    const color = promNum === null ? 'text-[#888888]' : promNum >= 7 ? 'text-green-600' : promNum >= 4 ? 'text-yellow-600' : 'text-[#c62828]';
                    return (
                      <div key={est.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#f4f4f6]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#e8e8ec] flex items-center justify-center text-xs font-semibold text-[#888888]">
                            {est.nombre.charAt(0)}
                          </div>
                          <span className="text-sm text-[#111111]">{est.apellido}, {est.nombre}</span>
                        </div>
                        <span className={`text-sm font-bold ${color}`}>{prom}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actividades */}
              <div className="bg-white rounded-xl border border-[#e8e8ec] p-5">
                <h3 className="font-semibold text-[#111111] mb-3">Actividades y entregas</h3>
                {actsMateria.length === 0 ? (
                  <p className="text-sm text-[#888888]">Sin actividades ni entregas publicadas</p>
                ) : (
                  <div className="space-y-2">
                    {actsMateria.map(a => (
                      <div key={a.id} className="p-3 rounded-lg bg-[#f4f4f6] text-sm">
                        <p className="font-medium text-[#111111]">{a.titulo}</p>
                        <p className="text-[#888888] text-xs mt-0.5">{a.tipo} {a.fechaEntrega && `• Entrega: ${new Date(a.fechaEntrega).toLocaleDateString('es-AR')}`}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
