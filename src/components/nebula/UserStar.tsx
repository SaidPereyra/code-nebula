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

  const baseScale = Math.min(Math.max(user.publicRepos / 20, 1.5), 3.0) // Cap slightly lower

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.12
      meshRef.current.rotation.z = time * 0.04
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(time * 1.8) * 0.04
      glowRef.current.scale.setScalar(baseScale * 1.6 * pulse)
    }
    if (coronaRef.current) {
      const pulse = 1 + Math.sin(time * 0.6) * 0.07
      coronaRef.current.scale.setScalar(baseScale * 2.5 * pulse)
      coronaRef.current.rotation.y = -time * 0.04
    }
  })

  const isActive = summary.dominantEnergy === 'active'
  const primaryColor = isActive ? '#f59e0b' : '#38bdf8'
  const emissiveColor = isActive ? '#d97706' : '#0284c7' // Desaturated emissive
  const coronaColor   = isActive ? '#fbbf24' : '#7dd3fc'

  return (
    <group>
      {/* Warm point light — lower intensity to not wash out atmosphere */}
      <pointLight intensity={2} color={primaryColor} distance={80} decay={2} />

      {/* Core Star — distort kept but emissive tuned down */}
      <Sphere ref={meshRef} args={[baseScale, 64, 64]}>
        <MeshDistortMaterial
          color={primaryColor}
          emissive={emissiveColor}
          emissiveIntensity={1.8}   // Was 3 — now cinematic instead of blown-out
          distort={0.2}
          speed={2.5}
          roughness={0.3}
          metalness={0.6}
        />
      </Sphere>

      {/* Inner glow halo */}
      <Sphere ref={glowRef} args={[1, 24, 24]}>
        <meshBasicMaterial
          color={emissiveColor}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Outer soft corona */}
      <Sphere ref={coronaRef} args={[1, 16, 16]}>
        <meshBasicMaterial
          color={coronaColor}
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>
    </group>
  )
}

