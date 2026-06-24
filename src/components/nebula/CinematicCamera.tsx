'use client'

import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { ExperienceStage } from './NebulaCanvas'
import type { RefObject } from 'react'

interface CinematicCameraProps {
  active: boolean
  stage: ExperienceStage
  startedAtRef: RefObject<number | null>
  targetRef: RefObject<THREE.Mesh | null>
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2
}

export function CinematicCamera({ active, stage, startedAtRef, targetRef }: CinematicCameraProps) {
  const lookTarget = useMemo(() => new THREE.Vector3(), [])
  const targetPosition = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera }) => {
    if (!active) return

    const startedAt = startedAtRef.current ?? performance.now()
    if (startedAtRef.current === null) startedAtRef.current = startedAt

    const progress = THREE.MathUtils.clamp((performance.now() - startedAt) / 4200, 0, 1)
    const eased = easeInOutCubic(progress)
    const revealPush = stage === 'reveal' ? Math.min(1, (progress - 0.8) / 0.2) : 0

    if (targetRef.current) targetRef.current.getWorldPosition(targetPosition)

    camera.position.set(
      THREE.MathUtils.lerp(0, targetPosition.x + 0.8, eased) + Math.sin(progress * Math.PI) * 2.6,
      THREE.MathUtils.lerp(11, targetPosition.y + 0.7, eased) + Math.sin(progress * Math.PI) * 1.5,
      THREE.MathUtils.lerp(72, targetPosition.z + 7.2, eased) - revealPush * 1.6
    )

    lookTarget.set(
      THREE.MathUtils.lerp(0, targetPosition.x, eased),
      THREE.MathUtils.lerp(0, targetPosition.y, eased),
      THREE.MathUtils.lerp(0, targetPosition.z, eased)
    )
    camera.lookAt(lookTarget)

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(52, 28, eased)
      camera.updateProjectionMatrix()
    }
  })

  return null
}
