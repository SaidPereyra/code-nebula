import type { MetadataRoute } from 'next'

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://code-nebula-three.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${appUrl.replace(/\/$/, '')}/sitemap.xml`,
  }
}
