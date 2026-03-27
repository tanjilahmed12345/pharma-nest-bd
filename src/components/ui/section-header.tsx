import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, viewAllHref, viewAllLabel = 'View All', className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between mb-5', className)}>
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-sm font-medium text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
        >
          {viewAllLabel}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
