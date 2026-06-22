'use client';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';

const tipoConfig: Record<string, { label: string; badgeColor: string; borderColor: string; icon: string }> = {
  observacion: { label: 'Observación', badgeColor: 'bg-[#eef1f8] text-[#2d4a8a]', borderColor: 'border-l-[#4a90d9]', icon: '👁️' },
  apercibimiento: { label: 'Apercibimiento', badgeColor: 'bg-[#fef3c7] text-[#d97706]', borderColor: 'border-l-[#f59e0b]', icon: '⚠️' },
  suspension: { label: 'Suspensión', badgeColor: 'bg-red-100 text-[#e53935]', borderColor: 'border-l-[#e53935]', icon: '🚫' },
  felicitacion: { label: 'Felicitación', badgeColor: 'bg-[#dcfce7] text-[#15803d]', borderColor: 'border-l-[#34a853]', icon: '⭐' },
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
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#1a2444]">{misDisciplina.length}</p>
          <p className="text-xs text-[#5a6a8a] mt-1 font-medium">Total registros</p>
        </div>
        <div className="bg-[#dcfce7] rounded-xl border border-green-200 p-4 text-center">
          <p className="text-2xl font-bold text-[#15803d]">{felicitaciones}</p>
          <p className="text-xs text-[#34a853] mt-1 font-medium">Felicitaciones</p>
        </div>
        <div className="bg-[#fef3c7] rounded-xl border border-amber-200 p-4 text-center">
          <p className="text-2xl font-bold text-[#d97706]">{negativos}</p>
          <p className="text-xs text-[#f59e0b] mt-1 font-medium">Sanciones</p>
        </div>
      </div>

      {/* Registros */}
      {misDisciplina.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#d8e0ee] p-8 text-center text-[#5a6a8a]">
          No hay registros disciplinarios
        </div>
      ) : (
        <div className="space-y-3">
          {misDisciplina.map(reg => {
            const config = tipoConfig[reg.tipo];
            const docente = docentes.find(d => d.id === reg.docenteId);
            return (
              <div key={reg.id} className={`bg-white rounded-xl border border-[#d8e0ee] border-l-4 ${config.borderColor} p-5 shadow-sm ${reg.resuelto ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{config.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${config.badgeColor}`}>
                        {config.label}
                      </span>
                      {reg.resuelto && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#eef1f8] text-[#5a6a8a] font-medium">
                          Resuelto
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#1a2444] font-medium">{reg.descripcion}</p>
                    <p className="text-xs text-[#5a6a8a] mt-1">
                      {new Date(reg.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {docente && ` • Prof. ${docente.apellido}`}
                    </p>
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
