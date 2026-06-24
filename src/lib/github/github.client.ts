import 'server-only'

import type {
  GitHubApiErrorCode,
  GitHubRepo,
  GitHubUser,
} from './github.types'

const GITHUB_API_URL = 'https://api.github.com'
const CACHE_SECONDS = 15 * 60

type GitHubUserResponse = {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  following: number
}

type GitHubRepoResponse = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  updated_at: string
  pushed_at: string | null
  fork: boolean
}

export class GitHubClientError extends Error {
  constructor(
    message: string,
    readonly code: GitHubApiErrorCode,
    readonly status: number,
    readonly retryAt?: string
  ) {
    super(message)
    this.name = 'GitHubClientError'
  }
}

function getRequestHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'code-nebula',
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  return headers
}

function getRetryAt(response: Response): string | undefined {
  const retryAfter = Number(response.headers.get('retry-after'))
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return new Date(Date.now() + retryAfter * 1000).toISOString()
  }

  const rateLimitReset = Number(response.headers.get('x-ratelimit-reset'))
  if (Number.isFinite(rateLimitReset) && rateLimitReset > 0) {
    return new Date(rateLimitReset * 1000).toISOString()
  }

  return undefined
}

async function fetchGitHub<T>(path: string, notFoundCode?: GitHubApiErrorCode): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${GITHUB_API_URL}${path}`, {
      headers: getRequestHeaders(),
      next: { revalidate: CACHE_SECONDS },
    })
  } catch {
    throw new GitHubClientError(
      'GitHub is not responding right now. Try again in a moment.',
      'GITHUB_UNAVAILABLE',
      502
    )
  }

  if (response.ok) return response.json() as Promise<T>

  if (response.status === 404 && notFoundCode) {
    throw new GitHubClientError(
      'We could not find that GitHub user.',
      notFoundCode,
      404
    )
  }

  if (response.status === 429 || response.status === 403) {
    throw new GitHubClientError(
      'GitHub reached its request limit. Try again when the signal resets.',
      'RATE_LIMITED',
      429,
      getRetryAt(response)
    )
  }

  throw new GitHubClientError(
    'GitHub data is temporarily unavailable.',
    'GITHUB_UNAVAILABLE',
    502
  )
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const user = await fetchGitHub<GitHubUserResponse>(
    `/users/${encodeURIComponent(username)}`,
    'USER_NOT_FOUND'
  )

  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    htmlUrl: user.html_url,
    publicRepos: user.public_repos,
    followers: user.followers,
    following: user.following,
  }
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const repos = await fetchGitHub<GitHubRepoResponse[]>(
    `/users/${encodeURIComponent(username)}/repos?type=owner&sort=updated&direction=desc&per_page=100`
  )

  return repos.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    isFork: repo.fork,
  }))
}
