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

const eventColors: Record<string, string> = {
  examen: '#1a5276',
  entrega: '#c62828',
  actividad: '#c9a227',
  reunion: '#27ae60',
  feriado: '#888888',
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
      <PageHeader title="Mi calendario institucional" description="Evaluaciones, actividades y fechas importantes del ciclo lectivo" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#1a5276' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#d6eaf8'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
            >◀</button>
            <h2 className="font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#111111', fontSize: '1.1rem' }}>
              {MONTHS[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#1a5276' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = '#d6eaf8'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; }}
            >▶</button>
          </div>
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold py-2 uppercase tracking-wide" style={{ color: '#888888' }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const dayEvents = getEventosForDay(day);
              const isToday = day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();
              return (
                <div
                  key={idx}
                  className="min-h-[60px] p-1 rounded-lg border transition-colors"
                  style={{
                    borderColor: isToday ? '#c62828' : 'transparent',
                    backgroundColor: isToday ? '#fde8e8' : undefined,
                  }}
                  onMouseEnter={e => { if (!isToday) { (e.currentTarget as HTMLElement).style.borderColor = '#e8e8ec'; (e.currentTarget as HTMLElement).style.backgroundColor = '#f4f4f6'; } }}
                  onMouseLeave={e => { if (!isToday) { (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; (e.currentTarget as HTMLElement).style.backgroundColor = ''; } }}
                >
                  <div
                    className="text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full"
                    style={isToday ? { backgroundColor: '#c62828', color: '#ffffff' } : { color: '#3a3a3a' }}
                  >
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.map(e => (
                      <div
                        key={e.id}
                        className="text-xs px-1 py-0.5 rounded truncate text-white font-medium"
                        style={{ backgroundColor: eventColors[e.tipo] || e.color }}
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
          <div className="bg-white rounded-xl p-5 mb-4 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
            <h2 className="font-semibold mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#111111', fontSize: '1.1rem' }}>Próximos Eventos</h2>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm" style={{ color: '#888888' }}>No hay eventos próximos</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(e => (
                  <div
                    key={e.id}
                    className="flex gap-3 items-start p-3 rounded-lg transition-colors"
                    style={{ backgroundColor: '#f4f4f6' }}
                    onMouseEnter={ev => { (ev.currentTarget as HTMLElement).style.backgroundColor = '#d6eaf8'; }}
                    onMouseLeave={ev => { (ev.currentTarget as HTMLElement).style.backgroundColor = '#f4f4f6'; }}
                  >
                    <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: eventColors[e.tipo] || e.color }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#3a3a3a' }}>{e.titulo}</p>
                      <p className="text-xs" style={{ color: '#888888' }}>{new Date(e.fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}</p>
                      <p className="text-xs" style={{ color: '#aaaaaa' }}>{tipoLabels[e.tipo]}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="bg-white rounded-xl p-5 shadow-sm" style={{ border: '1px solid #e8e8ec' }}>
            <h2 className="font-semibold mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#111111', fontSize: '1.1rem' }}>Leyenda</h2>
            <div className="space-y-2">
              {[
                { color: '#1a5276', label: 'Evaluación' },
                { color: '#c62828', label: 'Entrega' },
                { color: '#c9a227', label: 'Acto escolar' },
                { color: '#27ae60', label: 'Reunión' },
                { color: '#888888', label: 'Feriado' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-sm" style={{ color: '#888888' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
