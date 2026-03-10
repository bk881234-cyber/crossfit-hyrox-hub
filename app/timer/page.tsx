'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'

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

function beep(ctx: AudioContext, freq: number, duration: number, volume = 0.3) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)
  oscillator.frequency.value = freq
  oscillator.type = 'sine'
  gainNode.gain.setValueAtTime(volume, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + duration)
}

function beepStart(ctx: AudioContext) {
  beep(ctx, 880, 0.15, 0.4)
}

function beepEnd(ctx: AudioContext) {
  beep(ctx, 440, 0.3, 0.4)
  setTimeout(() => beep(ctx, 440, 0.3, 0.4), 350)
}

function beepCountdown(ctx: AudioContext) {
  beep(ctx, 880, 0.15, 0.8)
}

function beepCountdownFinal(ctx: AudioContext) {
  beep(ctx, 1200, 0.15, 0.8)
}

export default function TimerPage() {
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

  const [countdownEnabled, setCountdownEnabled] = useState(false)
  const [countingDown, setCountingDown] = useState(false)
  const [countdownVal, setCountdownVal] = useState(10)

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

  const getInitialState = useCallback(() => {
    const c = config[mode]
    switch (mode) {
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
  }, [config, mode])

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
    const init = getInitialState()
    setTimeLeft(init.time)
    setTotalTime(init.time)
    setTotalRounds(init.rounds)
    setPhase(init.phase)
  }, [stop, getInitialState])

  // Reset when mode changes
  useEffect(() => {
    reset()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode])

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
    if (countdownEnabled) {
      await requestWakeLock()
      const ctx = getAudioCtx()
      setCountingDown(true)
      setCountdownVal(10)
      let val = 10
      countdownRef.current = setInterval(() => {
        val -= 1
        setCountdownVal(val)
        beep(ctx, 660, 0.12, 0.25)
        if (val <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          setCountingDown(false)
          setCountdownVal(10)
          beepStart(ctx)
          setRunning(true)
        }
      }, 1000)
      return
    }
    await requestWakeLock()
    const ctx = getAudioCtx()
    beepStart(ctx)
    setRunning(true)
  }, [finished, countingDown, running, stop, reset, requestWakeLock, getAudioCtx, countdownEnabled])

  useEffect(() => {
    if (!running) return

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const ctx = audioCtxRef.current

        if ((prev === 3 || prev === 2) && ctx) {
          beepCountdown(ctx)
        }

        if (prev === 1 && ctx) {
          beepCountdownFinal(ctx)
        }

        if (prev <= 1) {
          // Phase end
          const endCtx = audioCtxRef.current
          if (endCtx) setTimeout(() => beepEnd(endCtx), 400)

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
      <Header />
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-lg mx-auto">
        {/* AdSense top */}
        <div className="mt-4 mb-4 w-full h-16 bg-rx-surface border border-rx-border rounded-lg flex items-center justify-center">
          <span className="text-rx-muted text-xs">광고 영역 (AdSense)</span>
        </div>

        <h1 className="section-title">WOD 타이머</h1>
        <p className="section-sub">운동 모드를 선택하고 타이머를 시작하세요</p>

        {/* Mode Tabs */}
        <div className="flex gap-1 bg-rx-surface rounded-xl p-1 mb-6 overflow-x-auto">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => { if (!running) setMode(m.id) }}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                mode === m.id ? 'bg-rx-red text-white' : 'text-rx-muted hover:text-white'
              } ${running ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Config Panel */}
        {!running && !finished && (
          <div className="card mb-6">
            <h3 className="font-bold text-white mb-4">설정</h3>
            {mode === 'amrap' && (
              <div>
                <label className="text-rx-muted text-sm block mb-2">시간 제한</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setConfig(p => ({ ...p, amrap: { minutes: Math.max(1, p.amrap.minutes - 1) } }))}
                    className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">−</button>
                  <span className="text-3xl font-black text-white flex-1 text-center">{(c as TimerConfig['amrap']).minutes}분</span>
                  <button onClick={() => setConfig(p => ({ ...p, amrap: { minutes: Math.min(99, p.amrap.minutes + 1) } }))}
                    className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">+</button>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[5, 10, 12, 15, 20, 30].map(m => (
                    <button key={m} onClick={() => setConfig(p => ({ ...p, amrap: { minutes: m } }))}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${(c as TimerConfig['amrap']).minutes === m ? 'bg-rx-red text-white' : 'bg-rx-surface text-rx-muted hover:text-white'}`}>
                      {m}분
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'emom' && (
              <div className="space-y-4">
                <div>
                  <label className="text-rx-muted text-sm block mb-2">총 라운드</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setConfig(p => ({ ...p, emom: { ...p.emom, rounds: Math.max(1, p.emom.rounds - 1) } }))}
                      className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">−</button>
                    <span className="text-3xl font-black text-white flex-1 text-center">{(c as TimerConfig['emom']).rounds}라운드</span>
                    <button onClick={() => setConfig(p => ({ ...p, emom: { ...p.emom, rounds: Math.min(60, p.emom.rounds + 1) } }))}
                      className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">+</button>
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-2">인터벌 (초)</label>
                  <div className="flex gap-2 flex-wrap">
                    {[30, 45, 60, 90, 120].map(s => (
                      <button key={s} onClick={() => setConfig(p => ({ ...p, emom: { ...p.emom, workSeconds: s } }))}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${(c as TimerConfig['emom']).workSeconds === s ? 'bg-rx-red text-white' : 'bg-rx-surface text-rx-muted hover:text-white'}`}>
                        {s}초
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
                    <label className="text-rx-muted text-sm block mb-2">운동 시간</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfig(p => ({ ...p, tabata: { ...p.tabata, workSeconds: Math.max(5, p.tabata.workSeconds - 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-green-500 transition-colors">−</button>
                      <span className="text-xl font-black text-green-400 flex-1 text-center">{(c as TimerConfig['tabata']).workSeconds}초</span>
                      <button onClick={() => setConfig(p => ({ ...p, tabata: { ...p.tabata, workSeconds: Math.min(120, p.tabata.workSeconds + 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-green-500 transition-colors">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-2">휴식 시간</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfig(p => ({ ...p, tabata: { ...p.tabata, restSeconds: Math.max(5, p.tabata.restSeconds - 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-red-500 transition-colors">−</button>
                      <span className="text-xl font-black text-red-400 flex-1 text-center">{(c as TimerConfig['tabata']).restSeconds}초</span>
                      <button onClick={() => setConfig(p => ({ ...p, tabata: { ...p.tabata, restSeconds: Math.min(120, p.tabata.restSeconds + 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-red-500 transition-colors">+</button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-2">라운드 수</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setConfig(p => ({ ...p, tabata: { ...p.tabata, rounds: Math.max(1, p.tabata.rounds - 1) } }))}
                      className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">−</button>
                    <span className="text-3xl font-black text-white flex-1 text-center">{(c as TimerConfig['tabata']).rounds}라운드</span>
                    <button onClick={() => setConfig(p => ({ ...p, tabata: { ...p.tabata, rounds: Math.min(20, p.tabata.rounds + 1) } }))}
                      className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">+</button>
                  </div>
                </div>
              </div>
            )}

            {mode === 'fortime' && (
              <div>
                <label className="text-rx-muted text-sm block mb-2">제한 시간 (캡)</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setConfig(p => ({ ...p, fortime: { minutes: Math.max(1, p.fortime.minutes - 1) } }))}
                    className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">−</button>
                  <span className="text-3xl font-black text-white flex-1 text-center">{(c as TimerConfig['fortime']).minutes}분</span>
                  <button onClick={() => setConfig(p => ({ ...p, fortime: { minutes: Math.min(99, p.fortime.minutes + 1) } }))}
                    className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">+</button>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[3, 5, 10, 15, 20, 30, 40].map(m => (
                    <button key={m} onClick={() => setConfig(p => ({ ...p, fortime: { minutes: m } }))}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${(c as TimerConfig['fortime']).minutes === m ? 'bg-rx-red text-white' : 'bg-rx-surface text-rx-muted hover:text-white'}`}>
                      {m}분
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'interval' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-rx-muted text-sm block mb-2">운동 시간</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfig(p => ({ ...p, interval: { ...p.interval, workSeconds: Math.max(5, p.interval.workSeconds - 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-green-500 transition-colors">−</button>
                      <span className="text-xl font-black text-green-400 flex-1 text-center">{(c as TimerConfig['interval']).workSeconds}초</span>
                      <button onClick={() => setConfig(p => ({ ...p, interval: { ...p.interval, workSeconds: Math.min(300, p.interval.workSeconds + 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-green-500 transition-colors">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-2">휴식 시간</label>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setConfig(p => ({ ...p, interval: { ...p.interval, restSeconds: Math.max(5, p.interval.restSeconds - 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-red-500 transition-colors">−</button>
                      <span className="text-xl font-black text-red-400 flex-1 text-center">{(c as TimerConfig['interval']).restSeconds}초</span>
                      <button onClick={() => setConfig(p => ({ ...p, interval: { ...p.interval, restSeconds: Math.min(300, p.interval.restSeconds + 5) } }))}
                        className="w-8 h-8 rounded-full bg-rx-surface border border-rx-border text-white font-bold hover:border-red-500 transition-colors">+</button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-2">총 라운드</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setConfig(p => ({ ...p, interval: { ...p.interval, rounds: Math.max(1, p.interval.rounds - 1) } }))}
                      className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">−</button>
                    <span className="text-3xl font-black text-white flex-1 text-center">{(c as TimerConfig['interval']).rounds}라운드</span>
                    <button onClick={() => setConfig(p => ({ ...p, interval: { ...p.interval, rounds: Math.min(50, p.interval.rounds + 1) } }))}
                      className="w-10 h-10 rounded-full bg-rx-surface border border-rx-border text-white font-bold text-xl hover:border-rx-red transition-colors">+</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timer Display */}
        <div className={`rounded-2xl border-2 ${phaseBorder} ${phaseColor} p-8 mb-6 text-center transition-colors duration-300`}>
          {/* Phase Indicator */}
          {running && (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 ${
              phase === 'work'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${phase === 'work' ? 'bg-green-400' : 'bg-red-400'}`} />
              {phase === 'work' ? '운동 중' : '휴식 중'}
            </div>
          )}

          {finished && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4 bg-rx-orange/20 text-rx-orange border border-rx-orange/30">
              완료!
            </div>
          )}

          {/* Big Timer */}
          <div className={`font-black tracking-tighter leading-none mb-4 ${
            timeLeft < 10 && running ? 'text-rx-red' : 'text-white'
          }`}
            style={{ fontSize: 'clamp(60px, 20vw, 120px)' }}
          >
            {mode === 'fortime' || mode === 'amrap'
              ? formatTime(timeLeft)
              : formatTime(timeLeft)
            }
          </div>

          {/* Round Info */}
          {(mode !== 'amrap' && mode !== 'fortime') && (
            <div className="text-rx-muted text-lg font-bold">
              라운드 {mode === 'tabata' ? Math.ceil(currentRound / 2) : currentRound} /&nbsp;
              {mode === 'tabata'
                ? (c as TimerConfig['tabata']).rounds
                : mode === 'emom'
                ? (c as TimerConfig['emom']).rounds
                : (c as TimerConfig['interval']).rounds}
            </div>
          )}

          {mode === 'amrap' && running && (
            <div className="text-rx-muted text-sm">
              경과: {formatTime(elapsed)}
            </div>
          )}
        </div>

        {/* 10초 후 시작 */}
        {!running && !finished && (
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={countdownEnabled}
              onChange={(e) => setCountdownEnabled(e.target.checked)}
              className="w-4 h-4 accent-rx-red"
            />
            <span className="text-rx-muted text-sm">10초 후 시작</span>
          </label>
        )}

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleStart}
            className={`flex-1 h-16 rounded-2xl font-black text-xl transition-all active:scale-95 ${
              finished
                ? 'bg-rx-orange text-white hover:bg-orange-500'
                : running
                ? 'bg-yellow-500 text-black hover:bg-yellow-400'
                : 'bg-rx-red text-white hover:bg-red-600'
            }`}
          >
            {finished ? '다시 시작' : running ? '일시정지' : '시작'}
          </button>
          <button
            onClick={reset}
            className="h-16 w-16 rounded-2xl bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red transition-colors flex items-center justify-center"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4" />
            </svg>
          </button>
        </div>

        {/* Mode Info */}
        <div className="card bg-rx-surface/50 mb-6">
          <h3 className="font-bold text-white text-sm mb-2">
            {mode === 'amrap' && 'AMRAP (As Many Rounds As Possible)'}
            {mode === 'emom' && 'EMOM (Every Minute On the Minute)'}
            {mode === 'tabata' && 'Tabata (타바타)'}
            {mode === 'fortime' && 'For Time (제한 시간)'}
            {mode === 'interval' && 'Interval (인터벌)'}
          </h3>
          <p className="text-rx-muted text-xs leading-relaxed">
            {mode === 'amrap' && '설정한 시간 동안 최대한 많은 라운드를 완료하세요.'}
            {mode === 'emom' && '매 분마다 정해진 동작을 완료하고 남은 시간은 휴식합니다.'}
            {mode === 'tabata' && '20초 운동 / 10초 휴식을 8라운드 반복하는 고강도 인터벌 훈련입니다.'}
            {mode === 'fortime' && '제한 시간 내에 주어진 동작을 완료하세요. 완료 시 타이머를 정지하세요.'}
            {mode === 'interval' && '설정한 운동/휴식 시간으로 반복 인터벌 훈련을 진행합니다.'}
          </p>
        </div>

        {/* AdSense bottom */}
        <div className="w-full h-16 bg-rx-surface border border-rx-border rounded-lg flex items-center justify-center">
          <span className="text-rx-muted text-xs">광고 영역 (AdSense)</span>
        </div>
      </main>
      {countingDown && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="text-center">
            <div className="font-black text-white" style={{ fontSize: 'clamp(100px, 30vw, 200px)' }}>{countdownVal}</div>
            <p className="text-white/50 text-lg mt-2">준비하세요!</p>
            <button onClick={() => { if (countdownRef.current) clearInterval(countdownRef.current); setCountingDown(false); setCountdownVal(10); }} className="mt-4 text-rx-muted text-sm underline">취소</button>
          </div>
        </div>
      )}
      <MobileNav />
    </div>
  )
}
