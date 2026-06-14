import { AppShell } from '@/components/layout/AppShell'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeatureCards } from '@/components/landing/FeatureCards'

export default function Home() {
  return (
    <AppShell>
      <div className="flex flex-col items-center w-full pb-24">
        <HeroSection />
        <FeatureCards />
        
        {/* Mock representation of the 3D scene (Phase 1 placeholder) */}
        <div className="mt-32 relative w-full max-w-3xl aspect-video mx-auto rounded-3xl border border-border-glass bg-surface-glass overflow-hidden shadow-2xl flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue/10 via-bg to-bg pointer-events-none" />
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Center Star */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber to-pink shadow-[0_0_60px_rgba(245,158,11,0.5)] z-10 animate-pulse" />
            
            {/* Orbit rings & planets mock */}
            <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5 animate-[spin_20s_linear_infinite]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan shadow-[0_0_20px_var(--color-cyan)]" />
            </div>
            
            <div className="absolute w-[500px] h-[500px] rounded-full border border-white/5 animate-[spin_35s_linear_infinite_reverse]">
              <div className="absolute top-1/4 -right-2 w-4 h-4 rounded-full bg-emerald shadow-[0_0_15px_var(--color-emerald)]" />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none backdrop-blur-[2px] bg-bg/40">
              <span className="px-4 py-2 rounded-full border border-border-glass bg-surface-glass text-sm text-text-muted font-mono tracking-wider">
                Interactive 3D galaxy coming in Phase 2
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
