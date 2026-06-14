'use client'

import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { NebulaRepo } from '@/lib/github/github.types'
import { useNebulaStore } from '@/store/nebula.store'
import { PlanetAtmosphere } from './PlanetAtmosphere'
import { PlanetRing } from './PlanetRing'

interface RepoPlanetProps {
  repo: NebulaRepo
  initialAngle: number
}

export function RepoPlanet({ repo, initialAngle }: RepoPlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)
  const highlightRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  const setSelectedRepo = useNebulaStore((state) => state.setSelectedRepo)
  const selectedRepo = useNebulaStore((state) => state.selectedRepo)
  const isSelected = selectedRepo?.id === repo.id

  // Memoize random rotation axes for variety
  const rotationAxis = useMemo(() => new THREE.Vector3(
    Math.random() * 0.2, 
    1, 
    Math.random() * 0.2
  ).normalize(), [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Orbit rotation
      groupRef.current.rotation.y += repo.orbitSpeed * delta * 0.3
    }
    if (planetRef.current) {
      // Self rotation on an angle
      planetRef.current.rotateOnAxis(rotationAxis, delta * 0.8)
    }
    if (highlightRef.current) {
      // Slowly rotate the selection highlight
      highlightRef.current.rotation.z += delta * 1.5
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

  // Premium look: selected/hovered planets pop more
  const isHighlighted = hovered || isSelected
  const scale = isHighlighted ? repo.planetRadius * 1.15 : repo.planetRadius

  // Add a ring only to one of the biggest planets for visual variety (e.g. the Go microservice mock)
  const hasRing = repo.language === 'Go' || repo.id === 4

  return (
    <group ref={groupRef} rotation={[0, initialAngle, 0]}>
      <group position={[repo.orbitRadius, 0, 0]}>
        
        {/* Interactive Hitbox (invisible sphere slightly larger to catch clicks easier) */}
        <mesh
          visible={false}
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
          <sphereGeometry args={[scale * 1.5, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* Planet Core */}
        <Sphere ref={planetRef} args={[scale, 64, 64]}>
          <meshStandardMaterial
            color={repo.theme.primary}
            emissive={repo.theme.emissive}
            emissiveIntensity={isHighlighted ? 0.6 : 0.15}
            roughness={0.6}
            metalness={0.3}
          />
          {hasRing && <PlanetRing radius={scale} color={repo.theme.secondary} />}
        </Sphere>

        {/* Atmosphere */}
        <PlanetAtmosphere 
          radius={scale} 
          color={repo.theme.emissive} 
          intensity={isHighlighted ? 0.4 : 0.15} 
        />

        {/* Sci-fi Selection Highlight Ring */}
        {isHighlighted && (
          <mesh ref={highlightRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[scale * 1.5, scale * 1.55, 64]} />
            <meshBasicMaterial 
              color={repo.theme.emissive} 
              side={THREE.DoubleSide} 
              transparent 
              opacity={0.8}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}
      </group>
    </group>
  )
}
