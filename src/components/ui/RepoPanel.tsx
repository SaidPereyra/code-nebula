'use client'

import { useNebulaStore } from '@/store/nebula.store'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { formatNumber, formatDate } from '@/lib/utils/format'
import { motion } from 'framer-motion'

export function RepoPanel() {
  const selectedRepo = useNebulaStore((state) => state.selectedRepo)
  const summaryVisible = useNebulaStore((state) => state.summaryVisible)
  const widgetVisible = useNebulaStore((state) => state.widgetVisible)
  const setSelectedRepo = useNebulaStore((state) => state.setSelectedRepo)
  if (!selectedRepo || summaryVisible || widgetVisible) return null

  return (
    <motion.div
      key={selectedRepo.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="absolute right-4 top-20 z-20 max-h-[calc(100dvh-10rem)] w-[calc(100vw-2rem)] max-w-[19rem] overflow-y-auto overscroll-contain rounded-2xl sm:right-6 sm:top-24 sm:max-h-[calc(100dvh-8rem)]"
    >
      <GlassPanel className="p-0 border-t overflow-hidden shadow-[0_20px_60px_rgba(2,6,23,0.48)]" style={{ borderTopColor: selectedRepo.theme.primary }}>
        
        {/* Subtle scanline overlay for cyber feel */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_5px]" />
        
        {/* Glowing top accent reflection */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px opacity-70 shadow-[0_0_10px_currentColor]"
          style={{ backgroundColor: selectedRepo.theme.primary }} 
        />

        <div className="relative z-10 p-4 sm:p-5">
          <div className="mb-3 flex items-start justify-between sm:mb-4">
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-bg/60 border border-border-glass">
              <div 
                className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" 
                style={{ backgroundColor: selectedRepo.theme.primary, color: selectedRepo.theme.primary }}
              />
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
                {selectedRepo.language}
              </span>
            </div>
            <button 
              onClick={() => setSelectedRepo(null)}
              aria-label="Close repository details"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-glass border border-border-glass text-text-muted hover:text-white hover:bg-surface transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <h2 className="mb-2 line-clamp-2 text-lg font-bold text-text-primary">
            {selectedRepo.name}
          </h2>
          
          {selectedRepo.description ? (
            <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-text-secondary sm:mb-5">
              {selectedRepo.description}
            </p>
          ) : (
            <p className="mb-4 text-sm italic text-text-muted sm:mb-5">No description provided.</p>
          )}

          <div className="mb-4 grid grid-cols-2 gap-2.5 sm:mb-5 sm:gap-3">
            <div className="group relative overflow-hidden rounded-lg border border-border-glass bg-bg/60 p-2.5 sm:p-3">
              <div className="absolute inset-0 bg-amber/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                Stars
              </div>
              <div className="font-mono font-bold text-text-primary text-lg tracking-tight">
                {formatNumber(selectedRepo.stars)}
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border border-border-glass bg-bg/60 p-2.5 sm:p-3">
              <div className="absolute inset-0 bg-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"></path><path d="M12 12v3"></path></svg>
                Forks
              </div>
              <div className="font-mono font-bold text-text-primary text-lg tracking-tight">
                {formatNumber(selectedRepo.forks)}
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between rounded-md border border-border-glass/50 bg-bg/30 px-3 py-2 text-xs text-text-muted sm:mb-5">
            <span>Last update</span>
            <span className="font-mono text-text-secondary">{formatDate(selectedRepo.updatedAt)}</span>
          </div>

          {selectedRepo.isProfileRepo && selectedRepo.pageUrl ? (
            <div className="grid grid-cols-2 gap-2">
              <a
                href={selectedRepo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-border-glass bg-white/5 text-xs font-semibold text-text-secondary transition-all hover:border-white/20 hover:text-text-primary"
              >
                Repository
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </a>
              <a
                href={selectedRepo.pageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-cyan/25 bg-cyan/10 text-xs font-semibold text-cyan transition-all hover:border-cyan/40 hover:bg-cyan/15"
              >
                Visit Website
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </a>
            </div>
          ) : (
            <a
              href={selectedRepo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-10 flex items-center justify-center gap-2 rounded-lg border border-cyan/20 bg-cyan/10 text-cyan text-sm font-semibold hover:bg-cyan/15 hover:border-cyan/35 transition-all"
            >
              Access Repository
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>
          )}
        </div>
      </GlassPanel>
    </motion.div>
  )
}
