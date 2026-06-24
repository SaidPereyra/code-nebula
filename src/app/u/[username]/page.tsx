import type { Metadata } from 'next'
import { NebulaProfileLoader } from '@/components/nebula/NebulaProfileLoader'

type UserPageProps = {
  params: Promise<{ username: string }>
  searchParams: Promise<{ intro?: string | string[] }>
}

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  const { username } = await params
  const decodedUsername = decodeURIComponent(username)
  const title = `${decodedUsername}'s GitHub Galaxy`
  const description = `Explore ${decodedUsername}'s public GitHub repositories as an interactive Code Nebula galaxy.`
  const profilePath = `/u/${encodeURIComponent(decodedUsername)}`

  return {
    title,
    description,
    alternates: {
      canonical: profilePath,
    },
    openGraph: {
      title: `${title} | Code Nebula`,
      description,
      url: profilePath,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${title} | Code Nebula`,
      description,
    },
  }
}

export default async function UserPage({
  params,
  searchParams,
}: UserPageProps) {
  const [{ username }, query] = await Promise.all([params, searchParams])

  return (
    <NebulaProfileLoader
      key={username}
      username={username}
      playIntro={query.intro === '1'}
    />
  )
}
