import { UsernameSearch } from './UsernameSearch'

export function HeroSection() {
  return (
    <section className="relative flex w-full min-w-0 flex-col items-center justify-center overflow-x-clip px-4 pb-12 pt-20 text-center sm:pb-16 sm:pt-32">
      {/* Decorative background glow for hero */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(400px,70vw)] w-[min(800px,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-cyan/10 blur-[100px] sm:blur-[120px]" />
      
      <div className="relative z-10 mx-auto flex w-full min-w-0 max-w-4xl flex-col items-center gap-5 sm:gap-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border-glass bg-surface-glass text-xs font-medium text-cyan mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
          </span>
          System Online
        </div>
        
        <h1 className="max-w-full bg-gradient-to-br from-white to-text-secondary bg-clip-text pb-2 text-[clamp(2.45rem,11.5vw,4.5rem)] font-extrabold leading-[1.06] tracking-tight text-transparent">
          Turn your GitHub into a<br className="hidden sm:block" /> living code galaxy.
        </h1>
        
        <p className="mx-auto mt-2 max-w-2xl text-base leading-relaxed text-text-secondary sm:mt-4 sm:text-xl">
          Explore your public repositories as orbiting planets, scan their activity with Nebbi, and generate a cosmic README widget for your profile.
        </p>

        <div className="mt-5 w-full min-w-0 sm:mt-8">
          <UsernameSearch />
        </div>
      </div>
    </section>
  )
}
