'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function NebulaClouds() {
  const groupRef = useRef<THREE.Group>(null)

  // Memoize positions and colors for performance
  const clouds = useMemo(() => {
    const temp = []
    for (let i = 0; i < 15; i++) {
      // Random position far away
      const radius = 60 + Math.random() * 40
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI * 0.8
      
      const x = radius * Math.cos(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi)
      const z = radius * Math.cos(phi) * Math.sin(theta)

      const scale = 30 + Math.random() * 40
      
      // Select random nebula colors
      const colors = ['#22d3ee', '#8b5cf6', '#ec4899', '#3b82f6', '#020617']
      const color = colors[Math.floor(Math.random() * colors.length)]

      temp.push({ position: new THREE.Vector3(x, y, z), scale, color })
    }
    return temp
  }, [])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02
    }
  })

  // We use soft additive spheres for a volumetric look without heavy textures
  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.position}>
          <sphereGeometry args={[cloud.scale, 16, 16]} />
          <meshBasicMaterial 
            color={cloud.color} 
            transparent 
            opacity={0.05} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}
