'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
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

const glossary = [
  { term: 'WOD', full: 'Workout of the Day', desc: '오늘의 운동. 매일 다른 훈련 프로그램' },
  { term: 'AMRAP', full: 'As Many Rounds/Reps As Possible', desc: '제한 시간 내 최대한 많은 라운드·반복수 수행' },
  { term: 'EMOM', full: 'Every Minute on the Minute', desc: '매 분 시작 시 정해진 동작을 수행하고 남은 시간 휴식' },
  { term: 'For Time', full: 'For Time', desc: '정해진 반복수를 최단 시간에 완료' },
  { term: 'RX', full: 'As Prescribed', desc: '규정된 무게·기준 그대로 수행' },
  { term: 'Scaled', full: 'Scaled', desc: '개인 체력에 맞게 무게·동작을 조정' },
  { term: 'PR', full: 'Personal Record', desc: '개인 최고 기록' },
  { term: 'Box', full: 'CrossFit Box', desc: '크로스핏 전용 체육관' },
  { term: 'HSPU', full: 'Handstand Push-up', desc: '물구나무 선 상태에서 팔굽혀펴기' },
  { term: 'T2B', full: 'Toes-to-Bar', desc: '철봉에 매달려 발끝을 바에 터치' },
  { term: '1RM', full: '1 Rep Maximum', desc: '1회 최대 중량. 훈련 무게 설정의 기준' },
  { term: 'Drop-in', full: 'Drop-in', desc: '타 박스를 일회성으로 방문하는 것' },
]

const comparisonRows = [
  { item: '운동 방식', crossfit: '기능적 복합 동작 중심', gym: '머신/고립 운동 중심' },
  { item: '프로그램', crossfit: '매일 다른 WOD (가변성)', gym: '반복 루틴 (일관성)' },
  { item: '강도', crossfit: '고강도 인터벌 (HIIT)', gym: '자기 페이스' },
  { item: '커뮤니티', crossfit: '강한 단체 문화, 코치 지도', gym: '개인 운동' },
  { item: '목표', crossfit: '전반적 체력 향상', gym: '근비대/체중 감량 특화' },
  { item: '공간', crossfit: '오픈 플로어, 전용 Box', gym: '머신·기구 위주' },
  { item: '비용', crossfit: '월 12~20만 원 (코칭 포함)', gym: '월 3~8만 원' },
]

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

const startingSteps = [
  { step: '01', title: '박스 찾기', desc: '드랍인 지도에서 가까운 크로스핏 박스를 찾고, 무료 체험 클래스를 예약하세요.' },
  { step: '02', title: '기초 동작 배우기', desc: '스쿼트, 데드리프트, 프레스 등 기본 동작부터 시작. OnRamp/Fundamentals 과정을 먼저 이수하세요.' },
  { step: '03', title: 'Scaled로 시작', desc: '처음엔 Scaled 옵션 사용을 두려워하지 마세요. 안전하고 올바른 동작이 먼저입니다.' },
  { step: '04', title: 'WOD 기록하기', desc: '매 WOD 결과를 기록하면 성장을 눈으로 확인할 수 있습니다. FITTERS STUDIO 기록 페이지를 활용하세요.' },
  { step: '05', title: '커뮤니티 참여', desc: '크로스핏의 핵심은 커뮤니티. 다른 회원들과 함께하고 대회에도 도전해보세요.' },
]

export default function AboutPage() {
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
          <div className="relative max-w-3xl mx-auto">
            <p className="text-rx-muted text-xs tracking-widest uppercase mb-4">가이드</p>
            <h1 className="font-heading font-black uppercase tracking-tighter mb-5 gradient-text" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: 1 }}>
              크로스핏이란?
            </h1>
            <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              크로스핏·HYROX를 처음 시작하는 분들을 위한 완전 가이드
            </p>
          </div>
        </section>

        {/* ── 1. 정의 + 철학 ── */}
        <section className="px-4 py-16 max-w-5xl mx-auto">
          <div ref={r1} className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-rx-muted text-xs tracking-widest uppercase mb-3">01 / 정의</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white tracking-tight mb-5">CrossFit<br />Philosophy</h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                크로스핏은 <strong className="text-white">Greg Glassman</strong>이 2000년에 창시한 피트니스 방법론입니다. 핵심 정의는 단 하나 —
              </p>
              <blockquote className="border-l-2 pl-4 mb-4" style={{ borderColor: '#E8321A' }}>
                <p className="text-white/80 italic text-sm leading-relaxed">
                  &ldquo;끊임없이 변화하는 기능적 동작을 고강도로 수행하는 것&rdquo;<br />
                  <span className="text-rx-muted text-xs">Constantly varied functional movements performed at high intensity</span>
                </p>
              </blockquote>
              <p className="text-white/60 text-sm leading-relaxed">
                단순한 운동이 아닌 <strong className="text-white">삶의 질을 향상</strong>시키는 것이 목표입니다. 모든 체력 요소를 골고루 발전시켜 어떤 도전에도 대응 가능한 <strong className="text-white">범용적 신체 능력</strong>을 기릅니다.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '⚡', label: '심폐지구력', en: 'Cardiovascular Endurance' },
                { icon: '🔥', label: '근지구력', en: 'Muscular Endurance' },
                { icon: '💪', label: '근력', en: 'Strength' },
                { icon: '🤸', label: '유연성', en: 'Flexibility' },
                { icon: '🚀', label: '파워', en: 'Power' },
                { icon: '⚡', label: '스피드', en: 'Speed' },
                { icon: '🎯', label: '민첩성', en: 'Agility' },
                { icon: '⚖️', label: '균형', en: 'Balance' },
                { icon: '🧠', label: '협응', en: 'Coordination' },
                { icon: '🎯', label: '정확성', en: 'Accuracy' },
              ].map((f) => (
                <div key={f.label} className="bg-rx-card border border-rx-border rounded-xl p-3 hover:border-white/20 transition-colors">
                  <div className="text-xl mb-1">{f.icon}</div>
                  <div className="text-white text-xs font-bold">{f.label}</div>
                  <div className="text-rx-muted text-[10px]">{f.en}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. CrossFit vs 일반 헬스 ── */}
        <section className="bg-rx-surface px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div ref={r2}>
              <p className="text-rx-muted text-xs tracking-widest uppercase mb-3">02 / 비교</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white tracking-tight mb-8">CrossFit<br />vs 일반 헬스</h2>

              <div className="overflow-x-auto rounded-2xl border border-rx-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-rx-border">
                      <th className="text-left px-5 py-4 text-rx-muted font-medium w-32">항목</th>
                      <th className="text-left px-5 py-4 font-bold" style={{ color: '#E8321A' }}>크로스핏</th>
                      <th className="text-left px-5 py-4 text-rx-muted font-medium">일반 헬스</th>
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
        <section className="px-4 py-16 max-w-5xl mx-auto">
          <div ref={r3}>
            <p className="text-rx-muted text-xs tracking-widest uppercase mb-3">03 / 용어</p>
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white tracking-tight mb-8">용어 사전<br /><span className="gradient-text">Glossary</span></h2>

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

        {/* ── 4. HYROX 소개 ── */}
        <section className="bg-rx-surface px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div ref={r4}>
              <p className="text-rx-muted text-xs tracking-widest uppercase mb-3">04 / HYROX</p>
              <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white tracking-tight mb-5">
                What is<br /><span className="gradient-text">HYROX?</span>
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-2xl">
                HYROX는 2017년 독일에서 시작된 <strong className="text-white">피트니스 레이싱 대회</strong>입니다. 1km 런 8회와 8개의 기능적 운동 스테이션으로 구성된 표준화된 레이스로, 전 세계 동일한 형식으로 진행됩니다. 누구나 참가 가능한 <strong className="text-white">대중 피트니스 대회</strong>의 새로운 표준입니다.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-rx-card border border-rx-border rounded-2xl p-5">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                    <span className="gradient-text font-heading font-black text-xl">레이스 구성</span>
                    <span className="text-rx-muted text-xs">(총 ~10km)</span>
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
                  <p className="text-rx-muted text-xs mt-4">* 각 스테이션 사이 1km Run</p>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { label: 'HYROX Open', desc: '입문 카테고리. 일부 동작 무게 조정 가능', badge: '입문' },
                    { label: 'HYROX Pro', desc: '표준 무게. 경쟁적 참가자용', badge: '표준' },
                    { label: 'HYROX Elite', desc: '고급 무게. 상위 퍼포먼스 선수용', badge: '고급' },
                    { label: 'HYROX Doubles', desc: '2인 1팀으로 참가하는 팀 카테고리', badge: '팀' },
                  ].map((cat) => (
                    <div key={cat.label} className="bg-rx-card border border-rx-border rounded-xl p-4 hover:border-white/20 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-sm">{cat.label}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full gradient-bg text-white font-bold">{cat.badge}</span>
                      </div>
                      <div className="text-rx-muted text-xs">{cat.desc}</div>
                    </div>
                  ))}
                  <Link href="/community" className="btn-secondary text-sm py-3 rounded-xl text-center font-bold">
                    한국 HYROX 대회 일정 보기 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. 처음 시작하는 법 ── */}
        <section className="px-4 py-16 max-w-5xl mx-auto">
          <div ref={r5}>
            <p className="text-rx-muted text-xs tracking-widest uppercase mb-3">05 / 시작</p>
            <h2 className="font-heading font-black text-4xl md:text-5xl uppercase text-white tracking-tight mb-10">
              처음 시작하는 법
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
                WOD Library 보기
              </Link>
              <Link href="/map" className="btn-secondary px-8 py-3.5 rounded-xl font-bold">
                드랍인 박스 찾기
              </Link>
            </div>
          </div>
        </section>

      </main>
      <MobileNav />
    </div>
  )
}
