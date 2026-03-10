'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { WODS } from '@/lib/wod-data'

interface WodLog {
  id: string
  wodId: string
  wodName: string
  wodType: string      // 'For Time' | 'AMRAP' | 'EMOM' | 'Tabata' | 'Strength' | 'Custom'
  date: string
  time: string
  rounds: string
  weight: string
  difficulty: number   // 1-5
  notes: string
  createdAt: string
}

const WOD_TYPES = ['For Time', 'AMRAP', 'EMOM', 'Tabata', 'Strength', 'Custom']

/* ─── Calendar View ─── */
function CalendarView({ logs, currentDate, onDayClick }: {
  logs: WodLog[]
  currentDate: Date
  onDayClick: (date: string) => void
}) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const logMap: Record<string, number> = {}
  logs.forEach(l => { logMap[l.date] = (logMap[l.date] || 0) + 1 })

  const cells: Array<{ day: number; dateStr: string; count: number } | null> = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, dateStr, count: logMap[dateStr] || 0 })
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => (
          <div key={d} className="text-center text-rx-muted text-xs py-2 font-medium">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => (
          <div key={i} className="aspect-square">
            {cell ? (
              <button
                onClick={() => cell.count > 0 ? onDayClick(cell.dateStr) : undefined}
                className={`w-full h-full flex flex-col items-center justify-center rounded-xl text-xs transition-all ${
                  cell.count > 0
                    ? 'cursor-pointer hover:scale-105'
                    : 'cursor-default'
                } ${cell.dateStr === today ? 'border border-white/20' : ''}`}
                style={cell.count > 0 ? {
                  background: 'linear-gradient(135deg, rgba(232,50,26,0.25), rgba(255,45,139,0.25))',
                  border: '1px solid rgba(232,50,26,0.4)'
                } : { background: 'transparent' }}
              >
                <span className={cell.count > 0 ? 'text-white font-bold' : 'text-rx-muted'}>{cell.day}</span>
                {cell.count > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: Math.min(cell.count, 3) }).map((_, i) => (
                      <div key={i} className="w-1 h-1 rounded-full gradient-bg" />
                    ))}
                  </div>
                )}
              </button>
            ) : <div />}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Star Rating ─── */
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`text-xl transition-transform hover:scale-110 ${s <= value ? 'opacity-100' : 'opacity-20'}`}
        >
          🔥
        </button>
      ))}
      <span className="text-rx-muted text-xs ml-2 self-center">
        {value === 0 ? '' : ['', '매우 쉬움', '쉬움', '보통', '힘듦', '극한'][value]}
      </span>
    </div>
  )
}

/* ─── Main Content ─── */
function WodLogContent() {
  const searchParams = useSearchParams()
  const preWodId = searchParams.get('wod') || ''

  const [logs, setLogs] = useState<WodLog[]>([])
  const [view, setView] = useState<'form' | 'list' | 'calendar'>('form')

  // Form state
  const [selectedWod, setSelectedWod] = useState(preWodId)
  const [customWodName, setCustomWodName] = useState('')
  const [wodType, setWodType] = useState('For Time')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('')
  const [rounds, setRounds] = useState('')
  const [weight, setWeight] = useState('')
  const [difficulty, setDifficulty] = useState(3)
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  // Calendar
  const [calDate, setCalDate] = useState(new Date())
  const [filterDate, setFilterDate] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('wod-logs-v2')
    if (stored) {
      try { setLogs(JSON.parse(stored)) } catch {}
    } else {
      // Migrate from old format
      const old = localStorage.getItem('wod-logs')
      if (old) {
        try {
          const migrated: WodLog[] = JSON.parse(old).map((l: Record<string, string>) => ({
            ...l, wodType: 'For Time', difficulty: 3,
          }))
          setLogs(migrated)
          localStorage.setItem('wod-logs-v2', JSON.stringify(migrated))
        } catch {}
      }
    }
  }, [])

  const saveLogs = (updated: WodLog[]) => {
    setLogs(updated)
    localStorage.setItem('wod-logs-v2', JSON.stringify(updated))
  }

  const selectedWodInfo = WODS.find(w => w.id === selectedWod)

  const handleSave = () => {
    const wodName = selectedWod === 'custom'
      ? customWodName
      : (selectedWodInfo?.name || selectedWod)
    if (!wodName) return

    const newLog: WodLog = {
      id: Date.now().toString(),
      wodId: selectedWod,
      wodName,
      wodType,
      date,
      time,
      rounds,
      weight,
      difficulty,
      notes,
      createdAt: new Date().toISOString(),
    }
    saveLogs([newLog, ...logs])
    setTime(''); setWeight(''); setRounds(''); setNotes(''); setDifficulty(3)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDelete = (id: string) => saveLogs(logs.filter(l => l.id !== id))

  // Grouped list
  const filteredLogs = filterDate ? logs.filter(l => l.date === filterDate) : logs
  const grouped: Record<string, WodLog[]> = {}
  filteredLogs.forEach(l => { (grouped[l.date] = grouped[l.date] || []).push(l) })
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-2xl mx-auto">

        {/* ─ Header ─ */}
        <div className="mt-6 mb-6">
          <Link href="/wod" className="flex items-center gap-1 text-rx-muted text-sm hover:text-white transition-colors mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            WOD Library
          </Link>
          <h1 className="font-heading font-black text-5xl uppercase tracking-tight gradient-text">WOD LOG</h1>
          <p className="text-rx-muted text-sm mt-1">운동 기록을 저장하고 성장을 추적하세요</p>
        </div>

        {/* ─ View Tabs ─ */}
        <div className="flex gap-2 mb-6 bg-rx-surface border border-rx-border rounded-xl p-1">
          {[
            { id: 'form', label: '기록 추가' },
            { id: 'list', label: `리스트 (${logs.length})` },
            { id: 'calendar', label: '달력' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setView(tab.id as 'form' | 'list' | 'calendar'); setFilterDate('') }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                view === tab.id ? 'gradient-bg text-white' : 'text-rx-muted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ FORM VIEW ═══ */}
        {view === 'form' && (
          <div className="bg-rx-card border border-rx-border rounded-2xl p-6">
            <h2 className="font-heading font-black text-2xl uppercase text-white mb-5">새 기록 추가</h2>

            {/* Date */}
            <div className="mb-4">
              <label className="text-rx-muted text-xs font-bold mb-2 block uppercase tracking-wider">날짜</label>
              <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
            </div>

            {/* WOD Select */}
            <div className="mb-4">
              <label className="text-rx-muted text-xs font-bold mb-2 block uppercase tracking-wider">WOD 선택</label>
              <select className="input" value={selectedWod} onChange={e => setSelectedWod(e.target.value)}>
                <option value="">WOD를 선택하세요</option>
                <optgroup label="── Girl WODs ──">
                  {WODS.filter(w => w.type === 'girl').map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </optgroup>
                <optgroup label="── Hero WODs ──">
                  {WODS.filter(w => w.type === 'hero').map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </optgroup>
                <optgroup label="── CrossFit Open ──">
                  {WODS.filter(w => w.type === 'open').map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </optgroup>
                <option value="custom">── 직접 입력 ──</option>
              </select>
            </div>

            {selectedWodInfo && (
              <div className="mb-4 p-3 bg-rx-surface border border-rx-border rounded-xl">
                <div className="text-white font-bold text-sm mb-0.5">{selectedWodInfo.name} <span className="text-rx-muted font-normal capitalize text-xs">({selectedWodInfo.type})</span></div>
                <div className="text-rx-muted text-xs">{selectedWodInfo.movements.join(' · ')}</div>
              </div>
            )}

            {selectedWod === 'custom' && (
              <div className="mb-4">
                <label className="text-rx-muted text-xs font-bold mb-2 block uppercase tracking-wider">WOD 이름</label>
                <input type="text" className="input" placeholder="WOD 이름 입력" value={customWodName} onChange={e => setCustomWodName(e.target.value)} />
              </div>
            )}

            {/* WOD Type */}
            <div className="mb-4">
              <label className="text-rx-muted text-xs font-bold mb-2 block uppercase tracking-wider">운동 타입</label>
              <div className="flex flex-wrap gap-2">
                {WOD_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setWodType(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      wodType === t ? 'gradient-bg text-white' : 'bg-rx-surface border border-rx-border text-rx-muted hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Time + Rounds */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-rx-muted text-xs font-bold mb-2 block uppercase tracking-wider">기록 시간</label>
                <input type="text" className="input" placeholder="예: 4:52" value={time} onChange={e => setTime(e.target.value)} />
              </div>
              <div>
                <label className="text-rx-muted text-xs font-bold mb-2 block uppercase tracking-wider">라운드 수</label>
                <input type="text" className="input" placeholder="예: 12 rounds" value={rounds} onChange={e => setRounds(e.target.value)} />
              </div>
            </div>

            {/* Weight */}
            <div className="mb-4">
              <label className="text-rx-muted text-xs font-bold mb-2 block uppercase tracking-wider">사용 무게</label>
              <input type="text" className="input" placeholder="예: Thruster 43kg, DL 100kg" value={weight} onChange={e => setWeight(e.target.value)} />
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <label className="text-rx-muted text-xs font-bold mb-2 block uppercase tracking-wider">체감 난이도</label>
              <StarRating value={difficulty} onChange={setDifficulty} />
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="text-rx-muted text-xs font-bold mb-2 block uppercase tracking-wider">메모</label>
              <textarea className="input min-h-[80px] resize-none" placeholder="오늘 컨디션, 느낀 점, 다음 목표..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <button
              onClick={handleSave}
              disabled={!selectedWod || (selectedWod === 'custom' && !customWodName)}
              className="w-full btn-primary py-3.5 rounded-xl font-bold text-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saved ? (
                <span className="flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  저장 완료!
                </span>
              ) : '기록 저장'}
            </button>
          </div>
        )}

        {/* ═══ LIST VIEW ═══ */}
        {view === 'list' && (
          <div>
            {filterDate && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-rx-surface border border-rx-border rounded-xl">
                <span className="text-white text-sm font-bold">{filterDate} 기록</span>
                <button onClick={() => setFilterDate('')} className="ml-auto text-rx-muted hover:text-white text-xs">전체 보기</button>
              </div>
            )}

            {logs.length === 0 ? (
              <div className="text-center py-14 bg-rx-surface border border-rx-border rounded-2xl">
                <svg className="w-12 h-12 text-rx-muted mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <p className="text-white font-bold text-lg mb-1">아직 기록이 없습니다</p>
                <p className="text-rx-muted text-sm">기록 추가 탭에서 첫 WOD를 기록해보세요!</p>
              </div>
            ) : sortedDates.length === 0 ? (
              <div className="text-center py-10 text-rx-muted">이 날짜의 기록이 없습니다</div>
            ) : (
              <div className="flex flex-col gap-6">
                {sortedDates.map(date => (
                  <div key={date}>
                    <div className="text-rx-muted text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b border-rx-border">{date}</div>
                    <div className="flex flex-col gap-3">
                      {grouped[date].map(log => (
                        <div key={log.id} className="bg-rx-card border border-rx-border rounded-2xl p-5 hover:border-white/20 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className="text-white font-black text-xl">{log.wodName}</span>
                              <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full gradient-bg text-white font-bold">{log.wodType}</span>
                            </div>
                            <button onClick={() => handleDelete(log.id)} className="text-rx-muted hover:text-red-400 transition-colors p-1">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-3 mb-2">
                            {log.time && <span className="flex items-center gap-1 text-sm font-bold gradient-text">⏱ {log.time}</span>}
                            {log.rounds && <span className="text-green-400 text-sm font-bold">🔄 {log.rounds}</span>}
                            {log.weight && <span className="text-blue-400 text-sm font-bold">🏋️ {log.weight}</span>}
                            {log.difficulty > 0 && <span className="text-yellow-400 text-sm">{'🔥'.repeat(log.difficulty)}</span>}
                          </div>
                          {log.notes && <p className="text-rx-muted text-xs leading-relaxed border-t border-rx-border pt-2 mt-2">{log.notes}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ CALENDAR VIEW ═══ */}
        {view === 'calendar' && (
          <div>
            {/* Month nav */}
            <div className="flex items-center justify-between mb-6 bg-rx-card border border-rx-border rounded-xl px-4 py-3">
              <button
                onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1))}
                className="text-rx-muted hover:text-white transition-colors p-1"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <span className="font-heading font-black text-xl text-white uppercase">
                {calDate.getFullYear()}.{String(calDate.getMonth() + 1).padStart(2, '0')}
              </span>
              <button
                onClick={() => setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1))}
                className="text-rx-muted hover:text-white transition-colors p-1"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>

            <div className="bg-rx-card border border-rx-border rounded-2xl p-4 mb-6">
              <CalendarView
                logs={logs}
                currentDate={calDate}
                onDayClick={(date) => { setFilterDate(date); setView('list') }}
              />
            </div>

            {/* Monthly summary */}
            <div className="bg-rx-surface border border-rx-border rounded-2xl p-5">
              <div className="font-bold text-white mb-3">
                {calDate.getMonth() + 1}월 요약
              </div>
              {(() => {
                const monthStr = `${calDate.getFullYear()}-${String(calDate.getMonth() + 1).padStart(2, '0')}`
                const monthLogs = logs.filter(l => l.date.startsWith(monthStr))
                const days = new Set(monthLogs.map(l => l.date)).size
                return (
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="font-heading font-black text-3xl gradient-text">{monthLogs.length}</div>
                      <div className="text-rx-muted text-xs">총 기록</div>
                    </div>
                    <div>
                      <div className="font-heading font-black text-3xl gradient-text">{days}</div>
                      <div className="text-rx-muted text-xs">운동 일수</div>
                    </div>
                    <div>
                      <div className="font-heading font-black text-3xl gradient-text">
                        {monthLogs.length > 0 ? (monthLogs.reduce((a, b) => a + b.difficulty, 0) / monthLogs.length).toFixed(1) : '-'}
                      </div>
                      <div className="text-rx-muted text-xs">평균 난이도</div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

      </main>
      <MobileNav />
    </div>
  )
}

export default function WodLogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-rx-bg flex items-center justify-center">
        <div className="text-rx-muted">Loading...</div>
      </div>
    }>
      <WodLogContent />
    </Suspense>
  )
}
