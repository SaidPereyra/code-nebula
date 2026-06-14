'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { GalaxyScene } from './GalaxyScene'
import { NebulaProfile } from '@/lib/github/github.types'

interface NebulaCanvasProps {
  profile: NebulaProfile
}

export function NebulaCanvas({ profile }: NebulaCanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full bg-bg z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 18, 42], fov: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]} // Slightly lower cap to maintain FPS
      >
        <color attach="background" args={['#020617']} />
        {/* Subtle fog — starts late so planets don't fade too fast */}
        <fog attach="fog" args={['#020617', 50, 140]} />

        {/* Cinematic Lighting: dim ambient + directional to show depth on planets */}
        <ambientLight intensity={0.08} />
        <directionalLight position={[15, 25, 10]} intensity={1.2} color="#e2e8f0" />

        <Suspense fallback={null}>
          <GalaxyScene profile={profile} />

          <EffectComposer enableNormalPass={false} multisampling={0}>
            <Bloom
              luminanceThreshold={0.4}  // Higher threshold = only bright emissives bloom
              luminanceSmoothing={0.7}
              intensity={0.8}           // Reduced from 1.2
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.15} darkness={1.0} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}

