import type { NebulaRepo } from '@/lib/github/github.types'

export type NebbiState =
  | 'idle'
  | 'loading'
  | 'loaded'
  | 'planetSelected'
  | 'activeRepo'
  | 'popularRepo'
  | 'dormantRepo'
  | 'galaxySummary'
  | 'widgetReady'
  | 'error'
  | 'noRepos'

export const companionMessages: Record<NebbiState, string[]> = {
  idle: [
    'Enter a GitHub username and I’ll scan the code sector.',
    'I’m ready to explore. Give me a username to scan.',
  ],
  loading: [
    'Scanning GitHub signals...',
    'Calibrating orbit paths...',
    'Mapping the code sector...',
  ],
  loaded: [
    'Orbit paths calculated. Your galaxy is ready.',
    'I found the system. Select a planet and I’ll scan it.',
    'Repository signals are stable. Let’s explore.',
  ],
  planetSelected: [
    'Scanning repository structure and activity signals.',
    'Data stream open. This planet has a stable signature.',
    'Repository telemetry acquired.',
  ],
  activeRepo: [
    'Strong commit energy detected. This planet is highly active.',
    'Recent activity is keeping this world in motion.',
    'Fresh development signals are radiating from this repository.',
  ],
  popularRepo: [
    'High star density detected. This planet has serious gravity.',
    'Other developers are orbiting this signal. It stands out.',
    'Popular repository signature confirmed.',
  ],
  dormantRepo: [
    'Low activity detected. This planet has entered a quiet cycle.',
    'The signal is calm, but its history is still visible.',
    'Dormant orbit confirmed. This repository has been resting.',
  ],
  galaxySummary: [
    'Three planetary signals mapped. Your galaxy summary is ready.',
    'Exploration milestone reached. I assembled your sector report.',
  ],
  widgetReady: [
    'Your nebula signal is ready to share.',
    'README beacon generated.',
  ],
  error: [
    'Signal lost. The sector might not exist.',
    'Something went wrong in deep space. Try again.',
  ],
  noRepos: [
    'I found a quiet sector. This profile has no public planets yet.',
    'Empty orbit paths. No public repositories detected.',
  ],
}

export function resolveNebbiState(repo: NebulaRepo): NebbiState {
  if (repo.stars >= 100) return 'popularRepo'
  if (repo.activityScore >= 0.65) return 'activeRepo'
  if (repo.activityScore <= 0.35) return 'dormantRepo'
  return 'planetSelected'
}

export function getCompanionMessage(state: NebbiState, seed = 0): string {
  const messages = companionMessages[state]
  const index = Math.abs(seed * 31 + state.length * 7) % messages.length
  return messages[index]
}
