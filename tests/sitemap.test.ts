import { afterEach, describe, expect, it, vi } from 'vitest'
import sitemap from '@/app/sitemap'

afterEach(() => {
  vi.useRealTimers()
})

describe('sitemap lastModified', () => {
  it('does not change with the current time', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2027-01-01T00:00:00Z'))
    const a = sitemap().map((e) => [e.url, e.lastModified])
    vi.setSystemTime(new Date('2028-06-15T12:00:00Z'))
    const b = sitemap().map((e) => [e.url, e.lastModified])
    expect(b).toEqual(a)
  })
  it('uses YYYY-MM-DD content dates for every entry', () => {
    for (const e of sitemap()) {
      expect(e.lastModified, e.url).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })
})
