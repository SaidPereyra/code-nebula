'use client'

import { useNebulaStore } from '@/store/nebula.store'
import { useEffect, useState } from 'react'

export function GalaxyHud() {
  const selectedRepo = useNebulaStore((state) => state.selectedRepo)
  const [visible, setVisible] = useState(true)

  // Hide the HUD automatically once they click something
  useEffect(() => {
    if (selectedRepo) {
      setVisible(false)
    }
  }, [selectedRepo])

  if (!visible) return null

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none animate-pulse">
      <div className="px-6 py-2 rounded-full border border-cyan/20 bg-surface-glass backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.1)]">
        <p className="text-sm font-medium text-cyan tracking-wide">
          Click a planet to inspect repository signal
        </p>
      </div>
    </div>
  )
}
