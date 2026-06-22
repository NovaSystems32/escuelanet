'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';

const tipoColors: Record<string, { bg: string; color: string }> = {
  tarea: { bg: '#d6eaf8', color: '#1a5276' },
  material: { bg: '#d4edda', color: '#155724' },
  actividad: { bg: '#fef3c7', color: '#856404' },
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
          <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #e8e8ec' }}>
            <div className="p-4 border-b" style={{ borderColor: '#e8e8ec' }}>
              <h2 className="font-semibold text-sm" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#111111' }}>Mis Materias</h2>
            </div>
            <div>
              {misMaterias.map((materia, idx) => {
                const docente = docentes.find(d => d.id === materia.docenteId);
                const cnt = actividades.filter(a => a.materiaId === materia.id).length;
                const isActive = (materiaActual?.id ?? misMaterias[0]?.id) === materia.id;
                return (
                  <button
                    key={materia.id}
                    onClick={() => setSelectedMateria(materia.id)}
                    className="w-full text-left p-4 transition-colors"
                    style={{
                      backgroundColor: isActive ? '#d6eaf8' : undefined,
                      borderBottom: idx < misMaterias.length - 1 ? '1px solid #e8e8ec' : undefined,
                      borderLeft: isActive ? '3px solid #c62828' : '3px solid transparent',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '#f4f4f6'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
                  >
                    <p className="text-sm font-medium" style={{ color: isActive ? '#1a5276' : '#3a3a3a' }}>{materia.nombre}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#888888' }}>Prof. {docente?.apellido}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#888888' }}>{cnt} actividades</p>
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
              <div className="rounded-xl p-6 text-white mb-4" style={{ background: 'linear-gradient(135deg, #1a5276 0%, #154360 100%)' }}>
                <h2 className="text-2xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{materiaActual.nombre}</h2>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>{materiaActual.descripcion}</p>
                <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>{materiaActual.horasSemanal}hs semanales</p>
              </div>

              {actividadesMateria.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center" style={{ border: '1px solid #e8e8ec', color: '#888888' }}>
                  No hay actividades publicadas para esta materia
                </div>
              ) : (
                <div className="space-y-3">
                  {actividadesMateria.map(actividad => {
                    const docente = docentes.find(d => d.id === actividad.docenteId);
                    const tipo = tipoColors[actividad.tipo] || { bg: '#f4f4f6', color: '#888888' };
                    return (
                      <div key={actividad.id} className="bg-white rounded-xl p-5 transition-shadow hover:shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: tipo.bg, color: tipo.color }}>
                                {tipoLabels[actividad.tipo]}
                              </span>
                              {actividad.fechaEntrega && (
                                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fef3c7', color: '#856404' }}>
                                  Entrega: {new Date(actividad.fechaEntrega).toLocaleDateString('es-AR')}
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold" style={{ color: '#111111', fontFamily: "'Barlow Condensed', sans-serif" }}>{actividad.titulo}</h3>
                            <p className="text-sm mt-1" style={{ color: '#888888' }}>{actividad.descripcion}</p>
                            <p className="text-xs mt-2" style={{ color: '#aaaaaa' }}>
                              Publicado por Prof. {docente?.apellido} · {new Date(actividad.fechaPublicacion).toLocaleDateString('es-AR')}
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
