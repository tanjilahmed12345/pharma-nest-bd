'use client';

import { Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  // Since no real images, show a placeholder
  return (
    <div className={cn('space-y-3', className)}>
      <div className="aspect-square bg-muted rounded-xl flex items-center justify-center border border-border">
        <Pill className="h-24 w-24 text-muted-foreground/30" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((_, idx) => (
            <div
              key={idx}
              className="h-16 w-16 shrink-0 bg-muted rounded-lg border border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
            >
              <Pill className="h-6 w-6 text-muted-foreground/30" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
