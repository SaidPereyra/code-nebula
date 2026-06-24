import type { LanguageTheme, NebulaProfile, NebulaRepo } from '@/lib/github/github.types'
import { getLanguageTheme } from '@/lib/nebula/languageTheme'

const WIDGET_WIDTH = 800
const WIDGET_HEIGHT = 240
const SYSTEM_CENTER_X = 610
const SYSTEM_CENTER_Y = 120
const MAX_LABEL_LENGTH = 14

const DOMINANT_ENERGY_LABEL: Record<NebulaProfile['summary']['dominantEnergy'], string> = {
  dormant: 'DORMANT',
  stable: 'STABLE',
  active: 'ACTIVE',
  supernova: 'SUPERNOVA',
}

const STAR_COLORS = ['#e0f2fe', '#c4b5fd', '#67e8f9', '#fde68a', '#bae6fd', '#a5f3fc', '#fbcfe8']

function createSeededRandom(seed: number): () => number {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

function renderBackgroundStars(seed: number, count: number): string {
  const random = createSeededRandom(seed)
  const stars: string[] = []
  for (let index = 0; index < count; index++) {
    const x = random() * WIDGET_WIDTH
    const y = random() * WIDGET_HEIGHT
    const radius = 0.5 + random() * 1.1
    const opacity = 0.35 + random() * 0.55
    const colorIndex = Math.floor(random() * STAR_COLORS.length)
    stars.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(2)}" fill="${STAR_COLORS[colorIndex]}" opacity="${opacity.toFixed(2)}"/>`)
  }
  return stars.join('')
}

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

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  return `${value.slice(0, Math.max(1, maxLength - 1))}…`
}

function getPlanetPosition(index: number, total: number, orbitRadius: number): { x: number; y: number } {
  const angleOffset = Math.PI / 6
  const angle = (index / Math.max(1, total)) * Math.PI * 2 + angleOffset
  const scaledRadius = 28 + orbitRadius * 5
  return {
    x: SYSTEM_CENTER_X + scaledRadius * Math.cos(angle),
    y: SYSTEM_CENTER_Y + scaledRadius * Math.sin(angle) * 0.55,
  }
}

function getTopLanguageTheme(topLanguage: string): LanguageTheme {
  return getLanguageTheme(topLanguage)
}

function renderPlanets(repos: NebulaRepo[]): string {
  if (repos.length === 0) {
    return `<text x="${SYSTEM_CENTER_X}" y="${SYSTEM_CENTER_Y + 4}" text-anchor="middle" fill="#94a3b8" font-family="Inter, Arial, sans-serif" font-size="11" opacity="0.75">Limited public signals</text>`
  }

  const total = repos.length
  const planetNodes = repos
    .map((repo, index) => {
      const { x, y } = getPlanetPosition(index, total, repo.orbitRadius)
      const radius = 4 + repo.energyScore * 5
      const ringNodes = repo.isProfileRepo
        ? `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(radius * 2.4).toFixed(1)}" ry="${(radius * 0.55).toFixed(1)}" fill="none" stroke="${repo.theme.emissive}" stroke-width="0.9" opacity="0.75"/><ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(radius * 2.4).toFixed(1)}" ry="${(radius * 0.55).toFixed(1)}" fill="none" stroke="${repo.theme.emissive}" stroke-width="0.4" opacity="0.35" filter="url(#planetGlow)"/>`
        : ''
      const stardust = `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(radius + 3).toFixed(1)}" fill="none" stroke="#38bdf8" stroke-width="0.6" opacity="0.45"/>`
      const planet = `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${radius.toFixed(1)}" fill="${repo.theme.primary}" opacity="0.92" filter="url(#planetGlow)"/>`
      return `${ringNodes}${stardust}${planet}`
    })
    .join('')

  const topThree = repos.slice(0, 3)
  const labelNodes = topThree
    .map((repo, index) => {
      const { x, y } = getPlanetPosition(index, total, repo.orbitRadius)
      const radius = 4 + repo.energyScore * 5
      const labelY = (y + radius + 12).toFixed(1)
      const label = escapeXml(truncate(repo.name, MAX_LABEL_LENGTH))
      return `<text x="${x.toFixed(1)}" y="${labelY}" text-anchor="middle" fill="#cbd5f5" font-family="ui-monospace, SFMono-Regular, monospace" font-size="8" font-weight="600" letter-spacing="0.4" opacity="0.85">${label}</text>`
    })
    .join('')

  return `${planetNodes}${labelNodes}`
}

export function generateWidgetSvg(profile: NebulaProfile): string {
  const username = escapeXml(profile.user.login)
  const topLanguage = escapeXml(profile.summary.topLanguage)
  const topLanguageTheme = getTopLanguageTheme(profile.summary.topLanguage)
  const dominantEnergy = DOMINANT_ENERGY_LABEL[profile.summary.dominantEnergy]
  const isActive = profile.summary.dominantEnergy === 'active' || profile.summary.dominantEnergy === 'supernova'
  const starCore = isActive ? '#fde68a' : '#e0f2fe'
  const starMid = isActive ? '#f97316' : '#38bdf8'
  const starDeep = isActive ? '#9a3412' : '#075985'
  const seed = profile.user.login.split('').reduce((total, char) => total + char.charCodeAt(0), 0)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDGET_WIDTH}" height="${WIDGET_HEIGHT}" viewBox="0 0 ${WIDGET_WIDTH} ${WIDGET_HEIGHT}" role="img" aria-label="Code Nebula galaxy for ${username}">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#020617"/>
      <stop offset="1" stop-color="#071426"/>
    </linearGradient>
    <radialGradient id="star" cx="50%" cy="45%" r="55%">
      <stop offset="0" stop-color="${starCore}"/>
      <stop offset="0.42" stop-color="${starMid}"/>
      <stop offset="1" stop-color="${starDeep}"/>
    </radialGradient>
    <filter id="planetGlow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="2.2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${WIDGET_WIDTH}" height="${WIDGET_HEIGHT}" rx="24" fill="url(#background)"/>
  <rect x="0.5" y="0.5" width="${WIDGET_WIDTH - 1}" height="${WIDGET_HEIGHT - 1}" rx="23.5" fill="none" stroke="#38bdf8" stroke-opacity="0.16"/>
  ${renderBackgroundStars(seed, 32)}
  <text x="40" y="45" fill="#67e8f9" font-family="ui-monospace, SFMono-Regular, monospace" font-size="11" font-weight="700" letter-spacing="2.4">CODE NEBULA</text>
  <text x="40" y="86" fill="#e5f0ff" font-family="Inter, Arial, sans-serif" font-size="27" font-weight="700">${username}</text>
  <text x="40" y="111" fill="#94a3b8" font-family="Inter, Arial, sans-serif" font-size="13">Living GitHub galaxy signal</text>
  <text x="40" y="148" fill="#64748b" font-family="Inter, Arial, sans-serif" font-size="10">TOP LANGUAGE</text>
  <text x="40" y="166" fill="${topLanguageTheme.primary}" font-family="ui-monospace, SFMono-Regular, monospace" font-size="14" font-weight="700">${topLanguage}</text>
  <text x="180" y="148" fill="#64748b" font-family="Inter, Arial, sans-serif" font-size="10">STARS</text>
  <text x="180" y="166" fill="#e5f0ff" font-family="ui-monospace, SFMono-Regular, monospace" font-size="14" font-weight="700">${profile.summary.totalStars}</text>
  <text x="260" y="148" fill="#64748b" font-family="Inter, Arial, sans-serif" font-size="10">ACTIVE</text>
  <text x="260" y="166" fill="#e5f0ff" font-family="ui-monospace, SFMono-Regular, monospace" font-size="14" font-weight="700">${profile.summary.activeRepos}</text>
  <text x="40" y="200" fill="#64748b" font-family="Inter, Arial, sans-serif" font-size="10">DOMINANT ENERGY</text>
  <text x="40" y="218" fill="#22d3ee" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" font-weight="700" letter-spacing="1.6">${dominantEnergy}</text>
  <g opacity="0.42" fill="none" stroke="#38bdf8" stroke-width="0.7">
    <ellipse cx="${SYSTEM_CENTER_X}" cy="${SYSTEM_CENTER_Y}" rx="76" ry="32"/>
    <ellipse cx="${SYSTEM_CENTER_X}" cy="${SYSTEM_CENTER_Y}" rx="124" ry="55"/>
    <ellipse cx="${SYSTEM_CENTER_X}" cy="${SYSTEM_CENTER_Y}" rx="166" ry="78"/>
  </g>
  <circle cx="${SYSTEM_CENTER_X}" cy="${SYSTEM_CENTER_Y}" r="20" fill="url(#star)" filter="url(#planetGlow)"/>
  ${renderPlanets(profile.repos)}
</svg>`
}

export function generateWidgetErrorSvg(message: string): string {
  const safeMessage = escapeXml(message)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDGET_WIDTH}" height="${WIDGET_HEIGHT}" viewBox="0 0 ${WIDGET_WIDTH} ${WIDGET_HEIGHT}" role="img" aria-label="Code Nebula error">
  <rect width="${WIDGET_WIDTH}" height="${WIDGET_HEIGHT}" rx="24" fill="#020617"/>
  <rect x="0.5" y="0.5" width="${WIDGET_WIDTH - 1}" height="${WIDGET_HEIGHT - 1}" rx="23.5" fill="none" stroke="#fb7185" stroke-opacity="0.28"/>
  <text x="40" y="92" fill="#fb7185" font-family="ui-monospace, SFMono-Regular, monospace" font-size="12" font-weight="700" letter-spacing="2">SIGNAL UNAVAILABLE</text>
  <text x="40" y="132" fill="#e5f0ff" font-family="Inter, Arial, sans-serif" font-size="18">${safeMessage}</text>
</svg>`
}