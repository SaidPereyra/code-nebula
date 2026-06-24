'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { NebulaRepo } from '@/lib/github/github.types'
import { useNebulaStore } from '@/store/nebula.store'
import { PlanetAtmosphere } from './PlanetAtmosphere'
import { PlanetRing } from './PlanetRing'
import { PlanetSurface } from './PlanetSurface'
import { SelectionBurst } from './SelectionBurst'

interface RepoPlanetProps {
  repo: NebulaRepo
  initialAngle: number
  worldPosition: THREE.Vector3
  reducedMotion: boolean
}

export function RepoPlanet({ repo, initialAngle, worldPosition, reducedMotion }: RepoPlanetProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const planetRef = useRef<THREE.Mesh>(null)
  const highlightRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const setSelectedRepo = useNebulaStore((state) => state.setSelectedRepo)
  const selectedRepo = useNebulaStore((state) => state.selectedRepo)
  const lastDiscoveredRepoId = useNebulaStore((state) => state.lastDiscoveredRepoId)
  const discoverySequence = useNebulaStore((state) => state.discoverySequence)
  const isSelected = selectedRepo?.id === repo.id
  const isHighlighted = hovered || isSelected

  const rotationAxis = useMemo(
    () =>
      new THREE.Vector3(
        ((repo.id * 17) % 9) * 0.018,
        1,
        ((repo.id * 29) % 11) * 0.014
      ).normalize(),
    [repo.id]
  )
  const surfaceSeed = useMemo(() => ((repo.id % 10007) / 10007) * 12, [repo.id])
  const ringColor = useMemo(
    () =>
      `#${new THREE.Color(repo.theme.primary)
        .lerp(new THREE.Color('#ffffff'), 0.28)
        .getHexString()}`,
    [repo.theme.primary]
  )

  const radius =
    0.48 +
    ((THREE.MathUtils.clamp(repo.planetRadius, 0.4, 0.9) - 0.4) / 0.5) * 0.3
  const hasRing = Boolean(repo.isProfileRepo)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += repo.orbitSpeed * delta * 0.3
    }
    if (planetRef.current) {
      planetRef.current.rotateOnAxis(rotationAxis, delta * 0.8)
    }
    if (bodyRef.current) {
      const targetScale = isHighlighted ? 1.1 : 1
      const nextScale = THREE.MathUtils.damp(bodyRef.current.scale.x, targetScale, 8, delta)
      bodyRef.current.scale.setScalar(nextScale)
      bodyRef.current.getWorldPosition(worldPosition)
    }
    if (highlightRef.current) {
      highlightRef.current.rotation.z += delta * 1.2
    }
  })

  useEffect(() => {
    if (!hovered) return

    document.body.style.cursor = 'pointer'
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered])

  return (
    <group ref={groupRef} rotation={[0, initialAngle, 0]}>
      <group position={[repo.orbitRadius, 0, 0]}>
        <group ref={bodyRef}>
          <mesh
            visible={false}
            onPointerOver={(event) => {
              event.stopPropagation()
              setHovered(true)
            }}
            onPointerOut={(event) => {
              event.stopPropagation()
              setHovered(false)
            }}
            onClick={(event) => {
              event.stopPropagation()
              setSelectedRepo(repo)
            }}
          >
            <sphereGeometry args={[radius * 1.6, 16, 16]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          <Sphere ref={planetRef} args={[radius, 48, 48]}>
            <PlanetSurface
              primary={repo.theme.primary}
              secondary={repo.theme.secondary}
              emissive={repo.theme.emissive}
              seed={surfaceSeed}
              highlighted={isHighlighted}
            />
            {hasRing && <PlanetRing radius={radius} color={ringColor} />}
          </Sphere>

          <PlanetAtmosphere
            radius={radius}
            color={repo.theme.emissive}
            intensity={isHighlighted ? 0.5 : 0.22}
          />

          {!reducedMotion &&
            isSelected &&
            lastDiscoveredRepoId === repo.id &&
            discoverySequence > 0 && (
              <SelectionBurst
                key={discoverySequence}
                color={repo.theme.emissive}
                radius={radius}
                seed={repo.id + discoverySequence * 101}
              />
            )}

          {isHighlighted && (
            <mesh ref={highlightRef} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius * 1.5, radius * 1.54, 64]} />
              <meshBasicMaterial
                color={repo.theme.emissive}
                side={THREE.DoubleSide}
                transparent
                opacity={0.58}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      </group>
    </group>
  )
}
