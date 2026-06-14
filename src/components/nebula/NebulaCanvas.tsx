'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { GalaxyScene } from './GalaxyScene'
import { NebulaProfile } from '@/lib/github/github.types'

interface NebulaCanvasProps {
  profile: NebulaProfile
}

export function NebulaCanvas({ profile }: NebulaCanvasProps) {
  return (
    <div className="absolute inset-0 w-full h-full bg-bg z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 15, 30], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]} // Cap DPR at 2 for performance
      >
        <color attach="background" args={['#020617']} />
        
        {/* Basic Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 20, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[0, 0, 0]} intensity={2} color="#f59e0b" distance={50} />

        <Suspense fallback={null}>
          <GalaxyScene profile={profile} />
        </Suspense>
      </Canvas>
    </div>
  )
}
