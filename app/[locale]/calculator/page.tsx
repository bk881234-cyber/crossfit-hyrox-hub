'use client'
import { useState, useCallback } from 'react'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'

type Tab = 'barbell' | 'dumbbell' | 'bodyweight'
type Unit = 'kg' | 'lb'

const PERCENTAGES = [100, 95, 90, 85, 80, 75, 70, 65, 60]

const BODYWEIGHT_MOVEMENTS = [
  { name: '풀업', multiplier: 1.0 },
  { name: '딥스', multiplier: 1.0 },
  { name: '푸시업', multiplier: 0.65 },
  { name: '핸드스탠드 푸시업', multiplier: 1.0 },
  { name: '머슬업', multiplier: 1.1 },
]

function epley(weight: number, reps: number): number {
  if (reps === 1) return weight
  return weight * (1 + reps / 30)
}

function kgToLb(kg: number): number {
  return Math.round(kg * 2.2046 * 10) / 10
}

function lbToKg(lb: number): number {
  return Math.round(lb / 2.2046 * 10) / 10
}

type WeightTabState = { weightInput: string; reps: number }

export default function CalculatorPage() {
  const [tab, setTab] = useState<Tab>('barbell')
  const [unit, setUnit] = useState<Unit>('lb')
  // 바벨·덤벨 탭 각각 독립적인 상태
  const [tabStates, setTabStates] = useState<Record<'barbell' | 'dumbbell', WeightTabState>>({
    barbell: { weightInput: '', reps: 1 },
    dumbbell: { weightInput: '', reps: 1 },
  })
  const [bodyweight, setBodyweight] = useState('')

  // 현재 탭의 중량·반복 값 (바디웨이트 탭은 사용 안 함)
  const currentKey = tab as 'barbell' | 'dumbbell'
  const weightInput = tab !== 'bodyweight' ? tabStates[currentKey].weightInput : ''
  const reps       = tab !== 'bodyweight' ? tabStates[currentKey].reps : 1

  const handleWeightChange = (val: string) => {
    if (tab === 'bodyweight') return
    setTabStates(prev => ({ ...prev, [currentKey]: { ...prev[currentKey], weightInput: val } }))
  }

  const handleRepsChange = (val: number) => {
    if (tab === 'bodyweight') return
    setTabStates(prev => ({ ...prev, [currentKey]: { ...prev[currentKey], reps: val } }))
  }

  const weightKg = useCallback(() => {
    const w = parseFloat(weightInput)
    if (isNaN(w) || w <= 0) return 0
    return unit === 'kg' ? w : lbToKg(w)
  }, [weightInput, unit])

  const oneRM = useCallback(() => {
    const kg = weightKg()
    if (kg === 0) return 0
    return Math.round(epley(kg, reps) * 10) / 10
  }, [weightKg, reps])

  const displayWeight = (kg: number) => {
    if (unit === 'kg') return `${kg.toFixed(1)} kg`
    return `${kgToLb(kg).toFixed(1)} lb`
  }

  const toggleUnit = () => {
    const current = parseFloat(weightInput)
    if (!isNaN(current) && current > 0) {
      handleWeightChange(unit === 'kg' ? kgToLb(current).toFixed(1) : lbToKg(current).toFixed(1))
    }
    setUnit(unit === 'kg' ? 'lb' : 'kg')
  }

  const rm = oneRM()
  const bw = parseFloat(bodyweight)

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-2xl mx-auto">
        {/* AdSense Placeholder */}
        <div className="hidden mt-4 mb-4 w-full h-16 bg-rx-surface border border-rx-border rounded-lg flex items-center justify-center">
          <span className="text-rx-muted text-xs">광고 영역 (AdSense)</span>
        </div>

        <h1 className="section-title mt-2">1RM 계산기</h1>
        <p className="section-sub">최대 중량을 계산하고 퍼센트 테이블을 확인하세요</p>

        {/* Strength Hub CTA */}
        <a
          href="calculator/1rm"
          className="flex items-center justify-between gap-3 mb-5 p-4 rounded-2xl group"
          style={{
            background: 'linear-gradient(135deg, rgba(232,50,26,0.10), rgba(255,45,139,0.10))',
            border: '1px solid rgba(232,50,26,0.35)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💪</span>
            <div>
              <p className="text-white font-black" style={{ fontSize: 16 }}>STRENGTH HUB</p>
              <p className="text-rx-muted" style={{ fontSize: 16 }}>7가지 리프트 PR 추적 · 성장 차트 · 공유</p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            className="text-rx-muted group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        {/* Tab Selector */}
        <div className="flex gap-1 bg-rx-surface rounded-xl p-1 mb-6">
          {(['barbell', 'dumbbell', 'bodyweight'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                tab === t ? 'bg-rx-red text-white' : 'text-rx-muted hover:text-white'
              }`}
            >
              {t === 'barbell' ? '바벨' : t === 'dumbbell' ? '덤벨' : '맨몸'}
            </button>
          ))}
        </div>

        {tab !== 'bodyweight' ? (
          <>
            {/* Weight Input */}
            <div className="card mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-bold">사용 중량</label>
                <button
                  onClick={toggleUnit}
                  className="px-3 py-1 rounded-lg bg-rx-surface border border-rx-border text-sm font-bold text-rx-muted hover:text-white hover:border-rx-red transition-colors"
                >
                  {unit === 'kg' ? 'kg → lb' : 'lb → kg'}
                </button>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  inputMode="decimal"
                  className="input text-3xl font-black text-center h-16"
                  placeholder="0"
                  value={weightInput}
                  onChange={(e) => handleWeightChange(e.target.value)}
                />
                <span className="text-rx-muted font-bold text-lg w-8">{unit}</span>
              </div>
              {weightInput && !isNaN(parseFloat(weightInput)) && (
                <p className="text-rx-muted text-sm mt-2 text-center">
                  = {unit === 'kg'
                    ? `${kgToLb(parseFloat(weightInput)).toFixed(1)} lb`
                    : `${lbToKg(parseFloat(weightInput)).toFixed(1)} kg`}
                </p>
              )}
            </div>

            {/* Percentage Table — 반복횟수보다 위 */}
            {rm > 0 && (
              <div className="card mb-4">
                <h2 className="font-black text-white mb-4">퍼센트 테이블</h2>
                <div className="space-y-2">
                  {PERCENTAGES.map((pct) => {
                    const pctKg = Math.round(rm * pct / 100 * 10) / 10
                    const pctDisplay = unit === 'kg'
                      ? `${pctKg.toFixed(1)} kg`
                      : `${kgToLb(pctKg).toFixed(1)} lb`
                    const isMax = pct === 100
                    return (
                      <div
                        key={pct}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                          isMax ? 'bg-rx-red/20 border border-rx-red/40' : 'bg-rx-surface'
                        }`}
                      >
                        <span className={`font-bold ${isMax ? 'text-rx-red' : 'text-rx-muted'}`}>{pct}%</span>
                        <span className={`font-black text-lg ${isMax ? 'text-white' : 'text-white'}`}>{pctDisplay}</span>
                        <span className="text-rx-muted text-xs">
                          {unit === 'kg'
                            ? `${kgToLb(pctKg).toFixed(0)} lb`
                            : `${lbToKg(pctKg).toFixed(1)} kg`}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Reps Input */}
            <div className="card mb-4">
              <label className="text-white font-bold block mb-3">반복 횟수: <span className="text-rx-red">{reps}회</span></label>
              <input
                type="range"
                min={1}
                max={30}
                value={reps}
                onChange={(e) => handleRepsChange(parseInt(e.target.value))}
                className="w-full accent-rx-red h-2"
              />
              <div className="flex justify-between text-rx-muted text-xs mt-1">
                <span>1회</span>
                <span>15회</span>
                <span>30회</span>
              </div>
              <div className="grid grid-cols-5 gap-1 mt-3">
                {[1, 2, 3, 5, 8, 10, 12, 15, 20, 30].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRepsChange(r)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      reps === r ? 'bg-rx-red text-white' : 'bg-rx-surface text-rx-muted hover:text-white'
                    }`}
                  >
                    {r}회
                  </button>
                ))}
              </div>
            </div>

            {/* 1RM Result — 맨 아래, 크기 축소 */}
            {rm > 0 && (
              <div className="card mb-6 text-center py-3 px-4 bg-gradient-to-br from-rx-red/20 to-rx-orange/10 border-rx-red/30">
                <p className="text-rx-muted text-sm mb-1">예상 1RM (Epley 공식)</p>
                <p className="text-3xl font-black text-white">
                  {unit === 'kg' ? rm.toFixed(1) : kgToLb(rm).toFixed(1)}
                  <span className="text-xl text-rx-muted ml-1">{unit}</span>
                </p>
              </div>
            )}
          </>
        ) : (
          // Bodyweight tab
          <div>
            <div className="card mb-4">
              <label className="text-white font-bold block mb-3">체중 입력 (kg)</label>
              <input
                type="number"
                inputMode="decimal"
                className="input text-3xl font-black text-center h-16"
                placeholder="70"
                value={bodyweight}
                onChange={(e) => setBodyweight(e.target.value)}
              />
            </div>

            {bw > 0 && (
              <div className="card mb-6">
                <h2 className="font-black text-white mb-4">맨몸 운동 기준 중량</h2>
                <div className="space-y-3">
                  {BODYWEIGHT_MOVEMENTS.map((m) => {
                    const baseKg = Math.round(bw * m.multiplier * 10) / 10
                    return (
                      <div key={m.name} className="flex items-center justify-between px-4 py-3 rounded-lg bg-rx-surface">
                        <span className="text-white font-medium">{m.name}</span>
                        <span className="font-black text-rx-red">{baseKg} kg</span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-rx-muted text-xs mt-3 text-center">* 체중 기준 권장 사용 중량입니다</p>
              </div>
            )}

            <div className="card bg-rx-surface/50">
              <h3 className="font-bold text-white mb-3">맨몸 운동 팁</h3>
              <ul className="text-rx-muted text-sm space-y-2">
                <li>• 풀업: 체중 × 1.0 = 내 체중이 곧 부하</li>
                <li>• 푸시업: 체중의 약 65% 부하</li>
                <li>• 딥스: 체중 × 1.0 (+ 추가 중량 가능)</li>
                <li>• HSPU: 체중 × 1.0 (팔뚝 위치에 따라 변동)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Equipment Recommendation */}
        <div className="mt-6 p-5 bg-rx-surface border border-rx-border rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge bg-rx-orange/20 text-rx-orange border border-rx-orange/30">추천 장비</span>
          </div>
          <h3 className="font-bold text-white mb-1">
            {tab === 'barbell' ? '바벨 & 플레이트 추천' : tab === 'dumbbell' ? '덤벨 세트 추천' : '맨몸 운동 장비 추천'}
          </h3>
          <p className="text-rx-muted text-sm">
            {tab === 'barbell'
              ? '올림픽 바벨 20kg + 플레이트 세트로 본격 훈련을 시작하세요.'
              : tab === 'dumbbell'
              ? '가변형 덤벨 세트로 다양한 중량을 효율적으로 활용하세요.'
              : '풀업바 + 딥바 세트로 맨몸 운동의 기본을 갖추세요.'}
          </p>
          <div className="hidden mt-3 h-12 bg-rx-card border border-rx-border rounded-lg flex items-center justify-center">
            <span className="text-rx-muted text-xs">제휴 광고 영역 (Affiliate)</span>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
