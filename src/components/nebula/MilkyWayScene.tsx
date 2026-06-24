'use client'

import { useMemo, useRef } from 'react'
import type { RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { createGaussianRandom, createSeededRandom } from '@/lib/nebula/galaxyMath'
import type { ExperienceStage } from './NebulaCanvas'

export const MILKY_WAY_TARGET: [number, number, number] = [10.5, -5.2, 0.35]

const vertexShader = /* glsl */ `
  attribute float size;
  attribute float brightness;
  attribute float phase;
  attribute vec3 color;

  varying vec3 vColor;
  varying float vBrightness;

  uniform float pixelRatio;
  uniform float time;

  void main() {
    float twinkle = 0.82 + sin(time * (0.7 + phase) + phase * 6.28318) * 0.18;
    vColor = color;
    vBrightness = brightness * twinkle;

    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    float perspectiveSize = size * twinkle * pixelRatio * (86.0 / max(7.0, -viewPosition.z));
    gl_PointSize = clamp(perspectiveSize, 0.8, 26.0);
    gl_Position = projectionMatrix * viewPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float opacity;

  varying vec3 vColor;
  varying float vBrightness;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = 1.0 - smoothstep(0.04, 0.5, distanceToCenter);
    alpha *= 0.72 + (1.0 - distanceToCenter) * 0.28;

    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vColor * (0.82 + vBrightness * 0.55), alpha * opacity * vBrightness);
  }
`

interface MilkyWaySceneProps {
  active: boolean
  stage: ExperienceStage
  targetRef: RefObject<THREE.Mesh | null>
}

function createGalaxyData(count: number) {
  const random = createSeededRandom(2306)
  const gaussian = createGaussianRandom(random)
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const brightness = new Float32Array(count)
  const phases = new Float32Array(count)
  const coreColor = new THREE.Color('#ffd7a3')
  const innerColor = new THREE.Color('#f08fbd')
  const outerColor = new THREE.Color('#6c71cf')
  const edgeColor = new THREE.Color('#2bb9d2')
  const haloColor = new THREE.Color('#7397d8')
  const color = new THREE.Color()
  const armCount = 3

  for (let index = 0; index < count; index++) {
    const offset = index * 3
    const population = random()
    let radiusRatio = 0
    let particleBrightness = 0.5
    let particleSize = 1

    if (population < 0.17) {
      const coreRadius = Math.min(Math.abs(gaussian()) * 3.8, 8.5)
      const angle = random() * Math.PI * 2
      positions[offset] = Math.cos(angle) * coreRadius
      positions[offset + 1] = Math.sin(angle) * coreRadius
      positions[offset + 2] = THREE.MathUtils.clamp(gaussian() * 2.1, -5.5, 5.5)
      radiusRatio = coreRadius / 25
      particleBrightness = 0.72 + random() * 0.28
      particleSize = 1.25 + random() * 2.8
      color.copy(coreColor).lerp(innerColor, Math.min(1, coreRadius / 7))
    } else if (population < 0.72) {
      const radius = (2.5 + Math.pow(random(), 0.72) * 23) 
      const arm = Math.floor(random() * armCount)
      const armOrigin = (arm / armCount) * Math.PI * 2
      const angularSpread = gaussian() * (0.16 + radius / 95)
      const radialSpread = gaussian() * (0.38 + radius / 20)
      const finalRadius = Math.max(1, radius + radialSpread)
      const angle = armOrigin + finalRadius * 0.3 + angularSpread
      radiusRatio = finalRadius / 26

      positions[offset] = Math.cos(angle) * finalRadius
      positions[offset + 1] = Math.sin(angle) * finalRadius
      positions[offset + 2] = THREE.MathUtils.clamp(
        gaussian() * (0.45 + radiusRatio * 1.05),
        -3.8,
        3.8
      )
      particleBrightness = 0.48 + random() * 0.48
      particleSize = 0.75 + random() * 2.05
      color.copy(innerColor).lerp(outerColor, Math.min(1, radiusRatio))
    } else if (population < 0.93) {
      const radius = Math.sqrt(random()) * 27
      const angle = random() * Math.PI * 2
      radiusRatio = radius / 27

      positions[offset] = Math.cos(angle) * radius + gaussian() * 0.35
      positions[offset + 1] = Math.sin(angle) * radius + gaussian() * 0.35
      positions[offset + 2] = THREE.MathUtils.clamp(
        gaussian() * (0.6 + radiusRatio * 1.35),
        -4.5,
        4.5
      )
      particleBrightness = 0.2 + random() * 0.42
      particleSize = 0.55 + random() * 1.35
      color.copy(outerColor).lerp(edgeColor, radiusRatio)
    } else {
      const radius = 10 + Math.pow(random(), 0.55) * 24
      const azimuth = random() * Math.PI * 2
      const elevation = Math.asin(random() * 2 - 1)
      const flattenedY = Math.cos(elevation) * radius
      radiusRatio = radius / 34

      positions[offset] = Math.cos(azimuth) * flattenedY
      positions[offset + 1] = Math.sin(azimuth) * flattenedY
      positions[offset + 2] = Math.sin(elevation) * radius * 0.42
      particleBrightness = 0.16 + random() * 0.32
      particleSize = 0.6 + random() * 1.6
      color.copy(haloColor).lerp(edgeColor, radiusRatio * 0.45)
    }

    const colorVariation = 0.72 + random() * 0.28
    colors[offset] = color.r * colorVariation
    colors[offset + 1] = color.g * colorVariation
    colors[offset + 2] = color.b * colorVariation
    sizes[index] = particleSize
    brightness[index] = particleBrightness
    phases[index] = random()
  }

  return { positions, colors, sizes, brightness, phases }
}

export function MilkyWayScene({ active, stage, targetRef }: MilkyWaySceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const targetMaterialRef = useRef<THREE.MeshBasicMaterial>(null)
  const { size, viewport } = useThree()
  const pointCount = size.width < 768 ? 19000 : 42000
  const galaxy = useMemo(() => createGalaxyData(pointCount), [pointCount])
  const uniforms = useMemo(
    () => ({
      opacity: { value: 1 },
      pixelRatio: { value: Math.min(viewport.dpr, 1.5) },
      time: { value: 0 },
    }),
    [viewport.dpr]
  )
  const targetPosition = useMemo(() => new THREE.Vector3(), [])
  const targetColor = useMemo(() => new THREE.Color('#fff2c7'), [])
  const darkColor = useMemo(() => new THREE.Color('#050816'), [])

  useFrame((state, delta) => {
    if (!active) return

    if (groupRef.current) groupRef.current.rotation.z += delta * 0.016

    const targetOpacity = stage === 'reveal' ? 0 : 1
    if (materialRef.current) {
      materialRef.current.uniforms.time.value += delta
      materialRef.current.uniforms.opacity.value = THREE.MathUtils.damp(
        materialRef.current.uniforms.opacity.value,
        targetOpacity,
        5,
        delta
      )
    }

    if (targetRef.current && targetMaterialRef.current) {
      targetRef.current.getWorldPosition(targetPosition)
      const distance = Math.max(0.6, targetPosition.distanceTo(state.camera.position))
      const scale = THREE.MathUtils.clamp(8 / distance, 0.16, 2.8)
      targetRef.current.scale.setScalar(scale)
      targetMaterialRef.current.color.lerp(
        stage === 'reveal' ? darkColor : targetColor,
        1 - Math.exp(-delta * 7)
      )
    }
  })

  return (
    <group ref={groupRef} visible={active} rotation={[0.58, -0.08, -0.12]}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[galaxy.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[galaxy.colors, 3]} />
          <bufferAttribute attach="attributes-size" args={[galaxy.sizes, 1]} />
          <bufferAttribute attach="attributes-brightness" args={[galaxy.brightness, 1]} />
          <bufferAttribute attach="attributes-phase" args={[galaxy.phases, 1]} />
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

      <mesh ref={targetRef} position={MILKY_WAY_TARGET}>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshBasicMaterial ref={targetMaterialRef} color="#fff2c7" toneMapped={false} />
        <pointLight color="#f9a8d4" intensity={0.55} distance={5} decay={2} />
      </mesh>
    </group>
  )
}
