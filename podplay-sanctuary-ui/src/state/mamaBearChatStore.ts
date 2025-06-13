import { create } from 'zustand';

interface MamaBearChatState {
  overlayVisible: boolean;
  toggleOverlay: () => void;
}

export const useMamaBearChatStore = create<MamaBearChatState>()((set) => ({
  overlayVisible: false,
  toggleOverlay: () => set((state) => ({ overlayVisible: !state.overlayVisible })),
}));