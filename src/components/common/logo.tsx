import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Pill } from 'lucide-react';

export interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { icon: 'h-5 w-5', text: 'text-lg' },
  md: { icon: 'h-6 w-6', text: 'text-xl' },
  lg: { icon: 'h-8 w-8', text: 'text-2xl' },
};

export function Logo({ size = 'md', className }: LogoProps) {
  const s = sizes[size];
  return (
    <Link href="/" className={cn('inline-flex items-center gap-2 font-bold', className)}>
      <Pill className={cn(s.icon, 'text-primary')} />
      <span className={cn(s.text, 'text-primary')}>
        Pharma<span className="text-secondary">Nest</span>
      </span>
    </Link>
  );
}
