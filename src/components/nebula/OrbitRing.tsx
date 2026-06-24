'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createGaussianRandom, createSeededRandom } from '@/lib/nebula/galaxyMath'

const vertexShader = /* glsl */ `
  attribute float size;
  attribute float brightness;
  attribute float phase;

  varying float vBrightness;

  uniform float time;

  void main() {
    float twinkle = 0.76 + sin(time * (0.5 + phase) + phase * 6.28318) * 0.24;
    vBrightness = brightness * twinkle;

    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(size * twinkle * (58.0 / max(12.0, -viewPosition.z)), 0.8, 4.5);
    gl_Position = projectionMatrix * viewPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform vec3 dustColor;
  uniform float opacity;

  varying float vBrightness;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = 1.0 - smoothstep(0.08, 0.5, distanceToCenter);

    if (alpha < 0.02) discard;
    gl_FragColor = vec4(dustColor * (0.72 + vBrightness * 0.5), alpha * opacity * vBrightness);
  }
`

interface OrbitRingProps {
  radius: number
}

interface StardustRingProps {
  radius: number
  radialSpread: number
  verticalSpread: number
  count: number
  color: string
  opacity: number
  driftSpeed: number
  seed: number
  rotation?: [number, number, number]
}

function createOrbitDust(
  radius: number,
  radialSpread: number,
  verticalSpread: number,
  count: number,
  seed: number
) {
  const random = createSeededRandom(seed)
  const gaussian = createGaussianRandom(random)
  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const brightness = new Float32Array(count)
  const phases = new Float32Array(count)

  for (let index = 0; index < count; index++) {
    const offset = index * 3
    const angle = random() * Math.PI * 2
    const radialJitter = THREE.MathUtils.clamp(
      gaussian() * radialSpread * 0.42,
      -radialSpread,
      radialSpread
    )
    const particleRadius = radius + radialJitter

    positions[offset] = Math.cos(angle) * particleRadius
    positions[offset + 1] = THREE.MathUtils.clamp(
      gaussian() * verticalSpread,
      -verticalSpread * 3,
      verticalSpread * 3
    )
    positions[offset + 2] = Math.sin(angle) * particleRadius
    sizes[index] = 0.7 + random() * 1.45
    brightness[index] = 0.22 + Math.pow(random(), 1.4) * 0.68
    phases[index] = random()
  }

  return { positions, sizes, brightness, phases }
}

export function StardustRing({
  radius,
  radialSpread,
  verticalSpread,
  count,
  color,
  opacity,
  driftSpeed,
  seed,
  rotation = [0, 0, 0],
}: StardustRingProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const dust = useMemo(
    () => createOrbitDust(radius, radialSpread, verticalSpread, count, seed),
    [count, radialSpread, radius, seed, verticalSpread]
  )
  const uniforms = useMemo(
    () => ({
      time: { value: radius * 0.37 },
      dustColor: { value: new THREE.Color(color) },
      opacity: { value: opacity },
    }),
    [color, opacity, radius]
  )

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * driftSpeed
    if (materialRef.current) materialRef.current.uniforms.time.value += delta
  })

  return (
    <group rotation={rotation}>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust.positions, 3]} />
          <bufferAttribute attach="attributes-size" args={[dust.sizes, 1]} />
          <bufferAttribute attach="attributes-brightness" args={[dust.brightness, 1]} />
          <bufferAttribute attach="attributes-phase" args={[dust.phases, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export function OrbitRing({ radius }: OrbitRingProps) {
  return (
    <StardustRing
      radius={radius}
      radialSpread={0.14}
      verticalSpread={0.025}
      count={Math.round(118 + radius * 6.5)}
      color="#38bdf8"
      opacity={0.38}
      driftSpeed={0.0025 + 0.01 / radius}
      seed={Math.round(radius * 997)}
    />
  )
}
