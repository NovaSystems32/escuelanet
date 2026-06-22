'use client';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import PageHeader from '@/components/PageHeader';

const tipoLabels: Record<string, string> = {
  examen: 'Examen',
  reunion: 'Reunión',
  feriado: 'Feriado',
  actividad: 'Actividad',
  entrega: 'Entrega',
};

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function CalendarioPage() {
  const { eventos } = useAppStore();
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  const getEventosForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventos.filter(e => e.fecha === dateStr || (e.fechaFin && e.fecha <= dateStr && e.fechaFin >= dateStr));
  };

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const upcomingEvents = eventos
    .filter(e => new Date(e.fecha) >= new Date())
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 5);

  return (
    <div>
      <PageHeader title="Calendario" description="Eventos, exámenes y actividades escolares" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-[#e8f0fb] rounded-lg text-[#2d4a8a] transition-colors">◀</button>
            <h2 className="font-semibold text-[#1a2444]">{MONTHS[currentMonth]} {currentYear}</h2>
            <button onClick={nextMonth} className="p-2 hover:bg-[#e8f0fb] rounded-lg text-[#2d4a8a] transition-colors">▶</button>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-[#5a6a8a] py-2 uppercase tracking-wide">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const dayEvents = getEventosForDay(day);
              const isToday = day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();
              return (
                <div key={idx} className={`min-h-[60px] p-1 rounded-lg border transition-colors ${isToday ? 'border-[#2d4a8a] bg-[#e8f0fb]' : 'border-transparent hover:border-[#d8e0ee] hover:bg-[#f8f9fc]'}`}>
                  <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-[#2d4a8a] text-white' : 'text-[#1a2444]'}`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.map(e => (
                      <div
                        key={e.id}
                        className="text-xs px-1 py-0.5 rounded truncate text-white font-medium"
                        style={{ backgroundColor: e.color }}
                        title={e.titulo}
                      >
                        {e.titulo}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming events */}
        <div>
          <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 mb-4 shadow-sm">
            <h2 className="font-semibold text-[#1a2444] mb-4">Próximos Eventos</h2>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-[#5a6a8a]">No hay eventos próximos</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(e => (
                  <div key={e.id} className="flex gap-3 items-start p-3 rounded-lg bg-[#f8f9fc] hover:bg-[#e8f0fb] transition-colors">
                    <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: e.color }} />
                    <div>
                      <p className="text-sm font-medium text-[#1a2444]">{e.titulo}</p>
                      <p className="text-xs text-[#5a6a8a]">{new Date(e.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</p>
                      <p className="text-xs text-[#5a6a8a]/60">{tipoLabels[e.tipo]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm">
            <h2 className="font-semibold text-[#1a2444] mb-3">Leyenda</h2>
            <div className="space-y-2">
              {[
                { color: '#4a90d9', label: 'Evaluación' },
                { color: '#f59e0b', label: 'Entrega' },
                { color: '#f0a500', label: 'Acto' },
                { color: '#0f766e', label: 'Reunión' },
                { color: '#9ca3af', label: 'Feriado' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-[#5a6a8a]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
