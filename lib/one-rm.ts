export type Unit = 'kg' | 'lb'

/** 크로스핏 박스는 한국도 lb를 쓴다 — 두 언어 모두 lb가 기본. */
export const DEFAULT_UNIT: Unit = 'lb'

const UNIT_KEY = 'fs-unit'
const MAX_REPS = 30

/** Epley 공식: weight × (1 + reps / 30). 1회면 무게 그대로, 반복 수는 1~30으로 자른다. */
export function estimate1RM(weight: number, reps: number): number | null {
  if (!Number.isFinite(weight) || weight <= 0) return null
  const r = Math.min(MAX_REPS, Math.max(1, Math.round(reps)))
  if (r === 1) return weight
  return weight * (1 + r / 30)
}

export function readSavedUnit(storage: Pick<Storage, 'getItem'> | null): Unit {
  if (!storage) return DEFAULT_UNIT
  try {
    const v = storage.getItem(UNIT_KEY)
    return v === 'kg' || v === 'lb' ? v : DEFAULT_UNIT
  } catch {
    return DEFAULT_UNIT
  }
}

export function saveUnit(storage: Pick<Storage, 'setItem'> | null, unit: Unit): void {
  if (!storage) return
  try {
    storage.setItem(UNIT_KEY, unit)
  } catch {
    // 저장 불가(사생활 보호 모드 등) — 기본값으로 계속 동작한다
  }
}

/** 브라우저의 localStorage. 서버 렌더링이나 접근이 막힌 환경에서는 null. */
export function browserStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}
