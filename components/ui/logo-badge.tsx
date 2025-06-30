'use client';

import { BarChart3 } from 'lucide-react';

export function LogoBadge() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-full px-3 py-2 shadow-lg">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
          <BarChart3 className="h-3 w-3 text-primary-foreground" />
        </div>
        <span className="text-xs font-medium text-foreground">Fintracker</span>
      </div>
    </div>
  );
}