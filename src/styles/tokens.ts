// Design tokens — Code Nebula v1
// Paleta basada en PROJECT_CONTEXT.md §11

export const colors = {
  // Backgrounds
  bg: '#020617',
  surface: '#07111f',
  surfaceGlass: 'rgba(15, 23, 42, 0.62)',
  borderGlass: 'rgba(148, 163, 184, 0.18)',

  // Accent
  cyan: '#22d3ee',
  blue: '#3b82f6',
  violet: '#8b5cf6',
  pink: '#ec4899',
  emerald: '#34d399',
  amber: '#f59e0b',

  // Text
  textPrimary: '#e5f0ff',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  danger: '#fb7185',
} as const

export const fonts = {
  sans: 'Inter, Geist, system-ui, sans-serif',
  mono: "'JetBrains Mono', 'Geist Mono', monospace",
} as const

export const radius = {
  sm: '6px',
  md: '12px',
  lg: '20px',
  full: '9999px',
} as const
