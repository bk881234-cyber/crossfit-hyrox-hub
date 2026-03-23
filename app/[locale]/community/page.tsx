'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { HYROX_EVENTS, BOARD_POSTS, type BoardPost } from '@/lib/community-data'

type Tab = 'hyrox' | 'major' | 'board'

// ─── 국내 대형 대회 타입 ───────────────────────────────────────────────────────
interface MajorComp {
  id: string
  name: string        // 한국명
  nameEn: string      // 영문명
  scale: string
  period: string      // "매년 4~6월 (예정)" 형식
  instagramUrl: string
  isHardcoded: true
  isMakia?: boolean
}

// 마키아 상세 일정
const MAKIA_DETAIL = {
  fullName: '2026 Jeju Island MAKIA',
  slogan: 'UNLOCK YOUR LIMIT',
  location: '제주도',
  registrationStart: '2026-04-27',
  registrationEnd: '2026-05-11',
  wodReveal: '2026-05-04',
  qualifierStart: '2026-05-06',
  qualifierEnd: '2026-05-17',
  mainEvent: '2026년 여름',
  ddayTarget: '2026-05-11', // 예선 접수 마감
}

interface RegisteredComp {
  id: string
  name: string
  organizer: string
  city: string
  date: string
  fee: string
  description: string
  registrationUrl: string
  contactName: string
  contactEmail: string
  isHardcoded: false
  createdAt: string
}

type AnyComp = MajorComp | RegisteredComp

const HARDCODED_COMPS: MajorComp[] = [
  {
    id: 'teamoffour', name: '팀오브포', nameEn: 'Team of Four',
    scale: '4인 팀 대회', period: '매년 4~6월 (예정)',
    instagramUrl: 'https://www.instagram.com/teamof_four', isHardcoded: true,
  },
  {
    id: 'kboxrise', name: '케이박스라이즈', nameEn: 'K-Box Rise',
    scale: '박스 단위 팀 대회 · 국내 최대 규모급', period: '매년 5~7월 (예정)',
    instagramUrl: 'https://www.instagram.com/k_box_rise', isHardcoded: true,
  },
  {
    id: 'makia', name: '마키아', nameEn: 'Makia',
    scale: '개인/팀 대회 · 제주도 개최', period: '예선 2026년 5월 · 본대회 2026년 여름',
    instagramUrl: 'https://www.instagram.com/makia_official_', isHardcoded: true, isMakia: true,
  },
  {
    id: 'battlecrew', name: '배틀크루', nameEn: 'Battle Crew',
    scale: '크루(4~6명) 단위 · 전국 선발전→챔피언십 구조', period: '매년 5~9월 (예정)',
    instagramUrl: 'https://www.instagram.com/battlecrew_korea', isHardcoded: true,
  },
  {
    id: 'suff', name: '서프', nameEn: 'SUFF',
    scale: '여름 시즌 대표 대회', period: '매년 7~8월 (예정)',
    instagramUrl: 'https://www.instagram.com/suff_estival', isHardcoded: true,
  },
  {
    id: 'cfkoreaopen', name: '크로스핏 코리아 오픈', nameEn: 'CrossFit Korea Open',
    scale: 'CrossFit Korea 공식 주관', period: '매년 2~3월 (예정)',
    instagramUrl: 'https://www.instagram.com/crossfitkorea', isHardcoded: true,
  },
  {
    id: 'nwnd', name: '엔스윈드', nameEn: 'NWND',
    scale: '개인/팀 대회', period: '매년 4~6월 (예정)',
    instagramUrl: 'https://www.instagram.com/nwnd_kr', isHardcoded: true,
  },
  {
    id: 'enuf', name: '이너프', nameEn: 'ENUF',
    scale: '개인/팀 대회', period: '매년 5~7월 (예정)',
    instagramUrl: 'https://www.instagram.com/enuf.sports', isHardcoded: true,
  },
  {
    id: 'girlfit', name: '걸핏코리아', nameEn: 'GirlFit Korea',
    scale: '여성 전용 크로스핏 대회', period: '매년 4~6월 (예정)',
    instagramUrl: 'https://www.instagram.com/girlfit_korea', isHardcoded: true,
  },
]

// ─── HYROX 날짜 유틸 ──────────────────────────────────────────────────────────
const TODAY = new Date('2026-03-12')

function getDday(dateStr: string): string {
  const diff = Math.ceil((new Date(dateStr).getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return '종료'
  if (diff === 0) return 'D-Day'
  return `D-${diff}`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function nowStr(): string {
  return formatDate(TODAY.toISOString().slice(0, 10))
}

// ─── 빈 폼 초기값 ─────────────────────────────────────────────────────────────
const emptyComp = {
  name: '', organizer: '', city: '', date: '',
  fee: '', description: '', registrationUrl: '',
  contactName: '', contactEmail: '',
}

const emptyPost = {
  nickname: '', title: '', content: '', tags: '',
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const isLoggedIn = false

  const [tab, setTab] = useState<Tab>('major')

  // URL 해시(#hyrox 등)로 직접 접근 시 해당 탭 활성화
  useEffect(() => {
    const hash = window.location.hash.slice(1) as Tab
    if (hash === 'hyrox' || hash === 'major' || hash === 'board') {
      setTab(hash)
    }
  }, [])
  const [likes, setLikes] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {}
    try { return JSON.parse(localStorage.getItem('board_likes') || '{}') } catch { return {} }
  })

  // 국내 대형 대회: 등록된 대회 상태
  const [registeredComps, setRegisteredComps] = useState<RegisteredComp[]>([])
  const [showCompModal, setShowCompModal] = useState(false)
  const [compForm, setCompForm] = useState(emptyComp)
  const [compSubmitted, setCompSubmitted] = useState(false)

  // 자유게시판: localStorage에서 사용자 작성 글 복원 후 기본 데이터와 병합
  const [boardPosts, setBoardPosts] = useState<BoardPost[]>(() => {
    if (typeof window === 'undefined') return BOARD_POSTS
    try {
      const saved: BoardPost[] = JSON.parse(localStorage.getItem('board_posts') || '[]')
      return [...saved, ...BOARD_POSTS]
    } catch { return BOARD_POSTS }
  })

  // boardPosts 변경 시 사용자 작성 글만 localStorage에 저장
  useEffect(() => {
    const userPosts = boardPosts.filter(p => p.id.startsWith('post-user-'))
    localStorage.setItem('board_posts', JSON.stringify(userPosts))
  }, [boardPosts])

  // likes 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('board_likes', JSON.stringify(likes))
  }, [likes])
  const [showWriteModal, setShowWriteModal] = useState(false)
  const [writeForm, setWriteForm] = useState(emptyPost)
  const [writeError, setWriteError] = useState('')

  const allComps: AnyComp[] = [
    ...registeredComps.slice().reverse(), // 신규 등록이 앞에
    ...HARDCODED_COMPS,
  ]

  const sortedHyrox = [...HYROX_EVENTS].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const toggleLike = (id: string) =>
    setLikes(prev => ({ ...prev, [id]: !prev[id] }))

  // ── 대회 등록 제출 ──────────────────────────────────────────────────────────
  const handleCompSubmit = () => {
    if (!compForm.name.trim() || !compForm.organizer.trim() || !compForm.date) return
    if (!isLoggedIn && (!compForm.contactName.trim() || !compForm.contactEmail.trim())) return

    const newComp: RegisteredComp = {
      id: `reg-${Date.now()}`,
      ...compForm,
      isHardcoded: false,
      createdAt: nowStr(),
    }
    setRegisteredComps(prev => [...prev, newComp])
    setCompSubmitted(true)
  }

  const closeCompModal = () => {
    setShowCompModal(false)
    setCompForm(emptyComp)
    setCompSubmitted(false)
  }

  // ── 게시글 작성 제출 ────────────────────────────────────────────────────────
  const handlePostSubmit = () => {
    setWriteError('')
    if (!writeForm.nickname.trim()) { setWriteError('닉네임을 입력해주세요.'); return }
    if (!writeForm.title.trim()) { setWriteError('제목을 입력해주세요.'); return }
    if (!writeForm.content.trim()) { setWriteError('내용을 입력해주세요.'); return }

    const tags = writeForm.tags
      .split(/[,#\s]+/)
      .map(t => t.trim())
      .filter(Boolean)
      .slice(0, 5)

    const newPost: BoardPost = {
      id: `post-user-${Date.now()}`,
      title: writeForm.title.trim(),
      content: writeForm.content.trim(),
      author: writeForm.nickname.trim(),
      createdAt: nowStr(),
      likes: 0,
      comments: 0,
      tags,
    }
    setBoardPosts(prev => [newPost, ...prev])
    setShowWriteModal(false)
    setWriteForm(emptyPost)
    setWriteError('')
  }

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-5xl mx-auto">
        <h1 className="section-title mt-4">커뮤니티</h1>
        <p className="section-sub">HYROX 대회 · 국내 대형 대회 · 자유게시판</p>

        {/* Tab Selector */}
        <div className="flex gap-1 bg-rx-surface rounded-xl p-1 mb-6">
          {([
            { id: 'major', label: '국내 대형 대회' },
            { id: 'hyrox', label: 'HYROX 대회' },
            { id: 'board', label: '자유게시판' },
          ] as { id: Tab; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                tab === t.id ? 'gradient-bg text-white' : 'text-rx-muted hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── HYROX 탭 ───────────────────────────────────────────────────────── */}
        {tab === 'hyrox' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-rx-muted text-sm">{HYROX_EVENTS.length}개 대회</p>
              <span className="badge bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs">2026 시즌</span>
            </div>
            <div className="space-y-3">
              {sortedHyrox.map((event) => {
                const dday = getDday(event.date)
                const isPast = dday === '종료'
                const isToday = dday === 'D-Day'
                return (
                  <div key={event.id} className={`card ${isPast ? 'opacity-60' : 'hover:border-rx-red/40'} transition-all`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`badge border text-xs ${
                            isPast ? 'bg-rx-surface border-rx-border text-rx-muted'
                            : isToday ? 'gradient-bg border-white/20 text-white'
                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                          }`}>{dday}</span>
                          <span className="text-rx-muted text-xs">{event.country}</span>
                        </div>
                        <h3 className="font-black text-white text-lg leading-tight">{event.name}</h3>
                        <p className="text-rx-muted text-sm mt-1">{formatDate(event.date)}</p>
                        <p className="text-rx-muted text-xs mt-1">{event.venue}</p>
                        {event.participants && (
                          <p className="text-rx-muted text-xs mt-1">예상 참가: {event.participants.toLocaleString()}명</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-2xl font-black text-rx-muted mb-2">{event.city}</div>
                        {!isPast && event.isOpen && (
                          <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-block bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition-colors">
                            등록하기
                          </a>
                        )}
                        {isPast && <span className="text-rx-muted text-xs">마감</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 국내 대형 대회 탭 ─────────────────────────────────────────────── */}
        {tab === 'major' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-rx-muted text-sm">총 {allComps.length}개 대회</p>
              <button
                onClick={() => setShowCompModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-bg text-white text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                대회 등록하기
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allComps.map((comp) => (
                comp.isHardcoded
                  ? <HardcodedCompCard key={comp.id} comp={comp as MajorComp} />
                  : <RegisteredCompCard key={comp.id} comp={comp as RegisteredComp} />
              ))}
            </div>
          </div>
        )}

        {/* ── 자유게시판 탭 ─────────────────────────────────────────────────── */}
        {tab === 'board' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-rx-muted text-sm">{boardPosts.length}개 게시글</p>
              <button
                onClick={() => setShowWriteModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-bg text-white text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                글쓰기
              </button>
            </div>
            <div className="space-y-3">
              {boardPosts.map((post) => (
                <BoardPostCard
                  key={post.id}
                  post={post}
                  liked={!!likes[post.id]}
                  onLike={() => toggleLike(post.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── 대회 등록 모달 ─────────────────────────────────────────────────── */}
      {showCompModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={closeCompModal} />
          <div className="relative w-full max-w-lg bg-rx-surface border border-rx-border rounded-t-2xl md:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-white text-xl">대회 등록하기</h2>
              <button onClick={closeCompModal} className="text-rx-muted hover:text-white p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {compSubmitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-black text-white text-xl mb-2">등록 완료!</h3>
                <p className="text-rx-muted text-sm mb-2">대회가 목록에 추가되었습니다.</p>
                <p className="text-rx-muted text-sm mb-6">담당자 확인 후 정식 게시됩니다.</p>
                <button onClick={closeCompModal} className="btn-primary px-8">확인</button>
              </div>
            ) : (
              <div className="space-y-4">
                {!isLoggedIn && (
                  <>
                    <div>
                      <label className="text-rx-muted text-sm block mb-1">신청자 이름 *</label>
                      <input type="text" className="input" placeholder="홍길동"
                        value={compForm.contactName}
                        onChange={e => setCompForm(p => ({ ...p, contactName: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-rx-muted text-sm block mb-1">이메일 *</label>
                      <input type="email" className="input" placeholder="example@email.com"
                        value={compForm.contactEmail}
                        onChange={e => setCompForm(p => ({ ...p, contactEmail: e.target.value }))} />
                    </div>
                    <hr className="border-rx-border" />
                  </>
                )}
                <div>
                  <label className="text-rx-muted text-sm block mb-1">대회명 *</label>
                  <input type="text" className="input" placeholder="대회 이름"
                    value={compForm.name}
                    onChange={e => setCompForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">주최 *</label>
                  <input type="text" className="input" placeholder="주최 단체 또는 박스명"
                    value={compForm.organizer}
                    onChange={e => setCompForm(p => ({ ...p, organizer: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">날짜 *</label>
                    <input type="date" className="input"
                      value={compForm.date}
                      onChange={e => setCompForm(p => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">지역</label>
                    <input type="text" className="input" placeholder="서울, 부산..."
                      value={compForm.city}
                      onChange={e => setCompForm(p => ({ ...p, city: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">참가비</label>
                  <input type="text" className="input" placeholder="예: 70,000원"
                    value={compForm.fee}
                    onChange={e => setCompForm(p => ({ ...p, fee: e.target.value }))} />
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">대회 설명</label>
                  <textarea className="input resize-none" rows={3} placeholder="대회 소개를 입력하세요"
                    value={compForm.description}
                    onChange={e => setCompForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">신청 링크</label>
                  <input type="url" className="input" placeholder="https://..."
                    value={compForm.registrationUrl}
                    onChange={e => setCompForm(p => ({ ...p, registrationUrl: e.target.value }))} />
                </div>

                {/* validation hint */}
                {(!compForm.name.trim() || !compForm.organizer.trim() || !compForm.date) && (
                  <p className="text-rx-muted text-xs">* 표시 항목은 필수입니다.</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={closeCompModal} className="flex-1 btn-secondary text-sm py-3">취소</button>
                  <button
                    onClick={handleCompSubmit}
                    disabled={!compForm.name.trim() || !compForm.organizer.trim() || !compForm.date || (!isLoggedIn && (!compForm.contactName.trim() || !compForm.contactEmail.trim()))}
                    className="flex-1 btn-primary text-sm py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    등록하기
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 글쓰기 모달 ────────────────────────────────────────────────────── */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => { setShowWriteModal(false); setWriteForm(emptyPost); setWriteError('') }} />
          <div className="relative w-full max-w-lg bg-rx-surface border border-rx-border rounded-t-2xl md:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-white text-xl">글쓰기</h2>
              <button onClick={() => { setShowWriteModal(false); setWriteForm(emptyPost); setWriteError('') }} className="text-rx-muted hover:text-white p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-rx-muted text-sm block mb-1">닉네임 *</label>
                <input type="text" className="input" placeholder="닉네임을 입력하세요"
                  value={writeForm.nickname}
                  onChange={e => setWriteForm(p => ({ ...p, nickname: e.target.value }))} />
              </div>
              <div>
                <label className="text-rx-muted text-sm block mb-1">제목 *</label>
                <input type="text" className="input" placeholder="제목을 입력하세요"
                  value={writeForm.title}
                  onChange={e => setWriteForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="text-rx-muted text-sm block mb-1">내용 *</label>
                <textarea
                  className="input resize-none"
                  rows={6}
                  placeholder="내용을 입력하세요"
                  value={writeForm.content}
                  onChange={e => setWriteForm(p => ({ ...p, content: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-rx-muted text-sm block mb-1">태그 <span className="text-rx-muted font-normal">(쉼표, 공백, # 구분 — 최대 5개)</span></label>
                <input type="text" className="input" placeholder="CrossFit, WOD, 기록달성"
                  value={writeForm.tags}
                  onChange={e => setWriteForm(p => ({ ...p, tags: e.target.value }))} />
              </div>

              {writeError && (
                <p className="text-rx-red text-sm font-bold">{writeError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => { setShowWriteModal(false); setWriteForm(emptyPost); setWriteError('') }}
                  className="flex-1 btn-secondary text-sm py-3"
                >
                  취소
                </button>
                <button onClick={handlePostSubmit} className="flex-1 btn-primary text-sm py-3">
                  게시하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  )
}

// ─── 인스타그램 아이콘 ────────────────────────────────────────────────────────────
function IgIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

// ─── 마키아 전용 D-day 계산 ───────────────────────────────────────────────────
function getMakiaDday(): string {
  const target = new Date(MAKIA_DETAIL.ddayTarget)
  const diff = Math.ceil((target.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return '마감'
  if (diff === 0) return 'D-Day'
  return `D-${diff}`
}

// ─── 하드코딩 대회 카드 ─────────────────────────────────────────────────────────
function HardcodedCompCard({ comp }: { comp: MajorComp }) {
  if (comp.isMakia) {
    const dday = getMakiaDday()
    const isPast = dday === '마감'
    return (
      <div className="card col-span-1 md:col-span-2 border-rx-red/30 hover:border-rx-red/60 transition-all">
        {/* 헤더 */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="badge gradient-bg border-transparent text-white text-xs font-black">예선 진행중</span>
          <span className={`badge border text-xs font-black ${
            isPast ? 'bg-rx-surface border-rx-border text-rx-muted'
            : 'bg-green-500/20 text-green-400 border-green-500/30'
          }`}>
            예선 마감 {dday}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <p className="text-rx-muted text-xs mb-0.5">{comp.nameEn}</p>
            <h3 className="font-black text-white text-xl mb-0.5">{MAKIA_DETAIL.fullName}</h3>
            <p className="gradient-text font-black text-sm mb-3">{MAKIA_DETAIL.slogan}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <span className="text-rx-muted text-xs w-24 flex-shrink-0 pt-0.5">규모</span>
                <span className="text-white text-sm">{comp.scale}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rx-muted text-xs w-24 flex-shrink-0 pt-0.5">장소</span>
                <span className="text-white text-sm font-bold">{MAKIA_DETAIL.location}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rx-muted text-xs w-24 flex-shrink-0 pt-0.5">예선 접수</span>
                <span className="text-white text-sm">{formatDate(MAKIA_DETAIL.registrationStart)} ~ {formatDate(MAKIA_DETAIL.registrationEnd)}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rx-muted text-xs w-24 flex-shrink-0 pt-0.5">WOD 공개</span>
                <span className="text-white text-sm">{formatDate(MAKIA_DETAIL.wodReveal)}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rx-muted text-xs w-24 flex-shrink-0 pt-0.5">예선 기간</span>
                <span className="text-white text-sm">{formatDate(MAKIA_DETAIL.qualifierStart)} ~ {formatDate(MAKIA_DETAIL.qualifierEnd)}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-rx-muted text-xs w-24 flex-shrink-0 pt-0.5">본대회</span>
                <span className="text-rx-orange text-sm font-bold">{MAKIA_DETAIL.mainEvent} (제주도)</span>
              </div>
            </div>
          </div>
        </div>

        <a
          href={comp.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-bg border-transparent text-white hover:opacity-90 text-sm font-bold transition-opacity"
        >
          <IgIcon />
          인스타 보기
        </a>
      </div>
    )
  }

  return (
    <div className="card hover:border-rx-red/40 transition-all flex flex-col">
      <div className="flex-1">
        <p className="text-rx-muted text-xs mb-0.5">{comp.nameEn}</p>
        <h3 className="font-black text-white text-lg mb-3">{comp.name}</h3>
        <div className="space-y-1.5 mb-3">
          <div className="flex items-start gap-2">
            <span className="text-rx-muted text-xs w-10 flex-shrink-0 pt-0.5">규모</span>
            <span className="text-white text-sm leading-snug">{comp.scale}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-rx-muted text-xs w-10 flex-shrink-0 pt-0.5">시기</span>
            <span className="text-rx-orange text-sm font-bold leading-snug">{comp.period}</span>
          </div>
        </div>
        <p className="text-rx-muted text-xs mb-4">공식 일정은 인스타그램에서 확인하세요</p>
      </div>
      <a
        href={comp.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red text-sm font-bold transition-colors self-start"
      >
        <IgIcon />
        인스타 보기
      </a>
    </div>
  )
}

// ─── 사용자 등록 대회 카드 ───────────────────────────────────────────────────────
function RegisteredCompCard({ comp }: { comp: RegisteredComp }) {
  return (
    <div className="card border-rx-orange/40 hover:border-rx-red/40 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <span className="badge bg-rx-orange/20 text-rx-orange border border-rx-orange/30 text-xs">신규</span>
        {comp.city && <span className="text-rx-muted text-xs">{comp.city}</span>}
      </div>
      <h3 className="font-black text-white text-lg mb-2">{comp.name}</h3>
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-rx-muted text-sm w-12 flex-shrink-0">주최</span>
          <span className="text-white text-sm font-medium">{comp.organizer}</span>
        </div>
        {comp.date && (
          <div className="flex items-center gap-2">
            <span className="text-rx-muted text-sm w-12 flex-shrink-0">날짜</span>
            <span className="text-white text-sm">{formatDate(comp.date)}</span>
          </div>
        )}
        {comp.fee && (
          <div className="flex items-center gap-2">
            <span className="text-rx-muted text-sm w-12 flex-shrink-0">참가비</span>
            <span className="text-rx-orange text-sm font-bold">{comp.fee}</span>
          </div>
        )}
      </div>
      {comp.description && (
        <p className="text-rx-muted text-sm leading-relaxed mb-3 line-clamp-2">{comp.description}</p>
      )}
      {comp.registrationUrl && (
        <a
          href={comp.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-bg border-transparent text-white hover:opacity-90 text-xs font-bold transition-opacity"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          신청 링크
        </a>
      )}
    </div>
  )
}

// ─── 게시글 카드 ────────────────────────────────────────────────────────────────
function BoardPostCard({ post, liked, onLike }: { post: BoardPost; liked: boolean; onLike: () => void }) {
  const isNew = post.id.startsWith('post-user-')
  return (
    <div className="card hover:border-rx-red/30 transition-colors cursor-pointer group">
      <div className="flex flex-wrap gap-1 mb-2">
        {isNew && (
          <span className="text-xs px-2 py-0.5 rounded-full gradient-bg border-transparent text-white font-bold">NEW</span>
        )}
        {post.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-rx-surface border border-rx-border text-rx-muted">
            #{tag}
          </span>
        ))}
      </div>

      <h3 className="font-bold text-white group-hover:text-rx-red transition-colors mb-1 leading-snug">
        {post.title}
      </h3>
      <p className="text-rx-muted text-sm leading-relaxed mb-3 line-clamp-2">{post.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-rx-muted text-sm">
          <span className="font-medium">{post.author}</span>
          <span>{post.createdAt}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onLike() }}
            className={`flex items-center gap-1 text-sm font-bold transition-colors ${liked ? 'text-rx-red' : 'text-rx-muted hover:text-rx-red'}`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {post.likes + (liked ? 1 : 0)}
          </button>
          <span className="flex items-center gap-1 text-rx-muted text-sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {post.comments}
          </span>
        </div>
      </div>
    </div>
  )
}
