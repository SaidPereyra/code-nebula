'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { GitHubUser, NebulaSummary } from '@/lib/github/github.types'

interface UserStarProps {
  user: GitHubUser
  summary: NebulaSummary
}

export function UserStar({ user, summary }: UserStarProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // Base size on public repos, bounded
  const baseScale = Math.min(Math.max(user.publicRepos / 20, 1.5), 3.5)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.1
    }
    if (glowRef.current) {
      // Gentle pulsing effect
      const pulse = 1 + Math.sin(time * 2) * 0.05
      glowRef.current.scale.setScalar(baseScale * 1.3 * pulse)
    }
  })

  // Colors based on energy
  const primaryColor = summary.dominantEnergy === 'active' ? '#f59e0b' : '#38bdf8'
  const emissiveColor = summary.dominantEnergy === 'active' ? '#fb923c' : '#0ea5e9'

  return (
    <group>
      {/* Core Star */}
      <Sphere ref={meshRef} args={[baseScale, 64, 64]}>
        <MeshDistortMaterial
          color={primaryColor}
          emissive={emissiveColor}
          emissiveIntensity={2}
          distort={0.2}
          speed={2}
          roughness={0.2}
        />
      </Sphere>

      {/* Outer Glow */}
      <Sphere ref={glowRef} args={[1, 32, 32]}>
        <meshBasicMaterial
          color={emissiveColor}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>
    </group>
  )
}
