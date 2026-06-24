'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { NebulaCanvas } from './NebulaCanvas'
import type { ExperienceStage } from './NebulaCanvas'
import { GalaxyHud } from '@/components/ui/GalaxyHud'
import { RepoPanel } from '@/components/ui/RepoPanel'
import { GalaxySummary } from '@/components/ui/GalaxySummary'
import { WidgetPreview } from '@/components/ui/WidgetPreview'
import type { NebulaProfile } from '@/lib/github/github.types'
import { useNebulaStore } from '@/store/nebula.store'

interface NebulaExperienceProps {
  username: string
  profile: NebulaProfile
  playIntro: boolean
}

const INTRO_DURATION = 4200

const stageCopy: Record<Exclude<ExperienceStage, 'explore'>, string> = {
  'milky-way': 'Locating your code signature',
  approach: 'Entering your code sector',
  reveal: 'Nebula lock acquired',
}

const stageProgress: Record<Exclude<ExperienceStage, 'explore'>, number> = {
  'milky-way': 18,
  approach: 72,
  reveal: 100,
}

export function NebulaExperience({ username, profile, playIntro }: NebulaExperienceProps) {
  const [stage, setStage] = useState<ExperienceStage>(playIntro ? 'milky-way' : 'explore')
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const startedAtRef = useRef<number | null>(null)
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()
  const setNebbiState = useNebulaStore((state) => state.setNebbiState)
  const setSelectedRepo = useNebulaStore((state) => state.setSelectedRepo)
  const readyNebbiState = profile.repos.length > 0 ? 'loaded' : 'noRepos'

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const finishIntro = useCallback(() => {
    clearTimers()
    setStage('explore')
    setNebbiState(readyNebbiState)

    const url = new URL(window.location.href)
    url.searchParams.delete('intro')
    const cleanUrl = `${pathname}${url.search}${url.hash}`
    window.history.replaceState(null, '', cleanUrl)
  }, [clearTimers, pathname, readyNebbiState, setNebbiState])

  useEffect(() => {
    setSelectedRepo(null)
    setNebbiState(playIntro ? 'loading' : readyNebbiState)
  }, [playIntro, readyNebbiState, setNebbiState, setSelectedRepo])

  useEffect(() => {
    if (!playIntro) return

    startedAtRef.current = performance.now()

    if (reduceMotion) {
      timersRef.current = [
        setTimeout(() => setStage('reveal'), 40),
        setTimeout(finishIntro, 420),
      ]
    } else {
      timersRef.current = [
        setTimeout(() => setStage('approach'), 650),
        setTimeout(() => setStage('reveal'), 3400),
        setTimeout(finishIntro, INTRO_DURATION),
      ]
    }

    return clearTimers
  }, [clearTimers, finishIntro, playIntro, reduceMotion])

  const introActive = stage !== 'explore'

  return (
    <main className="relative h-screen w-full overflow-hidden bg-bg text-text-primary">
      <NebulaCanvas
        profile={profile}
        stage={stage}
        startedAtRef={startedAtRef}
        reducedMotion={Boolean(reduceMotion)}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(circle_at_center,rgba(255,244,214,0.98)_0%,rgba(236,72,153,0.32)_24%,rgba(2,6,23,0)_68%)]"
        animate={{ opacity: stage === 'reveal' ? 1 : 0 }}
        transition={{ duration: stage === 'reveal' ? 0.32 : 0.5, ease: 'easeOut' }}
      />

      {introActive ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-5 sm:p-8">
          <div className="flex items-start justify-between">
            <div className="rounded-full border border-white/10 bg-bg/35 px-4 py-2 backdrop-blur-xl">
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-text-secondary">
                Code Nebula
              </span>
            </div>
            <button
              type="button"
              onClick={finishIntro}
              className="pointer-events-auto rounded-full border border-white/10 bg-bg/40 px-4 py-2 text-xs font-medium text-text-secondary backdrop-blur-xl transition-colors hover:border-cyan/30 hover:text-text-primary"
            >
              Skip intro
            </button>
          </div>

          <div className="mx-auto mb-8 w-full max-w-md text-center sm:mb-10" aria-live="polite">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-cyan/70">
              GitHub signal · {username}
            </p>
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium tracking-wide text-text-primary sm:text-base"
            >
              {stageCopy[stage]}
            </motion.p>
            <div className="mx-auto mt-5 h-px w-48 overflow-hidden bg-white/10 sm:w-64">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan via-violet to-pink shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                animate={{ width: `${stageProgress[stage]}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
          <div className="flex w-full items-start justify-between p-4 sm:p-6">
            <div className="pointer-events-auto flex items-center gap-4">
              <Link
                href="/"
                aria-label="Back to home"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-glass bg-bg/55 text-text-muted backdrop-blur-xl transition-all hover:border-cyan/40 hover:text-text-primary sm:h-10 sm:w-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </Link>
              <div className="rounded-xl border border-border-glass bg-bg/55 px-4 py-2 shadow-[0_10px_30px_rgba(2,6,23,0.3)] backdrop-blur-xl sm:px-5 sm:py-2.5">
                <span className="mr-2 text-[10px] font-medium uppercase tracking-widest text-text-secondary opacity-70">
                  Sector
                </span>
                <span className="bg-gradient-to-r from-cyan to-blue bg-clip-text text-sm font-bold text-transparent">
                  {username}
                </span>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto">
            <RepoPanel />
          </div>

          <GalaxySummary />
          <WidgetPreview username={username} />

          {profile.repos.length === 0 && (
            <div className="pointer-events-none absolute inset-x-4 top-24 flex justify-center sm:top-28">
              <div className="max-w-sm rounded-2xl border border-white/10 bg-bg/60 px-5 py-4 text-center shadow-[0_18px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan/70">
                  Quiet sector
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  No public repositories were detected. This star is waiting for its first planet.
                </p>
              </div>
            </div>
          )}

          {profile.repos.length > 0 && <GalaxyHud />}
        </div>
      )}
    </main>
  )
}
