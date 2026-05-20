'use client';

import { create } from 'zustand';

type UiState = {
  sidebarOpen: boolean;
  commandOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  commandOpen: false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
