import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 빌드 시각: 미리 만든 페이지(서버)와 브라우저 첫 렌더가 같은 '오늘'을 쓰도록 양쪽 번들에 같은 값으로 들어간다.
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  // 커뮤니티 → 대회 일정으로 주소 변경. 이미 색인된 /community 주소는 영구 이동(308)으로 넘긴다.
  async redirects() {
    return [
      { source: '/:locale(ko|en)/community', destination: '/:locale/competitions', permanent: true },
      { source: '/:locale(ko|en)/community/:path*', destination: '/:locale/competitions/:path*', permanent: true },
      { source: '/community', destination: '/competitions', permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
      },
    ],
  },
}

export default withNextIntl(nextConfig)
