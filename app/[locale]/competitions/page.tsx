'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from '@/navigation'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { HYROX_EVENTS, BOARD_POSTS, SCHEDULE_VERIFIED_AT, type BoardPost } from '@/lib/community-data'
import { ddayLabel, isEnded, isOngoing, scheduleReferenceDate } from '@/lib/event-dates'
import { localizeEvent, localizePost } from '@/lib/community-data-en'
import { CROSSFIT_GLOBAL_EVENTS, CROSSFIT_OFFICIAL_CALENDAR_URL } from '@/lib/crossfit-global'
import type { HyroxRegion } from '@/lib/community-data'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { BoardPostRow } from '@/lib/supabase-types'
import { useTranslations, useLocale } from 'next-intl'

function boardRowToPost(row: BoardPostRow): BoardPost {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    createdAt: row.created_at.slice(0, 10),
    likes: 0,
    comments: 0,
    tags: row.tags,
  }
}

type Tab = 'hyrox' | 'major' | 'global' | 'board'
type RegionFilter = 'all' | HyroxRegion
const REGION_ORDER: RegionFilter[] = ['all', 'korea', 'asia', 'oceania', 'europe', 'americas', 'mea']
const REGION_KEY: Record<RegionFilter, string> = {
  all: 'regionAll', korea: 'regionKorea', asia: 'regionAsia', oceania: 'regionOceania',
  europe: 'regionEurope', americas: 'regionAmericas', mea: 'regionMea',
}

// ─── 국내 대형 대회 타입 ───────────────────────────────────────────────────────
interface MajorComp {
  id: string
  name: string        // 한국명
  nameEn: string      // 영문명
  badge?: string
  badgeEn?: string
  scale: string
  scaleEn: string
  period: string      // "매년 4~6월 (예정)" 형식
  periodEn: string
  description?: string
  descriptionEn?: string
  instagramUrl: string
  websiteUrl?: string
  isHardcoded: true
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
    id: 'zonex', name: '존엑스 (ZoneX)', nameEn: 'ZoneX',
    badge: '26/27 겨울 시즌', badgeEn: '26/27 Winter Season',
    scale: '1:1 매치메이킹 피트니스 리그 · 컴바인(선발전) 및 넘버링 본선',
    scaleEn: '1:1 matchmaking fitness league · Combine qualifiers & numbering main event',
    period: '2026년 12월 ~ 2027년 2월 (SEASON 02)',
    periodEn: 'Dec 2026 – Feb 2027 (SEASON 02)',
    description: '크리에이터후드가 기획한 국내 1:1 컴뱃형 크로스핏 리그입니다. 전용 앱(zone-x.app)의 Daily WOD 기록 인증과 Weekly 챌린지, 선발전(Combine)을 거쳐 두 선수가 무대에서 정면 승부를 펼치는 관람형 스포츠 리그로 운영됩니다.',
    descriptionEn: 'Korea’s 1:1 combat-style CrossFit league produced by Creatorhood. Athletes advance from Daily WOD logs and Weekly challenges on zone-x.app through Combine qualifiers to head-to-head matchups on stage.',
    instagramUrl: 'https://www.instagram.com/zonex_games',
    websiteUrl: 'https://home.zone-x.app',
    isHardcoded: true,
  },
  {
    id: 'cfkoreaopen', name: '크로스핏 코리아 오픈', nameEn: 'CrossFit Korea Open',
    badge: '공식 오픈 시즌', badgeEn: 'Official Open Season',
    scale: 'CrossFit LLC / Korea 공식 주관 오픈 챌린지', scaleEn: 'Official open challenge hosted by CrossFit LLC / Korea',
    period: '2027년 2월~3월 (1월 7일 등록 시작)', periodEn: 'Feb–Mar 2027 (Registration opens Jan 7)',
    description: '전 세계 크로스피터가 참여하는 공식 시즌의 시작점입니다. 2027 시즌부터는 2인 1조로 함께 참여하는 Open Pairs 부문이 신설됩니다.',
    descriptionEn: 'The global kickoff to the official CrossFit season. New for 2027: an Open Pairs division lets 2-person teams compete together.',
    instagramUrl: 'https://www.instagram.com/crossfitkorea', isHardcoded: true,
  },
  {
    id: 'teamoffour', name: '팀오브포', nameEn: 'Team of Four',
    scale: '4인 팀 대회 (남2 여2 / 동일성별 팀)', scaleEn: '4-person team event (2 men, 2 women / same-gender teams)',
    period: '2027년 4월~6월 (예정)', periodEn: 'Apr–Jun 2027 (expected)',
    description: '네 명이 한 팀을 이루어 전략과 호흡을 겨루는 국내 대표 팀 단위 스로우다운 대회입니다.',
    descriptionEn: 'A flagship Korean 4-person team throwdown testing strategy, synchronization, and teamwork.',
    instagramUrl: 'https://www.instagram.com/teamof_four', isHardcoded: true,
  },
  {
    id: 'nwnd', name: '엔스윈드', nameEn: 'NWND',
    scale: '개인/팀 피트니스 챔피언십', scaleEn: 'Individual/team fitness championship',
    period: '2027년 4월~6월 (예정)', periodEn: 'Apr–Jun 2027 (expected)',
    description: '체계적인 디비전 구성으로 초보자부터 엘리트 선수까지 함께 경쟁할 수 있는 국내 피트니스 챔피언십입니다.',
    descriptionEn: 'A Korean fitness championship offering structured divisions for beginners through elite athletes.',
    instagramUrl: 'https://www.instagram.com/nwnd_kr', isHardcoded: true,
  },
  {
    id: 'girlfit', name: '걸핏코리아', nameEn: 'GirlFit Korea',
    scale: '여성 전용 피트니스 & 크로스핏 대회', scaleEn: "Women-only fitness & CrossFit competition",
    period: '2027년 4월~6월 (예정)', periodEn: 'Apr–Jun 2027 (expected)',
    description: '여성 크로스피터와 피트니스 애슬리트들을 위한 국내 대표 여성 전용 대회입니다.',
    descriptionEn: 'Korea’s premier women-only fitness and CrossFit competition.',
    instagramUrl: 'https://www.instagram.com/girlfit_korea', isHardcoded: true,
  },
  {
    id: 'kboxrise', name: '케이박스라이즈', nameEn: 'K-Box Rise',
    scale: '박스 단위 팀 대회 · 국내 최대 규모 대표 대회', scaleEn: 'Box-vs-box team event · one of the largest in Korea',
    period: '2027년 5월~7월 (예정)', periodEn: 'May–Jul 2027 (expected)',
    description: '각 크로스핏 박스의 명예를 걸고 박스 대표 팀들이 맞붙는 국내 최대 규모의 박스 대항전입니다.',
    descriptionEn: 'One of Korea’s largest box-vs-box team competitions where affiliates field teams to represent their gym.',
    instagramUrl: 'https://www.instagram.com/k_box_rise', isHardcoded: true,
  },
  {
    id: 'makia', name: '마키아', nameEn: 'Makia',
    scale: '개인/팀 대회 · 제주 축제형 종합 대회', scaleEn: 'Individual/team event · festival-style competition in Jeju',
    period: '예선 2027년 5월 · 본대회 2027년 여름 (예정)', periodEn: 'Qualifiers May 2027 · Finals summer 2027 (expected)',
    description: '제주도에서 열리는 축제형 종합 피트니스 대회로, 온라인 예선을 거쳐 여름 본선 무대가 펼쳐집니다.',
    descriptionEn: 'A festival-style comprehensive fitness competition held in Jeju following spring online qualifiers.',
    instagramUrl: 'https://www.instagram.com/makia_official_', isHardcoded: true,
  },
  {
    id: 'enuf', name: '이너프', nameEn: 'ENUF',
    scale: '개인/팀 아웃도어 피트니스 챌린지', scaleEn: 'Individual/team outdoor fitness challenge',
    period: '2027년 5월~7월 (예정)', periodEn: 'May–Jul 2027 (expected)',
    description: '야외 환경에서 다채로운 펑셔널 피트니스 종목을 소화하는 아웃도어 챌린지 대회입니다.',
    descriptionEn: 'An outdoor functional fitness challenge featuring diverse workouts in an open-air setting.',
    instagramUrl: 'https://www.instagram.com/enuf.sports', isHardcoded: true,
  },
  {
    id: 'battlecrew', name: '배틀크루', nameEn: 'Battle Crew',
    scale: '크루(4~6명) 단위 · 전국 지역 예선→파이널 챔피언십', scaleEn: 'Crew-based (4–6 people) · regional qualifiers → national finals',
    period: '2027년 5월~9월 (예정)', periodEn: 'May–Sep 2027 (expected)',
    description: '4~6인 크루가 지역 예선을 통과해 전국 파이널 챔피언십까지 진출하는 크루 배틀 리그입니다.',
    descriptionEn: 'A crew battle league where 4–6 person teams compete in regional qualifiers to reach the national finals.',
    instagramUrl: 'https://www.instagram.com/battlecrew_korea', isHardcoded: true,
  },
  {
    id: 'kffa', name: '대한기능성피트니스협회 대회', nameEn: 'KFFA Championship',
    scale: '국가대표 선발전 및 전국 챔피언십', scaleEn: 'National team trials and national championship',
    period: '2027년 6월~8월 (예정)', periodEn: 'Jun–Aug 2027 (expected)',
    description: '국제기능성피트니스연맹(iF3) 규정에 따른 국내 공식 기능성 피트니스 챔피언십 및 국가대표 선발전입니다.',
    descriptionEn: 'Official national functional fitness championship and national team trials following iF3 standards.',
    instagramUrl: 'https://www.instagram.com/kffa_official', isHardcoded: true,
  },
  {
    id: 'suff', name: '서프', nameEn: 'SUFF',
    scale: '서머 피트니스 페스티벌 · 대표 해변/여름 대회', scaleEn: 'Summer fitness festival · flagship beach/summer event',
    period: '2027년 7월~8월 (예정)', periodEn: 'Jul–Aug 2027 (expected)',
    description: '한여름 해변과 페스티벌 분위기를 결합한 국내 대표 서머 피트니스 이벤트입니다.',
    descriptionEn: 'Korea’s flagship summer fitness festival combining functional workouts with beach vibes.',
    instagramUrl: 'https://www.instagram.com/suff_estival', isHardcoded: true,
  },
]

// ─── HYROX 날짜 유틸 ──────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function formatRange(start: string, end?: string): string {
  if (!end || end === start) return formatDate(start)
  const s = new Date(start)
  const e = new Date(end)
  const tail = s.getFullYear() === e.getFullYear()
    ? `${String(e.getMonth() + 1).padStart(2, '0')}.${String(e.getDate()).padStart(2, '0')}`
    : formatDate(end)
  return `${formatDate(start)} – ${tail}`
}

function nowStr(): string {
  return formatDate(new Date().toISOString().slice(0, 10))
}

// ─── 빈 폼 초기값 ─────────────────────────────────────────────────────────────
const emptyComp = {
  name: '', organizer: '', city: '', date: '',
  fee: '', description: '', registrationUrl: '',
  contactName: '', contactEmail: '',
}

const emptyPost = {
  title: '', content: '', tags: '',
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function CompetitionsPage() {
  const t = useTranslations('community')
  const locale = useLocale()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [user, setUser] = useState<User | null>(null)
  const isLoggedIn = !!user

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const [tab, setTab] = useState<Tab>('major')
  const [region, setRegion] = useState<RegionFilter>('all')
  // 페이지는 빌드 시 미리 만들어진다. 첫 렌더는 빌드 시각(서버·브라우저 동일), 마운트 후 실제 오늘로 바꾼다.
  const [now, setNow] = useState<Date>(() =>
    process.env.NEXT_PUBLIC_BUILD_TIME ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME) : scheduleReferenceDate(SCHEDULE_VERIFIED_AT),
  )
  useEffect(() => {
    setNow(new Date())
  }, [])

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

  // 자유게시판: Supabase에서 실제 작성된 글을 불러와 시드 데이터 뒤에 병합
  const [boardPosts, setBoardPosts] = useState<BoardPost[]>(BOARD_POSTS)

  useEffect(() => {
    supabase
      .from('board_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setBoardPosts([...(data as BoardPostRow[]).map(boardRowToPost), ...BOARD_POSTS])
      })
  }, [supabase])

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

  const regionCounts = HYROX_EVENTS.reduce<Record<string, number>>((acc, e) => {
    acc[e.region] = (acc[e.region] ?? 0) + 1
    acc.all = (acc.all ?? 0) + 1
    return acc
  }, {})
  const byTime = (a: { date: string }, b: { date: string }) => new Date(a.date).getTime() - new Date(b.date).getTime()
  const hyroxFiltered = HYROX_EVENTS
    .filter((e) => region === 'all' || e.region === region)
    .map((e) => localizeEvent(e, locale))
  // 예정된 대회는 가까운 순, 지난 대회는 맨 아래에 최근 순
  const sortedHyrox = [
    ...hyroxFiltered.filter((e) => !isEnded(e.date, e.endDate, now)).sort(byTime),
    ...hyroxFiltered.filter((e) => isEnded(e.date, e.endDate, now)).sort((a, b) => byTime(b, a)),
  ]

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

  // ── 글쓰기 버튼: 비로그인이면 바로 로그인 화면으로 ──────────────────────────────
  const openWriteModal = () => {
    if (!user) { router.push('/login?callbackUrl=/competitions%23board'); return }
    setShowWriteModal(true)
  }

  // ── 게시글 작성 제출 (Supabase에 저장, 모두에게 공유됨) ─────────────────────────
  const handlePostSubmit = async () => {
    setWriteError('')
    if (!user) { router.push('/login?callbackUrl=/competitions%23board'); return }
    if (!writeForm.title.trim()) { setWriteError(t('errTitle')); return }
    if (!writeForm.content.trim()) { setWriteError(t('errContent')); return }

    const tags = writeForm.tags
      .split(/[,#\s]+/)
      .map(t => t.trim())
      .filter(Boolean)
      .slice(0, 5)

    const author =
      (user.user_metadata?.full_name as string | undefined) ??
      (user.user_metadata?.name as string | undefined) ??
      user.email?.split('@')[0] ??
      'Athlete'

    const { data, error } = await supabase
      .from('board_posts')
      .insert({ user_id: user.id, author, title: writeForm.title.trim(), content: writeForm.content.trim(), tags })
      .select()
      .single()

    if (error || !data) { setWriteError(t('errContent')); return }

    setBoardPosts(prev => [boardRowToPost(data as BoardPostRow), ...prev])
    setShowWriteModal(false)
    setWriteForm(emptyPost)
    setWriteError('')
  }

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-[992px] mx-auto">
        <h1 className="section-title mt-4">{t('title')}</h1>
        <p className="section-sub">{t('subtitle')}</p>
        <p className="text-rx-muted text-xs mb-4">{t('scheduleVerified', { date: SCHEDULE_VERIFIED_AT.replace(/-/g, '.') })}</p>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-rx-surface rounded-xl p-1 mb-6">
          {([
            { id: 'major', label: t('tabMajor') },
            { id: 'hyrox', label: t('tabHyrox') },
            { id: 'global', label: t('tabGlobal') },
            { id: 'board', label: t('tabBoard') },
          ] as { id: Tab; label: string }[]).map((tab_item) => (
            <button
              key={tab_item.id}
              onClick={() => setTab(tab_item.id)}
              className={`flex-1 min-w-0 px-1 py-2.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${tab === tab_item.id ? 'gradient-bg text-white' : 'text-rx-muted hover:text-white'
                }`}
            >
              {tab_item.label}
            </button>
          ))}
        </div>

        {/* ── HYROX 탭 ───────────────────────────────────────────────────────── */}
        {tab === 'hyrox' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-rx-muted text-sm">{t('hyroxCount', { count: sortedHyrox.length })}</p>
              <span className="badge bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs">{t('hyroxSeason')}</span>
            </div>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {REGION_ORDER.map((r) => (
                <button
                  key={r}
                  onClick={() => setRegion(r)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    region === r ? 'gradient-bg text-white' : 'bg-rx-surface border border-rx-border text-rx-muted hover:text-white'
                  }`}
                >
                  {t(REGION_KEY[r])} <span className="opacity-70">{regionCounts[r] ?? 0}</span>
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {sortedHyrox.map((event) => {
                const ended = isEnded(event.date, event.endDate, now)
                const dday = ended ? '종료' : ddayLabel(event.date, now)
                const isPast = ended
                const isToday = isOngoing(event.date, event.endDate, now)
                const ddayDisplay = isPast ? t('hyroxEnded') : isToday ? t('hyroxDDay') : dday
                return (
                  <div key={event.id} className={`card ${isPast ? 'opacity-60' : 'hover:border-rx-red/40'} transition-all`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`badge border text-xs ${isPast ? 'bg-rx-surface border-rx-border text-rx-muted'
                              : isToday ? 'gradient-bg border-white/20 text-white'
                                : 'bg-green-500/20 text-green-400 border-green-500/30'
                            }`}>{ddayDisplay}</span>
                          <span className="text-rx-muted text-xs">{event.country}</span>
                        </div>
                        <h3 className="font-black text-white text-lg leading-tight">{event.name}</h3>
                        <p className="text-rx-muted text-sm mt-1">{formatRange(event.date, event.endDate)}</p>
                        {event.venue && <p className="text-rx-muted text-xs mt-1">{event.venue}</p>}
                        {event.participants && (
                          <p className="text-rx-muted text-xs mt-1">{t('hyroxExpectedParticipants', { count: event.participants.toLocaleString() })}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-2xl font-black text-rx-muted mb-2">{event.city}</div>
                        {!isPast && event.isOpen && (
                          <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-block bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition-colors">
                            {t('hyroxRegister')}
                          </a>
                        )}
                        {isPast && <span className="text-rx-muted text-xs">{t('hyroxClosed')}</span>}
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
              <p className="text-rx-muted text-sm">{t('majorCount', { count: allComps.length })}</p>
              <button
                onClick={() => setShowCompModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg gradient-bg text-white text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {t('majorRegisterBtn')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allComps.map((comp) => (
                comp.isHardcoded
                  ? <HardcodedCompCard key={comp.id} comp={comp as MajorComp} t={t} locale={locale} />
                  : <RegisteredCompCard key={comp.id} comp={comp as RegisteredComp} t={t} />
              ))}
            </div>
          </div>
        )}

        {/* ── 자유게시판 탭 ─────────────────────────────────────────────────── */}
        {/* ── 해외 크로스핏 탭 ─────────────────────────────────────────────── */}
        {tab === 'global' && (
          <div>
            <p className="text-rx-muted text-sm mb-4">{t('globalNote')}</p>
            {(['official', 'invitational'] as const).map((cat) => (
              <div key={cat} className="mb-6">
                <h2 className="font-black text-white text-base mb-3">{t(cat === 'official' ? 'globalOfficial' : 'globalInvitational')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CROSSFIT_GLOBAL_EVENTS.filter((e) => e.category === cat).map((e) => {
                    const ended = isEnded(e.date, e.endDate, now)
                    return (
                      <div key={e.id} className={`card flex flex-col ${ended ? 'opacity-60' : 'hover:border-rx-red/40'} transition-all`}>
                        <div className="flex-1">
                          <h3 className="font-black text-white text-lg mb-2">{locale === 'en' ? e.nameEn : e.name}</h3>
                          <p className="text-rx-muted text-sm">{formatRange(e.date, e.endDate)}</p>
                          <p className="text-rx-muted text-xs mt-1">{locale === 'en' ? e.placeEn : e.place}</p>
                          <p className="text-rx-muted text-sm mt-3 leading-relaxed">{locale === 'en' ? e.descEn : e.descKo}</p>
                        </div>
                        <a href={e.url} target="_blank" rel="noopener noreferrer"
                          className="mt-4 inline-block self-start bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-500/30 transition-colors">
                          {t('globalOfficialLink')}
                        </a>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
            <div className="card">
              <p className="text-white font-bold mb-1">{t('globalMoreTitle')}</p>
              <p className="text-rx-muted text-sm mb-3">{t('globalMoreDesc')}</p>
              <a href={CROSSFIT_OFFICIAL_CALENDAR_URL} target="_blank" rel="noopener noreferrer"
                className="inline-block text-blue-400 text-sm font-bold hover:underline">{t('globalOfficialCalendar')} →</a>
            </div>
          </div>
        )}

        {tab === 'board' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-rx-muted text-sm">{t('boardCount', { count: boardPosts.length })}</p>
              <button
                onClick={openWriteModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg gradient-bg text-white text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {t('boardWriteBtn')}
              </button>
            </div>
            <div className="space-y-3">
              {boardPosts.map((post) => (
                <BoardPostCard
                  key={post.id}
                  post={localizePost(post, locale)}
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
              <h2 className="font-black text-white text-xl">{t('modalCompTitle')}</h2>
              <button onClick={closeCompModal} className="text-rx-muted hover:text-white p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {compSubmitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-black text-white text-xl mb-2">{t('successTitle')}</h3>
                <p className="text-rx-muted text-sm mb-2">{t('successCompDesc')}</p>
                <p className="text-rx-muted text-sm mb-6">{t('successCompNote')}</p>
                <button onClick={closeCompModal} className="btn-primary px-8">{t('confirmBtn')}</button>
              </div>
            ) : (
              <div className="space-y-4">
                {!isLoggedIn && (
                  <>
                    <div>
                      <label className="text-rx-muted text-sm block mb-1">{t('fApplicant')}</label>
                      <input type="text" className="input" placeholder={t('contactNamePh')}
                        value={compForm.contactName}
                        onChange={e => setCompForm(p => ({ ...p, contactName: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-rx-muted text-sm block mb-1">{t('fEmail')}</label>
                      <input type="email" className="input" placeholder="example@email.com"
                        value={compForm.contactEmail}
                        onChange={e => setCompForm(p => ({ ...p, contactEmail: e.target.value }))} />
                    </div>
                    <hr className="border-rx-border" />
                  </>
                )}
                <div>
                  <label className="text-rx-muted text-sm block mb-1">{t('fCompName')}</label>
                  <input type="text" className="input" placeholder={t('fCompNamePh')}
                    value={compForm.name}
                    onChange={e => setCompForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">{t('fOrganizer')}</label>
                  <input type="text" className="input" placeholder={t('fOrganizerPh')}
                    value={compForm.organizer}
                    onChange={e => setCompForm(p => ({ ...p, organizer: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">{t('fDate')}</label>
                    <input type="date" className="input"
                      value={compForm.date}
                      onChange={e => setCompForm(p => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">{t('fCity')}</label>
                    <input type="text" className="input" placeholder={t('fCityPh')}
                      value={compForm.city}
                      onChange={e => setCompForm(p => ({ ...p, city: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">{t('fFee')}</label>
                  <input type="text" className="input" placeholder={t('fFeePh')}
                    value={compForm.fee}
                    onChange={e => setCompForm(p => ({ ...p, fee: e.target.value }))} />
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">{t('fDesc')}</label>
                  <textarea className="input resize-none" rows={3} placeholder={t('fDescPh')}
                    value={compForm.description}
                    onChange={e => setCompForm(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">{t('fRegLink')}</label>
                  <input type="url" className="input" placeholder="https://..."
                    value={compForm.registrationUrl}
                    onChange={e => setCompForm(p => ({ ...p, registrationUrl: e.target.value }))} />
                </div>

                {/* validation hint */}
                {(!compForm.name.trim() || !compForm.organizer.trim() || !compForm.date) && (
                  <p className="text-rx-muted text-xs">{t('requiredNote')}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={closeCompModal} className="flex-1 btn-secondary text-sm py-3">{t('fCancel')}</button>
                  <button
                    onClick={handleCompSubmit}
                    disabled={!compForm.name.trim() || !compForm.organizer.trim() || !compForm.date || (!isLoggedIn && (!compForm.contactName.trim() || !compForm.contactEmail.trim()))}
                    className="flex-1 btn-primary text-sm py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('fSubmit')}
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
              <h2 className="font-black text-white text-xl">{t('modalBoardTitle')}</h2>
              <button onClick={() => { setShowWriteModal(false); setWriteForm(emptyPost); setWriteError('') }} className="text-rx-muted hover:text-white p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-rx-muted text-sm block mb-1">{t('bTitle')}</label>
                <input type="text" className="input" placeholder={t('bTitlePh')}
                  value={writeForm.title}
                  onChange={e => setWriteForm(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="text-rx-muted text-sm block mb-1">{t('bContent')}</label>
                <textarea
                  className="input resize-none"
                  rows={6}
                  placeholder={t('bContentPh')}
                  value={writeForm.content}
                  onChange={e => setWriteForm(p => ({ ...p, content: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-rx-muted text-sm block mb-1">{t('bTags')}</label>
                <input type="text" className="input" placeholder={t('bTagsPh')}
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
                  {t('fCancel')}
                </button>
                <button onClick={handlePostSubmit} className="flex-1 btn-primary text-sm py-3">
                  {t('bPost')}
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

// ─── 하드코딩 대회 카드 ─────────────────────────────────────────────────────────
function HardcodedCompCard({ comp, t, locale }: { comp: MajorComp; t: (key: string, values?: Record<string, string | number | Date>) => string; locale: string }) {
  const isEn = locale === 'en'
  const badgeText = isEn ? comp.badgeEn : comp.badge
  const descText = isEn ? comp.descriptionEn : comp.description
  return (
    <div className="card hover:border-rx-red/40 transition-all flex flex-col">
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          {!isEn ? <p className="text-rx-muted text-xs">{comp.nameEn}</p> : <span />}
          {badgeText && (
            <span className="badge bg-rx-red/15 text-rx-red border border-rx-red/30 text-[11px] font-bold">
              {badgeText}
            </span>
          )}
        </div>
        <h3 className="font-black text-white text-lg mb-3">{isEn ? comp.nameEn : comp.name}</h3>
        <div className="space-y-1.5 mb-3">
          <div className="flex items-start gap-2">
            <span className="text-rx-muted text-xs w-14 flex-shrink-0 pt-0.5">{t('majorScale')}</span>
            <span className="text-white text-sm leading-snug">{isEn ? comp.scaleEn : comp.scale}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-rx-muted text-xs w-14 flex-shrink-0 pt-0.5">{t('majorPeriod')}</span>
            <span className="text-rx-orange text-sm font-bold leading-snug">{isEn ? comp.periodEn : comp.period}</span>
          </div>
        </div>
        {descText && (
          <p className="text-rx-muted text-xs leading-relaxed mb-3">{descText}</p>
        )}
        <p className="text-rx-muted/70 text-[11px] mb-4">{t('majorNote')}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={comp.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red text-sm font-bold transition-colors"
        >
          <IgIcon />
          {t('majorInsta')}
        </a>
        {comp.websiteUrl && (
          <a
            href={comp.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 hover:bg-blue-500/25 text-sm font-bold transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            {t('globalOfficialLink')}
          </a>
        )}
      </div>
    </div>
  )
}

// ─── 사용자 등록 대회 카드 ───────────────────────────────────────────────────────
function RegisteredCompCard({ comp, t }: { comp: RegisteredComp; t: (key: string, values?: Record<string, string | number | Date>) => string }) {
  return (
    <div className="card border-rx-orange/40 hover:border-rx-red/40 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <span className="badge bg-rx-orange/20 text-rx-orange border border-rx-orange/30 text-xs">{t('majorNew')}</span>
        {comp.city && <span className="text-rx-muted text-xs">{comp.city}</span>}
      </div>
      <h3 className="font-black text-white text-lg mb-2">{comp.name}</h3>
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-rx-muted text-sm w-12 flex-shrink-0">{t('majorOrganizer')}</span>
          <span className="text-white text-sm font-medium">{comp.organizer}</span>
        </div>
        {comp.date && (
          <div className="flex items-center gap-2">
            <span className="text-rx-muted text-sm w-12 flex-shrink-0">{t('majorDate')}</span>
            <span className="text-white text-sm">{formatDate(comp.date)}</span>
          </div>
        )}
        {comp.fee && (
          <div className="flex items-center gap-2">
            <span className="text-rx-muted text-sm w-12 flex-shrink-0">{t('majorFee')}</span>
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
          {t('applyLink')}
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
