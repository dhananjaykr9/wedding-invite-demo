// frontend/lib/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // The "Elder Mode" State
  isSadhaMode: boolean;
  toggleSadhaMode: () => void;
  
  // Audio State (Muted by default)
  isMuted: boolean;
  toggleMute: () => void;
}

// frontend/lib/store.ts
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isSadhaMode: true, // Now this will correctly default to true
      isMuted: true,
      
      toggleSadhaMode: () => set((state) => ({ isSadhaMode: !state.isSadhaMode })),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    }),
    {
      // Renaming the key forces a fresh start without migration errors
      name: 'reshimgaath-v2', 
    }
  )
);