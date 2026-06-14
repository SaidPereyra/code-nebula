'use client'

import { useFrame } from '@react-three/fiber'
import { useNebulaStore } from '@/store/nebula.store'
import * as THREE from 'three'

export function CameraRig() {
  const selectedRepo = useNebulaStore((state) => state.selectedRepo)

  useFrame((state) => {
    // Basic subtle floating if nothing is selected
    if (!selectedRepo) {
      state.camera.position.y = THREE.MathUtils.lerp(
        state.camera.position.y,
        15 + Math.sin(state.clock.elapsedTime * 0.5) * 2,
        0.02
      )
    } else {
      // Phase 2: We just let OrbitControls handle it, but we could 
      // smoothly transition to look at the planet here later.
    }
  })

  return null
}
