'use client';

import * as React from 'react';

/**
 * Returns a debounced version of `value` that only updates after `delay` ms
 * have passed without further changes.
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = React.useState(value);

  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
