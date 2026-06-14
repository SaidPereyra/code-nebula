'use client'

import { useNebulaStore } from '@/store/nebula.store'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { formatNumber, formatDate } from '@/lib/utils/format'

export function RepoPanel() {
  const selectedRepo = useNebulaStore((state) => state.selectedRepo)
  const setSelectedRepo = useNebulaStore((state) => state.setSelectedRepo)

  if (!selectedRepo) return null

  return (
    <div className="absolute right-6 top-24 w-80 z-20 animate-in fade-in slide-in-from-right-8 duration-300">
      <GlassPanel glow className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: selectedRepo.theme.primary }}
            />
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
              {selectedRepo.language}
            </span>
          </div>
          <button 
            onClick={() => setSelectedRepo(null)}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <h2 className="text-xl font-bold text-text-primary mb-2 line-clamp-2">
          {selectedRepo.name}
        </h2>
        
        {selectedRepo.description ? (
          <p className="text-sm text-text-secondary mb-6 line-clamp-3 leading-relaxed">
            {selectedRepo.description}
          </p>
        ) : (
          <p className="text-sm text-text-muted italic mb-6">No description provided.</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-bg/50 p-3 rounded-lg border border-border-glass">
            <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Stars
            </div>
            <div className="font-mono font-bold text-text-primary">
              {formatNumber(selectedRepo.stars)}
            </div>
          </div>
          <div className="bg-bg/50 p-3 rounded-lg border border-border-glass">
            <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path><path d="M12 12v3"></path></svg>
              Forks
            </div>
            <div className="font-mono font-bold text-text-primary">
              {formatNumber(selectedRepo.forks)}
            </div>
          </div>
        </div>

        <div className="text-xs text-text-muted mb-6 flex justify-between items-center">
          <span>Updated</span>
          <span className="font-mono">{formatDate(selectedRepo.updatedAt)}</span>
        </div>

        <a 
          href={selectedRepo.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-surface border border-border-glass text-text-primary text-sm font-medium hover:bg-white hover:text-bg transition-all"
        >
          View Repository
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
        </a>
      </GlassPanel>
    </div>
  )
}
