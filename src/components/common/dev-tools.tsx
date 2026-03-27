'use client';

import { useState } from 'react';
import { reseedDatabase, clearAllData } from '@/lib/mock/seed-initializer';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trash2, Wrench, X } from 'lucide-react';

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV === 'production') return null;

  const handleReseed = () => {
    reseedDatabase();
    window.location.reload();
  };

  const handleClear = () => {
    clearAllData();
    window.location.reload();
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 h-10 w-10 bg-accent text-white rounded-full shadow-lg flex items-center justify-center hover:bg-accent/90 transition-colors"
        aria-label="Dev tools"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Wrench className="h-4 w-4" />}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 z-50 w-56 bg-card border border-border rounded-xl shadow-xl p-3 space-y-2">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dev Tools</p>
          <Button variant="outline" size="sm" fullWidth onClick={handleReseed}>
            <RotateCcw className="h-3.5 w-3.5" /> Reseed Data
          </Button>
          <Button variant="danger" size="sm" fullWidth onClick={handleClear}>
            <Trash2 className="h-3.5 w-3.5" /> Clear All Data
          </Button>
          <p className="text-[10px] text-muted-foreground">Reloads page after action</p>
        </div>
      )}
    </>
  );
}
