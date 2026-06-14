'use client'

import { NebulaProfile } from '@/lib/github/github.types'
import { UserStar } from './UserStar'
import { RepoPlanet } from './RepoPlanet'
import { OrbitRing } from './OrbitRing'
import { StarField } from './StarField'
import { CameraRig } from './CameraRig'
import { NebulaClouds } from './NebulaClouds'
import { OrbitControls } from '@react-three/drei'

interface GalaxySceneProps {
  profile: NebulaProfile
}

export function GalaxyScene({ profile }: GalaxySceneProps) {
  return (
    <group>
      <StarField />
      <NebulaClouds />
      <CameraRig />
      
      {/* Controls for manual navigation */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={15}
        maxDistance={80}
        maxPolarAngle={Math.PI / 1.8} // Restrict looking under the galaxy completely
        minPolarAngle={Math.PI / 6} // Don't look exactly top-down
        autoRotate
        autoRotateSpeed={0.3}
        dampingFactor={0.05} // Smoother inertia
      />

      <UserStar user={profile.user} summary={profile.summary} />

      {profile.repos.map((repo, index) => {
        const initialAngle = (index / profile.repos.length) * Math.PI * 2 + Math.random()
        return (
          <group key={repo.id}>
            <OrbitRing radius={repo.orbitRadius} />
            <RepoPlanet repo={repo} initialAngle={initialAngle} />
          </group>
        )
      })}
    </group>
  )
}
