'use client'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/navigation'
import { DEFAULT_UNIT, browserStorage, estimate1RM, readSavedUnit, saveUnit, type Unit } from '@/lib/one-rm'

const REP_CHOICES = [1, 2, 3, 5, 8, 10]

/** 홈 첫 화면의 1RM 빠른 계산. 단위 규칙은 계산기 페이지와 같다(기본 lb, 마지막 선택 기억). */
export default function QuickOneRm() {
  const t = useTranslations('home.quick')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState(5)
  const [unit, setUnit] = useState<Unit>(DEFAULT_UNIT)

  useEffect(() => {
    setUnit(readSavedUnit(browserStorage()))
  }, [])

  const chooseUnit = (u: Unit) => {
    setUnit(u)
    saveUnit(browserStorage(), u)
  }

  const result = estimate1RM(parseFloat(weight), reps)

  return (
    <div className="card p-5 text-left">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-white font-black text-lg">{t('title')}</h2>
        <div className="flex bg-rx-surface border border-rx-border rounded-lg overflow-hidden" role="group" aria-label={t('unit')}>
          {(['lb', 'kg'] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => chooseUnit(u)}
              aria-pressed={unit === u}
              className={`px-3 py-1.5 text-sm font-bold transition-colors ${unit === u ? 'bg-rx-red text-white' : 'text-rx-muted hover:text-white'}`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <label className="block text-rx-muted text-sm mb-1.5" htmlFor="quick-1rm-weight">{t('weight')}</label>
      <input
        id="quick-1rm-weight"
        type="number"
        inputMode="decimal"
        min={0}
        placeholder="0"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="input text-2xl font-black h-14 mb-4 tabular-nums"
      />

      <p className="text-rx-muted text-sm mb-1.5">{t('reps')}</p>
      <div className="grid grid-cols-6 gap-1.5 mb-5">
        {REP_CHOICES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReps(r)}
            aria-pressed={reps === r}
            className={`py-2 rounded-lg text-sm font-bold transition-colors ${reps === r ? 'bg-rx-red text-white' : 'bg-rx-surface text-rx-muted hover:text-white'}`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex items-end justify-between gap-3" aria-live="polite">
        <div>
          <p className="text-rx-muted text-sm">{t('result')}</p>
          <p className="text-white font-black text-4xl tabular-nums leading-tight">
            {result === null ? '—' : result.toFixed(1)}
            <span className="text-rx-muted text-lg font-bold ml-1">{unit}</span>
          </p>
        </div>
        <Link href="/calculator" className="text-sm font-bold text-rx-red hover:text-white transition-colors whitespace-nowrap pb-1">
          {t('openFull')}
        </Link>
      </div>
    </div>
  )
}
