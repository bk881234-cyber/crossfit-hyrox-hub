// 카카오 로그인 완료 화면은 주소의 ?token·?next를 읽으므로 요청마다 렌더링한다.
export const dynamic = 'force-dynamic'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
