import type { WOD } from './wod-data'

const KST_OFFSET_MS = 9 * 60 * 60 * 1000

/** 한국 시간(UTC+9) 기준 날짜 'YYYY-MM-DD'. */
export function kstDateKey(now: Date): string {
  return new Date(now.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10)
}

/** 날짜 문자열의 FNV-1a 해시로 고른다 — 같은 날은 항상 같은 WOD, 날마다 고르게 바뀐다. */
export function pickDailyWod(wods: WOD[], now: Date): WOD {
  let h = 0x811c9dc5
  for (const ch of kstDateKey(now)) {
    h ^= ch.charCodeAt(0)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return wods[h % wods.length]
}
