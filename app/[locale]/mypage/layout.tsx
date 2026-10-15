import type { Metadata } from 'next'

// 로그인·내 정보는 검색 결과에 나올 필요가 없는 화면이라 색인 제외(noindex).
// 기존에는 별도 메타데이터가 없어 홈페이지를 대표 주소로 가리키고 있었다.
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === 'en'
  return {
    title: isEn ? 'My Page | FITTERS STUDIO' : '내 정보 | FITTERS STUDIO',
    robots: { index: false, follow: false },
    alternates: { canonical: `https://www.fittersstudio.com/${locale}/mypage` },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
