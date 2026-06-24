'use client'

import { NebulaProfile } from '@/lib/github/github.types'
import { UserStar } from './UserStar'
import { RepoPlanet } from './RepoPlanet'
import { OrbitRing } from './OrbitRing'
import { StarField } from './StarField'
import { CameraRig } from './CameraRig'
import { NebulaClouds } from './NebulaClouds'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { NebbiCompanion } from './NebbiCompanion'
import type { PlanetPositionRegistry } from './NebbiCompanion'
import { useNebulaStore } from '@/store/nebula.store'

interface GalaxySceneProps {
  profile: NebulaProfile
  active: boolean
  reducedMotion: boolean
}

export function GalaxyScene({ profile, active, reducedMotion }: GalaxySceneProps) {
  const width = useThree((state) => state.size.width)
  const selectedRepo = useNebulaStore((state) => state.selectedRepo)
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const controlsInteractingRef = useRef(false)
  const systemOffset = width >= 1024 ? -2.2 : 0
  const planetPositions = useMemo<PlanetPositionRegistry>(
    () => new Map(profile.repos.map((repo) => [repo.id, new THREE.Vector3()])),
    [profile.repos]
  )
  const nebbiHome = useMemo<[number, number, number]>(
    () => [systemOffset + 3.4, 3.1, 2.2],
    [systemOffset]
  )
  const systemCenter = useMemo<[number, number, number]>(
    () => [systemOffset, 0, 0],
    [systemOffset]
  )

  return (
    <>
      <CameraRig
        active={active}
        targetX={systemOffset}
        controlsRef={controlsRef}
        controlsInteractingRef={controlsInteractingRef}
        planetPositions={planetPositions}
        reducedMotion={reducedMotion}
      />

      {active && (
        <OrbitControls
          ref={controlsRef}
          target={[systemOffset, 0, 0]}
          enablePan={false}
          enableZoom
          minDistance={13}
          maxDistance={52}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 6}
          autoRotate={!reducedMotion && !selectedRepo}
          autoRotateSpeed={0.18}
          enableDamping
          dampingFactor={0.055}
          onStart={() => {
            controlsInteractingRef.current = true
          }}
          onEnd={() => {
            controlsInteractingRef.current = false
            if (controlsRef.current) {
              controlsRef.current.autoRotate = !reducedMotion && !selectedRepo
            }
          }}
        />
      )}

      <group visible={active}>
        <StarField />
        <NebulaClouds />

        <group position={[systemOffset, 0, 0]}>
          <UserStar user={profile.user} summary={profile.summary} />

          {profile.repos.map((repo, index) => {
            const angleOffset = ((repo.id * 37) % 100) * 0.0035
            const initialAngle = (index / profile.repos.length) * Math.PI * 2 + angleOffset
            return (
              <group key={repo.id}>
                <OrbitRing radius={repo.orbitRadius} />
                <RepoPlanet
                  repo={repo}
                  initialAngle={initialAngle}
                  worldPosition={planetPositions.get(repo.id)!}
                  reducedMotion={reducedMotion}
                />
              </group>
            )
          })}
        </group>

        <NebbiCompanion
          active={active}
          homePosition={nebbiHome}
          systemCenter={systemCenter}
          planetPositions={planetPositions}
          reducedMotion={reducedMotion}
        />
      </group>
    </>
  )
}
