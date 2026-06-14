export function Footer() {
  return (
    <footer className="w-full border-t border-border-glass bg-bg/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} Code Nebula. Built as a portfolio project.
        </p>
        <div className="flex gap-4 text-sm text-text-muted">
          <span>Explore your GitHub as a living code galaxy.</span>
        </div>
      </div>
    </footer>
  )
}
