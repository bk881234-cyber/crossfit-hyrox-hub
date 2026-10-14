/**
 * 해외 크로스핏 대회. 공식 사이트에서 일정이 확인된 것만 싣는다 (확인일 2026-10-14).
 * 새 일정이 공식 발표되면 여기에 추가한다.
 */
export type CrossfitGlobalCategory = 'official' | 'invitational'

export interface CrossfitGlobalEvent {
  id: string
  category: CrossfitGlobalCategory
  name: string
  nameEn: string
  date: string
  endDate: string
  place: string
  placeEn: string
  descKo: string
  descEn: string
  url: string
}

export const CROSSFIT_GLOBAL_EVENTS: CrossfitGlobalEvent[] = [
  {
    id: 'cf-open-2027',
    category: 'official',
    name: '2027 크로스핏 오픈',
    nameEn: '2027 CrossFit Open',
    date: '2027-02-18',
    endDate: '2027-03-08',
    place: '온라인 (전 세계 누구나 참가)',
    placeEn: 'Online (open to everyone worldwide)',
    descKo: '27.1 (2/18) · 27.2 (2/25) · 27.3 (3/4) 공개. 매주 목요일 워크아웃 발표, 점수는 다음 주 월요일까지 제출.',
    descEn: 'Workouts 27.1 (Feb 18), 27.2 (Feb 25) and 27.3 (Mar 4) are released weekly on Thursdays; scores are due the following Monday.',
    url: 'https://games.crossfit.com/open/schedule',
  },
  {
    id: 'rogue-invitational-2026',
    category: 'invitational',
    name: '로그 인비테이셔널 2026',
    nameEn: 'Rogue Invitational 2026',
    date: '2026-10-23',
    endDate: '2026-10-25',
    place: '영국 스코틀랜드 애버딘 · P&J Live',
    placeEn: 'Aberdeen, Scotland · P&J Live',
    descKo: '로그 피트니스가 주최하는 초청 인비테이셔널 대회 (8회째).',
    descEn: 'Invitational competition hosted by Rogue Fitness (8th edition).',
    url: 'https://www.roguefitness.com/be/en/invitational',
  },
]

export const CROSSFIT_OFFICIAL_CALENDAR_URL = 'https://games.crossfit.com/competitions'
