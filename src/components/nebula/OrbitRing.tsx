'use client'

import * as THREE from 'three'

interface OrbitRingProps {
  radius: number
}

export function OrbitRing({ radius }: OrbitRingProps) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      {/* A very thin torus looks better for an orbit path than a flat ring */}
      <torusGeometry args={[radius, 0.02, 16, 64]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.08} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
