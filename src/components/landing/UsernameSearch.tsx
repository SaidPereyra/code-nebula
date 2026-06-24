'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  isValidGitHubUsername,
  normalizeGitHubUsername,
} from '@/lib/github/github.validation'

export function UsernameSearch() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalizedUsername = normalizeGitHubUsername(username)
    if (!isValidGitHubUsername(normalizedUsername)) {
      setError(true)
      return
    }
    setError(false)
    router.push(`/u/${encodeURIComponent(normalizedUsername)}?intro=1`)
  }

  const handleDemo = () => {
    router.push('/u/saidpereyra?intro=1')
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-lg flex-col gap-4">
      <form onSubmit={handleSubmit} className="relative flex min-w-0 flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted">
            {/* GitHub-like user icon */}
            <svg xmlns="http://www.w3.org/-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <input
            type="text"
            placeholder="GitHub username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              if (error) setError(false)
            }}
            className={cn(
              "w-full h-14 bg-surface/80 border text-text-primary rounded-xl pl-12 pr-4 outline-none transition-all placeholder:text-text-muted",
              "focus:bg-surface focus:ring-2 focus:ring-cyan/50 backdrop-blur-sm",
              error ? "border-danger focus:border-danger" : "border-border-glass focus:border-cyan"
            )}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>
        
        <button
          type="submit"
          className="h-14 px-6 rounded-xl bg-text-primary text-bg font-semibold hover:bg-white transition-colors flex items-center justify-center whitespace-nowrap shadow-[0_0_20px_-5px_var(--color-cyan)]"
        >
          Generate my nebula
        </button>
      </form>
      
      {error && (
        <p className="text-danger text-sm text-center sm:text-left ml-2">
          Please enter a valid GitHub username.
        </p>
      )}

      <div className="flex items-center justify-center gap-2 text-sm text-text-muted mt-2">
        <span>Not sure?</span>
        <button 
          onClick={handleDemo}
          className="text-cyan hover:text-white transition-colors font-medium underline decoration-cyan/30 underline-offset-4"
        >
          View demo
        </button>
      </div>
    </div>
  )
}
