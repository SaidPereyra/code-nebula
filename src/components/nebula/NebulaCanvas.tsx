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
        camera={{ position: [0, 20, 45], fov: 45 }} // Pulled back slightly for better cinematic view
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#020617']} />
        <fog attach="fog" args={['#020617', 30, 120]} /> {/* Spatial depth fog */}
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.1} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />

        <Suspense fallback={null}>
          <GalaxyScene profile={profile} />
          
          <EffectComposer enableNormalPass={false} multisampling={4}>
            <Bloom 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              intensity={1.2} 
              mipmapBlur 
            />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
