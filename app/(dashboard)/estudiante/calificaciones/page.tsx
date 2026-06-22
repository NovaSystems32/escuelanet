'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';

const tipoLabels: Record<string, string> = {
  parcial: 'Parcial',
  trabajo_practico: 'Trabajo Práctico',
  examen_final: 'Examen Final',
  oral: 'Oral',
};

export default function CalificacionesPage() {
  const { calificaciones, materias } = useAppStore();
  const [selectedTrimestre, setSelectedTrimestre] = useState<1|2|3|'todos'>('todos');

  const estudianteId = 'e1';
  const misMaterias = materias.filter(m => m.cursoId === 'c1');
  const misCalificaciones = calificaciones.filter(c => c.estudianteId === estudianteId);

  const filtered = selectedTrimestre === 'todos'
    ? misCalificaciones
    : misCalificaciones.filter(c => c.trimestre === selectedTrimestre);

  const promedioGeneral = misCalificaciones.length > 0
    ? (misCalificaciones.reduce((s, c) => s + c.nota, 0) / misCalificaciones.length).toFixed(1)
    : '-';

  const getNotaColor = (nota: number) => {
    if (nota >= 7) return 'bg-[#dcfce7] text-[#15803d]';
    if (nota >= 4) return 'bg-[#fef3c7] text-[#d97706]';
    return 'bg-red-100 text-[#e53935]';
  };

  return (
    <div>
      <PageHeader title="Mis Calificaciones" description="Historial de notas por materia" />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#1a2f5e] to-[#2d4a8a] text-white rounded-xl p-4 shadow-md">
          <p className="text-white/60 text-xs mb-1 font-medium uppercase tracking-wide">Promedio General</p>
          <p className="text-3xl font-bold">{promedioGeneral}</p>
        </div>
        {[1, 2, 3].map(t => {
          const cals = misCalificaciones.filter(c => c.trimestre === t);
          const prom = cals.length > 0 ? (cals.reduce((s, c) => s + c.nota, 0) / cals.length).toFixed(1) : '-';
          const promNum = cals.length > 0 ? cals.reduce((s, c) => s + c.nota, 0) / cals.length : null;
          return (
            <div key={t} className="bg-white rounded-xl border border-[#d8e0ee] p-4 shadow-sm">
              <p className="text-[#5a6a8a] text-xs mb-1 font-medium">{t}° Trimestre</p>
              <p className={`text-2xl font-bold ${promNum !== null ? (promNum >= 7 ? 'text-[#34a853]' : promNum >= 4 ? 'text-[#f59e0b]' : 'text-[#e53935]') : 'text-[#1a2444]'}`}>{prom}</p>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {(['todos', 1, 2, 3] as const).map(t => (
          <button
            key={t}
            onClick={() => setSelectedTrimestre(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedTrimestre === t
                ? 'bg-[#2d4a8a] text-white shadow-sm'
                : 'bg-white border border-[#d8e0ee] text-[#5a6a8a] hover:bg-[#e8f0fb] hover:text-[#2d4a8a]'
            }`}
          >
            {t === 'todos' ? 'Todos' : `${t}° Trimestre`}
          </button>
        ))}
      </div>

      {/* Por materia */}
      <div className="space-y-4">
        {misMaterias.map(materia => {
          const cals = filtered.filter(c => c.materiaId === materia.id);
          if (cals.length === 0 && selectedTrimestre !== 'todos') return null;
          const promMateria = cals.length > 0 ? (cals.reduce((s, c) => s + c.nota, 0) / cals.length).toFixed(1) : '-';
          const promNum = cals.length > 0 ? cals.reduce((s, c) => s + c.nota, 0) / cals.length : null;

          const tipoBadge: Record<string, string> = {
            parcial: 'bg-[#e8f0fb] text-[#2d4a8a]',
            trabajo_practico: 'bg-[#ccfbf1] text-[#0f766e]',
            oral: 'bg-[#f3e8ff] text-[#7e22ce]',
            examen_final: 'bg-[#e0e7ff] text-[#3730a3]',
          };

          return (
            <div key={materia.id} className="bg-white rounded-xl border border-[#d8e0ee] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-[#eef1f8] bg-[#f8f9fc]">
                <h3 className="font-semibold text-[#1a2444]">{materia.nombre}</h3>
                <div className={`text-lg font-bold px-3 py-1 rounded-lg ${promNum !== null ? getNotaColor(promNum) : 'bg-[#eef1f8] text-[#5a6a8a]'}`}>
                  {promMateria}
                </div>
              </div>
              {cals.length === 0 ? (
                <p className="text-sm text-[#5a6a8a] p-4">Sin calificaciones registradas</p>
              ) : (
                <div className="divide-y divide-[#eef1f8]">
                  {cals.map((cal, idx) => (
                    <div key={cal.id} className={`flex items-center justify-between px-4 py-3 ${idx % 2 === 0 ? '' : 'bg-[#f8f9fc]'}`}>
                      <div>
                        <p className="text-sm text-[#1a2444] font-medium">{cal.descripcion}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipoBadge[cal.tipo] || 'bg-[#eef1f8] text-[#5a6a8a]'}`}>
                            {tipoLabels[cal.tipo]}
                          </span>
                          <span className="text-xs text-[#5a6a8a]">{new Date(cal.fecha).toLocaleDateString('es-AR')} • {cal.trimestre}° trimestre</span>
                        </div>
                      </div>
                      <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${getNotaColor(cal.nota)}`}>
                        {cal.nota}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
