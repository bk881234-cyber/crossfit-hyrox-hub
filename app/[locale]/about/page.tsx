'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add('reveal')
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => el.classList.add('visible'), delay); obs.unobserve(el) } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return ref
}

const hyroxStations = [
  { no: 1, name: 'SkiErg', dist: '1,000m' },
  { no: 2, name: 'Sled Push', dist: '50m' },
  { no: 3, name: 'Sled Pull', dist: '50m' },
  { no: 4, name: 'Burpee Broad Jump', dist: '80m' },
  { no: 5, name: 'Rowing', dist: '1,000m' },
  { no: 6, name: 'Farmers Carry', dist: '200m' },
  { no: 7, name: 'Sandbag Lunges', dist: '100m' },
  { no: 8, name: 'Wall Balls', dist: '100 reps' },
]

export default function AboutPage() {
  const t = useTranslations('about')
  const locale = useLocale()

  const glossaryKo = [
    { term: 'WOD', full: 'Workout of the Day', desc: '오늘의 운동. 매일 다른 훈련 프로그램' },
    { term: 'AMRAP', full: 'As Many Rounds/Reps As Possible', desc: '제한 시간 내 최대한 많은 라운드·반복수 수행' },
    { term: 'EMOM', full: 'Every Minute on the Minute', desc: '매 분 시작 시 정해진 동작을 수행하고 남은 시간 휴식' },
    { term: 'For Time', full: 'For Time', desc: '정해진 반복수를 최단 시간에 완료' },
    { term: 'Tabata', full: 'Tabata Protocol', desc: '20초 운동 / 10초 휴식을 8라운드 반복하는 고강도 인터벌 프로토콜' },
    { term: 'Interval', full: 'Interval Training', desc: '운동과 휴식을 번갈아 반복하는 구조화된 훈련 방식' },
    { term: 'RX', full: 'As Prescribed', desc: '규정된 무게·기준 그대로 수행' },
    { term: 'Scaled', full: 'Scaled', desc: '개인 체력에 맞게 무게·동작을 조정' },
    { term: 'PR', full: 'Personal Record', desc: '개인 최고 기록' },
    { term: 'Box', full: 'CrossFit Box', desc: '크로스핏 전용 체육관' },
    { term: '1RM', full: '1 Rep Maximum', desc: '1회 최대 중량. 훈련 무게 설정의 기준' },
    { term: 'Drop-in', full: 'Drop-in', desc: '타 박스를 일회성으로 방문하는 것' },
  ]

  const glossaryEn = [
    { term: 'WOD', full: 'Workout of the Day', desc: 'Daily workout. A different training program every day.' },
    { term: 'AMRAP', full: 'As Many Rounds/Reps As Possible', desc: 'Complete as many rounds or reps as possible within the time limit.' },
    { term: 'EMOM', full: 'Every Minute on the Minute', desc: 'Perform the set movement at the start of each minute; rest for the remaining time.' },
    { term: 'For Time', full: 'For Time', desc: 'Complete the prescribed reps in the shortest time possible.' },
    { term: 'Tabata', full: 'Tabata Protocol', desc: '20 sec work / 10 sec rest repeated for 8 rounds — a high-intensity interval protocol.' },
    { term: 'Interval', full: 'Interval Training', desc: 'Structured training alternating between work and rest.' },
    { term: 'RX', full: 'As Prescribed', desc: 'Perform the workout at the prescribed weight and standards.' },
    { term: 'Scaled', full: 'Scaled', desc: 'Adjust weight or movements to match individual fitness level.' },
    { term: 'PR', full: 'Personal Record', desc: 'Personal best score or weight.' },
    { term: 'Box', full: 'CrossFit Box', desc: 'A CrossFit-dedicated gym.' },
    { term: '1RM', full: '1 Rep Maximum', desc: 'Maximum weight lifted for one rep. Used to set training loads.' },
    { term: 'Drop-in', full: 'Drop-in', desc: 'Visiting another box for a single class.' },
  ]

  const comparisonRowsKo = [
    { item: '운동 방식', crossfit: '기능적 복합 동작 중심', gym: '머신/고립 운동 중심' },
    { item: '프로그램', crossfit: '매일 다른 WOD (가변성)', gym: '반복 루틴 (일관성)' },
    { item: '강도', crossfit: '고강도 인터벌 (HIIT)', gym: '자기 페이스' },
    { item: '커뮤니티', crossfit: '강한 단체 문화, 코치 지도', gym: '개인 운동' },
    { item: '목표', crossfit: '전반적 체력 향상', gym: '근비대/체중 감량 특화' },
    { item: '공간', crossfit: '오픈 플로어, 전용 Box', gym: '머신·기구 위주' },
    { item: '비용', crossfit: '월 12~20만 원 (코칭 포함)', gym: '월 3~8만 원' },
  ]

  const comparisonRowsEn = [
    { item: 'Exercise Style', crossfit: 'Functional compound movements', gym: 'Machine / isolation exercises' },
    { item: 'Program', crossfit: 'Different WOD every day (variance)', gym: 'Repetitive routine (consistency)' },
    { item: 'Intensity', crossfit: 'High-intensity intervals (HIIT)', gym: 'Self-paced' },
    { item: 'Community', crossfit: 'Strong group culture, coach-led', gym: 'Individual training' },
    { item: 'Goal', crossfit: 'Overall fitness improvement', gym: 'Hypertrophy / weight loss focus' },
    { item: 'Space', crossfit: 'Open floor, dedicated Box', gym: 'Machine / equipment-focused' },
    { item: 'Cost', crossfit: '120,000–200,000 KRW / mo (coaching incl.)', gym: '30,000–80,000 KRW / mo' },
  ]

  const startingStepsKo = [
    { step: '01', title: '박스 찾기', desc: '드랍인 지도에서 가까운 크로스핏 박스를 찾고, 무료 체험 클래스를 예약하세요.' },
    { step: '02', title: '기초 동작 배우기', desc: '스쿼트, 데드리프트, 프레스 등 기본 동작부터 시작. OnRamp/Fundamentals 과정을 먼저 이수하세요.' },
    { step: '03', title: 'Scaled로 시작', desc: '처음엔 Scaled 옵션 사용을 두려워하지 마세요. 안전하고 올바른 동작이 먼저입니다.' },
    { step: '04', title: 'WOD 기록하기', desc: '매 WOD 결과를 기록하면 성장을 눈으로 확인할 수 있습니다. FITTERS STUDIO 기록 페이지를 활용하세요.' },
    { step: '05', title: '커뮤니티 참여', desc: '크로스핏의 핵심은 커뮤니티. 다른 회원들과 함께하고 대회에도 도전해보세요.' },
  ]

  const startingStepsEn = [
    { step: '01', title: 'Find a Box', desc: 'Find a nearby CrossFit box in the drop-in map and book a free trial class.' },
    { step: '02', title: 'Learn Basic Movements', desc: 'Start with basics like squat, deadlift, and press. Complete an OnRamp/Fundamentals course first.' },
    { step: '03', title: 'Start with Scaled', desc: "Don't be afraid to use the Scaled option at first. Safe, proper form comes first." },
    { step: '04', title: 'Record Your WODs', desc: 'Recording each WOD result lets you see your progress. Use the FITTERS STUDIO log page.' },
    { step: '05', title: 'Join the Community', desc: 'Community is the heart of CrossFit. Train with others and challenge yourself in competitions.' },
  ]

  const glossary = locale === 'en' ? glossaryEn : glossaryKo
  const comparisonRows = locale === 'en' ? comparisonRowsEn : comparisonRowsKo
  const startingSteps = locale === 'en' ? startingStepsEn : startingStepsKo

  const r1 = useReveal(0)
  const r2 = useReveal(0)
  const r3 = useReveal(0)
  const r4 = useReveal(0)
  const r5 = useReveal(0)

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10">

        {/* ── Hero ── */}
        <section className="relative px-4 pt-16 pb-20 text-center overflow-hidden">
          <div className="absolute inset-0 hero-grid-bg opacity-40" />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(232,50,26,0.07), transparent 70%)' }} />
          <div className="relative max-w-[992px] mx-auto">
            <p className="text-rx-muted text-xs tracking-widest uppercase mb-4">{t('heroLabel')}</p>
            <h1 className="font-heading font-black uppercase tracking-tighter mb-5 gradient-text" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1 }}>
              {t('heroTitle')}
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>
          </div>
        </section>

        {/* ── 1. 정의 + 철학 ── */}
        <section className="px-4 py-16 max-w-[992px] mx-auto">
          <div ref={r1}>
            {/* 상단: 제목 + 설명 */}
            <div className="mb-10">
              <p className="text-rx-muted text-xs tracking-widest uppercase mb-3">{t('s1Label')}</p>
              <h2 className="font-heading font-black text-3xl md:text-5xl uppercase text-white tracking-tight mb-6 whitespace-nowrap">CrossFit Philosophy</h2>
              <div className="flex flex-col gap-6 max-w-3xl">
                <div>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6">
                    크로스핏은 단순한 동작의 반복을 넘어 <strong className="text-white">삶의 질 향상</strong>과 어떤 도전에도 대응 가능한 <strong className="text-white">범용적 신체 능력(GPP)</strong> 극대화를 목표로 합니다.
                  </p>
                  <blockquote className="border-l-2 pl-5 py-2 mb-4" style={{ borderColor: '#E8321A', background: 'rgba(232,50,26,0.05)' }}>
                    <p className="text-white/90 italic text-base md:text-lg font-medium leading-relaxed">
                      &ldquo;끊임없이 변화하는 기능적 동작을 고강도로 수행하는 것&rdquo;<br />
                      <span className="text-rx-muted text-xs mt-2 block not-italic uppercase tracking-widest">Constantly varied functional movements performed at high intensity</span>
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>

            {/* 하단: 10가지 체력 요소 */}
            <div>
              <p className="text-rx-muted text-xs tracking-widest uppercase mb-4">{t('fitnessElements')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { icon: '❤️', label: t('el1'), en: 'Cardio Endurance' },
                  { icon: '🔋', label: t('el2'), en: 'Muscular Endurance' },
                  { icon: '💪', label: t('el3'), en: 'Strength' },
                  { icon: '🤸', label: t('el4'), en: 'Flexibility' },
                  { icon: '⚡', label: t('el5'), en: 'Power' },
                  { icon: '🏃', label: t('el6'), en: 'Speed' },
                  { icon: '🔀', label: t('el7'), en: 'Agility' },
                  { icon: '⚖️', label: t('el8'), en: 'Balance' },
                  { icon: '🧠', label: t('el9'), en: 'Coordination' },
                  { icon: '🎯', label: t('el10'), en: 'Accuracy' },
                ].map((f) => (
                  <div key={f.label} className="glass-card p-3 text-center hover:border-white/25 transition-colors">
                    <div className="text-2xl mb-2">{f.icon}</div>
                    <div className="text-white text-xs font-bold mb-0.5">{f.label}</div>
                    <div className="text-rx-muted" style={{ fontSize: '11px' }}>{f.en}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. CrossFit vs 일반 헬스 ── */}
        <section className="bg-rx-surface px-4 py-16">
          <div className="max-w-[992px] mx-auto">
            <div ref={r2}>
              <p className="text-rx-muted text-xs tracking-widest uppercase mb-3">{t('s2Label')}</p>
              <h2 className="font-heading font-black text-3xl md:text-5xl uppercase text-white tracking-tight mb-8 whitespace-nowrap">{t('s2Title')}</h2>

              <div className="overflow-x-auto rounded-2xl border border-rx-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-rx-border">
                      <th className="text-left px-5 py-4 text-rx-muted font-medium w-32">{t('s2ColItem')}</th>
                      <th className="text-left px-5 py-4 font-bold" style={{ color: '#E8321A' }}>{t('s2ColCf')}</th>
                      <th className="text-left px-5 py-4 text-rx-muted font-medium">{t('s2ColGym')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr key={i} className={`border-b border-rx-border last:border-0 ${i % 2 === 0 ? 'bg-rx-card/50' : ''}`}>
                        <td className="px-5 py-4 text-rx-muted font-medium">{row.item}</td>
                        <td className="px-5 py-4 text-white">{row.crossfit}</td>
                        <td className="px-5 py-4 text-rx-muted">{row.gym}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. 용어 사전 ── */}
        <section className="px-4 py-16 max-w-[992px] mx-auto">
          <div ref={r3}>
            <p className="text-rx-muted text-xs tracking-widest uppercase mb-3">{t('s3Label')}</p>
            <h2 className="font-heading font-black text-3xl md:text-5xl uppercase text-white tracking-tight mb-8 whitespace-nowrap">{t('s3Title')} <span className="gradient-text">Glossary</span></h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {glossary.map((g) => (
                <div key={g.term} className="bg-rx-card border border-rx-border rounded-2xl p-5 hover:border-white/20 transition-colors group">
                  <div className="font-heading font-black text-2xl gradient-text mb-1">{g.term}</div>
                  <div className="text-white text-xs font-medium mb-1 opacity-80">{g.full}</div>
                  <div className="text-rx-muted text-xs leading-relaxed">{g.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. 처음 시작하는 법 ── */}
        <section className="bg-rx-surface px-4 py-16">
          <div className="max-w-[992px] mx-auto">
            <div ref={r4}>
              <p className="text-rx-muted text-xs tracking-widest uppercase mb-3">{t('s4Label')}</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white tracking-tight mb-10">
                {t('s4Title')}
              </h2>

              <div className="flex flex-col gap-5">
                {startingSteps.map((s) => (
                  <div key={s.step} className="flex gap-6 items-start group">
                    <span className="font-heading font-black text-5xl gradient-text leading-none flex-shrink-0 w-16">{s.step}</span>
                    <div className="pt-2">
                      <div className="text-white font-bold text-lg mb-1 group-hover:gradient-text transition-all">{s.title}</div>
                      <div className="text-rx-muted text-sm leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex gap-4 flex-wrap">
                <Link href="/wod" className="btn-primary px-8 py-3.5 rounded-xl font-bold">
                  {t('ctaWod')}
                </Link>
                <Link href="/map" className="btn-secondary px-8 py-3.5 rounded-xl font-bold">
                  {t('ctaMap')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. HYROX 소개 ── */}
        <section className="px-4 py-16 max-w-[992px] mx-auto">
          <div ref={r5}>
            <p className="text-rx-muted text-xs tracking-widest uppercase mb-3">05 / HYROX</p>
            <h2 className="font-heading font-black text-3xl md:text-5xl uppercase text-white tracking-tight mb-5 whitespace-nowrap">
              What is <span className="gradient-text">HYROX?</span>
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-2xl">
              HYROX는 2017년 독일에서 시작된 <strong className="text-white">피트니스 레이싱 대회</strong>입니다. 1km 런 8회와 8개의 기능적 운동 스테이션으로 구성된 표준화된 레이스로, 전 세계 동일한 형식으로 진행됩니다. 누구나 참가 가능한 <strong className="text-white">대중 피트니스 대회</strong>의 새로운 표준입니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-rx-card border border-rx-border rounded-2xl p-5">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                  <span className="gradient-text font-heading font-black text-xl">{t('hyroxRace')}</span>
                  <span className="text-rx-muted text-xs">{t('hyroxTotal')}</span>
                </h3>
                <div className="space-y-2">
                  {hyroxStations.map((s) => (
                    <div key={s.no} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full gradient-bg text-white text-xs font-black flex items-center justify-center flex-shrink-0">{s.no}</span>
                      <span className="text-white text-sm font-medium flex-1">{s.name}</span>
                      <span className="text-rx-muted text-xs">{s.dist}</span>
                    </div>
                  ))}
                </div>
                <p className="text-rx-muted text-xs mt-4">{t('hyroxNote')}</p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { label: 'HYROX Open', desc: t('hyroxOpenDesc'), badge: t('hyroxBeginner') },
                  { label: 'HYROX Pro', desc: t('hyroxProDesc'), badge: t('hyroxStandard') },
                  { label: 'HYROX Elite', desc: t('hyroxEliteDesc'), badge: t('hyroxAdvanced') },
                  { label: 'HYROX Doubles', desc: t('hyroxDoublesDesc'), badge: t('hyroxTeam') },
                ].map((cat) => (
                  <div key={cat.label} className="bg-rx-card border border-rx-border rounded-xl p-4 hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{cat.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full gradient-bg text-white font-bold">{cat.badge}</span>
                    </div>
                    <div className="text-rx-muted text-xs">{cat.desc}</div>
                  </div>
                ))}
                <Link href="/community#hyrox" className="btn-secondary text-sm py-3 rounded-xl text-center font-bold">
                  {t('hyroxScheduleLink')}
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <MobileNav />
    </div>
  )
}
