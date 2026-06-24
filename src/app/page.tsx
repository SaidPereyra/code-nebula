import { AppShell } from '@/components/layout/AppShell'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeatureCards } from '@/components/landing/FeatureCards'

export default function Home() {
  return (
    <AppShell>
      <div className="flex w-full min-w-0 flex-col items-center pb-20 sm:pb-24">
        <HeroSection />
        <FeatureCards />
      </div>
    </AppShell>
  )
}
