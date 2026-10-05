import { MetadataRoute } from 'next'
import { WODS } from '@/lib/wod-data'
import { MOVEMENTS } from '@/lib/movements-data'

const baseUrl = 'https://www.fittersstudio.com'
const locales = ['ko', 'en'] as const

type StaticPage = {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

const STATIC_PAGES: StaticPage[] = [
  { path: '', changeFrequency: 'daily', priority: 1.0 },
  { path: '/calculator', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/calculator/1rm', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/timer', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/wod', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/wod/log', changeFrequency: 'weekly', priority: 0.6 },
  { path: '/movements', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/map', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/community', changeFrequency: 'daily', priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const { path, changeFrequency, priority } of STATIC_PAGES) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified,
        changeFrequency,
        priority,
        alternates: {
          languages: {
            ko: `${baseUrl}/ko${path}`,
            en: `${baseUrl}/en${path}`,
          },
        },
      })
    }
  }

  for (const wod of WODS) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/wod/${wod.id}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            ko: `${baseUrl}/ko/wod/${wod.id}`,
            en: `${baseUrl}/en/wod/${wod.id}`,
          },
        },
      })
    }
  }

  for (const movement of MOVEMENTS) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/movements/${movement.slug}`,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            ko: `${baseUrl}/ko/movements/${movement.slug}`,
            en: `${baseUrl}/en/movements/${movement.slug}`,
          },
        },
      })
    }
  }

  return entries
}
