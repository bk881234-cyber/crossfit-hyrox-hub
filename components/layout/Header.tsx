'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navItems = [
  { href: '/calculator', label: '1RM 계산기' },
  { href: '/timer', label: 'WOD 타이머' },
  { href: '/wod', label: 'WOD 라이브러리' },
  { href: '/community', label: '커뮤니티' },
  { href: '/about', label: '크로스핏이란?' },
  { href: '/map', label: '드랍인 지도' },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState<'KO' | 'EN'>('KO')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-4 transition-all duration-400 relative ${
          scrolled
            ? 'bg-rx-bg/90 backdrop-blur-2xl border-b border-white/10 shadow-lg'
            : 'bg-rx-bg/60 backdrop-blur-md border-b border-transparent'
        }`}
      >
        {/* Logo — left */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/Fittersstudio_BI.png"
            alt="FITTERS STUDIO"
            height={44}
            width={176}
            className="h-11 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav — absolute center */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-white/10 font-bold'
                    : 'text-rx-muted hover:text-white hover:bg-rx-card'
                }`}
              >
                {isActive ? <span className="gradient-text">{item.label}</span> : item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setLang(lang === 'KO' ? 'EN' : 'KO')}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold border border-rx-border text-rx-muted hover:text-white hover:border-white/30 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {lang}
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 text-rx-muted hover:text-white"
            aria-label="메뉴 열기"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-rx-surface/95 backdrop-blur-xl border-l border-rx-border transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-20 border-b border-rx-border">
          <Image
            src="/Fittersstudio_BI.png"
            alt="FITTERS STUDIO"
            height={24}
            width={120}
            className="h-6 w-auto"
          />
          <button onClick={() => setMenuOpen(false)} className="p-2 text-rx-muted hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/5 border border-white/10' : 'text-rx-muted hover:text-white hover:bg-rx-card'
                }`}
              >
                {isActive ? <span className="gradient-text font-bold">{item.label}</span> : item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 mt-2">
          <button
            onClick={() => setLang(lang === 'KO' ? 'EN' : 'KO')}
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold border border-rx-border text-rx-muted hover:text-white hover:border-white/30 transition-colors w-full"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
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
