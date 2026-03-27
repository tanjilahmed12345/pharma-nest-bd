import { Address } from '@/types';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AddressCardProps {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function AddressCard({ address, selected, onSelect, onEdit, onDelete, className }: AddressCardProps) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'p-4 rounded-xl border-2 transition-colors',
        selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30',
        onSelect && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{address.fullName}</span>
            {address.isDefault && <Badge variant="primary">Default</Badge>}
          </div>
          <p className="text-sm text-muted-foreground flex items-start gap-1.5">
            <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <span>
              {address.houseFlat}, {address.addressLine}, {address.area}, {address.upazila}, {address.district}, {address.division} - {address.postcode}
            </span>
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            {address.phone}
          </p>
          {address.deliveryNote && (
            <p className="text-xs text-muted-foreground mt-1 italic">Note: {address.deliveryNote}</p>
          )}
        </div>
      </div>

      {(onEdit || onDelete) && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border">
          {onEdit && (
            <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="text-xs text-primary hover:underline">
              Edit
            </button>
          )}
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-xs text-danger hover:underline">
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
