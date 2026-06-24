'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import type { RefObject } from 'react'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { GalaxyScene } from './GalaxyScene'
import { MilkyWayScene } from './MilkyWayScene'
import { CinematicCamera } from './CinematicCamera'
import type { NebulaProfile } from '@/lib/github/github.types'

export type ExperienceStage = 'milky-way' | 'approach' | 'reveal' | 'explore'

interface NebulaCanvasProps {
  profile: NebulaProfile
  stage: ExperienceStage
  startedAtRef: RefObject<number | null>
  reducedMotion: boolean
}

export function NebulaCanvas({ profile, stage, startedAtRef, reducedMotion }: NebulaCanvasProps) {
  const introActive = stage !== 'explore'
  const targetRef = useRef<THREE.Mesh>(null)

  return (
    <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-bg">
      <Canvas
        camera={{
          position: introActive ? [0, 4.5, 72] : [0, 9.5, 31],
          fov: introActive ? 52 : 46,
        }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        fallback={
          <div className="flex h-full items-center justify-center bg-bg px-6 text-center text-text-secondary">
            Your browser could not start the 3D nebula.
          </div>
        }
      >
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 65, 160]} />

        <ambientLight intensity={introActive ? 0.03 : 0.08} />
        <directionalLight
          position={[15, 25, 10]}
          intensity={introActive ? 0.25 : 1.05}
          color="#dbeafe"
        />

        <Suspense fallback={null}>
          {introActive ? (
            <>
              <MilkyWayScene active stage={stage} targetRef={targetRef} />
              <CinematicCamera
                active
                stage={stage}
                startedAtRef={startedAtRef}
                targetRef={targetRef}
              />
            </>
          ) : (
            <GalaxyScene profile={profile} active reducedMotion={reducedMotion} />
          )}

          <EffectComposer enableNormalPass={false} multisampling={0}>
            <Bloom
              luminanceThreshold={introActive ? 0.28 : 0.62}
              luminanceSmoothing={introActive ? 0.9 : 0.8}
              intensity={introActive ? 1.05 : 0.65}
            />
            <Vignette
              eskil={false}
              offset={introActive ? 0.08 : 0.2}
              darkness={introActive ? 0.86 : 0.72}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
