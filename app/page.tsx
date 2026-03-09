import Link from 'next/link'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'

const features = [
  {
    href: '/calculator',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="12" y2="14" />
        <line x1="8" y1="18" x2="12" y2="18" />
      </svg>
    ),
    iconColor: 'text-rx-red',
    bgColor: 'bg-rx-red/10',
    title: '1RM 계산기',
    subtitle: '무게 변환 & 최대 중량 계산',
    description: '바벨, 덤벨, 맨몸 운동별 1RM을 계산하고 퍼센트 테이블을 확인하세요.',
  },
  {
    href: '/timer',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    iconColor: 'text-rx-orange',
    bgColor: 'bg-rx-orange/10',
    title: 'WOD 타이머',
    subtitle: 'AMRAP/EMOM/Tabata 타이머',
    description: '5가지 모드의 WOD 타이머. 소리 알림과 화면 켜짐 유지 기능 포함.',
  },
  {
    href: '/wod',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    iconColor: 'text-green-400',
    bgColor: 'bg-green-400/10',
    title: 'WOD 아카이브',
    subtitle: '35개+ 벤치마크 WOD',
    description: 'Girl WODs, Hero WODs, CrossFit Open WOD를 한눈에. 스케일링 옵션 포함.',
  },
  {
    href: '/map',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    title: '드랍인 지도',
    subtitle: '전국 크로스핏 박스 찾기',
    description: '서울, 부산, 대구, 인천 등 전국 크로스핏 박스의 드랍인 요금과 정보.',
  },
  {
    href: '/community',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    iconColor: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    title: '커뮤니티',
    subtitle: 'HYROX & 크로스핏 대회 정보',
    description: 'HYROX 대회 일정, 국내 크로스핏 대회, 자유게시판까지 한곳에.',
  },
]

const stats = [
  { value: '35+', label: 'WOD 수록' },
  { value: '20+', label: '전국 박스' },
  { value: '5가지', label: '타이머 모드' },
  { value: '무료', label: '완전 무료' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />

      <main className="pt-14 pb-20 md:pb-8">
        {/* Hero */}
        <section className="px-4 pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rx-red/10 border border-rx-red/30 text-rx-red text-xs font-bold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-rx-red animate-pulse" />
            크로스피터를 위한 올인원 허브
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-3">
            RX <span className="text-rx-red">HUB</span>
          </h1>
          <p className="text-rx-muted text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            크로스피터를 위한 모든 도구
          </p>
          <p className="text-rx-muted/70 text-sm mt-2 max-w-sm mx-auto">
            1RM 계산기 · WOD 타이머 · WOD 아카이브 · 드랍인 지도 · 커뮤니티
          </p>
        </section>

        {/* Feature Cards */}
        <section className="px-4 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {features.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group bg-rx-card border border-rx-border rounded-2xl p-4 hover:border-rx-red/50 hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bgColor} flex items-center justify-center mb-3 ${f.iconColor} group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-black text-white text-sm mb-0.5">{f.title}</h3>
                <p className="text-rx-muted text-xs leading-snug">{f.subtitle}</p>
              </Link>
            ))}
          </div>

          {/* Feature descriptions - desktop only */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 mt-6">
            {features.slice(0, 3).map((f) => (
              <Link
                key={f.href + '-desc'}
                href={f.href}
                className="bg-rx-surface border border-rx-border rounded-xl p-5 hover:border-rx-red/40 transition-colors"
              >
                <div className={`${f.iconColor} mb-2`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-white mb-1">{f.title}</h3>
                <p className="text-rx-muted text-sm leading-relaxed">{f.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 max-w-5xl mx-auto mt-10">
          <div className="grid grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="bg-rx-surface border border-rx-border rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-rx-red">{s.value}</div>
                <div className="text-rx-muted text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 max-w-5xl mx-auto mt-10">
          <div className="bg-gradient-to-br from-rx-red/20 to-rx-orange/10 border border-rx-red/30 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-black text-white mb-2">오늘의 WOD를 기록하세요</h2>
            <p className="text-rx-muted text-sm mb-4">WOD 아카이브에서 오늘 할 운동을 찾고, 타이머로 기록을 측정해보세요.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/wod" className="btn-primary text-sm px-5 py-2.5">
                WOD 보기
              </Link>
              <Link href="/timer" className="btn-secondary text-sm px-5 py-2.5">
                타이머 시작
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MobileNav />
    </div>
  )
}
