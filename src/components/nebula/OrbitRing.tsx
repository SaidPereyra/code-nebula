'use client'

import * as THREE from 'three'

interface OrbitRingProps {
  radius: number
}

export function OrbitRing({ radius }: OrbitRingProps) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      {/* Very thin torus as holographic orbit guide */}
      <torusGeometry args={[radius, 0.015, 8, 128]} />
      <meshBasicMaterial
        color="#38bdf8"      // Subtle cyan tint — reads as holographic
        transparent
        opacity={0.07}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
