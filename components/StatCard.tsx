interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
  subtitle?: string;
}

export default function StatCard({ title, value, icon, color = 'bg-[#e8f0fb] text-[#2d4a8a]', subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#d8e0ee] p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-[#5a6a8a]">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-[#1a2444]">{value}</p>
      {subtitle && <p className="text-xs text-[#5a6a8a] mt-1">{subtitle}</p>}
    </div>
  );
}
