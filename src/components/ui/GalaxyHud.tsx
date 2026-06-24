'use client'

import { useNebulaStore } from '@/store/nebula.store'

export function GalaxyHud() {
  const profile = useNebulaStore((state) => state.profile)
  const stardust = useNebulaStore((state) => state.stardust)
  const exploredRepoIds = useNebulaStore((state) => state.exploredRepoIds)
  const setSummaryVisible = useNebulaStore((state) => state.setSummaryVisible)

  if (!profile || profile.repos.length === 0) return null

  const unlockTarget = Math.min(3, profile.repos.length)
  const summaryUnlocked = exploredRepoIds.length >= unlockTarget

  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 sm:bottom-8">
      <div className="pointer-events-auto flex items-center justify-between gap-2 rounded-2xl border border-cyan/15 bg-bg/68 p-2 shadow-[0_14px_50px_rgba(2,6,23,0.48)] backdrop-blur-xl sm:rounded-full sm:px-3">
        <div className="flex min-w-0 items-center gap-3 px-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet/30" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet shadow-[0_0_10px_rgba(139,92,246,0.75)]" />
          </span>
          <div className="min-w-0">
            <p className="text-[8px] uppercase tracking-[0.18em] text-text-muted">Stardust</p>
            <p className="font-mono text-xs font-semibold text-text-primary">{stardust}</p>
          </div>
          <div className="h-7 w-px bg-white/10" />
          <div>
            <p className="text-[8px] uppercase tracking-[0.18em] text-text-muted">Explored</p>
            <p className="font-mono text-xs text-text-secondary">
              {exploredRepoIds.length}/{profile.repos.length}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!summaryUnlocked}
          onClick={() => setSummaryVisible(true)}
          className="rounded-xl border border-cyan/20 bg-cyan/8 px-3 py-2 text-[10px] font-semibold text-cyan transition-colors enabled:hover:bg-cyan/15 disabled:cursor-default disabled:border-white/8 disabled:bg-white/[0.025] disabled:text-text-muted sm:rounded-full sm:px-4"
        >
          {summaryUnlocked ? 'Galaxy Summary' : `Scan ${unlockTarget - exploredRepoIds.length} more`}
        </button>
      </div>
    </div>
  )
}
