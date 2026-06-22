'use client';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';

const tipoConfig: Record<string, { label: string; color: string; icon: string }> = {
  observacion: { label: 'Observación', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '👁️' },
  apercibimiento: { label: 'Apercibimiento', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '⚠️' },
  suspension: { label: 'Suspensión', color: 'bg-red-100 text-red-700 border-red-200', icon: '🚫' },
  felicitacion: { label: 'Felicitación', color: 'bg-green-100 text-green-700 border-green-200', icon: '⭐' },
};

export default function DisciplinaPage() {
  const { disciplina, docentes } = useAppStore();

  const estudianteId = 'e1';
  const misDisciplina = disciplina
    .filter(d => d.estudianteId === estudianteId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const felicitaciones = misDisciplina.filter(d => d.tipo === 'felicitacion').length;
  const negativos = misDisciplina.filter(d => d.tipo !== 'felicitacion').length;

  return (
    <div>
      <PageHeader title="Disciplina" description="Registro de observaciones, apercibimientos y felicitaciones" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{misDisciplina.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total registros</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{felicitaciones}</p>
          <p className="text-xs text-green-600 mt-1">Felicitaciones</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 text-center">
          <p className="text-2xl font-bold text-orange-700">{negativos}</p>
          <p className="text-xs text-orange-600 mt-1">Sanciones</p>
        </div>
      </div>

      {/* Registros */}
      {misDisciplina.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400">
          No hay registros disciplinarios
        </div>
      ) : (
        <div className="space-y-3">
          {misDisciplina.map(reg => {
            const config = tipoConfig[reg.tipo];
            const docente = docentes.find(d => d.id === reg.docenteId);
            return (
              <div key={reg.id} className={`bg-white rounded-xl border p-5 ${reg.resuelto ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${config.color}`}>
                          {config.label}
                        </span>
                        {reg.resuelto && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            Resuelto
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-900">{reg.descripcion}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(reg.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {docente && ` • Prof. ${docente.apellido}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
