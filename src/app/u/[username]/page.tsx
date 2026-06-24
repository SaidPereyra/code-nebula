import { NebulaProfileLoader } from '@/components/nebula/NebulaProfileLoader'

export default async function UserPage({
  params,
  searchParams,
}: {
  params: Promise<{ username: string }>
  searchParams: Promise<{ intro?: string | string[] }>
}) {
  const [{ username }, query] = await Promise.all([params, searchParams])

  return (
    <NebulaProfileLoader
      key={username}
      username={username}
      playIntro={query.intro === '1'}
    />
  )
}
