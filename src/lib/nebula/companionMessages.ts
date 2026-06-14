// Mensajes de Nebbi — PROJECT_CONTEXT.md §10

export type NebbiState =
  | 'idle'
  | 'loading'
  | 'loaded'
  | 'planetSelected'
  | 'widgetReady'
  | 'error'
  | 'noRepos'

export const companionMessages: Record<NebbiState, string[]> = {
  idle: [
    'Enter a GitHub username and I\'ll scan the code sector.',
    'I\'m ready to explore. Give me a username to scan.',
    'The galaxy awaits. Which developer shall we explore?',
  ],
  loading: [
    'Scanning GitHub signals...',
    'Calibrating orbit paths...',
    'Searching for code planets...',
    'Mapping the code sector...',
    'Reading commit energy signatures...',
  ],
  loaded: [
    'Orbit paths calculated. Your galaxy is ready.',
    'I found the system. Let\'s explore.',
    'The planets are in motion. Click one to scan it.',
  ],
  planetSelected: [
    'This planet is glowing. Recent activity detected.',
    'Strong commit energy around this orbit.',
    'Scanning repository... data stream open.',
    'Interesting signals coming from this sector.',
  ],
  widgetReady: [
    'Your nebula signal is ready to share.',
    'README beacon generated.',
    'Copy the signal and broadcast it to your profile.',
  ],
  error: [
    'Signal lost. The sector might not exist.',
    'I couldn\'t reach that part of the galaxy.',
    'Something went wrong in deep space. Try again.',
  ],
  noRepos: [
    'I found a quiet sector. This profile has no public planets yet.',
    'Empty orbit paths. No public repositories detected.',
    'This developer is still building their system.',
  ],
}

export function getRandomMessage(state: NebbiState): string {
  const messages = companionMessages[state]
  return messages[Math.floor(Math.random() * messages.length)]
}
