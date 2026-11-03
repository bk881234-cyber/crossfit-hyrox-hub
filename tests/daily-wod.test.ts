import { describe, expect, it } from 'vitest'
import { kstDateKey, pickDailyWod } from '@/lib/daily-wod'
import { WODS } from '@/lib/wod-data'

describe('pickDailyWod', () => {
  it('uses the Korean calendar day (UTC+9)', () => {
    expect(kstDateKey(new Date('2026-11-03T14:30:00Z'))).toBe('2026-11-03') // 23:30 KST
    expect(kstDateKey(new Date('2026-11-03T15:30:00Z'))).toBe('2026-11-04') // 00:30 KST
  })
  it('returns the same WOD for the whole Korean day', () => {
    const early = pickDailyWod(WODS, new Date('2026-11-03T15:30:00Z')) // 11/4 00:30 KST
    const late = pickDailyWod(WODS, new Date('2026-11-04T14:30:00Z')) // 11/4 23:30 KST
    expect(late.id).toBe(early.id)
  })
  it('always returns a WOD from the list', () => {
    for (let d = 0; d < 30; d++) {
      const date = new Date(Date.UTC(2026, 10, 1 + d, 3))
      expect(WODS).toContain(pickDailyWod(WODS, date))
    }
  })
  it('does not show the same WOD every day', () => {
    const ids = new Set<string>()
    for (let d = 0; d < 30; d++) ids.add(pickDailyWod(WODS, new Date(Date.UTC(2026, 10, 1 + d, 3))).id)
    expect(ids.size).toBeGreaterThan(10)
  })
})
