'use client';

import * as React from 'react';

import { QuickPreviewContext } from '../model/context';

import { TenderQuickPreviewDialog } from './tender-quick-preview-dialog';

/**
 * Provides quick-preview state to descendants. Mounts a single Dialog that
 * lazily fetches the selected tender on demand via `useTenderQuery`.
 */
export function TenderQuickPreviewProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  const value = React.useMemo(
    () => ({
      openId,
      open: (id: string) => setOpenId(id),
      close: () => setOpenId(null),
    }),
    [openId],
  );

  return (
    <QuickPreviewContext.Provider value={value}>
      {children}
      <TenderQuickPreviewDialog />
    </QuickPreviewContext.Provider>
  );
}
