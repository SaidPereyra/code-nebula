const GITHUB_USERNAME_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i

export function normalizeGitHubUsername(username: string): string {
  return username.trim().toLowerCase()
}

export function isValidGitHubUsername(username: string): boolean {
  return GITHUB_USERNAME_PATTERN.test(normalizeGitHubUsername(username))
}
