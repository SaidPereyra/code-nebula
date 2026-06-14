import { UsernameSearch } from './UsernameSearch'

export function HeroSection() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center pt-32 pb-16 px-4 text-center">
      {/* Decorative background glow for hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan/10 blur-[120px] pointer-events-none rounded-[100%]" />
      
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-glass bg-surface-glass text-xs font-medium text-cyan mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
          </span>
          System Online
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-text-secondary">
          Turn your GitHub into a<br className="hidden sm:block" /> living code galaxy.
        </h1>
        
        <p className="mt-4 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Explore your public repositories as orbiting planets, scan their activity with Nebbi, and generate a cosmic README widget for your profile.
        </p>

        <div className="mt-8 w-full">
          <UsernameSearch />
        </div>
      </div>
    </section>
  )
}
