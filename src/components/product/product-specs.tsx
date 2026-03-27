'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { Tabs, Tab } from '@/components/ui/tabs';

export interface ProductSpecsProps {
  product: Product;
}

const tabList: Tab[] = [
  { id: 'description', label: 'Description' },
  { id: 'dosage', label: 'Dosage' },
  { id: 'side-effects', label: 'Side Effects' },
  { id: 'warnings', label: 'Warnings' },
  { id: 'storage', label: 'Storage' },
];

export function ProductSpecs({ product }: ProductSpecsProps) {
  const [active, setActive] = useState('description');

  const content: Record<string, string | undefined> = {
    description: product.description,
    dosage: product.dosageInstructions,
    'side-effects': product.sideEffects,
    warnings: product.warnings,
    storage: product.storageInfo,
  };

  return (
    <div>
      <Tabs tabs={tabList} activeTab={active} onChange={setActive} />
      <div className="py-4 text-sm text-foreground leading-relaxed min-h-[80px]">
        {content[active] || (
          <span className="text-muted-foreground">No information available.</span>
        )}
      </div>
    </div>
  );
}
