import { describe, expect, it } from 'vitest'
import { parseTimerPreset, timerHrefForWod } from '@/lib/timer-preset'
import { WODS } from '@/lib/wod-data'

const wod = (id: string) => {
  const w = WODS.find((x) => x.id === id)
  if (!w) throw new Error(`missing WOD ${id}`)
  return w
}

describe('parseTimerPreset', () => {
  it('reads an AMRAP with minutes', () => {
    expect(parseTimerPreset('?mode=amrap&min=20')).toEqual({ mode: 'amrap', minutes: 20 })
  })
  it('reads a capped For Time', () => {
    expect(parseTimerPreset('?mode=fortime&min=12')).toEqual({ mode: 'fortime', minutes: 12 })
  })
  it('reads an uncapped For Time', () => {
    expect(parseTimerPreset('?mode=fortime')).toEqual({ mode: 'fortime' })
  })
  it('reads an EMOM as rounds of one minute', () => {
    expect(parseTimerPreset('?mode=emom&min=30')).toEqual({ mode: 'emom', rounds: 30 })
  })
  it('rejects unknown modes and broken minutes', () => {
    expect(parseTimerPreset('?mode=xyz&min=20')).toBeNull()
    expect(parseTimerPreset('?mode=amrap&min=abc')).toBeNull()
    expect(parseTimerPreset('?mode=amrap&min=-5')).toBeNull()
    expect(parseTimerPreset('?mode=amrap&min=9999')).toBeNull()
    expect(parseTimerPreset('?mode=amrap&min=12.5')).toBeNull()
    expect(parseTimerPreset('')).toBeNull()
  })
  it('keeps For Time without a cap when the cap is broken', () => {
    expect(parseTimerPreset('?mode=fortime&min=abc')).toEqual({ mode: 'fortime' })
  })
})

describe('timerHrefForWod', () => {
  it('maps benchmark WODs to their timer presets', () => {
    expect(timerHrefForWod(wod('fran'))).toBe('/timer?mode=fortime')
    expect(timerHrefForWod(wod('cindy'))).toBe('/timer?mode=amrap&min=20')
    expect(timerHrefForWod(wod('chelsea'))).toBe('/timer?mode=emom&min=30')
    expect(timerHrefForWod(wod('26-1'))).toBe('/timer?mode=amrap&min=15')
    expect(timerHrefForWod(wod('26-3'))).toBe('/timer?mode=fortime&min=10')
    expect(timerHrefForWod(wod('open-12-1'))).toBe('/timer?mode=amrap&min=7')
  })
  it('produces a preset the parser accepts for every WOD', () => {
    for (const w of WODS) {
      const href = timerHrefForWod(w)
      expect(parseTimerPreset(href.slice(href.indexOf('?'))), `${w.id} → ${href}`).not.toBeNull()
    }
  })
})

describe('toLinkHref', () => {
  it('splits a timer href into pathname and query for the localized Link', async () => {
    const { toLinkHref } = await import('@/lib/timer-preset')
    expect(toLinkHref('/timer?mode=amrap&min=20')).toEqual({ pathname: '/timer', query: { mode: 'amrap', min: '20' } })
    expect(toLinkHref('/timer?mode=fortime')).toEqual({ pathname: '/timer', query: { mode: 'fortime' } })
  })
})
