'use client'

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { NebulaRepo } from '@/lib/github/github.types'
import { useNebulaStore } from '@/store/nebula.store'

interface RepoPlanetProps {
  repo: NebulaRepo
  initialAngle: number
}

export function RepoPlanet({ repo, initialAngle }: RepoPlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  const setSelectedRepo = useNebulaStore((state) => state.setSelectedRepo)
  const selectedRepo = useNebulaStore((state) => state.selectedRepo)
  const isSelected = selectedRepo?.id === repo.id

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Orbit rotation
      groupRef.current.rotation.y += repo.orbitSpeed * delta * 0.5
    }
    if (planetRef.current) {
      // Self rotation
      planetRef.current.rotation.y += delta * 0.5
    }
  })

  // Set cursor style
  useState(() => {
    if (hovered) {
      document.body.style.cursor = 'pointer'
    } else {
      document.body.style.cursor = 'auto'
    }
  })

  const scale = hovered || isSelected ? repo.planetRadius * 1.2 : repo.planetRadius

  return (
    <group ref={groupRef} rotation={[0, initialAngle, 0]}>
      <group position={[repo.orbitRadius, 0, 0]}>
        {/* Planet Mesh */}
        <Sphere
          ref={planetRef}
          args={[scale, 32, 32]}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            setSelectedRepo(repo)
          }}
        >
          <meshStandardMaterial
            color={repo.theme.primary}
            emissive={repo.theme.emissive}
            emissiveIntensity={hovered || isSelected ? 0.8 : 0.2}
            roughness={0.7}
            metalness={0.2}
          />
        </Sphere>

        {/* Selection / Hover ring */}
        {(hovered || isSelected) && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[scale + 0.2, scale + 0.25, 32]} />
            <meshBasicMaterial color={repo.theme.emissive} side={THREE.DoubleSide} transparent opacity={0.8} />
          </mesh>
        )}
      </group>
    </group>
  )
}
