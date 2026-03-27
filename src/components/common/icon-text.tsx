import { cn } from '@/lib/utils';

export interface IconTextProps {
  icon: React.ReactNode;
  text: string;
  subtext?: string;
  className?: string;
}

export function IconText({ icon, text, subtext, className }: IconTextProps) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="text-primary shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-medium text-foreground">{text}</p>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </div>
    </div>
  );
}
