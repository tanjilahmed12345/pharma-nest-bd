import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

export function CartEmpty() {
  return (
    <EmptyState
      icon={<ShoppingCart className="h-12 w-12" />}
      title="Your cart is empty"
      description="Looks like you haven't added any medicines to your cart yet."
      action={
        <Link href="/shop">
          <Button>Browse Medicines</Button>
        </Link>
      }
    />
  );
}
