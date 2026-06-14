import { ReactNode, HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  glow?: boolean
}

export function GlassPanel({ children, className, glow = false, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-border-glass bg-surface-glass backdrop-blur-md overflow-hidden',
        glow && 'shadow-[0_0_30px_-5px_rgba(34,211,238,0.15)]',
        className
      )}
      {...props}
    >
      {/* Optional subtle inner gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
