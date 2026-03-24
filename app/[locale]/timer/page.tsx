'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'

const XIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)
const RotateCcwIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"></polyline>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
  </svg>
)
const MaximizeIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
    <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
    <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
    <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
  </svg>
)
const PlayIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
)
const PauseIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
)

type TimerMode = 'amrap' | 'emom' | 'tabata' | 'fortime' | 'interval'
type Phase = 'work' | 'rest' | 'idle'

interface TimerConfig {
  amrap: { minutes: number }
  emom: { rounds: number; workSeconds: number }
  tabata: { workSeconds: number; restSeconds: number; rounds: number }
  fortime: { minutes: number }
  interval: { workSeconds: number; restSeconds: number; rounds: number }
}

const MODES: { id: TimerMode; label: string }[] = [
  { id: 'amrap', label: 'AMRAP' },
  { id: 'emom', label: 'EMOM' },
  { id: 'tabata', label: 'Tabata' },
  { id: 'fortime', label: 'For Time' },
  { id: 'interval', label: 'Interval' },
]

function pad(n: number) {
  return String(Math.floor(n)).padStart(2, '0')
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${pad(m)}:${pad(s)}`
}

function beep(ctx: AudioContext, duration: number, volume = 4.0) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  oscillator.frequency.value = 1000 // 한 음으로 통일 (삐익!)
  oscillator.type = 'square'
  gainNode.gain.setValueAtTime(volume, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  if (ctx.state === 'suspended') ctx.resume()
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

function beepStart(ctx: AudioContext) {
  beep(ctx, 0.8) // 길고 크게
}

function beepEnd(ctx: AudioContext) {
  beep(ctx, 0.4)
  setTimeout(() => beep(ctx, 0.4), 500)
}

// 3초, 2초, 1초 통일 비프음
function beepAtSec(ctx: AudioContext, sec: number) {
  if (sec <= 3 && sec >= 1) {
    beep(ctx, 0.3) // 짧고 크게
  }
}

// 10초 카운트다운 일반 틱 (10~4초 무음 요청)
function beepTick(ctx: AudioContext) {
  // 소리 없음
}

export default function TimerPage() {
  const t = useTranslations('timer')
  const [mode, setMode] = useState<TimerMode>('amrap')
  const [config, setConfig] = useState<TimerConfig>({
    amrap: { minutes: 20 },
    emom: { rounds: 10, workSeconds: 60 },
    tabata: { workSeconds: 20, restSeconds: 10, rounds: 8 },
    fortime: { minutes: 20 },
    interval: { workSeconds: 40, restSeconds: 20, rounds: 8 },
  })

  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds, setTotalRounds] = useState(1)
  const [elapsed, setElapsed] = useState(0)
  const [finished, setFinished] = useState(false)

  const [countdownEnabled, setCountdownEnabled] = useState(true)
  const [countingDown, setCountingDown] = useState(false)
  const [countdownVal, setCountdownVal] = useState(10)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const wakeLockRef = useRef<WakeLockSentinel | null>(null)
  const stateRef = useRef({ phase, timeLeft, currentRound })

  // Keep ref in sync
  stateRef.current = { phase, timeLeft, currentRound }

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
      }
    } catch {
      // WakeLock not available
    }
  }, [])

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release()
      wakeLockRef.current = null
    }
  }, [])

  // targetMode를 명시적으로 받아 config 참조 시점 오류 없이 즉시 초기값 반환
  const getInitialState = useCallback((targetMode: TimerMode) => {
    const c = config[targetMode]
    switch (targetMode) {
      case 'amrap':
        return { time: (c as TimerConfig['amrap']).minutes * 60, rounds: 0, phase: 'work' as Phase }
      case 'emom': {
        const em = c as TimerConfig['emom']
        return { time: em.workSeconds, rounds: em.rounds, phase: 'work' as Phase }
      }
      case 'tabata': {
        const tb = c as TimerConfig['tabata']
        return { time: tb.workSeconds, rounds: tb.rounds * 2, phase: 'work' as Phase }
      }
      case 'fortime':
        return { time: (c as TimerConfig['fortime']).minutes * 60, rounds: 1, phase: 'work' as Phase }
      case 'interval': {
        const iv = c as TimerConfig['interval']
        return { time: iv.workSeconds, rounds: iv.rounds, phase: 'work' as Phase }
      }
    }
  }, [config])

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    setCountingDown(false)
    setCountdownVal(10)
    setRunning(false)
    releaseWakeLock()
  }, [releaseWakeLock])

  const reset = useCallback(() => {
    stop()
    setFinished(false)
    setElapsed(0)
    setCurrentRound(1)
    setIsFullscreen(false)
    const init = getInitialState(mode)
    setTimeLeft(init.time)
    setTotalTime(init.time)
    setTotalRounds(init.rounds)
    setPhase(init.phase)
  }, [stop, getInitialState, mode])

  // 모드 변경: useEffect 비동기 없이 클릭 시 즉시 모든 상태를 동시에 갱신
  const handleModeChange = useCallback((newMode: TimerMode) => {
    if (running) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    setCountingDown(false)
    setCountdownVal(10)
    setRunning(false)
    releaseWakeLock()
    setMode(newMode)
    setFinished(false)
    setElapsed(0)
    setCurrentRound(1)
    const init = getInitialState(newMode)
    setTimeLeft(init.time)
    setTotalTime(init.time)
    setTotalRounds(init.rounds)
    setPhase(init.phase)
  }, [running, getInitialState, releaseWakeLock])

  // config 값이 바뀔 때 (타이머 미작동 상태) 메인 타이머 표시를 즉시 동기화
  useEffect(() => {
    if (running || (elapsed > 0 && !finished)) return // 일시정지 상태에서는 리셋 안 함
    const init = getInitialState(mode)
    setTimeLeft(init.time)
    setTotalTime(init.time)
    setTotalRounds(init.rounds)
    setPhase(init.phase)
  }, [config, mode, running, elapsed, finished, getInitialState])

  const handleStart = useCallback(async () => {
    if (finished) {
      reset()
      return
    }
    if (countingDown) {
      if (countdownRef.current) clearInterval(countdownRef.current)
      setCountingDown(false)
      setCountdownVal(10)
      return
    }
    if (running) {
      stop()
      return
    }
    if (countdownEnabled && elapsed === 0) {
      await requestWakeLock()
      const ctx = getAudioCtx()
      setCountingDown(true)
      setCountdownVal(10)
      let val = 10
      countdownRef.current = setInterval(() => {
        val -= 1
        setCountdownVal(val)
        if (val === 3 || val === 2 || val === 1) {
          beepAtSec(ctx, val)
        } else if (val > 0) {
          beepTick(ctx)
        }
        if (val <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          setCountingDown(false)
          setCountdownVal(10)
          beepStart(ctx)
          setRunning(true)
          setIsFullscreen(true)
        }
      }, 1000)
      return
    }
    await requestWakeLock()
    const ctx = getAudioCtx()
    beepStart(ctx)
    setRunning(true)
    setIsFullscreen(true)
  }, [finished, countingDown, running, stop, reset, requestWakeLock, getAudioCtx, countdownEnabled])

  useEffect(() => {
    if (!running) return

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const ctx = audioCtxRef.current

        if ((prev === 3 || prev === 2 || prev === 1) && ctx) {
          beepAtSec(ctx, prev)
        }

        if (prev <= 1) {
          // Phase end — delay so 1-sec beep plays first
          const endCtx = audioCtxRef.current
          if (endCtx) setTimeout(() => beepEnd(endCtx), 500)

          const cur = stateRef.current
          const c = config[mode]

          if (mode === 'amrap' || mode === 'fortime') {
            setFinished(true)
            setRunning(false)
            releaseWakeLock()
            return 0
          }

          if (mode === 'emom') {
            const em = c as TimerConfig['emom']
            const nextRound = cur.currentRound + 1
            if (nextRound > em.rounds) {
              setFinished(true)
              setRunning(false)
              releaseWakeLock()
              return 0
            }
            setCurrentRound(nextRound)
            return em.workSeconds
          }

          if (mode === 'tabata') {
            const tb = c as TimerConfig['tabata']
            const nextRound = cur.currentRound + 1
            const totalSegments = tb.rounds * 2
            if (nextRound > totalSegments) {
              setFinished(true)
              setRunning(false)
              releaseWakeLock()
              return 0
            }
            setCurrentRound(nextRound)
            // Odd segments = work, even = rest
            const isWork = nextRound % 2 === 1
            setPhase(isWork ? 'work' : 'rest')
            return isWork ? tb.workSeconds : tb.restSeconds
          }

          if (mode === 'interval') {
            const iv = c as TimerConfig['interval']
            const isWork = cur.phase === 'work'
            if (!isWork) {
              const nextRound = cur.currentRound + 1
              if (nextRound > iv.rounds) {
                setFinished(true)
                setRunning(false)
                releaseWakeLock()
                return 0
              }
              setCurrentRound(nextRound)
              setPhase('work')
              return iv.workSeconds
            } else {
              setPhase('rest')
              return iv.restSeconds
            }
          }

          return 0
        }

        setElapsed((e) => e + 1)
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, mode, config, releaseWakeLock])

  const phaseColor = phase === 'work' ? 'bg-green-500/10' : phase === 'rest' ? 'bg-red-500/10' : 'bg-transparent'
  const phaseBorder = phase === 'work' ? 'border-green-500/30' : phase === 'rest' ? 'border-red-500/30' : 'border-rx-border'

  const c = config[mode]

  return (
    <div className={`min-h-screen bg-rx-bg transition-colors duration-500`}>
      {!isFullscreen && <Header />}
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-[640px] mx-auto">
        {/* AdSense top */}
        <div className="hidden mt-4 mb-4 w-full h-16 bg-rx-surface border border-rx-border rounded-lg flex items-center justify-center">
          <span className="text-rx-muted text-xs">광고 영역 (AdSense)</span>
        </div>

        {!isFullscreen && <h1 className="section-title">{t('title')}</h1>}
        {!isFullscreen && <p className="section-sub">{t('subtitle')}</p>}

        {/* Mode Tabs */}
        {!isFullscreen && <div className={`flex gap-1 bg-rx-surface rounded-xl p-1 mb-4 overflow-x-auto ${elapsed > 0 && !finished ? 'opacity-50 pointer-events-none' : ''}`}>
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              className={`flex-shrink-0 whitespace-nowrap px-3 py-2.5 min-h-[44px] rounded-lg text-xs font-bold transition-colors ${
                mode === m.id ? 'gradient-bg text-white' : 'text-rx-muted hover:text-white'
              } ${running ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {m.label}
            </button>
          ))}
        </div>}

        {/* Config Panel */}
        {!running && !finished && elapsed === 0 && (
          <div className="card mb-6">
            <h3 className="font-bold text-white mb-4">{t('config')}</h3>
            {mode === 'amrap' && (
              <div>
                <label className="text-rx-muted text-sm block mb-2">{t('timeLimit')}</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setConfig(p => ({ ...p, amrap: { minutes: Math.max(1, p.amrap.minutes - 1) } }))}
                    className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">−</button>
                  <span className="text-3xl font-black text-white flex-1 text-center">{(c as TimerConfig['amrap']).minutes}{t('minUnit')}</span>
                  <button onClick={() => setConfig(p => ({ ...p, amrap: { minutes: Math.min(99, p.amrap.minutes + 1) } }))}
                    className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">+</button>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[5, 10, 12, 15, 20, 30].map(m => (
                    <button key={m} onClick={() => setConfig(p => ({ ...p, amrap: { minutes: m } }))}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${(c as TimerConfig['amrap']).minutes === m ? 'gradient-bg text-white' : 'bg-rx-surface text-rx-muted hover:text-white'}`}>
                      {m}{t('minUnit')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'emom' && (
              <div className="space-y-4">
                <div>
                  <label className="text-rx-muted text-sm block mb-2">{t('totalRounds')}</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setConfig(p => ({ ...p, emom: { ...p.emom, rounds: Math.max(1, p.emom.rounds - 1) } }))}
                      className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">−</button>
                    <span className="text-3xl font-black text-white flex-1 text-center">{(c as TimerConfig['emom']).rounds}{t('roundUnit')}</span>
                    <button onClick={() => setConfig(p => ({ ...p, emom: { ...p.emom, rounds: Math.min(60, p.emom.rounds + 1) } }))}
                      className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">+</button>
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-2">{t('interval')}</label>
                  <div className="flex gap-2 flex-wrap">
                    {[30, 45, 60, 90, 120].map(s => (
                      <button key={s} onClick={() => setConfig(p => ({ ...p, emom: { ...p.emom, workSeconds: s } }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${(c as TimerConfig['emom']).workSeconds === s ? 'gradient-bg text-white' : 'bg-rx-surface text-rx-muted hover:text-white'}`}>
                        {s}{t('secUnit')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {mode === 'tabata' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-rx-muted text-sm block mb-2">{t('workTime')}</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfig(p => ({ ...p, tabata: { ...p.tabata, workSeconds: Math.max(5, p.tabata.workSeconds - 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-green-500 transition-colors">−</button>
                      <span className="text-xl font-black text-green-400 flex-1 text-center">{(c as TimerConfig['tabata']).workSeconds}{t('secUnit')}</span>
                      <button onClick={() => setConfig(p => ({ ...p, tabata: { ...p.tabata, workSeconds: Math.min(120, p.tabata.workSeconds + 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-green-500 transition-colors">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-2">{t('restTime')}</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfig(p => ({ ...p, tabata: { ...p.tabata, restSeconds: Math.max(5, p.tabata.restSeconds - 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-red-500 transition-colors">−</button>
                      <span className="text-xl font-black text-red-400 flex-1 text-center">{(c as TimerConfig['tabata']).restSeconds}{t('secUnit')}</span>
                      <button onClick={() => setConfig(p => ({ ...p, tabata: { ...p.tabata, restSeconds: Math.min(120, p.tabata.restSeconds + 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-red-500 transition-colors">+</button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-2">{t('totalRounds')}</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setConfig(p => ({ ...p, tabata: { ...p.tabata, rounds: Math.max(1, p.tabata.rounds - 1) } }))}
                      className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">−</button>
                    <span className="text-3xl font-black text-white flex-1 text-center">{(c as TimerConfig['tabata']).rounds}{t('roundUnit')}</span>
                    <button onClick={() => setConfig(p => ({ ...p, tabata: { ...p.tabata, rounds: Math.min(20, p.tabata.rounds + 1) } }))}
                      className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">+</button>
                  </div>
                </div>
              </div>
            )}

            {mode === 'fortime' && (
              <div>
                <label className="text-rx-muted text-sm block mb-2">{t('capLabel')}</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setConfig(p => ({ ...p, fortime: { minutes: Math.max(1, p.fortime.minutes - 1) } }))}
                    className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">−</button>
                  <span className="text-3xl font-black text-white flex-1 text-center">{(c as TimerConfig['fortime']).minutes}{t('minUnit')}</span>
                  <button onClick={() => setConfig(p => ({ ...p, fortime: { minutes: Math.min(99, p.fortime.minutes + 1) } }))}
                    className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">+</button>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[3, 5, 10, 15, 20, 30, 40].map(m => (
                    <button key={m} onClick={() => setConfig(p => ({ ...p, fortime: { minutes: m } }))}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${(c as TimerConfig['fortime']).minutes === m ? 'gradient-bg text-white' : 'bg-rx-surface text-rx-muted hover:text-white'}`}>
                      {m}{t('minUnit')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'interval' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-rx-muted text-sm block mb-2">{t('workTime')}</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfig(p => ({ ...p, interval: { ...p.interval, workSeconds: Math.max(5, p.interval.workSeconds - 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-green-500 transition-colors">−</button>
                      <span className="text-xl font-black text-green-400 flex-1 text-center">{(c as TimerConfig['interval']).workSeconds}{t('secUnit')}</span>
                      <button onClick={() => setConfig(p => ({ ...p, interval: { ...p.interval, workSeconds: Math.min(300, p.interval.workSeconds + 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-green-500 transition-colors">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-2">{t('restTime')}</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfig(p => ({ ...p, interval: { ...p.interval, restSeconds: Math.max(5, p.interval.restSeconds - 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-red-500 transition-colors">−</button>
                      <span className="text-xl font-black text-red-400 flex-1 text-center">{(c as TimerConfig['interval']).restSeconds}{t('secUnit')}</span>
                      <button onClick={() => setConfig(p => ({ ...p, interval: { ...p.interval, restSeconds: Math.min(300, p.interval.restSeconds + 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-red-500 transition-colors">+</button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-2">{t('totalRounds')}</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setConfig(p => ({ ...p, interval: { ...p.interval, rounds: Math.max(1, p.interval.rounds - 1) } }))}
                      className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">−</button>
                    <span className="text-3xl font-black text-white flex-1 text-center">{(c as TimerConfig['interval']).rounds}{t('roundUnit')}</span>
                    <button onClick={() => setConfig(p => ({ ...p, interval: { ...p.interval, rounds: Math.min(50, p.interval.rounds + 1) } }))}
                      className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">+</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === Fullscreen capable Timer & Controls Area === */}
        <div className={
          isFullscreen
            ? `fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden touch-none overscroll-none pointer-events-auto`
            : "mb-4"
        }>
          {isFullscreen && (
            <button onClick={() => setIsFullscreen(false)} className="absolute top-6 left-6 p-2 rounded-full bg-white/10 text-white/50 hover:text-white hover:bg-white/20 transition-all z-10" title={t('backToMenu')}>
              <XIcon size={28} />
            </button>
          )}

          <div className={
            isFullscreen
              ? "flex-1 flex flex-col items-center justify-center p-6 w-full max-h-screen relative"
              : `rounded-2xl relative border-2 ${phaseBorder} ${phaseColor} p-4 md:p-8 flex flex-col items-center justify-center text-center transition-colors duration-300`
          }>
            {!isFullscreen && (running || finished || elapsed > 0) && (
              <button onClick={() => setIsFullscreen(true)} className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-white/50 hover:text-white transition-all z-10" title={t('fullscreen')}>
                <MaximizeIcon size={20} />
              </button>
            )}

            {/* Phase Indicator */}
            {running && (
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6 ${
                phase === 'work'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${phase === 'work' ? 'bg-green-400' : 'bg-red-400'}`} />
                {phase === 'work' ? t('phaseWork') : t('phaseRest')}
              </div>
            )}

            {finished && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-6 bg-rx-orange/20 text-rx-orange border border-rx-orange/30">
                {t('finished')}
              </div>
            )}

            {/* Big Timer */}
            <div className={`font-black tracking-tighter leading-none mb-6 text-center w-full ${
              timeLeft < 10 && running ? 'text-rx-red animate-pulse' : 'text-white'
            }`}
              style={{ fontSize: isFullscreen ? 'clamp(100px, 25vw, 250px)' : 'clamp(60px, 20vw, 120px)' }}
            >
              {formatTime(timeLeft)}
            </div>

            {/* Round Info */}
            {(mode !== 'amrap' && mode !== 'fortime') && (
              <div className={isFullscreen ? "text-white/80 text-2xl font-bold uppercase tracking-widest" : "text-rx-muted text-lg font-bold"}>
                Round {mode === 'tabata' ? Math.ceil(currentRound / 2) : currentRound} / {mode === 'tabata'
                  ? (c as TimerConfig['tabata']).rounds
                  : mode === 'emom'
                  ? (c as TimerConfig['emom']).rounds
                  : (c as TimerConfig['interval']).rounds}
              </div>
            )}

            {mode === 'amrap' && running && (
              <div className={isFullscreen ? "text-white/80 text-xl font-bold uppercase" : "text-rx-muted text-sm font-bold"}>
                Elapsed: {formatTime(elapsed)}
              </div>
            )}
          </div>

          {/* 10초 후 시작 */}
          {!running && !finished && elapsed === 0 && (
            <label className="flex items-center justify-center gap-3 cursor-pointer mb-6 mt-4">
              <input
                type="checkbox"
                checked={countdownEnabled}
                onChange={(e) => setCountdownEnabled(e.target.checked)}
                className="w-5 h-5 accent-rx-red"
              />
              <span className="text-white font-bold text-sm">{t('countdown')}</span>
            </label>
          )}

          {/* Controls */}
          <div className={
            isFullscreen
              ? "p-6 pb-safe flex gap-4 w-full max-w-[640px] mx-auto bg-transparent mb-10 z-10"
              : "flex gap-3 mt-2"
          }>
            <button
              onClick={handleStart}
              className={`flex-1 h-20 min-h-[64px] rounded-2xl font-black text-2xl transition-all active:scale-95 border-2 flex items-center justify-center gap-3 ${
                finished
                  ? 'bg-transparent border-rx-orange text-rx-orange hover:bg-rx-orange hover:text-white'
                  : running
                  ? 'bg-yellow-500 border-yellow-500 text-black hover:bg-yellow-400'
                  : 'gradient-bg border-transparent text-white hover:opacity-90'
              }`}
            >
              {finished ? t('restart') : running ? <><PauseIcon size={28}/>{t('pause')}</> : (elapsed > 0 ? <><PlayIcon size={28}/>{t('resume')}</> : <><PlayIcon size={28}/>{t('start')}</>)}
            </button>
            <button
              onClick={reset}
              className={`h-20 w-20 min-h-[64px] rounded-2xl border-2 font-black text-lg transition-colors flex items-center justify-center shrink-0 ${
                isFullscreen
                  ? "bg-transparent border-white/30 text-white/50 hover:text-white hover:border-white"
                  : "bg-rx-surface border-rx-border text-rx-muted hover:text-white hover:border-rx-red"
              }`}
              title={t('backToMenu')}
            >
              <RotateCcwIcon size={28} />
            </button>
          </div>
        </div>

        {/* Mode Info */}
        {!isFullscreen && <div className="card bg-rx-surface/50 mb-6">
          <h3 className="font-bold text-white text-sm mb-2">
            {mode === 'amrap' && t('amrapTitle')}
            {mode === 'emom' && t('emomTitle')}
            {mode === 'tabata' && t('tabataTitle')}
            {mode === 'fortime' && t('fortimeTitle')}
            {mode === 'interval' && t('intervalTitle')}
          </h3>
          <p className="text-rx-muted text-xs leading-relaxed">
            {mode === 'amrap' && t('amrapDesc')}
            {mode === 'emom' && t('emomDesc')}
            {mode === 'tabata' && t('tabataDesc')}
            {mode === 'fortime' && t('fortimeDesc')}
            {mode === 'interval' && t('intervalDesc')}
          </p>
        </div>}

        {/* AdSense bottom */}
        <div className="hidden w-full h-16 bg-rx-surface border border-rx-border rounded-lg flex items-center justify-center">
          <span className="text-rx-muted text-xs">광고 영역 (AdSense)</span>
        </div>
      </main>
      {countingDown && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]">
          <div className="text-center w-full">
            <div className="font-black text-rx-red animate-pulse leading-none" style={{ fontSize: 'clamp(150px, 40vw, 350px)' }}>{countdownVal}</div>
            <p className="text-white/70 font-black text-2xl mt-4 uppercase tracking-widest">{t('getReady')}</p>
            <button
              onClick={() => {
                if (countdownRef.current) clearInterval(countdownRef.current);
                setCountingDown(false);
                setCountdownVal(10);
              }}
              className="mt-12 px-8 py-3 rounded-full border-2 border-white/20 text-white/50 hover:text-white hover:border-white transition-colors font-bold text-lg"
            >
              {t('cancelCountdown')}
            </button>
          </div>
        </div>
      )}
      {!isFullscreen && <MobileNav />}
    </div>
  )
}
