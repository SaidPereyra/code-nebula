// Placeholder — implementado en Fase 1 y 4
// /u/[username] — Galaxy Explorer page

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#020617]">
      <p className="text-[#94a3b8]">Galaxy for: {username}</p>
      <p className="mt-2 text-xs text-[#64748b]">Coming in Phase 2.</p>
    </main>
  )
}
