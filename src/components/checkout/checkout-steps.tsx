import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckoutStep {
  id: string;
  label: string;
}

export interface CheckoutStepsProps {
  steps: CheckoutStep[];
  currentStep: string;
  className?: string;
}

export function CheckoutSteps({ steps, currentStep, className }: CheckoutStepsProps) {
  const currentIdx = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors',
                  isCompleted && 'bg-primary border-primary text-white',
                  isCurrent && 'border-primary text-primary bg-primary/5',
                  !isCompleted && !isCurrent && 'border-border text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
              </div>
              <span
                className={cn(
                  'text-[10px] sm:text-[11px] mt-1 font-medium text-center max-w-[60px] sm:max-w-none leading-tight',
                  isCurrent ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  'w-8 md:w-16 h-0.5 mx-1 mt-[-16px]',
                  idx < currentIdx ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
