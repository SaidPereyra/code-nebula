import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen min-w-0 max-w-full flex-col overflow-x-clip font-sans text-text-primary">
      {/* Global Space Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-bg" />
        
        {/* Subtle radial gradients for galaxy effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan/10 blur-[150px]" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-pink/5 blur-[100px]" />
        
        {/* Simple CSS stars */}
        <div 
          className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1.5px)',
            backgroundSize: '40px 40px'
          }}
        />
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: 'radial-gradient(circle at center, white 1.5px, transparent 2px)',
            backgroundSize: '90px 90px',
            backgroundPosition: '20px 20px'
          }}
        />
      </div>

      <Header />
      
      <main className="relative z-0 mt-16 flex min-w-0 flex-1 flex-col">
        {children}
      </main>

      <Footer />
    </div>
  )
}
