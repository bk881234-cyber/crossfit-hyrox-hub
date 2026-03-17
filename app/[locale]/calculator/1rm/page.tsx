import type { Metadata } from 'next'
import StrengthHubClient from '@/components/calculator/StrengthHubClient'

export const metadata: Metadata = {
  title: '1RM Strength Hub — 나의 최대 중량 추적',
  description:
    '데드리프트, 백 스쿼트, 벤치프레스 등 7가지 리프트의 1RM 기록을 추적하고 6개월 성장 차트를 확인하세요.',
  openGraph: {
    title: 'FITTERS STUDIO — 1RM Strength Hub',
    description:
      '나의 데드리프트, 백 스쿼트, 벤치프레스 PR을 추적하는 강력한 강도 허브. 6개월 트렌드 차트와 소셜 공유 기능 포함.',
    url: 'https://www.fittersstudio.com/calculator/1rm',
    siteName: 'FITTERS STUDIO',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FITTERS STUDIO — 1RM Strength Hub',
    description: '나의 1RM을 추적하고 강해지세요',
  },
  alternates: {
    canonical: 'https://www.fittersstudio.com/calculator/1rm',
  },
}

export default function StrengthHubPage() {
  return <StrengthHubClient />
}
