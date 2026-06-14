import { create } from 'zustand'
import type { NebulaProfile, NebulaRepo } from '@/lib/github/github.types'
import type { NebbiState } from '@/lib/nebula/companionMessages'

type AppState = 'idle' | 'loading' | 'loaded' | 'error'

interface NebulaStore {
  // App state
  appState: AppState
  setAppState: (state: AppState) => void

  // Profile data
  profile: NebulaProfile | null
  setProfile: (profile: NebulaProfile | null) => void

  // Selected planet/repo
  selectedRepo: NebulaRepo | null
  setSelectedRepo: (repo: NebulaRepo | null) => void

  // Error
  error: string | null
  setError: (error: string | null) => void

  // Nebbi state
  nebbiState: NebbiState
  setNebbiState: (state: NebbiState) => void

  // Stardust score (fase 5)
  stardust: number
  addStardust: (amount: number) => void

  // Widget preview visible
  widgetVisible: boolean
  setWidgetVisible: (visible: boolean) => void

  // Reset
  reset: () => void
}

const initialState = {
  appState: 'idle' as AppState,
  profile: null,
  selectedRepo: null,
  error: null,
  nebbiState: 'idle' as NebbiState,
  stardust: 0,
  widgetVisible: false,
}

export const useNebulaStore = create<NebulaStore>((set) => ({
  ...initialState,

  setAppState: (state) => set({ appState: state }),
  setProfile: (profile) => set({ profile }),
  setSelectedRepo: (repo) => set({ selectedRepo: repo }),
  setError: (error) => set({ error }),
  setNebbiState: (state) => set({ nebbiState: state }),
  addStardust: (amount) =>
    set((s) => ({ stardust: s.stardust + amount })),
  setWidgetVisible: (visible) => set({ widgetVisible: visible }),
  reset: () => set(initialState),
}))
