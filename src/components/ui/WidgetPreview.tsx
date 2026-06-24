'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { CopyButton } from './CopyButton'
import { useNebulaStore } from '@/store/nebula.store'

interface WidgetPreviewProps {
  username: string
}

export function WidgetPreview({ username }: WidgetPreviewProps) {
  const visible = useNebulaStore((state) => state.widgetVisible)
  const setWidgetVisible = useNebulaStore((state) => state.setWidgetVisible)
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '')
  const encodedUsername = encodeURIComponent(username)
  const widgetUrl = `${appUrl}/api/widget/${encodedUsername}`
  const profileUrl = `${appUrl}/u/${encodedUsername}`
  const markdown = `[![Code Nebula](${widgetUrl})](${profileUrl})`

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-auto absolute inset-0 z-40 flex items-start justify-center overflow-y-auto bg-bg/72 p-3 py-4 backdrop-blur-md sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="README widget preview"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            className="max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-[#050d1b]/95 p-4 shadow-[0_30px_100px_rgba(2,6,23,0.75)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.26em] text-cyan/70">
                  README beacon
                </p>
                <h2 className="mt-2 text-xl font-semibold text-text-primary">Widget ready</h2>
              </div>
              <button
                type="button"
                onClick={() => setWidgetVisible(false)}
                aria-label="Close widget preview"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-muted transition-colors hover:text-text-primary"
              >
                ×
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-bg sm:mt-5">
              <Image
                src={`/api/widget/${encodedUsername}`}
                alt={`Code Nebula widget for ${username}`}
                width={800}
                height={240}
                unoptimized
                className="h-auto w-full"
              />
            </div>

            <p className="mt-4 text-xs leading-relaxed text-text-secondary sm:mt-5">
              Paste this Markdown into your GitHub profile README.
            </p>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-bg/75 p-2">
              <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap px-2 font-mono text-[10px] text-text-secondary sm:text-xs">
                {markdown}
              </code>
              <CopyButton value={markdown} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
