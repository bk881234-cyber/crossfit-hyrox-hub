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
  { href: '/movements', labelKey: 'movements' },
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
  const tLang = useTranslations('lang')
  const tHeader = useTranslations('header')

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
        className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-4 transition-all duration-300 ${scrolled
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
                className={`whitespace-nowrap px-2.5 py-1.5 rounded-md text-sm font-medium transition-colors ${isActive
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

        {/* Right side: actions + auth + language */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Add Record Button */}
          <Link
            href="/wod/log"
            className="hidden md:flex px-4 py-1.5 rounded-lg text-xs font-black text-white gradient-bg hover:opacity-90 transition-opacity mr-1"
          >
            {tNav('addLog')}
          </Link>

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
                      <span className="text-white text-xs font-bold max-w-[80px] truncate">{displayName}</span>
                    )}
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 z-40 w-32 bg-rx-surface border border-rx-border rounded-xl shadow-xl overflow-hidden py-1">
                        <Link
                          href="/mypage"
                          onClick={() => setUserMenuOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm font-bold text-white hover:bg-white/5 transition-colors"
                        >
                          {tAuth('mypage')}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm font-bold text-rx-muted hover:text-white hover:bg-white/5 transition-colors"
                        >
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

          {/* Language toggle pill */}
          <div className="hidden md:flex items-center bg-rx-surface border border-rx-border rounded-full overflow-hidden">
            <button
              onClick={locale === 'en' ? handleLocaleSwitch : undefined}
              className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${locale === 'ko' ? 'gradient-bg text-white' : 'text-rx-muted hover:text-white'}`}
              title={tLang('switchToKo')}
            >KR</button>
            <button
              onClick={locale === 'ko' ? handleLocaleSwitch : undefined}
              className={`px-2.5 py-1 text-[11px] font-bold transition-colors ${locale === 'en' ? 'gradient-bg text-white' : 'text-rx-muted hover:text-white'}`}
              title={tLang('switchToEn')}
            >EN</button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 text-rx-muted hover:text-white text-xs font-black uppercase"
            aria-label={tHeader('menuAriaLabel')}
          >
            {tHeader('menu')}
          </button>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-rx-surface/95 backdrop-blur-xl border-l border-rx-border transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'
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
          <button onClick={() => setMenuOpen(false)} className="p-2 text-rx-muted hover:text-white font-black text-xs uppercase">
            {tHeader('close')}
          </button>
        </div>

        {/* Mobile auth area */}
        <div className="px-4 py-3 border-b border-rx-border">
          {!authLoading && (user ? (
            <div className="flex items-center gap-3">
              <Link href="/mypage" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 flex-1 min-w-0">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={displayName} width={36} height={36} className="w-9 h-9 rounded-full object-cover flex-shrink-0" unoptimized />
                ) : null}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-bold truncate">{displayName}</p>
                  <p className="text-rx-muted" style={{ fontSize: 12 }}>{tAuth('mypage')} →</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-rx-muted hover:text-white transition-colors p-1 flex-shrink-0 text-xs font-bold"
                title={tAuth('logout')}
              >
                {tAuth('logout')}
              </button>
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
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-white/5 border border-white/10' : 'text-rx-muted hover:text-white hover:bg-rx-card'
                  }`}
              >
                {isActive ? <span className="gradient-text font-bold">{tNav(item.labelKey)}</span> : tNav(item.labelKey)}
              </Link>
            )
          })}
        </nav>

        {/* Language toggle in drawer */}
        <div className="px-4 mt-2">
          <div className="flex items-center bg-rx-card border border-rx-border rounded-full overflow-hidden w-full">
            <button
              onClick={() => { if (locale === 'en') { handleLocaleSwitch(); setMenuOpen(false) } }}
              className={`flex-1 py-2.5 text-sm font-bold transition-colors ${locale === 'ko' ? 'gradient-bg text-white' : 'text-rx-muted hover:text-white'}`}
            >KR</button>
            <button
              onClick={() => { if (locale === 'ko') { handleLocaleSwitch(); setMenuOpen(false) } }}
              className={`flex-1 py-2.5 text-sm font-bold transition-colors ${locale === 'en' ? 'gradient-bg text-white' : 'text-rx-muted hover:text-white'}`}
            >EN</button>
          </div>
        </div>
      </div>
    </>
  )
}
