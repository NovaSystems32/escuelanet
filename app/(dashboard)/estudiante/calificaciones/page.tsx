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
    if (nota >= 7) return 'bg-green-100 text-green-700';
    if (nota >= 4) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div>
      <PageHeader title="Mis Calificaciones" description="Historial de notas por materia" />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-600 text-white rounded-xl p-4">
          <p className="text-blue-200 text-xs mb-1">Promedio General</p>
          <p className="text-3xl font-bold">{promedioGeneral}</p>
        </div>
        {[1, 2, 3].map(t => {
          const cals = misCalificaciones.filter(c => c.trimestre === t);
          const prom = cals.length > 0 ? (cals.reduce((s, c) => s + c.nota, 0) / cals.length).toFixed(1) : '-';
          return (
            <div key={t} className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-slate-500 text-xs mb-1">{t}° Trimestre</p>
              <p className="text-2xl font-bold text-slate-900">{prom}</p>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {(['todos', 1, 2, 3] as const).map(t => (
          <button
            key={t}
            onClick={() => setSelectedTrimestre(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedTrimestre === t
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
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

          return (
            <div key={materia.id} className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">{materia.nombre}</h3>
                <div className={`text-lg font-bold px-3 py-1 rounded-lg ${promNum !== null ? getNotaColor(promNum) : 'bg-slate-100 text-slate-500'}`}>
                  {promMateria}
                </div>
              </div>
              {cals.length === 0 ? (
                <p className="text-sm text-slate-400 p-4">Sin calificaciones registradas</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {cals.map(cal => (
                    <div key={cal.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm text-slate-900">{cal.descripcion}</p>
                        <p className="text-xs text-slate-500">
                          {tipoLabels[cal.tipo]} • {new Date(cal.fecha).toLocaleDateString('es-AR')} • {cal.trimestre}° trimestre
                        </p>
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
