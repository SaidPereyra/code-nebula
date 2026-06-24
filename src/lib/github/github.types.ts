// GitHub & Nebula domain types — Code Nebula v1
// Definidos en PROJECT_CONTEXT.md §7

export type GitHubUser = {
  login: string
  name: string | null
  avatarUrl: string
  htmlUrl: string
  publicRepos: number
  followers: number
  following: number
}

export type GitHubRepo = {
  id: number
  name: string
  fullName: string
  description: string | null
  htmlUrl: string
  language: string | null
  stars: number
  forks: number
  openIssues: number
  updatedAt: string
  pushedAt: string | null
  isFork: boolean
}

export type LanguageTheme = {
  primary: string
  secondary: string
  emissive: string
  label: string
}

export type NebulaRepo = {
  id: number
  name: string
  description: string | null
  url: string
  language: string
  stars: number
  forks: number
  updatedAt: string
  sizeScore: number
  activityScore: number
  energyScore: number
  orbitRadius: number
  orbitSpeed: number
  planetRadius: number
  theme: LanguageTheme
  isProfileRepo?: boolean
  pageUrl?: string
}

export type NebulaSummary = {
  username: string
  totalStars: number
  totalForks: number
  topLanguage: string
  activeRepos: number
  dominantEnergy: 'dormant' | 'stable' | 'active' | 'supernova'
}

export type NebulaProfile = {
  user: GitHubUser
  repos: NebulaRepo[]
  summary: NebulaSummary
}

export type GitHubApiErrorCode =
  | 'INVALID_USERNAME'
  | 'USER_NOT_FOUND'
  | 'RATE_LIMITED'
  | 'GITHUB_UNAVAILABLE'

export type GitHubApiErrorResponse = {
  error: {
    code: GitHubApiErrorCode
    message: string
    retryAt?: string
  }
}
