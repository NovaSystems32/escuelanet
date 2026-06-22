'use client';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';

const tipoConfig: Record<string, { label: string; badgeBg: string; badgeColor: string; borderColor: string; icon: string }> = {
  observacion: { label: 'Observación', badgeBg: '#d6eaf8', badgeColor: '#1a5276', borderColor: '#1a5276', icon: '👁️' },
  apercibimiento: { label: 'Llamado de Atención', badgeBg: '#fef3c7', badgeColor: '#856404', borderColor: '#c9a227', icon: '⚠️' },
  suspension: { label: 'Amonestación', badgeBg: '#fde8e8', badgeColor: '#c62828', borderColor: '#c62828', icon: '🚫' },
  felicitacion: { label: 'Felicitación', badgeBg: '#d4edda', badgeColor: '#155724', borderColor: '#27ae60', icon: '⭐' },
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
      <PageHeader title="Observaciones e intervenciones" description="Registro de observaciones, intervenciones y reconocimientos del ciclo lectivo" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <p className="text-2xl font-bold" style={{ color: '#111111', fontFamily: "'Barlow Condensed', sans-serif" }}>{misDisciplina.length}</p>
          <p className="text-xs mt-1 font-medium" style={{ color: '#888888' }}>Total registros</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#d4edda', border: '1px solid #b8ddc0' }}>
          <p className="text-2xl font-bold" style={{ color: '#155724', fontFamily: "'Barlow Condensed', sans-serif" }}>{felicitaciones}</p>
          <p className="text-xs mt-1 font-medium" style={{ color: '#27ae60' }}>Felicitaciones</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a' }}>
          <p className="text-2xl font-bold" style={{ color: '#856404', fontFamily: "'Barlow Condensed', sans-serif" }}>{negativos}</p>
          <p className="text-xs mt-1 font-medium" style={{ color: '#c9a227' }}>Sanciones</p>
        </div>
      </div>

      {/* Registros */}
      {misDisciplina.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center shadow-sm" style={{ border: '1px solid #e8e8ec', color: '#888888' }}>
          No hay observaciones o intervenciones registradas.
        </div>
      ) : (
        <div className="space-y-3">
          {misDisciplina.map(reg => {
            const config = tipoConfig[reg.tipo] || tipoConfig.observacion;
            const docente = docentes.find(d => d.id === reg.docenteId);
            return (
              <div
                key={reg.id}
                className="bg-white rounded-xl p-5 shadow-sm"
                style={{
                  border: '1px solid #e8e8ec',
                  borderLeft: `4px solid ${config.borderColor}`,
                  opacity: reg.resuelto ? 0.6 : 1,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{config.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: config.badgeBg, color: config.badgeColor }}>
                        {config.label}
                      </span>
                      {reg.resuelto && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#f4f4f6', color: '#888888' }}>
                          Resuelto
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{reg.descripcion}</p>
                    <p className="text-xs mt-1" style={{ color: '#888888' }}>
                      {new Date(reg.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {docente && ` · Prof. ${docente.apellido}`}
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
