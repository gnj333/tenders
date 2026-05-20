import * as React from 'react';

import { cn } from '@/shared/lib';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'border-input bg-surface text-text placeholder:text-text-secondary flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors',
        'outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:ring-[3px]',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/30',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
