'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';

const tipoColors: Record<string, string> = {
  tarea: 'bg-[#e8f0fb] text-[#2d4a8a]',
  material: 'bg-[#dcfce7] text-[#15803d]',
  actividad: 'bg-purple-100 text-purple-700',
};

const tipoLabels: Record<string, string> = {
  tarea: 'Tarea',
  material: 'Material',
  actividad: 'Actividad',
};

export default function AulasPage() {
  const { materias, actividades, docentes } = useAppStore();
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);

  const misMaterias = materias.filter(m => m.cursoId === 'c1');

  const materiaActual = selectedMateria
    ? misMaterias.find(m => m.id === selectedMateria)
    : misMaterias[0];

  const actividadesMateria = actividades.filter(a => a.materiaId === (materiaActual?.id ?? ''));

  return (
    <div>
      <PageHeader title="Aulas Virtuales" description="Accedé a tus materias, tareas y materiales" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar materias */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#d8e0ee] overflow-hidden">
            <div className="p-4 border-b border-[#d8e0ee]">
              <h2 className="font-semibold text-[#1a2444] text-sm">Mis Materias</h2>
            </div>
            <div className="divide-y divide-[#eef1f8]">
              {misMaterias.map(materia => {
                const docente = docentes.find(d => d.id === materia.docenteId);
                const cnt = actividades.filter(a => a.materiaId === materia.id).length;
                const isActive = (materiaActual?.id ?? misMaterias[0]?.id) === materia.id;
                return (
                  <button
                    key={materia.id}
                    onClick={() => setSelectedMateria(materia.id)}
                    className={`w-full text-left p-4 transition-colors ${isActive ? 'bg-[#e8f0fb]' : 'hover:bg-[#f8f9fc]'}`}
                  >
                    <p className={`text-sm font-medium ${isActive ? 'text-[#2d4a8a]' : 'text-[#1a2444]'}`}>{materia.nombre}</p>
                    <p className="text-xs text-[#5a6a8a] mt-0.5">Prof. {docente?.apellido}</p>
                    <p className="text-xs text-[#5a6a8a] mt-0.5">{cnt} actividades</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="lg:col-span-3">
          {materiaActual && (
            <div>
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mb-4">
                <h2 className="text-xl font-bold">{materiaActual.nombre}</h2>
                <p className="text-blue-100 text-sm mt-1">{materiaActual.descripcion}</p>
                <p className="text-blue-200 text-xs mt-2">{materiaActual.horasSemanal}hs semanales</p>
              </div>

              {actividadesMateria.length === 0 ? (
                <div className="bg-white rounded-xl border border-[#d8e0ee] p-8 text-center text-[#5a6a8a]">
                  No hay actividades publicadas para esta materia
                </div>
              ) : (
                <div className="space-y-3">
                  {actividadesMateria.map(actividad => {
                    const docente = docentes.find(d => d.id === actividad.docenteId);
                    return (
                      <div key={actividad.id} className="bg-white rounded-xl border border-[#d8e0ee] p-5 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipoColors[actividad.tipo]}`}>
                                {tipoLabels[actividad.tipo]}
                              </span>
                              {actividad.fechaEntrega && (
                                <span className="text-xs text-[#d97706] bg-orange-50 px-2 py-0.5 rounded-full">
                                  Entrega: {new Date(actividad.fechaEntrega).toLocaleDateString('es-AR')}
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-[#1a2444]">{actividad.titulo}</h3>
                            <p className="text-sm text-[#5a6a8a] mt-1">{actividad.descripcion}</p>
                            <p className="text-xs text-[#5a6a8a] mt-2">
                              Publicado por Prof. {docente?.apellido} • {new Date(actividad.fechaPublicacion).toLocaleDateString('es-AR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
