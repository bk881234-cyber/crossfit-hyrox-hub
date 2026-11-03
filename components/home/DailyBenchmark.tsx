'use client'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { WODS, type WOD } from '@/lib/wod-data'
import { localizeWod } from '@/lib/wod-data-en'
import { pickDailyWod } from '@/lib/daily-wod'
import { timerHrefForWod, toLinkHref } from '@/lib/timer-preset'

const TYPE_LABEL: Record<WOD['type'], string> = {
  girl: 'Girl WOD',
  hero: 'Hero WOD',
  open: 'CrossFit Open',
  benchmark: 'Benchmark',
}

/** 운동 구성 줄만 (설명의 첫 문단 다음부터) 최대 n줄. */
function workoutLines(description: string, n: number): string[] {
  const parts = description.split('\n\n')
  const body = parts.length > 1 ? parts.slice(1).join('\n') : parts[0]
  return body.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, n)
}

/**
 * 오늘의 벤치마크. 첫 렌더는 목록의 첫 WOD로 고정해 서버·브라우저 화면을 맞추고(하이드레이션 경고 방지),
 * 마운트 후 한국 시간 날짜 기준으로 오늘의 WOD로 바꾼다.
 */
export default function DailyBenchmark() {
  const t = useTranslations('home.daily')
  const locale = useLocale()
  const [wod, setWod] = useState<WOD>(WODS[0])

  useEffect(() => {
    setWod(pickDailyWod(WODS, new Date()))
  }, [])

  const shown = localizeWod(wod, locale)
  const lines = workoutLines(shown.description, 4)

  return (
    <div className="card p-5 text-left">
      <p className="text-rx-muted text-sm mb-1">{t('title')}</p>
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h2 className="text-white font-black text-2xl">{shown.name}</h2>
        <span className="text-xs font-bold text-rx-muted whitespace-nowrap">{TYPE_LABEL[shown.type]}</span>
      </div>
      <ul className="text-white/80 text-sm leading-relaxed mb-4 space-y-0.5">
        {lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-2">
        <Link href={toLinkHref(timerHrefForWod(wod))} className="btn-primary text-sm py-2.5 rounded-lg text-center">
          {t('startTimer')}
        </Link>
        <Link href={`/wod/${wod.id}`} className="btn-secondary text-sm py-2.5 rounded-lg text-center">
          {t('details')}
        </Link>
      </div>
    </div>
  )
}
