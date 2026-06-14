// Placeholder — implementado en Fase 6
// GET /api/widget/[username]

import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params
  return NextResponse.json(
    { message: `Widget SVG endpoint for ${username} — coming in Phase 6` },
    { status: 501 }
  )
}
