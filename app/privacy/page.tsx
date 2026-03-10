import Link from 'next/link'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'

export const metadata = {
  title: '개인정보 처리방침 | FITTERS STUDIO',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-3xl mx-auto">
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-black text-white mb-2">개인정보 처리방침</h1>
          <p className="text-rx-muted text-sm">최종 수정일: 2026년 3월 10일</p>
        </div>

        <div className="space-y-8 text-white/80 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. 개인정보의 처리 목적</h2>
            <p>
              FITTERS STUDIO는 별도의 회원가입 없이 이용 가능한 서비스입니다. 현재 수집하는 개인정보는 없으나,
              서비스 개선을 위해 Google Analytics 및 Google AdSense를 통한 익명 통계 데이터가 수집될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. 수집하는 정보</h2>
            <p className="mb-2">서비스 이용 과정에서 아래 정보가 자동으로 수집될 수 있습니다:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70">
              <li>IP 주소 (서비스 보안 및 통계 목적)</li>
              <li>브라우저 종류 및 버전</li>
              <li>방문한 페이지 및 체류 시간 (Google Analytics)</li>
              <li>광고 상호작용 데이터 (Google AdSense)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. 로컬 저장소 사용</h2>
            <p>
              WOD 기록 기능은 사용자의 기기 로컬 저장소(localStorage)에 데이터를 저장합니다.
              이 데이터는 서버로 전송되지 않으며, 사용자가 직접 브라우저에서 삭제할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. 쿠키(Cookie) 사용</h2>
            <p className="mb-2">
              Google AdSense 및 Google Analytics는 쿠키를 사용합니다. 쿠키를 통해 수집된 정보는
              광고 맞춤화 및 서비스 분석에 활용됩니다.
            </p>
            <p>
              브라우저 설정을 통해 쿠키 수집을 거부할 수 있으나, 일부 서비스 기능이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">5. 제3자 서비스</h2>
            <p className="mb-2">본 서비스는 다음 제3자 서비스를 사용합니다:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70">
              <li>Google Analytics - 방문자 통계 분석</li>
              <li>Google AdSense - 광고 서비스</li>
            </ul>
            <p className="mt-2">
              각 서비스의 개인정보 처리방침은 해당 서비스 제공자의 정책을 따릅니다.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">6. 개인정보 보유 기간</h2>
            <p>
              수집된 익명 통계 데이터는 서비스 분석 목적으로 최대 26개월간 보관됩니다.
              로컬 저장소 데이터는 사용자가 직접 삭제하기 전까지 기기에 보관됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">7. 이용자의 권리</h2>
            <p className="mb-2">이용자는 다음 권리를 행사할 수 있습니다:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70">
              <li>개인정보 수집·이용에 대한 동의 철회</li>
              <li>개인정보 처리 정지 요구</li>
              <li>개인정보 삭제 요구</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">8. 개인정보 보호 책임자</h2>
            <p>
              개인정보 처리에 관한 문의, 불만 처리, 피해구제 등에 관한 사항은 아래로 연락해 주십시오.<br /><br />
              담당자: 임병권<br />
              이메일: bkbk881234@gmail.com
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">9. 개인정보 처리방침 변경</h2>
            <p>
              본 개인정보 처리방침은 관련 법령 및 회사 정책에 따라 변경될 수 있습니다.
              변경 사항은 서비스 내 공지사항을 통해 안내됩니다.
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-rx-border">
          <Link href="/" className="text-rx-muted text-sm hover:text-white transition-colors">← 홈으로 돌아가기</Link>
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
