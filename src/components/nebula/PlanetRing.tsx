'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface PlanetRingProps {
  radius: number
  color: string
}

export function PlanetRing({ radius, color }: PlanetRingProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z -= delta * 0.2
    }
  })

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2.2, 0.2, 0]}>
      {/* Flat ring with inner hole */}
      <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.2}
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
        roughness={0.8}
      />
    </mesh>
  )
}
