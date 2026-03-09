'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/', label: '홈' },
  { href: '/calculator', label: '1RM 계산기' },
  { href: '/timer', label: 'WOD 타이머' },
  { href: '/wod', label: 'WOD 아카이브' },
  { href: '/map', label: '드랍인 지도' },
  { href: '/community', label: '커뮤니티' },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState<'KO' | 'EN'>('KO')

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-rx-bg/95 backdrop-blur-sm border-b border-rx-border flex items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-8 flex-shrink-0">
          <span className="text-xl font-black text-rx-red tracking-tight">RX HUB</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-rx-red bg-rx-red/10'
                    : 'text-rx-muted hover:text-white hover:bg-rx-card'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Lang Toggle */}
          <button
            onClick={() => setLang(lang === 'KO' ? 'EN' : 'KO')}
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold border border-rx-border text-rx-muted hover:text-white hover:border-rx-red transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {lang}
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 text-rx-muted hover:text-white"
            aria-label="메뉴 열기"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-rx-surface border-l border-rx-border transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-rx-border">
          <span className="text-lg font-black text-rx-red">RX HUB</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-rx-muted hover:text-white"
            aria-label="메뉴 닫기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer Nav */}
        <nav className="flex flex-col p-4 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-rx-red bg-rx-red/10'
                    : 'text-rx-muted hover:text-white hover:bg-rx-card'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Lang toggle in drawer */}
        <div className="px-4 mt-2">
          <button
            onClick={() => setLang(lang === 'KO' ? 'EN' : 'KO')}
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold border border-rx-border text-rx-muted hover:text-white hover:border-rx-red transition-colors w-full"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            언어 변경: {lang === 'KO' ? '한국어' : 'English'}
          </button>
        </div>
      </div>
    </>
  )
}
