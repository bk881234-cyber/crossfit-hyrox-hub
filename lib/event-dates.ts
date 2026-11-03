/**
 * 대회 일정의 날짜 계산. 페이지는 빌드 시 미리 만들어지므로 "오늘"을 모듈에서 고정하지 않고
 * 항상 인자로 받는다 (서버 렌더·첫 브라우저 렌더는 같은 기준일, 마운트 후 실제 오늘로 갱신).
 */
const DAY_MS = 24 * 60 * 60 * 1000

/** 서버와 첫 브라우저 렌더가 같은 값을 쓰도록 하는 고정 기준일 (한국 시간 자정) */
export function scheduleReferenceDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00+09:00`)
}

export function ddayLabel(dateStr: string, now: Date): string {
  const diff = Math.ceil((new Date(dateStr).getTime() - now.getTime()) / DAY_MS)
  if (diff <= 0) return 'D-Day'
  return `D-${diff}`
}

export function isEnded(start: string, end: string | undefined, now: Date): boolean {
  return new Date(end ?? start).getTime() + DAY_MS < now.getTime()
}

export function isOngoing(start: string, end: string | undefined, now: Date): boolean {
  return !isEnded(start, end, now) && new Date(start).getTime() <= now.getTime()
}
