'use client'

import * as THREE from 'three'

interface PlanetAtmosphereProps {
  radius: number
  color: string
  intensity?: number
}

export function PlanetAtmosphere({ radius, color, intensity = 0.2 }: PlanetAtmosphereProps) {
  // A slightly larger sphere with additive blending creates an atmosphere rim glow
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.25, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide} // Rendering BackSide helps with the rim effect
      />
    </mesh>
  )
}
