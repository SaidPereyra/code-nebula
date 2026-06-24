'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type {
  GitHubApiErrorResponse,
  NebulaProfile,
} from '@/lib/github/github.types'
import { useNebulaStore } from '@/store/nebula.store'
import { NebulaExperience } from './NebulaExperience'

interface NebulaProfileLoaderProps {
  username: string
  playIntro: boolean
}

type RequestError = GitHubApiErrorResponse['error']

function LoadingSignal({ username }: { username: string }) {
  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-bg px-6 text-text-primary">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.11),transparent_42%)]" />
      <div className="absolute h-64 w-64 animate-pulse rounded-full border border-cyan/10 shadow-[0_0_100px_rgba(34,211,238,0.08)]" />
      <div className="relative text-center" aria-live="polite" aria-busy="true">
        <div className="mx-auto mb-7 h-12 w-12 rounded-full border border-white/10 border-t-cyan shadow-[0_0_24px_rgba(34,211,238,0.28)] motion-safe:animate-spin" />
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan/70">
          GitHub signal · {username}
        </p>
        <h1 className="text-lg font-semibold">Scanning public repositories</h1>
        <p className="mt-2 text-sm text-text-muted">Nebbi is mapping your code sector.</p>
      </div>
    </main>
  )
}

function ErrorSignal({
  error,
  onRetry,
}: {
  error: RequestError
  onRetry: () => void
}) {
  const canRetry = error.code === 'RATE_LIMITED' || error.code === 'GITHUB_UNAVAILABLE'
  const retryTime = error.retryAt
    ? new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(
        new Date(error.retryAt)
      )
    : null

  return (
    <main className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-bg px-5 text-text-primary">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12),transparent_48%)]" />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-surface-glass p-7 text-center shadow-[0_28px_90px_rgba(2,6,23,0.65)] backdrop-blur-xl"
      >
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet/20 bg-violet/10 text-violet">
          <span aria-hidden className="text-xl">×</span>
        </div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-violet/75">
          Signal unavailable
        </p>
        <h1 className="text-xl font-semibold">Nebbi could not map this sector</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">{error.message}</p>
        {retryTime && (
          <p className="mt-2 font-mono text-xs text-text-muted">Signal reset: {retryTime}</p>
        )}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {canRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-xl border border-cyan/25 bg-cyan/10 px-5 py-2.5 text-sm font-semibold text-cyan transition-colors hover:bg-cyan/15"
            >
              Scan again
            </button>
          )}
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
          >
            Change username
          </Link>
        </div>
      </motion.div>
    </main>
  )
}

export function NebulaProfileLoader({ username, playIntro }: NebulaProfileLoaderProps) {
  const [profile, setProfile] = useState<NebulaProfile | null>(null)
  const [requestError, setRequestError] = useState<RequestError | null>(null)
  const [attempt, setAttempt] = useState(0)
  const setAppState = useNebulaStore((state) => state.setAppState)
  const setStoreProfile = useNebulaStore((state) => state.setProfile)
  const setStoreError = useNebulaStore((state) => state.setError)
  const setNebbiState = useNebulaStore((state) => state.setNebbiState)
  const setSelectedRepo = useNebulaStore((state) => state.setSelectedRepo)

  const retry = () => {
    setProfile(null)
    setRequestError(null)
    setAttempt((value) => value + 1)
  }

  useEffect(() => {
    const controller = new AbortController()

    setAppState('loading')
    setStoreProfile(null)
    setStoreError(null)
    setNebbiState('loading')
    setSelectedRepo(null)

    async function loadProfile() {
      try {
        const response = await fetch(`/api/github/${encodeURIComponent(username)}`, {
          signal: controller.signal,
        })
        const payload = (await response.json()) as NebulaProfile | GitHubApiErrorResponse

        if (!response.ok) {
          const error = 'error' in payload
            ? payload.error
            : { code: 'GITHUB_UNAVAILABLE' as const, message: 'The signal could not be read.' }
          setRequestError(error)
          setAppState('error')
          setStoreError(error.message)
          setNebbiState('error')
          return
        }

        const loadedProfile = payload as NebulaProfile
        setProfile(loadedProfile)
        setRequestError(null)
        setStoreProfile(loadedProfile)
        setAppState('loaded')
        setNebbiState(loadedProfile.repos.length > 0 ? 'loaded' : 'noRepos')
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return

        const unavailableError: RequestError = {
          code: 'GITHUB_UNAVAILABLE',
          message: 'The GitHub signal was interrupted. Check your connection and try again.',
        }
        setRequestError(unavailableError)
        setAppState('error')
        setStoreError(unavailableError.message)
        setNebbiState('error')
      }
    }

    void loadProfile()
    return () => controller.abort()
  }, [
    attempt,
    setAppState,
    setNebbiState,
    setSelectedRepo,
    setStoreError,
    setStoreProfile,
    username,
  ])

  if (requestError) {
    return <ErrorSignal error={requestError} onRetry={retry} />
  }

  if (!profile) return <LoadingSignal username={username} />

  return (
    <NebulaExperience
      username={profile.user.login}
      profile={profile}
      playIntro={playIntro}
    />
  )
}
