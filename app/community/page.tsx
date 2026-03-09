'use client'
import { useState } from 'react'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { HYROX_EVENTS, COMPETITION_POSTS, BOARD_POSTS, type BoardPost } from '@/lib/community-data'

type Tab = 'hyrox' | 'crossfit' | 'board'

const TODAY = new Date('2026-03-09')

function getDday(dateStr: string): string {
  const eventDate = new Date(dateStr)
  const diff = Math.ceil((eventDate.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return '종료'
  if (diff === 0) return 'D-Day'
  return `D-${diff}`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

interface CompModalData {
  title: string
  organizer: string
  city: string
  date: string
  fee: string
  levels: string
  description: string
  registrationUrl: string
}

export default function CommunityPage() {
  const [tab, setTab] = useState<Tab>('hyrox')
  const [likes, setLikes] = useState<Record<string, boolean>>({})
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState<CompModalData>({
    title: '',
    organizer: '',
    city: '',
    date: '',
    fee: '',
    levels: '',
    description: '',
    registrationUrl: '',
  })

  const toggleLike = (id: string) => {
    setLikes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const sortedHyrox = [...HYROX_EVENTS].sort((a, b) => {
    const da = new Date(a.date).getTime()
    const db = new Date(b.date).getTime()
    return da - db
  })

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-14 pb-24 md:pb-10 px-4 max-w-5xl mx-auto">
        <h1 className="section-title mt-4">커뮤니티</h1>
        <p className="section-sub">HYROX 대회 · 크로스핏 대회 · 자유게시판</p>

        {/* Tab Selector */}
        <div className="flex gap-1 bg-rx-surface rounded-xl p-1 mb-6">
          {([
            { id: 'hyrox', label: 'HYROX 대회' },
            { id: 'crossfit', label: '크로스핏 대회' },
            { id: 'board', label: '자유게시판' },
          ] as { id: Tab; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                tab === t.id ? 'bg-rx-red text-white' : 'text-rx-muted hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* HYROX Tab */}
        {tab === 'hyrox' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-rx-muted text-sm">{HYROX_EVENTS.length}개 대회</p>
              <span className="badge bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs">
                2026 시즌
              </span>
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
                            isPast
                              ? 'bg-rx-surface border-rx-border text-rx-muted'
                              : isToday
                              ? 'bg-rx-red/20 text-rx-red border-rx-red/30'
                              : 'bg-green-500/20 text-green-400 border-green-500/30'
                          }`}>
                            {dday}
                          </span>
                          <span className="text-rx-muted text-xs">{event.country}</span>
                        </div>
                        <h3 className="font-black text-white text-lg leading-tight">{event.name}</h3>
                        <p className="text-rx-muted text-sm mt-1">{formatDate(event.date)}</p>
                        <p className="text-rx-muted text-xs mt-1">{event.venue}</p>
                        {event.participants && (
                          <p className="text-rx-muted text-xs mt-1">
                            예상 참가: {event.participants.toLocaleString()}명
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-2xl font-black text-rx-muted mb-2">{event.city}</div>
                        {!isPast && event.isOpen && (
                          <a
                            href={event.registrationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition-colors"
                          >
                            등록하기
                          </a>
                        )}
                        {isPast && (
                          <span className="text-rx-muted text-xs">마감</span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CrossFit Competitions Tab */}
        {tab === 'crossfit' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-rx-muted text-sm">{COMPETITION_POSTS.length}개 대회</p>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rx-red text-white text-xs font-bold hover:bg-red-600 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                대회 등록하기
              </button>
            </div>

            <div className="space-y-4">
              {COMPETITION_POSTS.map((comp) => {
                const dday = getDday(comp.date)
                const isPast = dday === '종료'
                return (
                  <div key={comp.id} className={`card ${isPast ? 'opacity-60' : 'hover:border-rx-red/40'} transition-all`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`badge border text-xs ${
                            isPast
                              ? 'bg-rx-surface border-rx-border text-rx-muted'
                              : 'bg-rx-red/20 text-rx-red border-rx-red/30'
                          }`}>
                            {dday}
                          </span>
                          <span className="text-rx-muted text-xs">{comp.city}</span>
                        </div>
                        <h3 className="font-black text-white text-lg leading-tight">{comp.title}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                      <div>
                        <p className="text-rx-muted text-xs mb-0.5">주최</p>
                        <p className="text-white font-medium text-sm">{comp.organizer}</p>
                      </div>
                      <div>
                        <p className="text-rx-muted text-xs mb-0.5">대회 날짜</p>
                        <p className="text-white font-medium text-sm">{formatDate(comp.date)}</p>
                      </div>
                      <div>
                        <p className="text-rx-muted text-xs mb-0.5">참가비</p>
                        <p className="text-rx-orange font-black text-sm">{comp.fee}</p>
                      </div>
                      <div>
                        <p className="text-rx-muted text-xs mb-0.5">등록 마감</p>
                        <p className="text-white font-medium text-sm">{formatDate(comp.registrationDeadline)}</p>
                      </div>
                    </div>

                    {/* Levels */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {comp.levels.map((level) => (
                        <span key={level} className="badge bg-rx-surface border border-rx-border text-rx-muted text-xs">
                          {level}
                        </span>
                      ))}
                    </div>

                    <p className="text-rx-muted text-sm leading-relaxed mb-3">{comp.description}</p>

                    {comp.registrationUrl && !isPast && (
                      <a
                        href={comp.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-rx-red/20 text-rx-red border border-rx-red/30 rounded-lg text-xs font-bold hover:bg-rx-red/30 transition-colors"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        참가 신청
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Board Tab */}
        {tab === 'board' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-rx-muted text-sm">{BOARD_POSTS.length}개 게시글</p>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rx-red text-white text-xs font-bold hover:bg-red-600 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                글쓰기
              </button>
            </div>

            <div className="space-y-3">
              {BOARD_POSTS.map((post) => (
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

      {/* Competition Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg bg-rx-surface border border-rx-border rounded-t-2xl md:rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-white text-xl">대회 등록하기</h2>
              <button onClick={() => setShowModal(false)} className="text-rx-muted hover:text-white p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-rx-muted text-sm block mb-1">대회명 *</label>
                <input type="text" className="input" placeholder="대회 이름을 입력하세요"
                  value={modalData.title} onChange={e => setModalData(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="text-rx-muted text-sm block mb-1">주최 *</label>
                <input type="text" className="input" placeholder="주최 단체 또는 박스명"
                  value={modalData.organizer} onChange={e => setModalData(p => ({ ...p, organizer: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-rx-muted text-sm block mb-1">날짜 *</label>
                  <input type="date" className="input"
                    value={modalData.date} onChange={e => setModalData(p => ({ ...p, date: e.target.value }))} />
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">지역 *</label>
                  <input type="text" className="input" placeholder="서울, 부산..."
                    value={modalData.city} onChange={e => setModalData(p => ({ ...p, city: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="text-rx-muted text-sm block mb-1">참가비</label>
                <input type="text" className="input" placeholder="예: 70,000원"
                  value={modalData.fee} onChange={e => setModalData(p => ({ ...p, fee: e.target.value }))} />
              </div>
              <div>
                <label className="text-rx-muted text-sm block mb-1">레벨 (쉼표로 구분)</label>
                <input type="text" className="input" placeholder="Rx, Scaled, Masters"
                  value={modalData.levels} onChange={e => setModalData(p => ({ ...p, levels: e.target.value }))} />
              </div>
              <div>
                <label className="text-rx-muted text-sm block mb-1">대회 설명</label>
                <textarea className="input resize-none" rows={3} placeholder="대회 설명을 입력하세요"
                  value={modalData.description} onChange={e => setModalData(p => ({ ...p, description: e.target.value }))} />
              </div>
              <div>
                <label className="text-rx-muted text-sm block mb-1">신청 링크</label>
                <input type="url" className="input" placeholder="https://..."
                  value={modalData.registrationUrl} onChange={e => setModalData(p => ({ ...p, registrationUrl: e.target.value }))} />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary text-sm py-3"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    alert('대회 등록 요청이 접수되었습니다. 검토 후 게시됩니다.')
                    setShowModal(false)
                  }}
                  className="flex-1 btn-primary text-sm py-3"
                >
                  등록 요청
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

function BoardPostCard({ post, liked, onLike }: { post: BoardPost; liked: boolean; onLike: () => void }) {
  return (
    <div className="card hover:border-rx-red/30 transition-colors cursor-pointer group">
      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {post.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-rx-surface border border-rx-border text-rx-muted">
            #{tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h3 className="font-bold text-white group-hover:text-rx-red transition-colors mb-1 leading-snug">
        {post.title}
      </h3>

      {/* Content Preview */}
      <p className="text-rx-muted text-xs leading-relaxed mb-3 line-clamp-2">
        {post.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-rx-muted text-xs">
          <span className="font-medium">{post.author}</span>
          <span>{post.createdAt}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onLike() }}
            className={`flex items-center gap-1 text-xs font-bold transition-colors ${
              liked ? 'text-rx-red' : 'text-rx-muted hover:text-rx-red'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {post.likes + (liked ? 1 : 0)}
          </button>
          <span className="flex items-center gap-1 text-rx-muted text-xs">
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
