'use client'

import { NebulaProfile } from '@/lib/github/github.types'
import { UserStar } from './UserStar'
import { RepoPlanet } from './RepoPlanet'
import { OrbitRing } from './OrbitRing'
import { StarField } from './StarField'
import { CameraRig } from './CameraRig'
import { OrbitControls } from '@react-three/drei'

interface GalaxySceneProps {
  profile: NebulaProfile
}

export function GalaxyScene({ profile }: GalaxySceneProps) {
  return (
    <group>
      <StarField />
      <CameraRig />
      
      {/* Controls for manual navigation */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        minDistance={10}
        maxDistance={60}
        maxPolarAngle={Math.PI / 1.5} // Don't let the camera go too far below the plane
        autoRotate
        autoRotateSpeed={0.5}
      />

      <UserStar user={profile.user} summary={profile.summary} />

      {profile.repos.map((repo, index) => {
        // Distribute starting positions randomly along the orbit
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
