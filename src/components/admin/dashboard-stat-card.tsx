import { cn } from '@/lib/utils';

export interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function DashboardStatCard({ title, value, icon, trend, trendUp, className }: DashboardStatCardProps) {
  return (
    <div className={cn('bg-card rounded-xl border border-border p-4 md:p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p className={cn('text-xs font-medium mt-1', trendUp ? 'text-secondary' : 'text-danger')}>
              {trend}
            </p>
          )}
        </div>
        <div className="h-10 w-10 bg-primary/5 rounded-lg flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
