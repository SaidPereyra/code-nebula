// Matemáticas de galaxia — esqueleto Fase 0
// Implementación completa en Fase 2

/**
 * Calcula el score de un repo para selección y orden.
 * score = stars * 3 + forks * 2 + recentActivityScore + hasDescriptionBonus
 */
export function calcRepoScore(
  stars: number,
  forks: number,
  activityScore: number,
  hasDescription: boolean
): number {
  return stars * 3 + forks * 2 + activityScore + (hasDescription ? 5 : 0)
}

/**
 * Normaliza un valor dentro de un rango [min, max] a [0, 1].
 */
export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0
  return Math.max(0, Math.min(1, (value - min) / (max - min)))
}

/**
 * Calcula el radio del planeta. Resultado entre minR y maxR.
 */
export function calcPlanetRadius(
  normalizedScore: number,
  minR = 0.3,
  maxR = 0.9
): number {
  return minR + normalizedScore * (maxR - minR)
}

/**
 * Calcula la velocidad orbital. Repos más activos orbitan ligeramente más rápido.
 */
export function calcOrbitSpeed(activityScore: number, base = 0.2): number {
  return base + activityScore * 0.15
}

/**
 * Distribuye radios orbitales uniformemente entre los planetas.
 */
export function calcOrbitRadii(
  count: number,
  innerR = 3,
  outerR = 9
): number[] {
  if (count === 0) return []
  if (count === 1) return [(innerR + outerR) / 2]
  const step = (outerR - innerR) / (count - 1)
  return Array.from({ length: count }, (_, i) => innerR + i * step)
}

/**
 * Generador pseudoaleatorio determinista para geometrías procedurales.
 */
export function createSeededRandom(seed: number) {
  let state = seed

  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }
}

/**
 * Distribución normal determinista mediante Box-Muller.
 */
export function createGaussianRandom(random: () => number) {
  return () => {
    const first = Math.max(random(), Number.EPSILON)
    const second = Math.max(random(), Number.EPSILON)
    return Math.sqrt(-2 * Math.log(first)) * Math.cos(Math.PI * 2 * second)
  }
}
