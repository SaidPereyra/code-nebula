import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 border-b border-border-glass bg-bg/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet to-cyan flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-bg rounded-full flex items-center justify-center group-hover:scale-90 transition-transform">
              <div className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_10px_var(--color-cyan)]" />
            </div>
          </div>
          <span className="font-bold text-lg tracking-tight text-text-primary">
            Code Nebula
          </span>
        </Link>

        <nav>
          <a
            href="https://github.com/SaidPereyra/code-nebula"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
