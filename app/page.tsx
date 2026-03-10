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
    detail: '바벨·덤벨·맨몸 운동의 최대 중량을 빠르게 계산하세요.',
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
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,50,26,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: 'linear-gradient(to bottom, transparent, #0D0D0D)' }} />

        <div className="relative text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-semibold mb-5 tracking-widest uppercase animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full gradient-bg animate-pulse" />
            CrossFit & HYROX Platform
          </div>
          <h1
            className="font-heading font-black uppercase tracking-tighter mb-4 leading-none animate-fade-in-up"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', animationDelay: '0.1s', letterSpacing: '0.02em' }}
          >
            <span className="block text-white">FITTERS</span>
            <span className="block gradient-text">STUDIO</span>
          </h1>
          <p className="text-rx-muted text-sm md:text-base animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            크로스피터를 위한 모든 도구를 한곳에
          </p>
        </div>
      </section>

      {/* ═══ SECTION 2: CORE 3 TOOLS ═══ */}
      <section className="px-4 pb-6 pt-2 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allTools.slice(0, 3).map((tool) => (
            <ToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </section>

      {/* Diagonal divider */}
      <div className="bg-rx-surface" style={{ height: '60px', clipPath: 'polygon(0 60%, 100% 0, 100% 100%, 0 100%)' }} />

      {/* ═══ SECTION 3: AUX 2 TOOLS ═══ */}
      <section className="bg-rx-surface px-4 py-14 relative overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/fittersstudio_img01.png')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div ref={r3} className="text-center mb-8">
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white tracking-tight">More Features</h2>
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
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div ref={r4} className="text-center mb-12">
          <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white tracking-tight">By the Numbers</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-rx-surface border border-rx-border rounded-2xl p-6 md:p-8 text-center hover:border-white/20 transition-colors group">
              {/* font-normal = weight 400 */}
              <div className="font-heading font-normal text-5xl md:text-6xl mb-2 group-hover:scale-110 transition-transform duration-300 inline-block" style={{ color: '#999999' }}>
                <CountUp end={s.end} suffix={s.suffix} duration={1800} />
              </div>
              <div className="font-bold text-sm mb-1 gradient-text">{s.label}</div>
              <div className="text-rx-muted text-xs">{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SECTION 5: CROSSFIT 소개 ═══ */}
      <section className="px-4 py-16 bg-rx-surface">
        <div className="max-w-6xl mx-auto">
          {/* items-stretch so both columns share the same height */}
          <div ref={r5} className="grid md:grid-cols-2 gap-12">
            {/* Left: Text */}
            <div className="flex flex-col">
              <h2 className="font-heading font-black text-5xl md:text-6xl uppercase gradient-text tracking-tight mb-6 leading-none">
                What is<br />CrossFit?
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8">
                크로스핏은 <strong className="text-white">기능적 동작</strong>을 <strong className="text-white">끊임없이 변화</strong>하는 방식으로 <strong className="text-white">고강도</strong>로 수행하는 훈련입니다. 체력의 10가지 요소(심폐지구력, 근지구력, 근력, 유연성, 파워, 스피드, 민첩성, 균형, 협응, 정확성)를 골고루 발전시킵니다.
              </p>
              <div className="flex flex-col gap-4 mb-8">
                {crossfitPoints.map((p) => (
                  <div key={p.title} className="flex items-start gap-4">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <div className="text-white font-bold text-sm mb-0.5">{p.title}</div>
                      <div className="text-rx-muted text-xs">{p.desc}</div>
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

            {/* Right: Term cards — grid-rows-2 fills full column height */}
            <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
              {termCards.map((term) => (
                <div key={term.label} className="bg-rx-card border border-rx-border rounded-2xl p-4 hover:border-white/20 transition-colors flex flex-col justify-center">
                  <div className="font-heading font-black text-2xl gradient-text mb-1">{term.label}</div>
                  <div className="text-white text-xs font-medium mb-0.5">{term.en}</div>
                  <div className="text-rx-muted text-xs">{term.ko}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Large Brand Text + Footer */}
      <footer className="bg-rx-bg" style={{ borderTop: '1px solid #333' }}>
        {/* FITTERSSTUDIO 100vw watermark text */}
        <div
          className="select-none overflow-hidden w-full leading-none font-heading font-black uppercase"
          style={{
            fontSize: '15vw',
            color: '#2b1119',
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          FITTERSSTUDIO
        </div>

        {/* Footer info */}
        <div className="px-6 pb-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-6 pt-4 border-t border-rx-border">
            <div>
              <div className="font-heading font-black text-xl text-white mb-2">FITTERS STUDIO</div>
              <p className="text-rx-muted text-sm leading-relaxed">
                상호명: Fitters Studio&nbsp;&nbsp;|&nbsp;&nbsp;대표자: 임병권&nbsp;&nbsp;|&nbsp;&nbsp;이메일: bkbk881234@gmail.com
              </p>
            </div>
            <div className="flex items-center gap-6 flex-shrink-0">
              <Link href="/terms" className="text-rx-muted text-sm hover:text-white transition-colors">이용약관</Link>
              <Link href="/privacy" className="text-rx-muted text-sm hover:text-white transition-colors">개인정보 처리방침</Link>
            </div>
          </div>
          <p className="text-rx-muted text-sm text-center mt-4">Copyright © 2026 Fitters Studio. All rights reserved.</p>
        </div>
      </footer>

      <MobileNav />
    </div>
  )
}
