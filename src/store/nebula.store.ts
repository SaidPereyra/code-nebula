import { create } from 'zustand'
import type { NebulaProfile, NebulaRepo } from '@/lib/github/github.types'
import type { NebbiState } from '@/lib/nebula/companionMessages'
import { resolveNebbiState } from '@/lib/nebula/companionMessages'

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
  exploredRepoIds: number[]
  discoverySequence: number
  lastDiscoveredRepoId: number | null

  // Galaxy summary
  summaryVisible: boolean
  setSummaryVisible: (visible: boolean) => void

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
  exploredRepoIds: [] as number[],
  discoverySequence: 0,
  lastDiscoveredRepoId: null as number | null,
  summaryVisible: false,
  widgetVisible: false,
}

export const useNebulaStore = create<NebulaStore>((set) => ({
  ...initialState,

  setAppState: (state) => set({ appState: state }),
  setProfile: (profile) =>
    set({
      profile,
      selectedRepo: null,
      stardust: 0,
      exploredRepoIds: [],
      discoverySequence: 0,
      lastDiscoveredRepoId: null,
      summaryVisible: false,
      widgetVisible: false,
    }),
  setSelectedRepo: (repo) =>
    set((state) => {
      if (!repo) {
        return {
          selectedRepo: null,
          nebbiState: state.profile?.repos.length === 0 ? 'noRepos' : 'loaded',
        }
      }

      const alreadyExplored = state.exploredRepoIds.includes(repo.id)
      const exploredRepoIds = alreadyExplored
        ? state.exploredRepoIds
        : [...state.exploredRepoIds, repo.id]
      const unlockTarget = Math.min(3, state.profile?.repos.length ?? 3)
      const reachedMilestone =
        !alreadyExplored && unlockTarget > 0 && exploredRepoIds.length === unlockTarget

      return {
        selectedRepo: repo,
        exploredRepoIds,
        stardust: alreadyExplored
          ? state.stardust
          : state.stardust + 10 + Math.round(repo.energyScore * 15),
        discoverySequence: alreadyExplored
          ? state.discoverySequence
          : state.discoverySequence + 1,
        lastDiscoveredRepoId: alreadyExplored ? null : repo.id,
        summaryVisible: reachedMilestone ? true : state.summaryVisible,
        nebbiState: reachedMilestone ? 'galaxySummary' : resolveNebbiState(repo),
      }
    }),
  setError: (error) => set({ error }),
  setNebbiState: (state) => set({ nebbiState: state }),
  setSummaryVisible: (visible) => set({ summaryVisible: visible }),
  setWidgetVisible: (visible) =>
    set((state) => ({
      widgetVisible: visible,
      nebbiState: visible
        ? 'widgetReady'
        : state.selectedRepo
          ? resolveNebbiState(state.selectedRepo)
          : state.profile?.repos.length === 0
            ? 'noRepos'
            : 'loaded',
    })),
  reset: () => set(initialState),
}))
