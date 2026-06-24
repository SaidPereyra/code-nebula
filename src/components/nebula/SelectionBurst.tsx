'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createSeededRandom } from '@/lib/nebula/galaxyMath'

const vertexShader = /* glsl */ `
  attribute vec3 velocity;
  attribute float size;

  uniform float progress;

  varying float vAlpha;

  void main() {
    float eased = 1.0 - pow(1.0 - min(progress, 1.0), 3.0);
    vec3 displaced = position + velocity * eased;
    vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);

    vAlpha = pow(1.0 - min(progress, 1.0), 1.8);
    gl_PointSize = clamp(size * (52.0 / max(8.0, -viewPosition.z)), 1.0, 6.0);
    gl_Position = projectionMatrix * viewPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 burstColor;

  varying float vAlpha;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = 1.0 - smoothstep(0.08, 0.5, distanceToCenter);

    if (alpha * vAlpha < 0.015) discard;
    gl_FragColor = vec4(burstColor, alpha * vAlpha);
  }
`

interface SelectionBurstProps {
  color: string
  radius: number
  seed: number
}

function createBurst(radius: number, seed: number) {
  const count = 52
  const random = createSeededRandom(seed)
  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let index = 0; index < count; index++) {
    const offset = index * 3
    const direction = new THREE.Vector3(
      random() * 2 - 1,
      random() * 2 - 1,
      random() * 2 - 1
    ).normalize()
    const startRadius = radius * (1.04 + random() * 0.16)
    const speed = radius * (0.65 + random() * 0.9)

    positions[offset] = direction.x * startRadius
    positions[offset + 1] = direction.y * startRadius
    positions[offset + 2] = direction.z * startRadius
    velocities[offset] = direction.x * speed
    velocities[offset + 1] = direction.y * speed
    velocities[offset + 2] = direction.z * speed
    sizes[index] = 1.1 + random() * 2.2
  }

  return { positions, velocities, sizes }
}

export function SelectionBurst({ color, radius, seed }: SelectionBurstProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const burst = useMemo(() => createBurst(radius, seed), [radius, seed])
  const uniforms = useMemo(
    () => ({
      progress: { value: 0 },
      burstColor: { value: new THREE.Color(color) },
    }),
    [color]
  )

  useFrame((_, delta) => {
    if (!materialRef.current || !pointsRef.current || !pointsRef.current.visible) return

    materialRef.current.uniforms.progress.value += delta * 1.15
    if (materialRef.current.uniforms.progress.value >= 1) pointsRef.current.visible = false
  })

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[burst.positions, 3]} />
        <bufferAttribute attach="attributes-velocity" args={[burst.velocities, 3]} />
        <bufferAttribute attach="attributes-size" args={[burst.sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}
