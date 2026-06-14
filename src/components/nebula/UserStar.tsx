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
  const coronaRef = useRef<THREE.Mesh>(null)

  // Base size on public repos, bounded
  const baseScale = Math.min(Math.max(user.publicRepos / 20, 1.5), 3.5)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.15
      meshRef.current.rotation.z = time * 0.05
    }
    if (glowRef.current) {
      // Gentle pulsing effect
      const pulse = 1 + Math.sin(time * 2) * 0.03
      glowRef.current.scale.setScalar(baseScale * 1.5 * pulse)
    }
    if (coronaRef.current) {
      // Slower ambient corona pulse
      const pulse = 1 + Math.sin(time * 0.5) * 0.1
      coronaRef.current.scale.setScalar(baseScale * 2.8 * pulse)
      coronaRef.current.rotation.y = -time * 0.05
    }
  })

  // Colors based on energy
  const primaryColor = summary.dominantEnergy === 'active' ? '#f59e0b' : '#38bdf8'
  const emissiveColor = summary.dominantEnergy === 'active' ? '#fb923c' : '#0ea5e9'
  const coronaColor = summary.dominantEnergy === 'active' ? '#fde68a' : '#bae6fd'

  return (
    <group>
      <pointLight intensity={3} color={primaryColor} distance={100} decay={1.5} />
      
      {/* Core Star */}
      <Sphere ref={meshRef} args={[baseScale, 64, 64]}>
        <MeshDistortMaterial
          color={primaryColor}
          emissive={emissiveColor}
          emissiveIntensity={3}
          distort={0.25}
          speed={3}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>

      {/* Inner Glow */}
      <Sphere ref={glowRef} args={[1, 32, 32]}>
        <meshBasicMaterial
          color={emissiveColor}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Outer Corona */}
      <Sphere ref={coronaRef} args={[1, 32, 32]}>
        <meshBasicMaterial
          color={coronaColor}
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>
    </group>
  )
}
