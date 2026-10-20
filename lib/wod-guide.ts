import type { WOD } from './wod-data'

type Loc = 'ko' | 'en'

const ABOUT: Record<WOD['type'], Record<Loc, string>> = {
  girl: {
    en: 'Girl WODs are CrossFit\'s classic named benchmark workouts. The workout never changes, so repeating it every few months is a clean way to measure whether your fitness is improving.',
    ko: 'Girl WOD는 크로스핏의 대표적인 이름 붙은 벤치마크 워크아웃입니다. 운동 구성이 절대 바뀌지 않아서, 몇 달마다 반복해서 기록을 비교하면 체력이 실제로 좋아지고 있는지 가장 정확하게 확인할 수 있습니다.',
  },
  hero: {
    en: 'Hero WODs honor military service members, first responders and others who died in the line of duty. They tend to be long and demanding, and many athletes do them on a memorial date as a tribute rather than purely for a score.',
    ko: 'Hero WOD는 군인, 소방관, 경찰 등 임무 수행 중 목숨을 잃은 이들을 기리기 위한 워크아웃입니다. 길고 힘든 경우가 많고, 기록보다 추모의 의미로 특정 기념일에 수행하는 사람도 많습니다.',
  },
  open: {
    en: 'This workout comes from the CrossFit Open, the worldwide online competition held every year. Anyone can attempt it, and redoing a past Open workout lets you compare your score with your earlier attempts or with the standards of that year.',
    ko: '이 워크아웃은 매년 열리는 전 세계 온라인 대회, 크로스핏 오픈에서 나온 것입니다. 누구나 도전할 수 있고, 지난 오픈 워크아웃을 다시 해보면 이전 기록이나 그해 기준과 비교해 볼 수 있습니다.',
  },
  benchmark: {
    en: 'Benchmark workouts stay the same every time, so they are ideal for tracking progress. Log your result and retest every few months.',
    ko: '벤치마크 워크아웃은 항상 같은 구성이라 발전 정도를 추적하기에 좋습니다. 기록을 남기고 몇 달마다 다시 도전해 보세요.',
  },
}

type Format = 'descending' | 'amrap' | 'emom' | 'max' | 'time'

function detectFormat(w: WOD): Format {
  const d = w.description
  if (/EMOM/i.test(d) || w.tags.some((t) => /EMOM/i.test(t))) return 'emom'
  if (/1RM/i.test(d)) return 'max'
  if (/AMRAP/i.test(d) || w.tags.some((t) => /AMRAP/i.test(t))) return 'amrap'
  if (/\b21-15-9\b|\b9-7-5\b|\b50-40-30-20-10\b|\b27-21-15-9\b|\b30-20-10\b/.test(d)) return 'descending'
  return 'time'
}

const PACE: Record<Format, Record<Loc, string>> = {
  descending: {
    en: 'In a descending rep scheme the first round is the longest. Plan your breaks before you start — for example, split the 21s into two or three sets so you stay ahead of fatigue — and try to finish the final round with unbroken sets.',
    ko: '반복 수가 줄어드는 방식은 첫 라운드가 가장 깁니다. 시작 전에 끊어 가는 계획을 세우세요. 예를 들어 21개는 2~3세트로 나눠서 피로가 오기 전에 쉬고, 마지막 라운드는 끊지 않고 끝내는 것을 목표로 합니다.',
  },
  amrap: {
    en: 'AMRAPs are usually lost by starting too fast. Pick a pace you can hold for the whole time cap, keep your round splits even, and save your sprint for the last couple of minutes. Write down your rounds as you go.',
    ko: 'AMRAP은 처음에 너무 빠르게 시작해서 망치는 경우가 많습니다. 제한 시간 내내 유지할 수 있는 속도를 정하고, 라운드 시간을 일정하게 유지하며, 마지막 1~2분에 스퍼트를 내세요. 라운드 수는 기록해 두는 것이 좋습니다.',
  },
  emom: {
    en: 'Choose a load and pace that leaves you at least 10–15 seconds of rest in every minute. If you finish later and later each minute, lower the weight or reps so you can complete the full time.',
    ko: '매 분마다 최소 10~15초는 쉴 수 있는 무게와 속도를 고르세요. 분이 지날수록 끝나는 시간이 점점 늦어진다면 무게나 반복 수를 줄여서 끝까지 완주하는 것이 좋습니다.',
  },
  max: {
    en: 'For a max-load test, warm up with progressively heavier sets and plan your jumps in advance. Rest long enough between attempts and avoid spending your best lifts too early.',
    ko: '최대 중량 테스트는 점점 무거워지는 웜업 세트로 몸을 준비하고, 시도할 무게를 미리 계획하세요. 시도 사이에 충분히 쉬고 좋은 시도를 너무 일찍 소모하지 않는 것이 중요합니다.',
  },
  time: {
    en: 'For a For Time workout, break big sets early and on purpose with short rests instead of failing mid-set. Keep transitions between movements quick and go unbroken only on the movements you are strongest at.',
    ko: 'For Time 워크아웃은 큰 세트를 실패할 때까지 가지 말고 처음부터 짧게 의도적으로 끊어 가세요. 동작 전환을 빠르게 하고, 가장 자신 있는 동작에서만 끊지 않고 이어가는 것이 좋습니다.',
  },
}

export interface WodGuide {
  about: string
  pace: string
}

export function getWodGuide(w: WOD, locale: string): WodGuide {
  const l: Loc = locale === 'en' ? 'en' : 'ko'
  return { about: ABOUT[w.type][l], pace: PACE[detectFormat(w)][l] }
}

/** 같은 동작이 들어간 다른 WOD (같은 종류 우선), 최대 n개 */
export function getRelatedWods(w: WOD, all: WOD[], n = 4): WOD[] {
  const mine = new Set(w.movements.map((m) => m.toLowerCase()))
  return all
    .filter((o) => o.id !== w.id)
    .map((o) => ({ o, shared: o.movements.filter((m) => mine.has(m.toLowerCase())).length }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared || Number(b.o.type === w.type) - Number(a.o.type === w.type))
    .slice(0, n)
    .map((x) => x.o)
}
