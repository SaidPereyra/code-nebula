import type { MetadataRoute } from 'next'

const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://code-nebula-three.vercel.app').replace(
  /\/$/,
  ''
)

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${appUrl}/u/saidpereyra`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
