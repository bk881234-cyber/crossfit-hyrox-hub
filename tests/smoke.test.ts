import { describe, expect, it } from 'vitest'
import { WODS } from '@/lib/wod-data'

describe('test setup', () => {
  it('resolves the @ alias and loads the WOD data', () => {
    expect(WODS.length).toBe(82)
  })
})
