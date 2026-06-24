'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getCompanionMessage } from '@/lib/nebula/companionMessages'
import { useNebulaStore } from '@/store/nebula.store'

export type PlanetPositionRegistry = Map<number, THREE.Vector3>

interface NebbiCompanionProps {
  active: boolean
  homePosition: [number, number, number]
  systemCenter: [number, number, number]
  planetPositions: PlanetPositionRegistry
  reducedMotion: boolean
}

interface NebbiDialogueProps {
  message: string
  repositoryName?: string
}

function NebbiDialogue({ message, repositoryName }: NebbiDialogueProps) {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setOpen(false), 6000)
    return () => clearTimeout(timeout)
  }, [])

  if (!open) return null

  return (
    <Html
      position={[0, 1.65, 0]}
      center
      distanceFactor={10}
      zIndexRange={[15, 10]}
      style={{ pointerEvents: 'none' }}
    >
      <div
        aria-live="polite"
        className="w-52 max-w-[72vw] rounded-2xl border border-cyan/20 bg-[#050d1b]/95 p-3.5 text-left shadow-[0_18px_50px_rgba(2,6,23,0.62)]"
      >
        <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-cyan/75">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          Nebbi · scan link
        </div>
        {repositoryName && (
          <p className="mb-1 truncate font-mono text-[10px] text-text-muted">
            {repositoryName}
          </p>
        )}
        <p className="text-xs leading-relaxed text-text-primary">{message}</p>
      </div>
    </Html>
  )
}

export function NebbiCompanion({
  active,
  homePosition,
  systemCenter,
  planetPositions,
  reducedMotion,
}: NebbiCompanionProps) {
  const groupRef = useRef<THREE.Group>(null)
  const bodyRef = useRef<THREE.Group>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const antennaRef = useRef<THREE.Group>(null)
  const antennaMaterialRef = useRef<THREE.MeshStandardMaterial>(null)
  const leftThrusterRef = useRef<THREE.Group>(null)
  const rightThrusterRef = useRef<THREE.Group>(null)
  const leftThrusterMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const rightThrusterMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const scanBeamRef = useRef<THREE.Mesh>(null)
  const scanMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const spawnScaleRef = useRef(reducedMotion ? 1 : 0.08)
  const [hovered, setHovered] = useState(false)
  const [dialogueVersion, setDialogueVersion] = useState(0)

  const selectedRepo = useNebulaStore((state) => state.selectedRepo)
  const nebbiState = useNebulaStore((state) => state.nebbiState)
  const message = getCompanionMessage(nebbiState, selectedRepo?.id ?? 0)
  const dialogueKey = `${nebbiState}-${selectedRepo?.id ?? 'system'}-${dialogueVersion}`

  const home = useMemo(() => new THREE.Vector3(...homePosition), [homePosition])
  const center = useMemo(() => new THREE.Vector3(...systemCenter), [systemCenter])
  const upAxis = useMemo(() => new THREE.Vector3(0, 1, 0), [])
  const targetOffset = useMemo(() => new THREE.Vector3(1.15, 1.1, 1.35), [])
  const scratchRef = useRef({
    desiredPosition: new THREE.Vector3(),
    lookTarget: new THREE.Vector3(),
    scanDirection: new THREE.Vector3(),
    scanMidpoint: new THREE.Vector3(),
  })

  useEffect(() => {
    if (!hovered) return

    document.body.style.cursor = 'pointer'
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered])

  useFrame((state, delta) => {
    if (!active || !groupRef.current) return

    const targetPosition = selectedRepo
      ? planetPositions.get(selectedRepo.id)
      : undefined
    const time = state.clock.elapsedTime
    const { desiredPosition, lookTarget, scanDirection, scanMidpoint } = scratchRef.current

    if (targetPosition) {
      desiredPosition.copy(targetPosition).add(targetOffset)
      lookTarget.copy(targetPosition)
    } else {
      desiredPosition.copy(home)
      if (!reducedMotion) {
        desiredPosition.set(
          desiredPosition.x,
          desiredPosition.y + Math.sin(time * 1.25) * 0.22,
          desiredPosition.z
        )
      }
      lookTarget.copy(center)
    }

    const distanceToTarget = groupRef.current.position.distanceTo(desiredPosition)
    const damping = reducedMotion ? 18 : targetPosition ? 4.2 : 2.8
    groupRef.current.position.set(
      THREE.MathUtils.damp(groupRef.current.position.x, desiredPosition.x, damping, delta),
      THREE.MathUtils.damp(groupRef.current.position.y, desiredPosition.y, damping, delta),
      THREE.MathUtils.damp(groupRef.current.position.z, desiredPosition.z, damping, delta)
    )
    groupRef.current.lookAt(lookTarget)

    spawnScaleRef.current = reducedMotion
      ? 1
      : THREE.MathUtils.damp(spawnScaleRef.current, 1, 4.8, delta)
    groupRef.current.scale.setScalar(spawnScaleRef.current)

    if (bodyRef.current) {
      const tilt = reducedMotion ? 0 : Math.min(distanceToTarget * 0.045, 0.16)
      bodyRef.current.rotation.z = THREE.MathUtils.damp(bodyRef.current.rotation.z, tilt, 5, delta)
      bodyRef.current.rotation.y = reducedMotion ? 0 : Math.sin(time * 0.75) * 0.035
    }

    const blink = reducedMotion
      ? 1
      : 1 - Math.pow(Math.max(0, Math.sin(time * 1.35 - 1.1)), 28) * 0.88
    if (leftEyeRef.current) leftEyeRef.current.scale.y = 0.72 * blink
    if (rightEyeRef.current) rightEyeRef.current.scale.y = 0.72 * blink

    if (antennaRef.current) {
      antennaRef.current.scale.y = reducedMotion ? 1 : 1 + Math.sin(time * 2.2) * 0.045
    }
    if (antennaMaterialRef.current) {
      antennaMaterialRef.current.emissiveIntensity = reducedMotion
        ? 1.2
        : 1.05 + Math.sin(time * 2.8) * 0.35
    }

    const thrust = reducedMotion ? 0.55 : THREE.MathUtils.clamp(distanceToTarget * 0.8, 0.45, 1.35)
    if (leftThrusterRef.current) leftThrusterRef.current.scale.y = thrust
    if (rightThrusterRef.current) rightThrusterRef.current.scale.y = thrust
    if (leftThrusterMaterialRef.current) leftThrusterMaterialRef.current.opacity = 0.42 + thrust * 0.28
    if (rightThrusterMaterialRef.current) rightThrusterMaterialRef.current.opacity = 0.42 + thrust * 0.28

    const scanning = Boolean(targetPosition) && distanceToTarget < 0.72
    if (scanBeamRef.current) {
      scanBeamRef.current.visible = scanning

      if (scanning && targetPosition) {
        scanDirection.subVectors(targetPosition, groupRef.current.position)
        const scanDistance = scanDirection.length()
        scanMidpoint.copy(groupRef.current.position).addScaledVector(scanDirection, 0.5)
        scanBeamRef.current.position.copy(scanMidpoint)
        scanBeamRef.current.quaternion.setFromUnitVectors(upAxis, scanDirection.normalize())
        scanBeamRef.current.scale.set(1, scanDistance, 1)
      }
    }
    if (scanMaterialRef.current) {
      scanMaterialRef.current.opacity = reducedMotion ? 0.14 : 0.11 + Math.sin(time * 4) * 0.035
    }
  })

  return (
    <>
      <group
        ref={groupRef}
        visible={active}
        position={homePosition}
        scale={reducedMotion ? 1 : 0.08}
        onClick={(event) => {
          event.stopPropagation()
          setDialogueVersion((version) => version + 1)
        }}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={(event) => {
          event.stopPropagation()
          setHovered(false)
        }}
      >
        <group ref={bodyRef}>
          <mesh scale={[0.76, 0.62, 0.82]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhysicalMaterial
              color="#52647d"
              emissive="#0c1d31"
              emissiveIntensity={0.32}
              roughness={0.34}
              metalness={0.68}
              clearcoat={0.82}
              clearcoatRoughness={0.2}
            />
          </mesh>

          <mesh position={[0, -0.31, 0.69]} scale={[0.42, 0.15, 0.08]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial
              color="#1e293b"
              emissive="#06b6d4"
              emissiveIntensity={0.18}
              metalness={0.75}
              roughness={0.3}
            />
          </mesh>

          <mesh position={[0, 0.05, 0.7]} scale={[0.6, 0.34, 0.17]}>
            <sphereGeometry args={[1, 28, 28]} />
            <meshStandardMaterial
              color="#334a62"
              emissive="#0891b2"
              emissiveIntensity={0.45}
              metalness={0.72}
              roughness={0.25}
            />
          </mesh>

          <mesh position={[0, 0.05, 0.76]} scale={[0.53, 0.27, 0.14]}>
            <sphereGeometry args={[1, 28, 28]} />
            <meshPhysicalMaterial
              color="#06111f"
              emissive="#0c4a6e"
              emissiveIntensity={0.62}
              roughness={0.12}
              metalness={0.7}
              clearcoat={0.9}
            />
          </mesh>

          <mesh ref={leftEyeRef} position={[-0.2, 0.08, 0.9]} scale={[1.28, 0.72, 0.5]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color="#67e8f9" toneMapped={false} />
          </mesh>
          <mesh ref={rightEyeRef} position={[0.2, 0.08, 0.9]} scale={[1.28, 0.72, 0.5]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color="#67e8f9" toneMapped={false} />
          </mesh>

          <mesh position={[-0.175, 0.105, 0.946]}>
            <sphereGeometry args={[0.018, 10, 10]} />
            <meshBasicMaterial color="#f0fdff" toneMapped={false} />
          </mesh>
          <mesh position={[0.225, 0.105, 0.946]}>
            <sphereGeometry args={[0.018, 10, 10]} />
            <meshBasicMaterial color="#f0fdff" toneMapped={false} />
          </mesh>

          <group ref={antennaRef} position={[0, 0.72, 0]}>
            <mesh position={[0, 0.01, 0]} scale={[0.18, 0.08, 0.18]}>
              <sphereGeometry args={[1, 16, 12]} />
              <meshStandardMaterial color="#26384f" metalness={0.78} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.025, 0.035, 0.4, 10]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.82} roughness={0.28} />
            </mesh>
            <mesh position={[0, 0.43, 0]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial
                ref={antennaMaterialRef}
                color="#22d3ee"
                emissive="#22d3ee"
                emissiveIntensity={1.2}
                toneMapped={false}
              />
            </mesh>
          </group>

          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.7, -0.08, -0.18]}>
              <mesh scale={[0.22, 0.31, 0.38]}>
                <sphereGeometry args={[1, 20, 16]} />
                <meshStandardMaterial
                  color="#32465e"
                  emissive={side < 0 ? '#063f4d' : '#2e1956'}
                  emissiveIntensity={0.3}
                  metalness={0.76}
                  roughness={0.32}
                />
              </mesh>
              <mesh position={[side * 0.13, 0.02, 0.04]} scale={[0.07, 0.2, 0.24]}>
                <sphereGeometry args={[1, 14, 12]} />
                <meshStandardMaterial
                  color={side < 0 ? '#22d3ee' : '#8b5cf6'}
                  emissive={side < 0 ? '#0891b2' : '#6d28d9'}
                  emissiveIntensity={0.55}
                  metalness={0.55}
                  roughness={0.26}
                />
              </mesh>
            </group>
          ))}

          {([-1, 1] as const).map((side) => {
            const isLeft = side < 0
            const color = isLeft ? '#22d3ee' : '#8b5cf6'

            return (
              <group
                key={`thruster-${side}`}
                position={[side * 0.38, -0.28, -0.58]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <mesh>
                  <cylinderGeometry args={[0.18, 0.15, 0.38, 18]} />
                  <meshStandardMaterial
                    color="#26384f"
                    emissive="#0b1729"
                    emissiveIntensity={0.35}
                    metalness={0.82}
                    roughness={0.28}
                  />
                </mesh>
                <mesh position={[0, 0.21, 0]}>
                  <cylinderGeometry args={[0.14, 0.1, 0.1, 18, 1, true]} />
                  <meshStandardMaterial
                    color="#07111f"
                    emissive={color}
                    emissiveIntensity={0.7}
                    metalness={0.7}
                    roughness={0.22}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                <mesh position={[0, 0.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.035, 0.095, 18]} />
                  <meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
                <group
                  ref={isLeft ? leftThrusterRef : rightThrusterRef}
                  position={[0, 0.46, 0]}
                >
                  <mesh>
                    <coneGeometry args={[0.105, 0.42, 16, 1, true]} />
                    <meshBasicMaterial
                      ref={isLeft ? leftThrusterMaterialRef : rightThrusterMaterialRef}
                      color={color}
                      transparent
                      opacity={0.68}
                      blending={THREE.AdditiveBlending}
                      depthWrite={false}
                      toneMapped={false}
                    />
                  </mesh>
                  <mesh position={[0, -0.055, 0]}>
                    <coneGeometry args={[0.055, 0.27, 12]} />
                    <meshBasicMaterial
                      color={isLeft ? '#ecfeff' : '#ede9fe'}
                      transparent
                      opacity={0.9}
                      blending={THREE.AdditiveBlending}
                      depthWrite={false}
                      toneMapped={false}
                    />
                  </mesh>
                </group>
              </group>
            )
          })}

          <pointLight color="#67e8f9" intensity={0.7} distance={4.5} decay={2} />
        </group>

        <NebbiDialogue
          key={dialogueKey}
          message={message}
          repositoryName={selectedRepo?.name}
        />
      </group>

      <mesh ref={scanBeamRef} visible={false}>
        <cylinderGeometry args={[0.025, 0.18, 1, 16, 1, true]} />
        <meshBasicMaterial
          ref={scanMaterialRef}
          color="#22d3ee"
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}
