import type { WOD } from './wod-data'

export type TimerPreset =
  | { mode: 'amrap'; minutes: number }
  | { mode: 'fortime'; minutes?: number }
  | { mode: 'emom'; rounds: number }

const MIN_MINUTES = 1
const MAX_MINUTES = 90

function parseMinutes(raw: string | null): number | null {
  if (raw === null || !/^\d+$/.test(raw)) return null
  const n = Number(raw)
  return n >= MIN_MINUTES && n <= MAX_MINUTES ? n : null
}

/**
 * 주소 파라미터로 타이머를 미리 설정한다.
 * `?mode=amrap&min=20` · `?mode=fortime&min=12`(제한 시간) · `?mode=fortime` · `?mode=emom&min=30`(30라운드×60초).
 * 해석할 수 없으면 null → 타이머는 기본 화면을 그대로 보여준다.
 */
export function parseTimerPreset(search: string): TimerPreset | null {
  const params = new URLSearchParams(search)
  const mode = params.get('mode')
  const minutes = parseMinutes(params.get('min'))
  if (mode === 'amrap') return minutes === null ? null : { mode, minutes }
  if (mode === 'emom') return minutes === null ? null : { mode, rounds: minutes }
  if (mode === 'fortime') return minutes === null ? { mode } : { mode, minutes }
  return null
}

/** WOD 설명(한국어 원본 데이터)에서 형식을 읽어 타이머 사전 설정 주소를 만든다. */
export function timerHrefForWod(wod: WOD): string {
  const d = wod.description
  const amrap = d.match(/(\d+)분\s*AMRAP/) ?? d.match(/AMRAP\s*(\d+)분/)
  if (amrap) return `/timer?mode=amrap&min=${amrap[1]}`
  const emom = d.match(/(\d+)분\s*EMOM/)
  if (emom) return `/timer?mode=emom&min=${emom[1]}`
  const cap = d.match(/For Time \((\d+)분 제한\)/)
  if (cap) return `/timer?mode=fortime&min=${cap[1]}`
  return '/timer?mode=fortime'
}

/** next-intl의 Link는 문자열 주소의 ?query를 버리므로 { pathname, query } 형태로 넘긴다. */
export function toLinkHref(href: string): { pathname: '/timer'; query: Record<string, string> } {
  const q = href.indexOf('?')
  const query = Object.fromEntries(new URLSearchParams(q === -1 ? '' : href.slice(q)))
  return { pathname: '/timer', query }
}
