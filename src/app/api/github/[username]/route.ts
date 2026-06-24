import { NextResponse } from 'next/server'
import { fetchGitHubRepos, fetchGitHubUser, GitHubClientError } from '@/lib/github/github.client'
import { mapToNebulaProfile } from '@/lib/github/github.mapper'
import type { GitHubApiErrorResponse } from '@/lib/github/github.types'
import {
  isValidGitHubUsername,
  normalizeGitHubUsername,
} from '@/lib/github/github.validation'

const SUCCESS_CACHE = 'public, max-age=60, s-maxage=900, stale-while-revalidate=3600'
const ERROR_CACHE = 'no-store'

function errorResponse(
  error: GitHubApiErrorResponse['error'],
  status: number
) {
  return NextResponse.json<GitHubApiErrorResponse>(
    { error },
    { status, headers: { 'Cache-Control': ERROR_CACHE } }
  )
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const routeParams = await params
  const username = normalizeGitHubUsername(routeParams.username)

  if (!isValidGitHubUsername(username)) {
    return errorResponse(
      {
        code: 'INVALID_USERNAME',
        message: 'Enter a valid GitHub username.',
      },
      400
    )
  }

  try {
    const user = await fetchGitHubUser(username)
    const repos = await fetchGitHubRepos(username)
    const profile = mapToNebulaProfile(user, repos)

    return NextResponse.json(profile, {
      headers: { 'Cache-Control': SUCCESS_CACHE },
    })
  } catch (error) {
    if (error instanceof GitHubClientError) {
      return errorResponse(
        {
          code: error.code,
          message: error.message,
          ...(error.retryAt ? { retryAt: error.retryAt } : {}),
        },
        error.status
      )
    }

    return errorResponse(
      {
        code: 'GITHUB_UNAVAILABLE',
        message: 'The GitHub signal could not be processed.',
      },
      502
    )
  }
}
