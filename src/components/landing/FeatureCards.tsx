import { GlassPanel } from '@/components/ui/GlassPanel'

const features = [
  {
    title: 'Living GitHub Galaxy',
    description: 'Explore your public repositories as orbiting planets. Colors, sizes, and speeds reflect languages, popularity, and recent activity.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-cyan">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        <path d="M2 12h20"></path>
      </svg>
    ),
  },
  {
    title: 'Nebbi Companion',
    description: 'A procedural mascot guides your exploration. Scan planets to read commit energy and uncover the story behind your code.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-violet">
        <path d="M12 8V4H8"></path>
        <rect x="4" y="8" width="16" height="12" rx="2"></rect>
        <path d="M2 14h2"></path>
        <path d="M20 14h2"></path>
        <path d="M15 13v2"></path>
        <path d="M9 13v2"></path>
      </svg>
    ),
  },
  {
    title: 'README Widget',
    description: 'Generate a dynamic, cosmic SVG badge to embed directly in your GitHub profile README and share your galaxy with others.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-pink">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
  },
]

export function FeatureCards() {
  return (
    <div className="mx-auto mt-16 grid w-full min-w-0 max-w-5xl grid-cols-1 gap-6 px-4 sm:mt-24 md:grid-cols-3">
      {features.map((feature, idx) => (
        <GlassPanel key={idx} className="p-6 flex flex-col gap-4 hover:border-cyan/30 transition-colors group">
          <div className="w-12 h-12 rounded-xl bg-surface border border-border-glass flex items-center justify-center group-hover:scale-110 transition-transform">
            {feature.icon}
          </div>
          <h3 className="text-xl font-semibold text-text-primary">
            {feature.title}
          </h3>
          <p className="text-text-muted leading-relaxed">
            {feature.description}
          </p>
        </GlassPanel>
      ))}
    </div>
  )
}
