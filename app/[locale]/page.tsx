'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'

/* ─── Scroll Reveal Hook ─── */
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add('reveal')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add('visible'), delay)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return ref
}

/* ─── Count-Up ─── */
function CountUp({ end, suffix = '', duration = 1800 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.unobserve(el) } },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  useEffect(() => {
    if (!started) return
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, end, duration])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── Data ─── */
const allTools = [
  {
    href: '/calculator',
    label: '1RM CALCULATOR',
    desc: '최대 중량 계산 + 훈련 퍼센트 테이블',
    detail: '크로스핏·파워리프팅 1RM(최대 중량)과 훈련 퍼센테이지 테이블을 자동 계산합니다.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#g1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="g1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#E8321A" />
            <stop offset="100%" stopColor="#FF2D8B" />
          </linearGradient>
        </defs>
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="12" y2="14" />
        <line x1="8" y1="18" x2="12" y2="18" />
      </svg>
    ),
  },
  {
    href: '/timer',
    label: 'WOD TIMER',
    desc: 'AMRAP · EMOM · Tabata · For Time · HIIT',
    detail: '5가지 모드, 소리 알림 + 화면 켜짐 유지.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#g2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="g2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#E8321A" />
            <stop offset="100%" stopColor="#FF2D8B" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: '/wod',
    label: 'WOD LIBRARY',
    desc: '37개+ 벤치마크 WOD 컬렉션',
    detail: 'Girl · Hero · Open WOD. 스케일링 옵션 포함.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#g3)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="g3" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#E8321A" />
            <stop offset="100%" stopColor="#FF2D8B" />
          </linearGradient>
        </defs>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: '/map',
    label: 'DROP-IN MAP',
    desc: '전국 크로스핏 박스 드랍인 요금·정보',
    detail: '전국 크로스핏 박스 드랍인 요금·정보를 한눈에 확인하세요.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#g4)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="g4" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#E8321A" />
            <stop offset="100%" stopColor="#FF2D8B" />
          </linearGradient>
        </defs>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    href: '/community',
    label: 'COMMUNITY',
    desc: 'HYROX 대회 일정 · 국내 크로스핏 대회 · 자유게시판',
    detail: 'HYROX 대회 일정 · 국내 크로스핏 대회 · 자유게시판',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#g5)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="g5" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24">
            <stop offset="0%" stopColor="#E8321A" />
            <stop offset="100%" stopColor="#FF2D8B" />
          </linearGradient>
        </defs>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

const stats = [
  { end: 37, suffix: '+', label: 'WODs', sub: 'Girl · Hero · Open' },
  { end: 20, suffix: '+', label: '전국 박스', sub: '드랍인 정보' },
  { end: 5, suffix: '가지', label: '타이머 모드', sub: 'AMRAP · EMOM · Tabata' },
  { end: 100, suffix: '%', label: '무료', sub: '광고 없는 도구' },
]

const crossfitPoints = [
  { icon: '⚡', title: '기능적 동작', desc: '일상의 움직임을 기반으로 한 실용적 운동' },
  { icon: '🔥', title: '고강도 인터벌', desc: '짧고 강렬한 WOD로 최대 효율의 훈련' },
  { icon: '🔄', title: '끝없는 가변성', desc: '매일 다른 WOD로 지루함 없는 훈련' },
]

const termCards = [
  { label: 'WOD', en: 'Workout of the Day', ko: '오늘의 운동' },
  { label: 'AMRAP', en: 'As Many Rounds As Possible', ko: '최대 라운드 수행' },
  { label: 'EMOM', en: 'Every Minute on the Minute', ko: '매 분 시작' },
  { label: 'RX', en: 'As Prescribed', ko: '정규 무게/기준' },
]

/* ─── Shared Tool Card ─── */
function ToolCard({ tool }: { tool: typeof allTools[number] }) {
  return (
    <Link
      href={tool.href}
      className="tool-card group p-6 md:p-8 flex flex-row md:flex-col gap-4 md:gap-5 items-center md:items-start"
    >
      {/* Icon — always gradient stroke, no hover color change */}
      <div className="flex-shrink-0">
        {tool.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="font-heading font-black text-xl md:text-2xl text-white uppercase tracking-tight mb-0.5 md:mb-1 group-hover:gradient-text transition-all leading-tight">
          {tool.label}
        </div>
        <p className="text-rx-muted text-xs md:text-sm leading-relaxed hidden md:block">{tool.detail}</p>
        <p className="text-rx-muted text-xs leading-relaxed md:hidden">{tool.desc}</p>
      </div>

      {/* 바로가기 → — mobile */}
      <span className="flex-shrink-0 text-xs font-bold gradient-text md:hidden whitespace-nowrap">
        바로가기 →
      </span>
      {/* 바로가기 → — desktop */}
      <span className="hidden md:block mt-auto text-sm font-bold gradient-text pt-2">
        바로가기 →
      </span>
    </Link>
  )
}

export default function HomePage() {
  const r3 = useReveal(100)
  const r4 = useReveal(0)
  const r5 = useReveal(0)

  return (
    <div className="min-h-screen bg-rx-bg overflow-x-hidden">
      <Header />

      {/* ═══ SECTION 1: HERO ═══ */}
      <section className="relative pt-24 pb-6 px-4 overflow-hidden">
        <div className="absolute inset-0 hero-grid-bg opacity-60" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,50,26,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: 'linear-gradient(to bottom, transparent, #0D0D0D)' }} />

        <div className="relative text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-semibold mb-5 tracking-widest uppercase animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full gradient-bg animate-pulse" />
            CrossFit &amp; HYROX Platform
          </div>
          <h1
            className="font-heading font-black uppercase tracking-tighter mb-4 leading-none animate-fade-in-up"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', animationDelay: '0.1s', letterSpacing: '0.02em' }}
          >
            <span className="block text-white">FITTERS</span>
            <span className="block gradient-text">STUDIO</span>
          </h1>
          <p className="text-rx-muted text-sm md:text-base animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            크로스핏 &amp; HYROX 훈련에 필요한 모든 도구 — 1RM 계산기, WOD 타이머, 운동 라이브러리를 무료로 제공합니다.
          </p>
        </div>
      </section>

      {/* ═══ SECTION 2: CORE 3 TOOLS ═══ */}
      <section aria-label="핵심 훈련 도구" className="relative px-4 pt-2 pb-10">
        {/* 배경 오브 — 섹션 내부에 완전히 배치, overflow 없이 자연스럽게 페이드 */}
        <div
          className="absolute top-1/2 left-[8%] -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: 'rgba(232,50,26,0.20)', filter: 'blur(130px)' }}
        />
        <div
          className="absolute top-1/4 right-[8%] w-[340px] h-[340px] rounded-full pointer-events-none"
          style={{ background: 'rgba(255,45,139,0.16)', filter: 'blur(120px)' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="sr-only">크로스핏 핵심 훈련 도구 — 1RM 계산기, WOD 타이머, WOD 라이브러리</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {allTools.slice(0, 3).map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 2→3 배경 연결 (검정) */}
      <div className="h-10 bg-rx-bg" />

      {/* ═══ SECTION 3: AUX 2 TOOLS ═══ */}
      <section aria-label="추가 기능" className="bg-rx-surface px-4 pt-14 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/fittersstudio_img01.png')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div ref={r3} className="text-center mb-8">
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white tracking-tight">More Features</h2>
            <p className="text-rx-muted text-sm mt-2">전국 크로스핏 박스 드랍인 지도 &amp; HYROX 대회 커뮤니티</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allTools.slice(3).map((tool) => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Diagonal divider */}
      <div style={{ height: '60px', clipPath: 'polygon(0 0, 100% 60%, 100% 100%, 0 100%)', background: '#0D0D0D', marginTop: '-1px' }} />

      {/* ═══ SECTION 4: STATS ═══ */}
      <section aria-label="FITTERS STUDIO 서비스 현황" className="relative px-4 py-16">
        {/* 배경 오브 — 섹션 내부에 완전히 배치 */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[280px] rounded-full pointer-events-none"
          style={{ background: 'rgba(255,45,139,0.14)', filter: 'blur(140px)' }}
        />
        <div
          className="absolute top-[15%] left-[5%] w-[260px] h-[260px] rounded-full pointer-events-none"
          style={{ background: 'rgba(232,50,26,0.15)', filter: 'blur(110px)' }}
        />
        <div
          className="absolute bottom-[15%] right-[5%] w-[240px] h-[240px] rounded-full pointer-events-none"
          style={{ background: 'rgba(232,50,26,0.12)', filter: 'blur(100px)' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div ref={r4} className="text-center mb-12">
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white tracking-tight">By the Numbers</h2>
            <p className="text-rx-muted text-sm mt-2">FITTERS STUDIO가 제공하는 크로스핏 & HYROX 훈련 콘텐츠</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass-card p-6 md:p-8 text-center group">
                <div className="font-heading font-normal text-5xl md:text-6xl mb-2 group-hover:scale-110 transition-transform duration-300 inline-block" style={{ color: '#999999' }}>
                  <CountUp end={s.end} suffix={s.suffix} duration={1800} />
                </div>
                <div className="font-bold text-sm mb-1 gradient-text">{s.label}</div>
                <div className="text-rx-muted text-xs">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: CROSSFIT 소개 ═══ */}
      <section aria-label="크로스핏 소개" className="relative px-4 bg-rx-surface" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        {/* 배경 오브 — term card 영역 뒤에 은은하게 */}
        <div
          className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: 'rgba(255,45,139,0.14)', filter: 'blur(130px)' }}
        />
        <div
          className="absolute bottom-[10%] right-[28%] w-[260px] h-[260px] rounded-full pointer-events-none"
          style={{ background: 'rgba(232,50,26,0.12)', filter: 'blur(110px)' }}
        />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div ref={r5} className="grid md:grid-cols-2 gap-12">
            {/* Left: Text */}
            <div className="flex flex-col">
              <h2 className="font-heading font-black text-5xl md:text-6xl uppercase gradient-text tracking-tight mb-6 leading-none">
                What is<br />CrossFit?
              </h2>
              <p className="text-white/70 md:text-base" style={{ lineHeight: 1.8, marginBottom: '24px' }}>
                크로스핏은 <strong className="text-white">기능적 동작(Functional Movement)</strong>을 <strong className="text-white">끊임없이 변화</strong>하는 방식으로 <strong className="text-white">고강도(High Intensity)</strong>로 수행하는 훈련 방법론입니다. 심폐지구력·근력·파워·유연성·민첩성 등 <strong className="text-white">체력의 10가지 요소</strong>를 균형 있게 발전시켜 실생활과 스포츠 퍼포먼스를 향상합니다.
              </p>
              <div className="flex flex-col mb-8" style={{ gap: '20px' }}>
                {crossfitPoints.map((p) => (
                  <div key={p.title} className="flex items-start" style={{ gap: '12px' }}>
                    <span className="text-2xl flex-shrink-0">{p.icon}</span>
                    <div>
                      <div className="text-white font-bold" style={{ marginBottom: '4px' }}>{p.title}</div>
                      <div className="text-rx-muted" style={{ lineHeight: 1.6 }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto">
                <Link href="/about" className="btn-primary px-7 py-3 rounded-xl font-bold inline-flex items-center gap-2">
                  더 알아보기
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right: Term cards */}
            <div className="grid grid-cols-2 grid-rows-2 h-full" style={{ gap: '16px' }}>
              {termCards.map((term) => (
                <div key={term.label} className="glass-card flex flex-col justify-center" style={{ padding: '24px' }}>
                  <div className="font-heading font-black text-2xl gradient-text" style={{ marginBottom: '8px' }}>{term.label}</div>
                  <div className="text-white font-medium" style={{ lineHeight: 1.6, marginBottom: '4px' }}>{term.en}</div>
                  <div className="text-rx-muted" style={{ lineHeight: 1.6 }}>{term.ko}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MobileNav />
    </div>
  )
}
