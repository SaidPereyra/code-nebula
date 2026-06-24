import type { GitHubRepo } from '@/lib/github/github.types'

const DAY_IN_MS = 24 * 60 * 60 * 1000

export function getRepoActivityScore(repo: GitHubRepo, now = Date.now()): number {
  const activityDate = Date.parse(repo.pushedAt ?? repo.updatedAt)
  if (!Number.isFinite(activityDate)) return 0

  const daysSinceActivity = Math.max(0, (now - activityDate) / DAY_IN_MS)
  return Math.exp(-daysSinceActivity / 180)
}

export function scoreRepo(repo: GitHubRepo, now = Date.now()): number {
  const activityBonus = getRepoActivityScore(repo, now) * 60
  const descriptionBonus = repo.description ? 5 : 0
  const languageBonus = repo.language ? 3 : 0

  return repo.stars * 3 + repo.forks * 2 + activityBonus + descriptionBonus + languageBonus
}
