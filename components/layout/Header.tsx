'use client'
import Image from 'next/image'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const navItems = [
  { href: '/calculator', labelKey: 'calculator' },
  { href: '/timer', labelKey: 'timer' },
  { href: '/wod', labelKey: 'wod' },
  { href: '/community', labelKey: 'community' },
  { href: '/about', labelKey: 'about' },
  { href: '/map', labelKey: 'map' },
] as const

export default function Header() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const tNav = useTranslations('nav')
  const tAuth = useTranslations('auth')

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  const supabase = useMemo(() => createClient(), [])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auth state listener
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setAuthLoading(false)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLocaleSwitch = useCallback(() => {
    const newLocale = locale === 'ko' ? 'en' : 'ko'
    router.replace(pathname, { locale: newLocale })
  }, [locale, pathname, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserMenuOpen(false)
    router.refresh()
  }

  const avatarUrl = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? ''

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-4 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0a0a] border-b border-white/10 shadow-lg'
            : 'bg-[#0a0a0a] border-b border-transparent'
        }`}
      >
        {/* Logo */}
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
            const isActive = pathname === item.href || (item.href === '/wod' && pathname.startsWith('/wod'))
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
                {isActive
                  ? <span className="gradient-text">{tNav(item.labelKey)}</span>
                  : tNav(item.labelKey)
                }
              </Link>
            )
          })}
        </nav>

        {/* Right side: language toggle + auth */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Language toggle */}
          <button
            onClick={handleLocaleSwitch}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold border border-rx-border text-rx-muted hover:text-white hover:border-white/30 transition-colors"
            title={locale === 'ko' ? 'Switch to English' : '한국어로 변경'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className={locale === 'ko' ? 'text-white' : 'text-rx-muted'}>KO</span>
            <span className="text-rx-border">/</span>
            <span className={locale === 'en' ? 'text-white' : 'text-rx-muted'}>EN</span>
          </button>

          {/* Auth area — desktop */}
          {!authLoading && (
            <div className="hidden md:block relative">
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={displayName} width={28} height={28} className="w-7 h-7 rounded-full object-cover" unoptimized />
                    ) : (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white"
                        style={{ background: 'linear-gradient(135deg, #E8321A, #FF2D8B)' }}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-white text-xs font-bold max-w-[80px] truncate">{displayName}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rx-muted">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 z-40 w-40 bg-rx-surface border border-rx-border rounded-xl shadow-xl overflow-hidden">
                        <Link
                          href="/community"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-white hover:bg-white/5 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                          </svg>
                          {tAuth('mypage')}
                        </Link>
                        <hr className="border-rx-border" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rx-muted hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                          </svg>
                          {tAuth('logout')}
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-lg text-xs font-black text-white transition-all duration-200 hover:opacity-90 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #E8321A, #FF2D8B)' }}
                >
                  {tAuth('login')}
                </Link>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
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

        {/* Mobile auth area */}
        <div className="px-4 py-3 border-b border-rx-border">
          {!authLoading && (user ? (
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={displayName} width={36} height={36} className="w-9 h-9 rounded-full object-cover flex-shrink-0" unoptimized />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #E8321A, #FF2D8B)' }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">{displayName}</p>
                <button
                  onClick={handleLogout}
                  className="text-rx-muted text-xs hover:text-white transition-colors"
                >
                  {tAuth('logout')}
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center w-full py-2.5 rounded-xl font-black text-sm text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #E8321A, #FF2D8B)' }}
            >
              {tAuth('login')}
            </Link>
          ))}
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
                {isActive ? <span className="gradient-text font-bold">{tNav(item.labelKey)}</span> : tNav(item.labelKey)}
              </Link>
            )
          })}
        </nav>

        {/* Language toggle in drawer */}
        <div className="px-4 mt-2">
          <button
            onClick={() => { handleLocaleSwitch(); setMenuOpen(false) }}
            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-bold border border-rx-border text-rx-muted hover:text-white hover:border-white/30 transition-colors w-full"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {locale === 'ko' ? '🇺🇸 Switch to English' : '🇰🇷 한국어로 변경'}
          </button>
        </div>
      </div>
    </>
  )
}
