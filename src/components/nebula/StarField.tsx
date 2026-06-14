'use client'

import { Stars } from '@react-three/drei'

export function StarField() {
  return (
    <group>
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0.5} 
        fade 
        speed={1} 
      />
      {/* Additional larger stars for a more magical feel */}
      <Stars 
        radius={50} 
        depth={20} 
        count={200} 
        factor={6} 
        saturation={1} 
        fade 
        speed={2} 
      />
    </group>
  )
}
