// Placeholder — implementado en Fase 4
// GET /api/github/[username]

import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  return NextResponse.json(
    { message: `GitHub API endpoint for ${username} — coming in Phase 4` },
    { status: 501 }
  )
}
