import { cn } from '@/lib/utils';
import { DosageForm } from '@/types';
import {
  Pill, Tablets, Wine, FlaskConical, Syringe, Pipette,
  Droplet, Wind, Sparkles, SprayCan, Activity,
  type LucideIcon,
} from 'lucide-react';

export interface MedicineImageProps {
  name: string;
  dosageForm: DosageForm;
  strength: string;
  manufacturer: string;
  isPrescriptionRequired?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

// --- Icon mapping ---

const DOSAGE_ICONS: Record<string, LucideIcon> = {
  [DosageForm.TABLET]: Pill,
  [DosageForm.CAPSULE]: Tablets,
  [DosageForm.SYRUP]: Wine,
  [DosageForm.SUSPENSION]: FlaskConical,
  [DosageForm.INJECTION]: Syringe,
  [DosageForm.CREAM]: Pipette,
  [DosageForm.OINTMENT]: Pipette,
  [DosageForm.GEL]: Pipette,
  [DosageForm.DROPS]: Droplet,
  [DosageForm.INHALER]: Wind,
  [DosageForm.POWDER]: Sparkles,
  [DosageForm.SOLUTION]: FlaskConical,
  [DosageForm.SPRAY]: SprayCan,
  [DosageForm.DEVICE]: Activity,
  [DosageForm.SUPPOSITORY]: Pill,
  [DosageForm.OTHER]: Pill,
};

// --- Color palettes (all static strings for Tailwind JIT) ---

interface Palette {
  gradient: string;
  accent: string;
  accentBg: string;
  border: string;
}

const PALETTES: Palette[] = [
  {
    gradient: 'from-teal-50 to-cyan-50 dark:from-teal-950/60 dark:to-cyan-950/60',
    accent: 'text-teal-600 dark:text-teal-400',
    accentBg: 'bg-teal-500/10',
    border: 'border-teal-200/60 dark:border-teal-800/40',
  },
  {
    gradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60',
    accent: 'text-blue-600 dark:text-blue-400',
    accentBg: 'bg-blue-500/10',
    border: 'border-blue-200/60 dark:border-blue-800/40',
  },
  {
    gradient: 'from-emerald-50 to-green-50 dark:from-emerald-950/60 dark:to-green-950/60',
    accent: 'text-emerald-600 dark:text-emerald-400',
    accentBg: 'bg-emerald-500/10',
    border: 'border-emerald-200/60 dark:border-emerald-800/40',
  },
  {
    gradient: 'from-violet-50 to-purple-50 dark:from-violet-950/60 dark:to-purple-950/60',
    accent: 'text-violet-600 dark:text-violet-400',
    accentBg: 'bg-violet-500/10',
    border: 'border-violet-200/60 dark:border-violet-800/40',
  },
  {
    gradient: 'from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/60',
    accent: 'text-amber-600 dark:text-amber-400',
    accentBg: 'bg-amber-500/10',
    border: 'border-amber-200/60 dark:border-amber-800/40',
  },
  {
    gradient: 'from-rose-50 to-pink-50 dark:from-rose-950/60 dark:to-pink-950/60',
    accent: 'text-rose-600 dark:text-rose-400',
    accentBg: 'bg-rose-500/10',
    border: 'border-rose-200/60 dark:border-rose-800/40',
  },
  {
    gradient: 'from-sky-50 to-cyan-50 dark:from-sky-950/60 dark:to-cyan-950/60',
    accent: 'text-sky-600 dark:text-sky-400',
    accentBg: 'bg-sky-500/10',
    border: 'border-sky-200/60 dark:border-sky-800/40',
  },
  {
    gradient: 'from-lime-50 to-emerald-50 dark:from-lime-950/60 dark:to-emerald-950/60',
    accent: 'text-lime-600 dark:text-lime-400',
    accentBg: 'bg-lime-500/10',
    border: 'border-lime-200/60 dark:border-lime-800/40',
  },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getPalette(manufacturer: string): Palette {
  return PALETTES[hashString(manufacturer) % PALETTES.length];
}

function getIcon(dosageForm: DosageForm): LucideIcon {
  return DOSAGE_ICONS[dosageForm] || Pill;
}

// --- Component ---

export function MedicineImage({
  name,
  dosageForm,
  strength,
  manufacturer,
  isPrescriptionRequired = false,
  size = 'sm',
  className,
}: MedicineImageProps) {
  const palette = getPalette(manufacturer);
  const Icon = getIcon(dosageForm);

  // Compact sizes: cart thumbnail & gallery thumbnail
  if (size === 'xs' || size === 'md') {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-gradient-to-br border rounded-lg',
          palette.gradient, palette.border,
          size === 'xs' ? 'h-16 w-16' : 'h-16 w-16',
          className,
        )}
      >
        <Icon className={cn('h-5 w-5', palette.accent)} />
        <span className="text-[9px] font-semibold text-foreground/60 mt-0.5 line-clamp-1 px-1 text-center leading-tight">
          {name.split(' ')[0]}
        </span>
      </div>
    );
  }

  // Full sizes: product card (sm) & gallery main (lg)
  const isLarge = size === 'lg';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center bg-gradient-to-br relative overflow-hidden aspect-square',
        palette.gradient,
        isLarge && cn('rounded-xl border', palette.border),
        className,
      )}
    >
      {/* Decorative circle */}
      <div
        className={cn(
          'absolute rounded-full',
          palette.accentBg,
          isLarge ? 'h-44 w-44 -top-12 -right-12' : 'h-28 w-28 -top-8 -right-8',
        )}
      />
      <div
        className={cn(
          'absolute rounded-full',
          palette.accentBg,
          isLarge ? 'h-32 w-32 -bottom-10 -left-10' : 'h-20 w-20 -bottom-6 -left-6',
        )}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-3">
        <div className={cn('rounded-2xl flex items-center justify-center', palette.accentBg, isLarge ? 'h-16 w-16 mb-3' : 'h-10 w-10 mb-2')}>
          <Icon className={cn(palette.accent, isLarge ? 'h-8 w-8' : 'h-5 w-5')} />
        </div>
        <p className={cn('font-bold text-foreground leading-tight line-clamp-2', isLarge ? 'text-lg' : 'text-xs')}>
          {name}
        </p>
        <p className={cn('font-semibold mt-0.5', palette.accent, isLarge ? 'text-sm' : 'text-[10px]')}>
          {strength}
        </p>
        <p className={cn('text-muted-foreground mt-1 line-clamp-1', isLarge ? 'text-xs' : 'text-[9px]')}>
          {manufacturer}
        </p>
      </div>

      {/* Rx badge */}
      {isPrescriptionRequired && (
        <div className={cn(
          'absolute bg-secondary/15 text-secondary font-bold rounded-full',
          isLarge ? 'top-3 right-3 text-xs px-2 py-0.5' : 'top-1.5 right-1.5 text-[8px] px-1.5 py-0.5',
        )}>
          Rx
        </div>
      )}
    </div>
  );
}
