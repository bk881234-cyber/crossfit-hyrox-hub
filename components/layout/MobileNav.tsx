'use client'
import { useTranslations } from 'next-intl'
import { usePathname } from '@/navigation'
import { Link } from '@/navigation'

const tabs = [
  {
    href: '/' as const,
    labelKey: 'home' as const,
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
        stroke={active ? '#E8321A' : 'currentColor'}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: '/timer' as const,
    labelKey: 'timer' as const,
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
        stroke={active ? '#E8321A' : 'currentColor'}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    href: '/wod' as const,
    labelKey: 'wod' as const,
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
        stroke={active ? '#E8321A' : 'currentColor'}>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <circle cx="3.5" cy="6" r="0.8" fill={active ? '#E8321A' : 'currentColor'} />
        <circle cx="3.5" cy="12" r="0.8" fill={active ? '#E8321A' : 'currentColor'} />
        <circle cx="3.5" cy="18" r="0.8" fill={active ? '#E8321A' : 'currentColor'} />
      </svg>
    ),
  },
  {
    href: '/map' as const,
    labelKey: 'map' as const,
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
        stroke={active ? '#E8321A' : 'currentColor'}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    href: '/community' as const,
    labelKey: 'community' as const,
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
        stroke={active ? '#E8321A' : 'currentColor'}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

export default function MobileNav() {
  const pathname = usePathname()
  const t = useTranslations('mobileNav')

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-rx-surface/95 backdrop-blur-xl border-t border-rx-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href === '/wod' && pathname.startsWith('/wod'))
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 py-3 min-h-[48px] gap-0.5 transition-colors ${
                isActive ? 'text-white' : 'text-rx-muted hover:text-white'
              }`}
            >
              {tab.icon(isActive)}
              <span className={`text-[10px] font-semibold ${isActive ? 'gradient-text' : ''}`}>{t(tab.labelKey)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
