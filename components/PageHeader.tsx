interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#111111', fontWeight: 700 }}>{title}</h1>
        {description && <p className="text-sm mt-1" style={{ color: '#888888' }}>{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
