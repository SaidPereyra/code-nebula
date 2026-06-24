'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { formatNumber } from '@/lib/utils/format'
import { useNebulaStore } from '@/store/nebula.store'

export function GalaxySummary() {
  const profile = useNebulaStore((state) => state.profile)
  const stardust = useNebulaStore((state) => state.stardust)
  const exploredRepoIds = useNebulaStore((state) => state.exploredRepoIds)
  const visible = useNebulaStore((state) => state.summaryVisible)
  const setSummaryVisible = useNebulaStore((state) => state.setSummaryVisible)
  const setWidgetVisible = useNebulaStore((state) => state.setWidgetVisible)

  if (!profile) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          aria-label="Galaxy summary"
          className="pointer-events-auto absolute left-4 top-20 z-30 w-[calc(100vw-2rem)] max-w-[20rem] rounded-2xl border border-cyan/15 bg-bg/82 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.62)] backdrop-blur-xl sm:left-6 sm:top-24"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-cyan/70">
                Galaxy summary
              </p>
              <h2 className="mt-2 text-lg font-semibold text-text-primary">
                Sector mapped
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setSummaryVisible(false)}
              aria-label="Close galaxy summary"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-muted transition-colors hover:text-text-primary"
            >
              ×
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            {[
              ['Top language', profile.summary.topLanguage],
              ['Stars', formatNumber(profile.summary.totalStars)],
              ['Forks', formatNumber(profile.summary.totalForks)],
              ['Active repos', String(profile.summary.activeRepos)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/8 bg-white/[0.035] p-3">
                <p className="text-[9px] uppercase tracking-wider text-text-muted">{label}</p>
                <p className="mt-1 truncate font-mono text-sm font-semibold text-text-primary">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl border border-violet/15 bg-violet/5 px-3.5 py-3">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-text-muted">Explored</p>
              <p className="mt-1 font-mono text-sm text-text-primary">
                {exploredRepoIds.length}/{profile.repos.length} planets
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wider text-text-muted">Stardust</p>
              <p className="mt-1 font-mono text-sm font-semibold text-violet">{stardust}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSummaryVisible(false)
              setWidgetVisible(true)
            }}
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-cyan/25 bg-cyan/10 text-sm font-semibold text-cyan transition-all hover:border-cyan/40 hover:bg-cyan/15"
          >
            Generate README Widget
            <span aria-hidden>↗</span>
          </button>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
