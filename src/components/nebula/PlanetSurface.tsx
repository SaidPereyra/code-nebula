'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
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

const fragmentShader = /* glsl */ `
  uniform vec3 primaryColor;
  uniform vec3 secondaryColor;
  uniform vec3 emissiveColor;
  uniform float seed;
  uniform float highlight;

  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying vec3 vLocalPosition;

  float hash(vec3 point) {
    point = fract(point * 0.3183099 + vec3(seed * 0.013));
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
      point = point * 2.04 + vec3(1.7, 0.9, 2.3);
      amplitude *= 0.47;
    }

    return value;
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDirection = normalize(-vWorldPosition);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float diffuse = max(dot(normal, lightDirection), 0.0);
    float rim = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.4);

    vec3 seedOffset = vec3(seed * 0.31, seed * 0.17, seed * 0.43);
    float broadDetail = fbm(vLocalPosition * 3.8 + seedOffset);
    float fineDetail = fbm(vLocalPosition * 10.5 - seedOffset.yzx);
    float ridges = 1.0 - abs(fineDetail * 2.0 - 1.0);
    float bands = sin((vLocalPosition.y + broadDetail * 0.2) * 11.0 + seed) * 0.5 + 0.5;
    float surfaceSignal = broadDetail * 0.56 + fineDetail * 0.2 + ridges * 0.14 + bands * 0.1;
    float surfaceMix = smoothstep(0.3, 0.72, surfaceSignal);
    vec3 surface = mix(secondaryColor, primaryColor, surfaceMix);
    surface *= 0.84 + fineDetail * 0.24;

    float lighting = 0.2 + diffuse * 0.8;
    vec3 color = surface * lighting;
    color += emissiveColor * (0.025 + rim * 0.08 + highlight * 0.1);
    color += vec3(1.0) * pow(max(dot(reflect(-lightDirection, normal), viewDirection), 0.0), 32.0) * 0.08;

    gl_FragColor = vec4(color, 1.0);
  }
`

interface PlanetSurfaceProps {
  primary: string
  secondary: string
  emissive: string
  seed: number
  highlighted: boolean
}

export function PlanetSurface({ primary, secondary, emissive, seed, highlighted }: PlanetSurfaceProps) {
  const uniforms = useMemo(
    () => ({
      primaryColor: { value: new THREE.Color(primary) },
      secondaryColor: { value: new THREE.Color(secondary) },
      emissiveColor: { value: new THREE.Color(emissive) },
      seed: { value: seed },
      highlight: { value: highlighted ? 1 : 0 },
    }),
    [emissive, highlighted, primary, secondary, seed]
  )

  return (
    <shaderMaterial
      vertexShader={vertexShader}
      fragmentShader={fragmentShader}
      uniforms={uniforms}
    />
  )
}
