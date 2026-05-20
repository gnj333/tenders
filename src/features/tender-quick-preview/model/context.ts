'use client';

import * as React from 'react';

type Ctx = {
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
};

export const QuickPreviewContext = React.createContext<Ctx | null>(null);

export function useQuickPreview() {
  const ctx = React.useContext(QuickPreviewContext);
  if (!ctx) throw new Error('useQuickPreview must be used within <TenderQuickPreviewProvider>');

  return ctx;
}
