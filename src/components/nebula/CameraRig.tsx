'use client'

import { useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import type { PlanetPositionRegistry } from './NebbiCompanion'
import { useNebulaStore } from '@/store/nebula.store'

interface CameraRigProps {
  active: boolean
  targetX: number
  controlsRef: RefObject<OrbitControlsImpl | null>
  controlsInteractingRef: RefObject<boolean>
  planetPositions: PlanetPositionRegistry
  reducedMotion: boolean
}

export function CameraRig({
  active,
  targetX,
  controlsRef,
  controlsInteractingRef,
  planetPositions,
  reducedMotion,
}: CameraRigProps) {
  const width = useThree((state) => state.size.width)
  const selectedRepo = useNebulaStore((state) => state.selectedRepo)
  const isCompactView = width < 640
  const initializedRef = useRef(false)
  const trackedRepoIdRef = useRef<number | null>(null)
  const transitionRef = useRef<'focus' | 'home' | null>(null)
  const transitionElapsedRef = useRef(0)
  const previousTargetRef = useRef(new THREE.Vector3())
  const scratchTargetRef = useRef(new THREE.Vector3())
  const homePosition = useMemo(
    () => new THREE.Vector3(targetX, isCompactView ? 11.6 : 9.5, isCompactView ? 48 : 31),
    [isCompactView, targetX]
  )
  const systemCenter = useMemo(() => new THREE.Vector3(targetX, 0, 0), [targetX])
  const focusOffset = useMemo(
    () => new THREE.Vector3(isCompactView ? 8 : 7, isCompactView ? 6.2 : 5.5, isCompactView ? 15 : 12),
    [isCompactView]
  )

  useFrame((state, delta) => {
    if (!active || !controlsRef.current) return

    const controls = controlsRef.current
    const targetPosition = selectedRepo
      ? planetPositions.get(selectedRepo.id)
      : undefined

    if (!initializedRef.current) {
      state.camera.position.copy(homePosition)
      controls.target.copy(systemCenter)
      state.camera.lookAt(systemCenter)

      if (state.camera instanceof THREE.PerspectiveCamera) {
        state.camera.fov = isCompactView ? 56 : 46
        state.camera.updateProjectionMatrix()
      }

      initializedRef.current = true
      controls.update()
    }

    if (selectedRepo && targetPosition) {
      if (trackedRepoIdRef.current !== selectedRepo.id) {
        trackedRepoIdRef.current = selectedRepo.id
        transitionRef.current = reducedMotion ? null : 'focus'
        transitionElapsedRef.current = 0
        previousTargetRef.current.copy(targetPosition)

        if (reducedMotion) {
          state.camera.position.copy(scratchTargetRef.current.copy(targetPosition).add(focusOffset))
          controls.target.copy(targetPosition)
          controls.update()
        }
      }

      if (controlsInteractingRef.current) {
        transitionRef.current = null
      }

      if (transitionRef.current === 'focus') {
        transitionElapsedRef.current += delta
        scratchTargetRef.current.copy(targetPosition).add(focusOffset)

        state.camera.position.set(
          THREE.MathUtils.damp(state.camera.position.x, scratchTargetRef.current.x, 3.8, delta),
          THREE.MathUtils.damp(state.camera.position.y, scratchTargetRef.current.y, 3.8, delta),
          THREE.MathUtils.damp(state.camera.position.z, scratchTargetRef.current.z, 3.8, delta)
        )
        controls.target.set(
          THREE.MathUtils.damp(controls.target.x, targetPosition.x, 5, delta),
          THREE.MathUtils.damp(controls.target.y, targetPosition.y, 5, delta),
          THREE.MathUtils.damp(controls.target.z, targetPosition.z, 5, delta)
        )
        controls.update()

        if (transitionElapsedRef.current >= 1.05) transitionRef.current = null
      } else {
        scratchTargetRef.current.subVectors(targetPosition, previousTargetRef.current)
        state.camera.position.add(scratchTargetRef.current)
        controls.target.add(scratchTargetRef.current)
        controls.update()
      }

      previousTargetRef.current.copy(targetPosition)
      return
    }

    if (trackedRepoIdRef.current !== null) {
      trackedRepoIdRef.current = null
      transitionRef.current = reducedMotion ? null : 'home'
      transitionElapsedRef.current = 0
      controls.autoRotate = false
    }

    if (reducedMotion) {
      state.camera.position.copy(homePosition)
      controls.target.copy(systemCenter)
      controls.update()
      return
    }

    if (controlsInteractingRef.current) transitionRef.current = null
    if (transitionRef.current !== 'home') return

    transitionElapsedRef.current += delta
    state.camera.position.set(
      THREE.MathUtils.damp(state.camera.position.x, homePosition.x, 3.2, delta),
      THREE.MathUtils.damp(state.camera.position.y, homePosition.y, 3.2, delta),
      THREE.MathUtils.damp(state.camera.position.z, homePosition.z, 3.2, delta)
    )
    controls.target.set(
      THREE.MathUtils.damp(controls.target.x, systemCenter.x, 4, delta),
      THREE.MathUtils.damp(controls.target.y, systemCenter.y, 4, delta),
      THREE.MathUtils.damp(controls.target.z, systemCenter.z, 4, delta)
    )
    controls.update()

    if (transitionElapsedRef.current >= 1.2) {
      transitionRef.current = null
      controls.autoRotate = true
    }
  })

  return null
}
