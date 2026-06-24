import type {
  GitHubRepo,
  GitHubUser,
  NebulaProfile,
  NebulaRepo,
  NebulaSummary,
} from './github.types'
import { getLanguageTheme } from '@/lib/nebula/languageTheme'
import { getRepoActivityScore, scoreRepo } from '@/lib/nebula/repoScoring'

const MAX_PLANETS = 6
const ACTIVE_REPO_DAYS = 90
const DAY_IN_MS = 24 * 60 * 60 * 1000

function normalize(value: number, min: number, max: number): number {
  if (max === min) return max === 0 ? 0 : 0.5
  return (value - min) / (max - min)
}

function getTopLanguage(repos: GitHubRepo[]): string {
  const counts = new Map<string, number>()

  repos.forEach((repo) => {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
  })

  return [...counts.entries()].sort(
    ([languageA, countA], [languageB, countB]) =>
      countB - countA || languageA.localeCompare(languageB)
  )[0]?.[0] ?? 'Unknown'
}

function getDominantEnergy(
  averageEnergy: number,
  recentRepoSignals: number
): NebulaSummary['dominantEnergy'] {
  if (averageEnergy >= 0.8) return 'supernova'
  if (recentRepoSignals >= 2 || averageEnergy >= 0.55) return 'active'
  if (averageEnergy < 0.25) return 'dormant'
  return 'stable'
}

export function mapToNebulaProfile(
  user: GitHubUser,
  repositories: GitHubRepo[],
  now = Date.now()
): NebulaProfile {
  const profileRepoName = `${user.login}.github.io`.toLowerCase()
  const isProfileRepo = (repo: GitHubRepo) => repo.name.toLowerCase() === profileRepoName
  const rankedRepos = [...repositories].sort(
    (repoA, repoB) =>
      Number(isProfileRepo(repoB)) - Number(isProfileRepo(repoA)) ||
      Number(repoA.isFork) - Number(repoB.isFork) ||
      getRepoActivityScore(repoB, now) - getRepoActivityScore(repoA, now) ||
      scoreRepo(repoB, now) - scoreRepo(repoA, now) ||
      repoA.id - repoB.id
  )
  const selectedRepos = rankedRepos.slice(0, MAX_PLANETS)
  const popularityValues = selectedRepos.map((repo) => Math.log1p(repo.stars + repo.forks * 2))
  const minPopularity = popularityValues.length ? Math.min(...popularityValues) : 0
  const maxPopularity = popularityValues.length ? Math.max(...popularityValues) : 0

  const repos: NebulaRepo[] = selectedRepos.map((repo, index) => {
    const popularity = Math.log1p(repo.stars + repo.forks * 2)
    const sizeScore = normalize(popularity, minPopularity, maxPopularity)
    const activityScore = getRepoActivityScore(repo, now)
    const energyScore = activityScore * 0.58 + sizeScore * 0.42

    return {
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.htmlUrl,
      language: repo.language ?? 'Unknown',
      stars: repo.stars,
      forks: repo.forks,
      updatedAt: repo.updatedAt,
      sizeScore,
      activityScore,
      energyScore,
      orbitRadius: 4 + index * 2.5,
      orbitSpeed: 0.1 + activityScore * 0.22,
      planetRadius: 0.52 + energyScore * 0.28,
      theme: getLanguageTheme(repo.language),
      isProfileRepo: isProfileRepo(repo),
      ...(isProfileRepo(repo) ? { pageUrl: `https://${repo.name.toLowerCase()}` } : {}),
    }
  })

  const summaryRepos = repositories.filter((repo) => !repo.isFork)
  const profileRepos = summaryRepos.length > 0 ? summaryRepos : repositories
  const averageEnergy = repos.length
    ? repos.reduce((total, repo) => total + repo.energyScore, 0) / repos.length
    : 0
  const recentRepoSignals = profileRepos.filter((repo) => {
    const date = Date.parse(repo.pushedAt ?? repo.updatedAt)
    return Number.isFinite(date) && now - date <= 30 * DAY_IN_MS
  }).length

  return {
    user,
    repos,
    summary: {
      username: user.login,
      totalStars: profileRepos.reduce((total, repo) => total + repo.stars, 0),
      totalForks: profileRepos.reduce((total, repo) => total + repo.forks, 0),
      topLanguage: getTopLanguage(profileRepos),
      activeRepos: profileRepos.filter((repo) => {
        const date = Date.parse(repo.pushedAt ?? repo.updatedAt)
        return Number.isFinite(date) && now - date <= ACTIVE_REPO_DAYS * DAY_IN_MS
      }).length,
      dominantEnergy: getDominantEnergy(averageEnergy, recentRepoSignals),
    },
  }
}
