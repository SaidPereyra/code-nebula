import { NebulaCanvas } from '@/components/nebula/NebulaCanvas'
import { RepoPanel } from '@/components/ui/RepoPanel'
import { mockProfile } from '@/lib/nebula/mockNebula'
import Link from 'next/link'

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  
  // Phase 2: Use mock data instead of fetching
  const profile = mockProfile

  return (
    <main className="relative w-full h-screen overflow-hidden bg-bg">
      {/* 3D Scene */}
      <NebulaCanvas profile={profile} />

      {/* UI Overlays */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-10">
        
        {/* Top Left: Header / Breadcrumb */}
        <div className="pointer-events-auto flex items-center gap-4">
          <Link 
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-glass border border-border-glass backdrop-blur-md text-text-muted hover:text-text-primary hover:border-cyan/50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </Link>
          <div className="px-4 py-2 rounded-xl bg-surface-glass border border-border-glass backdrop-blur-md">
            <span className="text-sm font-medium text-text-primary">
              Sector: <span className="text-cyan font-mono">{username}</span>
            </span>
          </div>
        </div>

      </div>

      {/* Selected Repo Detail Panel */}
      <div className="pointer-events-auto">
        <RepoPanel />
      </div>

    </main>
  )
}
