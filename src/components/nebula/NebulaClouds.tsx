'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { createSeededRandom } from '@/lib/nebula/galaxyMath'

const vertexShader = /* glsl */ `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(size * (70.0 / max(20.0, -viewPosition.z)), 1.0, 14.0);
    gl_Position = projectionMatrix * viewPosition;
  }
`

const fragmentShader = /* glsl */ `
  uniform float opacity;
  varying vec3 vColor;

  void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float softEdge = 1.0 - smoothstep(0.08, 0.5, distanceToCenter);
    float softCore = 1.0 - smoothstep(0.0, 0.28, distanceToCenter);
    float alpha = (softEdge * 0.7 + softCore * 0.3) * opacity;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor, alpha);
  }
`

interface CloudLayerProps {
  seed: number
  count: number
  center: [number, number, number]
  spread: [number, number, number]
  colors: [string, string]
  opacity: number
  size: [number, number]
}

function CloudLayer({ seed, count, center, spread, colors, opacity, size }: CloudLayerProps) {
  const { positions, pointColors, sizes, uniforms } = useMemo(() => {
    const rng = createSeededRandom(seed)
    const positionData = new Float32Array(count * 3)
    const colorData = new Float32Array(count * 3)
    const sizeData = new Float32Array(count)
    const startColor = new THREE.Color(colors[0])
    const endColor = new THREE.Color(colors[1])
    const mixedColor = new THREE.Color()

    for (let index = 0; index < count; index++) {
      const offset = index * 3
      const concentration = 0.35 + rng() * 0.65
      positionData[offset] = center[0] + (rng() - 0.5) * spread[0] * concentration
      positionData[offset + 1] = center[1] + (rng() - 0.5) * spread[1] * concentration
      positionData[offset + 2] = center[2] + (rng() - 0.5) * spread[2]

      mixedColor.copy(startColor).lerp(endColor, rng())
      colorData[offset] = mixedColor.r
      colorData[offset + 1] = mixedColor.g
      colorData[offset + 2] = mixedColor.b
      sizeData[index] = size[0] + rng() * (size[1] - size[0])
    }

    return {
      positions: positionData,
      pointColors: colorData,
      sizes: sizeData,
      uniforms: { opacity: { value: opacity } },
    }
  }, [center, colors, count, opacity, seed, size, spread])

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[pointColors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export function NebulaClouds() {
  return (
    <group>
      <CloudLayer
        seed={42}
        count={130}
        center={[-18, -5, -42]}
        spread={[78, 28, 24]}
        colors={['#172554', '#4c1d95']}
        opacity={0.085}
        size={[2.5, 6.5]}
      />
      <CloudLayer
        seed={84}
        count={110}
        center={[24, 8, -58]}
        spread={[64, 24, 20]}
        colors={['#083344', '#1e3a8a']}
        opacity={0.07}
        size={[2, 5.5]}
      />
    </group>
  )
}
