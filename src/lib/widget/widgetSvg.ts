import type { NebulaProfile } from '@/lib/github/github.types'

const PLANET_POSITIONS = [
  [475, 76],
  [548, 128],
  [640, 76],
  [690, 155],
  [575, 184],
  [735, 112],
] as const

function escapeXml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&apos;',
      '"': '&quot;',
    }
    return entities[character]
  })
}

export function generateWidgetSvg(profile: NebulaProfile): string {
  const username = escapeXml(profile.user.login)
  const topLanguage = escapeXml(profile.summary.topLanguage)
  const planets = profile.repos
    .map((repo, index) => {
      const [x, y] = PLANET_POSITIONS[index]
      const radius = 5 + repo.energyScore * 5
      return `<circle cx="${x}" cy="${y}" r="${radius.toFixed(1)}" fill="${repo.theme.primary}" opacity="0.9" filter="url(#planetGlow)"/>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="240" viewBox="0 0 800 240" role="img" aria-label="Code Nebula galaxy for ${username}">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#020617"/>
      <stop offset="1" stop-color="#071426"/>
    </linearGradient>
    <radialGradient id="star" cx="50%" cy="45%" r="55%">
      <stop offset="0" stop-color="#fff7d6"/>
      <stop offset="0.42" stop-color="#f59e0b"/>
      <stop offset="1" stop-color="#ea580c"/>
    </radialGradient>
    <filter id="planetGlow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="2.2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="800" height="240" rx="24" fill="url(#background)"/>
  <rect x="0.5" y="0.5" width="799" height="239" rx="23.5" fill="none" stroke="#38bdf8" stroke-opacity="0.16"/>
  <circle cx="742" cy="34" r="1.2" fill="#e0f2fe" opacity="0.7"/>
  <circle cx="430" cy="42" r="1" fill="#c4b5fd" opacity="0.65"/>
  <circle cx="515" cy="208" r="1.1" fill="#67e8f9" opacity="0.55"/>
  <text x="40" y="45" fill="#67e8f9" font-family="ui-monospace, SFMono-Regular, monospace" font-size="11" font-weight="700" letter-spacing="2.4">CODE NEBULA</text>
  <text x="40" y="86" fill="#e5f0ff" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="700">${username}</text>
  <text x="40" y="111" fill="#94a3b8" font-family="Inter, Arial, sans-serif" font-size="13">Living GitHub galaxy signal</text>
  <text x="40" y="160" fill="#64748b" font-family="Inter, Arial, sans-serif" font-size="11">TOP LANGUAGE</text>
  <text x="40" y="182" fill="#e5f0ff" font-family="ui-monospace, SFMono-Regular, monospace" font-size="15" font-weight="700">${topLanguage}</text>
  <text x="185" y="160" fill="#64748b" font-family="Inter, Arial, sans-serif" font-size="11">STARS</text>
  <text x="185" y="182" fill="#e5f0ff" font-family="ui-monospace, SFMono-Regular, monospace" font-size="15" font-weight="700">${profile.summary.totalStars}</text>
  <text x="275" y="160" fill="#64748b" font-family="Inter, Arial, sans-serif" font-size="11">ACTIVE REPOS</text>
  <text x="275" y="182" fill="#e5f0ff" font-family="ui-monospace, SFMono-Regular, monospace" font-size="15" font-weight="700">${profile.summary.activeRepos}</text>
  <g opacity="0.42" fill="none" stroke="#38bdf8" stroke-width="0.7">
    <ellipse cx="610" cy="120" rx="76" ry="32"/>
    <ellipse cx="610" cy="120" rx="124" ry="55"/>
    <ellipse cx="610" cy="120" rx="166" ry="78"/>
  </g>
  <circle cx="610" cy="120" r="20" fill="url(#star)" filter="url(#planetGlow)"/>
  ${planets}
</svg>`
}

export function generateWidgetErrorSvg(message: string): string {
  const safeMessage = escapeXml(message)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="240" viewBox="0 0 800 240" role="img" aria-label="Code Nebula error">
  <rect width="800" height="240" rx="24" fill="#020617"/>
  <rect x="0.5" y="0.5" width="799" height="239" rx="23.5" fill="none" stroke="#fb7185" stroke-opacity="0.28"/>
  <text x="40" y="92" fill="#fb7185" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" font-weight="700" letter-spacing="2">SIGNAL UNAVAILABLE</text>
  <text x="40" y="132" fill="#e5f0ff" font-family="Inter, Arial, sans-serif" font-size="18">${safeMessage}</text>
</svg>`
}
