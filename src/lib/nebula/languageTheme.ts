import type { LanguageTheme } from '@/lib/github/github.types'

// Temas por lenguaje — PROJECT_CONTEXT.md §9
export const languageThemes: Record<string, LanguageTheme> = {
  TypeScript: {
    primary: '#38bdf8',
    secondary: '#1d4ed8',
    emissive: '#0ea5e9',
    label: 'TypeScript Ocean',
  },
  JavaScript: {
    primary: '#facc15',
    secondary: '#a16207',
    emissive: '#f59e0b',
    label: 'JavaScript Solar',
  },
  Python: {
    primary: '#22c55e',
    secondary: '#14532d',
    emissive: '#84cc16',
    label: 'Python Forest',
  },
  PHP: {
    primary: '#8b5cf6',
    secondary: '#4c1d95',
    emissive: '#a78bfa',
    label: 'PHP Violet Cloud',
  },
  Java: {
    primary: '#f97316',
    secondary: '#7c2d12',
    emissive: '#fb923c',
    label: 'Java Magma',
  },
  C: {
    primary: '#94a3b8',
    secondary: '#334155',
    emissive: '#cbd5e1',
    label: 'C Metal Core',
  },
  'C++': {
    primary: '#60a5fa',
    secondary: '#1e3a8a',
    emissive: '#93c5fd',
    label: 'C++ Blue Forge',
  },
  'C#': {
    primary: '#a855f7',
    secondary: '#3b0764',
    emissive: '#c084fc',
    label: 'C# Purple Forge',
  },
  Rust: {
    primary: '#f97316',
    secondary: '#431407',
    emissive: '#fdba74',
    label: 'Rust Iron Belt',
  },
  Go: {
    primary: '#06b6d4',
    secondary: '#164e63',
    emissive: '#22d3ee',
    label: 'Go Cyan Drift',
  },
  Ruby: {
    primary: '#f43f5e',
    secondary: '#881337',
    emissive: '#fb7185',
    label: 'Ruby Red Giant',
  },
  Swift: {
    primary: '#fb923c',
    secondary: '#7c2d12',
    emissive: '#fdba74',
    label: 'Swift Fire Ring',
  },
  Kotlin: {
    primary: '#a78bfa',
    secondary: '#4c1d95',
    emissive: '#c4b5fd',
    label: 'Kotlin Violet Pulse',
  },
  Shell: {
    primary: '#4ade80',
    secondary: '#14532d',
    emissive: '#86efac',
    label: 'Shell Green Terminal',
  },
  HTML: {
    primary: '#f97316',
    secondary: '#431407',
    emissive: '#fed7aa',
    label: 'HTML Lava Web',
  },
  CSS: {
    primary: '#38bdf8',
    secondary: '#0c4a6e',
    emissive: '#7dd3fc',
    label: 'CSS Blue Style',
  },
  default: {
    primary: '#a78bfa',
    secondary: '#312e81',
    emissive: '#c4b5fd',
    label: 'Unknown Nebula',
  },
}

export function getLanguageTheme(language: string | null): LanguageTheme {
  if (!language) return languageThemes.default
  return languageThemes[language] ?? languageThemes.default
}
