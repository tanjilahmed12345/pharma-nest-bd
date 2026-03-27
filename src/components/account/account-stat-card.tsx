import { cn } from '@/lib/utils';

export interface AccountStatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

export function AccountStatCard({ label, value, icon, className }: AccountStatCardProps) {
  return (
    <div className={cn('flex items-center gap-3 p-4 bg-white rounded-xl border border-border', className)}>
      <div className="h-10 w-10 bg-primary/5 rounded-lg flex items-center justify-center shrink-0 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
