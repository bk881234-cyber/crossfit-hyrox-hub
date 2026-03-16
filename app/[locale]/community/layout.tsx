import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '크로스핏 대회·HYROX 일정 커뮤니티 — FITTERS STUDIO',
  description:
    '2025 HYROX Korea 서울·부산·인천 대회 일정, 팀오브포·마키아·배틀크루·크로스핏 코리아 오픈 등 국내 크로스핏 대회 정보를 한곳에서 확인하세요. 대회 직접 등록 가능.',
  keywords: [
    '크로스핏 대회',
    'HYROX 2025',
    '하이록스 한국',
    '크로스핏 대회 일정',
    '팀오브포',
    '마키아',
    '배틀크루',
    '크로스핏 코리아 오픈',
    '국내 크로스핏 대회',
  ],
  alternates: {
    canonical: 'https://www.fittersstudio.com/community',
    languages: {
      ko: 'https://www.fittersstudio.com/ko/community',
      en: 'https://www.fittersstudio.com/en/community',
    },
  },
  openGraph: {
    title: '크로스핏·HYROX 대회 일정 & 커뮤니티 | FITTERS STUDIO',
    description: '2025 HYROX Korea 및 국내 크로스핏 대회 일정을 한 곳에서. 대회 직접 등록 가능.',
    url: 'https://www.fittersstudio.com/community',
    images: [{ url: '/OG_img.png', width: 1200, height: 630 }],
  },
}

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: '2025 HYROX Korea & 크로스핏 대회 일정 — FITTERS STUDIO',
            description: 'HYROX Korea 서울·부산·인천 일정 및 국내 크로스핏 주요 대회 정보.',
            url: 'https://www.fittersstudio.com/community',
            organizer: {
              '@type': 'Organization',
              name: 'Fitters Studio',
              url: 'https://www.fittersstudio.com',
            },
          }),
        }}
      />
      {children}
    </>
  )
}
