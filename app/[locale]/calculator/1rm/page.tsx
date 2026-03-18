import type { Metadata } from 'next'
import StrengthHubClient from '@/components/calculator/StrengthHubClient'

export const metadata: Metadata = {
  title: '나의 PR 기록하기 — 1RM 성장 추적',
  description:
    '나의 데드리프트, 백 스쿼트, 벤치프레스 등 PR을 기록하고 관리하며 성장과정을 공유하세요.',
  openGraph: {
    title: 'FITTERS STUDIO — 나의 PR 기록하기',
    description:
      '나의 PR을 기록하고 관리하며 성장과정을 공유하세요. 6개월 트렌드 차트와 소셜 공유 기능 포함.',
    url: 'https://www.fittersstudio.com/calculator/1rm',
    siteName: 'FITTERS STUDIO',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FITTERS STUDIO — 나의 PR 기록하기',
    description: '나의 PR을 기록하고 관리하며 성장과정을 공유하세요.',
  },
  alternates: {
    canonical: 'https://www.fittersstudio.com/calculator/1rm',
  },
}

export default function StrengthHubPage() {
  return <StrengthHubClient />
}
