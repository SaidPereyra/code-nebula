import { fetchGitHubRepos, fetchGitHubUser, GitHubClientError } from '@/lib/github/github.client'
import { mapToNebulaProfile } from '@/lib/github/github.mapper'
import {
  isValidGitHubUsername,
  normalizeGitHubUsername,
} from '@/lib/github/github.validation'
import { generateWidgetErrorSvg, generateWidgetSvg } from '@/lib/widget/widgetSvg'

const SVG_HEADERS = {
  'Content-Type': 'image/svg+xml; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
}

function errorResponse(message: string, status: number) {
  return new Response(generateWidgetErrorSvg(message), {
    status,
    headers: { ...SVG_HEADERS, 'Cache-Control': 'no-store' },
  })
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const routeParams = await params
  const username = normalizeGitHubUsername(routeParams.username)

  if (!isValidGitHubUsername(username)) {
    return errorResponse('Enter a valid GitHub username.', 400)
  }

  try {
    const user = await fetchGitHubUser(username)
    const repos = await fetchGitHubRepos(username)
    const profile = mapToNebulaProfile(user, repos)

    return new Response(generateWidgetSvg(profile), {
      headers: {
        ...SVG_HEADERS,
        'Cache-Control': 'public, max-age=60, s-maxage=900, stale-while-revalidate=3600',
      },
    })
  } catch (error) {
    if (error instanceof GitHubClientError) {
      return errorResponse(error.message, error.status)
    }

    return errorResponse('The GitHub signal could not be processed.', 502)
  }
}
