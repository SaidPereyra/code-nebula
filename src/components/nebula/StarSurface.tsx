'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const noiseFunctions = /* glsl */ `
  float hash(vec3 point) {
    point = fract(point * 0.3183099 + vec3(0.17, 0.31, 0.53));
    point *= 17.0;
    return fract(point.x * point.y * point.z * (point.x + point.y + point.z));
  }

  float noise(vec3 point) {
    vec3 cell = floor(point);
    vec3 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    return mix(
      mix(mix(hash(cell), hash(cell + vec3(1, 0, 0)), local.x),
          mix(hash(cell + vec3(0, 1, 0)), hash(cell + vec3(1, 1, 0)), local.x), local.y),
      mix(mix(hash(cell + vec3(0, 0, 1)), hash(cell + vec3(1, 0, 1)), local.x),
          mix(hash(cell + vec3(0, 1, 1)), hash(cell + vec3(1, 1, 1)), local.x), local.y),
      local.z
    );
  }

  float fbm(vec3 point) {
    float value = 0.0;
    float amplitude = 0.55;
    for (int octave = 0; octave < 4; octave++) {
      value += noise(point) * amplitude;
      point = point * 2.03 + vec3(1.7, 2.1, 0.9);
      amplitude *= 0.48;
    }
    return value;
  }
`

const surfaceVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vLocalPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPosition = worldPosition.xyz;
    vLocalPosition = position;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const surfaceFragmentShader = /* glsl */ `
  uniform float time;
  uniform vec3 deepColor;
  uniform vec3 warmColor;
  uniform vec3 hotColor;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vLocalPosition;

  ${noiseFunctions}

  void main() {
    vec3 flow = vLocalPosition * 2.45 + vec3(time * 0.06, -time * 0.035, time * 0.025);
    float broadTurbulence = fbm(flow);
    float fineTurbulence = fbm(vLocalPosition * 7.5 - vec3(time * 0.09, 0.0, time * 0.045));
    float cells = smoothstep(0.34, 0.82, broadTurbulence * 0.72 + fineTurbulence * 0.4);
    float hotRegions = smoothstep(0.62, 0.92, fineTurbulence + broadTurbulence * 0.28);
    float sunspots = smoothstep(0.76, 0.9, fbm(vLocalPosition * 3.1 + vec3(4.2, time * 0.02, 1.7)));

    vec3 surface = mix(deepColor, warmColor, cells);
    surface = mix(surface, hotColor, hotRegions * 0.82);
    surface *= 1.0 - sunspots * 0.34;

    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float facing = max(dot(normalize(vNormal), viewDirection), 0.0);
    float limb = pow(facing, 0.32);
    surface *= 0.72 + limb * 0.34;
    surface += hotColor * hotRegions * 0.24;

    gl_FragColor = vec4(surface, 1.0);
  }
`

const coronaVertexShader = /* glsl */ `
  uniform float time;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying float vTurbulence;

  ${noiseFunctions}

  void main() {
    float turbulence = fbm(normal * 3.2 + vec3(time * 0.055, -time * 0.035, time * 0.02));
    float pulse = sin(time * 1.25 + position.y * 3.0) * 0.025;
    vec3 displaced = position + normal * ((turbulence - 0.48) * 0.2 + pulse);
    vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);

    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorldPosition = worldPosition.xyz;
    vTurbulence = turbulence;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const coronaFragmentShader = /* glsl */ `
  uniform vec3 coronaColor;
  uniform float opacity;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying float vTurbulence;

  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - abs(dot(normalize(vNormal), viewDirection)), 2.15);
    float filaments = smoothstep(0.42, 0.88, vTurbulence);
    float alpha = (fresnel * 0.72 + filaments * fresnel * 0.45) * opacity;

    if (alpha < 0.015) discard;
    gl_FragColor = vec4(coronaColor * (0.82 + filaments * 0.45), alpha);
  }
`

interface StarMaterialProps {
  active: boolean
}

export function StarSurface({ active }: StarMaterialProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      deepColor: { value: new THREE.Color(active ? '#9a3412' : '#075985') },
      warmColor: { value: new THREE.Color(active ? '#f97316' : '#38bdf8') },
      hotColor: { value: new THREE.Color(active ? '#fde68a' : '#e0f2fe') },
    }),
    [active]
  )

  useFrame((_, delta) => {
    if (materialRef.current) materialRef.current.uniforms.time.value += delta
  })

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={surfaceVertexShader}
      fragmentShader={surfaceFragmentShader}
      uniforms={uniforms}
    />
  )
}

export function StarCorona({ active }: StarMaterialProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      coronaColor: { value: new THREE.Color(active ? '#fb923c' : '#7dd3fc') },
      opacity: { value: 0.42 },
    }),
    [active]
  )

  useFrame((_, delta) => {
    if (materialRef.current) materialRef.current.uniforms.time.value += delta
  })

  return (
    <shaderMaterial
      ref={materialRef}
      vertexShader={coronaVertexShader}
      fragmentShader={coronaFragmentShader}
      uniforms={uniforms}
      transparent
      depthWrite={false}
      side={THREE.DoubleSide}
      blending={THREE.AdditiveBlending}
    />
  )
}
