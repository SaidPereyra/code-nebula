'use client'

import { Sphere } from '@react-three/drei'
import type { GitHubUser, NebulaSummary } from '@/lib/github/github.types'
import { StarCorona, StarSurface } from './StarSurface'

interface UserStarProps {
  user: GitHubUser
  summary: NebulaSummary
}

export function UserStar({ user, summary }: UserStarProps) {
  const baseScale = Math.min(Math.max(user.publicRepos / 22, 1.55), 2.45)
  const isActive =
    summary.dominantEnergy === 'active' || summary.dominantEnergy === 'supernova'
  const lightColor = isActive ? '#fbbf24' : '#7dd3fc'

  return (
    <group>
      <pointLight intensity={1.55} color={lightColor} distance={65} decay={2} />

      <Sphere args={[baseScale, 64, 64]}>
        <StarSurface active={isActive} />
      </Sphere>

      <mesh scale={baseScale * 1.16}>
        <sphereGeometry args={[1, 48, 48]} />
        <StarCorona active={isActive} />
      </mesh>
    </group>
  )
}
