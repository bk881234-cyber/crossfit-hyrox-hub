'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { useTranslations, useLocale } from 'next-intl'

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

/* ─── Character Reveal with Gradient Cursor ─── */
function CharacterReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const chars = text.split('')
  // Cursor blinks during typing, then stays solid
  const typingMs = delay * 1000 + chars.length * 28 + 200
  const [done, setDone] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setDone(true), typingMs)
    return () => clearTimeout(id)
  }, [typingMs])

  return (
    <span aria-label={text}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * 0.028,
            duration: 0.14,
            ease: 'easeOut',
          }}
          style={{ display: 'inline' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
      {/* Brand gradient cursor — blinks while typing, fades out when done */}
      <motion.span
        aria-hidden
        animate={done
          ? { opacity: 0, scaleY: 0.5, transition: { duration: 0.4, delay: 0.6 } }
          : { opacity: [1, 0, 1] }
        }
        transition={done ? {} : {
          duration: 0.85,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          display: 'inline-block',
          width: '2px',
          height: '0.88em',
          marginLeft: '3px',
          verticalAlign: 'middle',
          background: 'linear-gradient(180deg, #E8321A 0%, #FF2D8B 100%)',
          borderRadius: '1px',
          transformOrigin: 'center',
        }}
      />
    </span>
  )
}

/* ─── High-End Tilt Card ─── */
function ToolCard({
  href,
  label,
  desc,
  detail,
  shortcut,
  icon,
}: {
  href: string
  label: string
  desc: string
  detail: string
  shortcut: string
  icon: React.ReactNode
}) {
  // Per-instance spring motion values — spring physics for a premium feel
  const rotXRaw = useMotionValue(0)
  const rotYRaw = useMotionValue(0)
  const rotX = useSpring(rotXRaw, { stiffness: 140, damping: 18, mass: 0.6 })
  const rotY = useSpring(rotYRaw, { stiffness: 140, damping: 18, mass: 0.6 })

  // Shine moves OPPOSITE to tilt — simulates glass/specular reflection
  const shineX = useTransform(rotY, [-7, 7], [22, -22])
  const shineY = useTransform(rotX, [-7, 7], [-16, 16])

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const cy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    rotYRaw.set(cx * 7)   // max ±7 degrees — subtle, anti-tacky
    rotXRaw.set(-cy * 7)
  }
  const handleLeave = () => { rotXRaw.set(0); rotYRaw.set(0) }

  return (
    <div style={{ perspective: '900px' }}>
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          position: 'relative',
          // radius matches rounded-2xl but on wrapper for shine clipping
          borderRadius: '1rem',
          // willChange for GPU compositing
          willChange: 'transform',
        }}
      >
        <Link
          href={href}
          className="tool-card group p-6 md:p-8 flex flex-row md:flex-col gap-4 md:gap-5 items-center md:items-start"
          style={{ display: 'flex' }}
        >
          <div className="flex-shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <div className="font-heading font-black text-xl md:text-2xl text-white uppercase tracking-tight mb-0.5 md:mb-1 group-hover:gradient-text transition-all leading-tight">
              {label}
            </div>
            <p className="text-rx-muted text-xs md:text-sm leading-relaxed hidden md:block">{detail}</p>
            <p className="text-rx-muted text-xs leading-relaxed md:hidden">{desc}</p>
          </div>
          <span className="flex-shrink-0 text-xs font-bold gradient-text md:hidden whitespace-nowrap">{shortcut}</span>
          <span className="hidden md:block mt-auto text-sm font-bold gradient-text pt-2">{shortcut}</span>
        </Link>

        {/* Glossy shine overlay — glass reflection moving opposite to tilt */}
        <motion.div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '1rem',
            pointerEvents: 'none',
            // Radial highlight centered at upper-30% — like a ceiling light reflection
            background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 65%)',
            x: shineX,
            y: shineY,
            zIndex: 2,
          }}
        />
      </motion.div>
    </div>
  )
}

/* ─── SVG Icons ─── */
const icons = {
  calculator: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#g1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="g1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#E8321A" /><stop offset="100%" stopColor="#FF2D8B" /></linearGradient></defs>
      <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" /><line x1="8" y1="18" x2="12" y2="18" />
    </svg>
  ),
  timer: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#g2)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="g2" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#E8321A" /><stop offset="100%" stopColor="#FF2D8B" /></linearGradient></defs>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  wod: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#g3)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="g3" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#E8321A" /><stop offset="100%" stopColor="#FF2D8B" /></linearGradient></defs>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  map: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#g4)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="g4" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#E8321A" /><stop offset="100%" stopColor="#FF2D8B" /></linearGradient></defs>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  community: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#g5)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="g5" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="24"><stop offset="0%" stopColor="#E8321A" /><stop offset="100%" stopColor="#FF2D8B" /></linearGradient></defs>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
}

export default function HomePage() {
  const t = useTranslations('home')
  const locale = useLocale()
  const r3 = useReveal(100)
  const r4 = useReveal(0)
  const r5 = useReveal(0)

  // ─── Hero Parallax — useSpring stiffness:50 damping:30 for heavy, smooth feel ───
  const heroMouseX = useMotionValue(0)
  const heroMouseY = useMotionValue(0)
  const heroSpringX = useSpring(heroMouseX, { stiffness: 50, damping: 30 })
  const heroSpringY = useSpring(heroMouseY, { stiffness: 50, damping: 30 })

  // Grid shifts OPPOSITE to cursor (background parallax) — max 20px
  const gridX = useTransform(heroSpringX, [-1, 1], [20, -20])
  const gridY = useTransform(heroSpringY, [-1, 1], [20, -20])

  // Blob1 (red, bottom-left) — opposite, 14px — slightly "closer" than grid
  const blob1X = useTransform(heroSpringX, [-1, 1], [14, -14])
  const blob1Y = useTransform(heroSpringY, [-1, 1], [10, -10])

  // Blob2 (pink radial centre) — same direction as cursor, 10px — appears "in front"
  const blob2X = useTransform(heroSpringX, [-1, 1], [-10, 10])
  const blob2Y = useTransform(heroSpringY, [-1, 1], [-7, 7])

  const handleHeroMouse = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    heroMouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2))
    heroMouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2))
  }
  const handleHeroLeave = () => { heroMouseX.set(0); heroMouseY.set(0) }

  const coreTools = [
    { href: `/${locale}/calculator`, label: t('tools.calculatorLabel'), desc: t('tools.calculatorDesc'), detail: t('tools.calculatorDetail'), icon: icons.calculator },
    { href: `/${locale}/timer`, label: t('tools.timerLabel'), desc: t('tools.timerDesc'), detail: t('tools.timerDetail'), icon: icons.timer },
    { href: `/${locale}/wod`, label: t('tools.wodLabel'), desc: t('tools.wodDesc'), detail: t('tools.wodDetail'), icon: icons.wod },
  ]

  const auxTools = [
    { href: `/${locale}/map`, label: t('tools.mapLabel'), desc: t('tools.mapDesc'), detail: t('tools.mapDetail'), icon: icons.map },
    { href: `/${locale}/community`, label: t('tools.communityLabel'), desc: t('tools.communityDesc'), detail: t('tools.communityDetail'), icon: icons.community },
  ]

  const stats = [
    { end: 37, suffix: '+', label: t('stats.wods'), sub: t('stats.wodsSub') },
    { end: 20, suffix: '+', label: t('stats.boxes'), sub: t('stats.boxesSub') },
    { end: 5, suffix: locale === 'ko' ? '가지' : '', label: t('stats.timer'), sub: t('stats.timerSub') },
    { end: 100, suffix: '%', label: t('stats.free'), sub: t('stats.freeSub') },
  ]

  const crossfitPoints = [
    { icon: '⚡', title: t('points.p1Title'), desc: t('points.p1Desc') },
    { icon: '🔥', title: t('points.p2Title'), desc: t('points.p2Desc') },
    { icon: '🔄', title: t('points.p3Title'), desc: t('points.p3Desc') },
  ]

  const termCards = [
    { label: 'WOD', en: 'Workout of the Day', ko: t('terms.t1Ko') },
    { label: 'AMRAP', en: 'As Many Rounds As Possible', ko: t('terms.t2Ko') },
    { label: 'EMOM', en: 'Every Minute on the Minute', ko: t('terms.t3Ko') },
    { label: 'RX', en: 'As Prescribed', ko: t('terms.t4Ko') },
  ]

  const shortcut = t('toolShortcut')

  return (
    <div className="min-h-screen bg-rx-bg overflow-x-hidden">
      <Header />

      {/* ═══ SECTION 1: HERO with Parallax ═══ */}
      <section
        className="relative pt-24 pb-6 px-4 overflow-hidden"
        onMouseMove={handleHeroMouse}
        onMouseLeave={handleHeroLeave}
      >
        {/* Grid — scale 1.08 so edges never show during parallax shift */}
        <motion.div
          className="absolute inset-0 hero-grid-bg opacity-60 pointer-events-none"
          style={{ x: gridX, y: gridY, scale: 1.08 }}
        />

        {/* Red radial blob — parallax layer 1 */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            x: blob1X,
            y: blob1Y,
            background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,50,26,0.14) 0%, transparent 70%)',
          }}
        />

        {/* Pink radial blob — parallax layer 2 (moves toward cursor) */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            x: blob2X,
            y: blob2Y,
            background: 'radial-gradient(ellipse 60% 40% at 70% 30%, rgba(255,45,139,0.09) 0%, transparent 65%)',
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: 'linear-gradient(to bottom, transparent, #0D0D0D)' }} />

        <div className="relative text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-semibold mb-5 tracking-widest uppercase animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full gradient-bg animate-pulse" />
            {t('heroBadge')}
          </div>
          <h1
            className="font-heading font-black uppercase tracking-tighter mb-4 leading-none animate-fade-in-up"
            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', animationDelay: '0.1s', letterSpacing: '0.02em' }}
          >
            <span className="block text-white">{t('heroTitle1')}</span>
            <span className="block gradient-text">{t('heroTitle2')}</span>
          </h1>

          {/* Subtitle — CharacterReveal starts after h1 fade-in (0.7s delay) */}
          <p className="text-rx-muted text-sm md:text-base" style={{ minHeight: '1.6em' }}>
            <CharacterReveal text={t('heroDesc')} delay={0.7} />
          </p>
        </div>
      </section>

      {/* ═══ SECTION 2: CORE 3 TOOLS ═══ */}
      <section aria-label="core tools" className="relative px-4 pt-2 pb-10">
        <div className="absolute top-1/2 left-[8%] -translate-y-1/2 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: 'rgba(232,50,26,0.20)', filter: 'blur(130px)' }} />
        <div className="absolute top-1/4 right-[8%] w-[340px] h-[340px] rounded-full pointer-events-none" style={{ background: 'rgba(255,45,139,0.16)', filter: 'blur(120px)' }} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coreTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} shortcut={shortcut} />
            ))}
          </div>
        </div>
      </section>

      <div className="h-10 bg-rx-bg" />

      {/* ═══ SECTION 3: AUX 2 TOOLS ═══ */}
      <section aria-label="additional features" className="bg-rx-surface px-4 pt-14 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/fittersstudio_img01.png')", backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <div ref={r3} className="text-center mb-8">
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white tracking-tight">{t('featuresTitle')}</h2>
            <p className="text-rx-muted text-sm mt-2">{t('featuresDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {auxTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} shortcut={shortcut} />
            ))}
          </div>
        </div>
      </section>

      {/* Diagonal divider */}
      <div style={{ height: '60px', clipPath: 'polygon(0 0, 100% 60%, 100% 100%, 0 100%)', background: '#0D0D0D', marginTop: '-1px' }} />

      {/* ═══ SECTION 4: STATS ═══ */}
      <section aria-label="stats" className="relative px-4 py-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[280px] rounded-full pointer-events-none" style={{ background: 'rgba(255,45,139,0.14)', filter: 'blur(140px)' }} />
        <div className="absolute top-[15%] left-[5%] w-[260px] h-[260px] rounded-full pointer-events-none" style={{ background: 'rgba(232,50,26,0.15)', filter: 'blur(110px)' }} />
        <div className="absolute bottom-[15%] right-[5%] w-[240px] h-[240px] rounded-full pointer-events-none" style={{ background: 'rgba(232,50,26,0.12)', filter: 'blur(100px)' }} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div ref={r4} className="text-center mb-12">
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white tracking-tight">{t('statsTitle')}</h2>
            <p className="text-rx-muted text-sm mt-2">{t('statsDesc')}</p>
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
      <section aria-label="about crossfit" className="relative px-4 bg-rx-surface" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none" style={{ background: 'rgba(255,45,139,0.14)', filter: 'blur(130px)' }} />
        <div className="absolute bottom-[10%] right-[28%] w-[260px] h-[260px] rounded-full pointer-events-none" style={{ background: 'rgba(232,50,26,0.12)', filter: 'blur(110px)' }} />
        <div className="relative z-10 max-w-6xl mx-auto">
          <div ref={r5} className="grid md:grid-cols-2 gap-12">
            {/* Left: Text */}
            <div className="flex flex-col">
              <h2 className="font-heading font-black text-5xl md:text-6xl uppercase gradient-text tracking-tight mb-6 leading-none">
                What is<br />CrossFit?
              </h2>
              <p className="text-white/70 md:text-base" style={{ lineHeight: 1.8, marginBottom: '24px' }}
                dangerouslySetInnerHTML={{ __html: t('aboutDesc') }}
              />
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
                <Link href={`/${locale}/about`} className="btn-primary px-7 py-3 rounded-xl font-bold inline-flex items-center gap-2">
                  {t('learnMore')}
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
