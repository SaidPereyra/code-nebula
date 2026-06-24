'use client'

import { StardustRing } from './OrbitRing'

interface PlanetRingProps {
  radius: number
  color: string
}

export function PlanetRing({ radius, color }: PlanetRingProps) {
  return (
    <StardustRing
      radius={radius * 1.685}
      radialSpread={radius * 0.265}
      verticalSpread={radius * 0.018}
      count={Math.round(290 + radius * 68)}
      color={color}
      opacity={0.52}
      driftSpeed={-0.08}
      seed={Math.round(radius * 10007)}
      rotation={[0.32, 0.2, 0.1]}
    />
  )
}
