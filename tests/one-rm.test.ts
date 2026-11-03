import { describe, expect, it } from 'vitest'
import { DEFAULT_UNIT, estimate1RM, readSavedUnit, saveUnit } from '@/lib/one-rm'

describe('estimate1RM (Epley)', () => {
  it('estimates 100 x 5 as about 116.67', () => {
    expect(estimate1RM(100, 5)).toBeCloseTo(116.67, 2)
  })
  it('returns the weight itself for a single rep', () => {
    expect(estimate1RM(100, 1)).toBe(100)
  })
  it('clamps reps above 30 to 30', () => {
    expect(estimate1RM(100, 40)).toBe(estimate1RM(100, 30))
    expect(estimate1RM(100, 30)).toBe(200)
  })
  it('returns null for zero, negative or non-numeric weight', () => {
    expect(estimate1RM(0, 5)).toBeNull()
    expect(estimate1RM(-10, 5)).toBeNull()
    expect(estimate1RM(NaN, 5)).toBeNull()
  })
})

describe('unit preference', () => {
  it('defaults to lb', () => {
    expect(DEFAULT_UNIT).toBe('lb')
  })
  it('falls back to lb without storage', () => {
    expect(readSavedUnit(null)).toBe('lb')
  })
  it('falls back to lb when storage access throws', () => {
    expect(readSavedUnit({ getItem: () => { throw new Error('blocked') } })).toBe('lb')
  })
  it('returns a saved kg preference', () => {
    expect(readSavedUnit({ getItem: () => 'kg' })).toBe('kg')
  })
  it('ignores an unknown saved value', () => {
    expect(readSavedUnit({ getItem: () => 'stone' })).toBe('lb')
  })
  it('saveUnit swallows storage errors', () => {
    expect(() => saveUnit({ setItem: () => { throw new Error('quota') } }, 'kg')).not.toThrow()
  })
  it('saveUnit stores under fs-unit', () => {
    const store: Record<string, string> = {}
    saveUnit({ setItem: (k: string, v: string) => { store[k] = v } }, 'kg')
    expect(store['fs-unit']).toBe('kg')
  })
})

describe('browserStorage', () => {
  it('returns null outside the browser instead of throwing', async () => {
    const { browserStorage } = await import('@/lib/one-rm')
    expect(browserStorage()).toBeNull()
  })
})
