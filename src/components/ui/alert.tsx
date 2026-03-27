import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const config: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  info: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: Info },
  success: { bg: 'bg-green-50 border-green-200', text: 'text-green-800', icon: CheckCircle2 },
  warning: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', icon: AlertTriangle },
  danger: { bg: 'bg-red-50 border-red-200', text: 'text-red-800', icon: XCircle },
};

export function Alert({ variant = 'info', title, children, className }: AlertProps) {
  const { bg, text, icon: Icon } = config[variant];
  return (
    <div className={cn('flex gap-3 p-4 rounded-lg border', bg, text, className)} role="alert">
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="text-sm">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
