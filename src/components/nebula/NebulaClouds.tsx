'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

// Static seed-based pseudo-random to avoid re-generation on re-renders
function seededRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function NebulaClouds() {
  const clouds = useMemo(() => {
    const rng = seededRng(42)
    const temp = []
    
    // 3 large very-distant "ambient" nebulae — barely visible, just add color depth
    for (let i = 0; i < 3; i++) {
      const radius = 90 + rng() * 30
      const theta = rng() * Math.PI * 2
      const phi = (rng() - 0.5) * Math.PI * 0.5
      temp.push({
        position: new THREE.Vector3(
          radius * Math.cos(phi) * Math.cos(theta),
          radius * Math.sin(phi) * 0.3,
          radius * Math.cos(phi) * Math.sin(theta)
        ),
        scale: 55 + rng() * 25,
        color: ['#8b5cf6', '#3b82f6', '#0f172a'][i],
        opacity: 0.025,
      })
    }
    
    // 5 medium clouds at mid-distance — the "nebula wisps"
    for (let i = 0; i < 5; i++) {
      const radius = 55 + rng() * 25
      const theta = rng() * Math.PI * 2
      const phi = (rng() - 0.5) * Math.PI * 0.4
      const colors = ['#22d3ee', '#8b5cf6', '#ec4899', '#3b82f6', '#06b6d4']
      temp.push({
        position: new THREE.Vector3(
          radius * Math.cos(phi) * Math.cos(theta),
          radius * Math.sin(phi) * 0.4,
          radius * Math.cos(phi) * Math.sin(theta)
        ),
        scale: 15 + rng() * 12,
        color: colors[i % colors.length],
        opacity: 0.04 + rng() * 0.02,
      })
    }

    return temp
  }, [])

  // No rotation needed — static clouds blend better as background
  return (
    <group>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position}>
          <sphereGeometry args={[cloud.scale, 8, 8]} />
          <meshBasicMaterial
            color={cloud.color}
            transparent
            opacity={cloud.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
