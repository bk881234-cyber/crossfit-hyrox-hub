import { getTranslations } from 'next-intl/server'
import { Link } from '@/navigation'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'termsPage' })
  return { title: t('pageTitle') }
}

export default async function TermsPage() {
  const t = await getTranslations('termsPage')

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-[992px] mx-auto">
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-black text-white mb-2">{t('title')}</h1>
          <p className="text-rx-muted text-sm">{t('lastModified')}</p>
        </div>

        <div className="space-y-8 text-white/80 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">{t('s1Title')}</h2>
            <p>{t('s1Desc')}</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">{t('s2Title')}</h2>
            <p className="mb-2">{t('s2Intro')}</p>
            <ul className="list-disc list-inside space-y-1 text-white/70">
              <li>{t('s2Li1')}</li>
              <li>{t('s2Li2')}</li>
              <li>{t('s2Li3')}</li>
              <li>{t('s2Li4')}</li>
              <li>{t('s2Li5')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">{t('s3Title')}</h2>
            <p className="mb-2">{t('s3Intro')}</p>
            <ul className="list-disc list-inside space-y-1 text-white/70">
              <li>{t('s3Li1')}</li>
              <li>{t('s3Li2')}</li>
              <li>{t('s3Li3')}</li>
              <li>{t('s3Li4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">{t('s4Title')}</h2>
            <p className="mb-2">{t('s4Desc1')}</p>
            <p>{t('s4Desc2')}</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">{t('s5Title')}</h2>
            <p>{t('s5Desc')}</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">{t('s6Title')}</h2>
            <p>{t('s6Desc')}</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">{t('s7Title')}</h2>
            <p>{t('s7Desc')}</p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">{t('s8Title')}</h2>
            <p>
              {t('s8Desc')}<br />
              {t('s8Email')}
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-rx-border">
          <Link href="/" className="text-rx-muted text-sm hover:text-white transition-colors">{t('backToHome')}</Link>
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
