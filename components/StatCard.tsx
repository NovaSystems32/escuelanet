interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  subtitle?: string;
  accentColor?: string;
}

export default function StatCard({ title, value, icon, color = 'bg-[#d6eaf8] text-[#1a5276]', subtitle, accentColor }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
      style={{ border: accentColor ? `1px solid #e8e8ec; border-left: 4px solid ${accentColor}` : '1px solid #e8e8ec' }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: '#888888', fontFamily: "'Inter', sans-serif" }}>{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: '#111111', fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</p>
      {subtitle && <p className="text-xs mt-1" style={{ color: '#888888' }}>{subtitle}</p>}
    </div>
  );
}
