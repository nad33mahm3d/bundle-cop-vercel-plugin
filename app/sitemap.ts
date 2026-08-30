import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const paths = ['', '/docs', '/setup', '/dashboard', '/privacy', '/eula']

  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === '' || path === '/docs' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path === '/docs' ? 0.9 : 0.6,
  }))
}
