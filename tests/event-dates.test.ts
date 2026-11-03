import { describe, expect, it } from 'vitest'
import { ddayLabel, isEnded, isOngoing, scheduleReferenceDate } from '@/lib/event-dates'

const now = new Date('2026-11-04T03:00:00Z') // 2026-11-04 12:00 KST

describe('event dates use an explicit "now"', () => {
  it('counts days until a future event', () => {
    expect(ddayLabel('2026-11-13', now)).toBe('D-9')
    expect(ddayLabel('2026-11-04', now)).toBe('D-Day')
  })
  it('marks a single-day event as ended only after that day', () => {
    expect(isEnded('2026-11-03', undefined, now)).toBe(true)
    expect(isEnded('2026-11-04', undefined, now)).toBe(false)
  })
  it('keeps a multi-day event open until its last day', () => {
    expect(isEnded('2026-11-01', '2026-11-05', now)).toBe(false)
    expect(isOngoing('2026-11-01', '2026-11-05', now)).toBe(true)
    expect(isOngoing('2026-11-13', '2026-11-15', now)).toBe(false)
  })
  it('gives the same reference date on the server and in the first client render', () => {
    expect(scheduleReferenceDate('2026-10-14').toISOString()).toBe('2026-10-13T15:00:00.000Z')
  })
})
