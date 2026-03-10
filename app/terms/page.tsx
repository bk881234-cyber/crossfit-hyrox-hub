import Link from 'next/link'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'

export const metadata = {
  title: '이용약관 | FITTERS STUDIO',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10 px-4 max-w-3xl mx-auto">
        <div className="mt-8 mb-8">
          <h1 className="text-3xl font-black text-white mb-2">이용약관</h1>
          <p className="text-rx-muted text-sm">최종 수정일: 2026년 3월 10일</p>
        </div>

        <div className="space-y-8 text-white/80 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-bold text-lg mb-3">제1조 (목적)</h2>
            <p>
              본 약관은 Fitters Studio(이하 &quot;회사&quot;)가 운영하는 FITTERS STUDIO 웹사이트(이하 &quot;서비스&quot;)의 이용과 관련하여
              회사와 이용자 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">제2조 (서비스 내용)</h2>
            <p className="mb-2">FITTERS STUDIO는 크로스핏 및 HYROX 커뮤니티를 위한 다음 도구와 정보를 제공합니다:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70">
              <li>1RM 계산기 (Epley 공식 기반 최대 중량 산출)</li>
              <li>WOD 타이머 (AMRAP, EMOM, Tabata, For Time, Interval)</li>
              <li>WOD 라이브러리 (Girl, Hero, CrossFit Open WOD 정보)</li>
              <li>크로스핏 박스 드랍인 정보 지도</li>
              <li>커뮤니티 게시판 및 대회 정보</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">제3조 (이용자의 의무)</h2>
            <p className="mb-2">이용자는 다음 행위를 해서는 안 됩니다:</p>
            <ul className="list-disc list-inside space-y-1 text-white/70">
              <li>타인의 정보를 도용하거나 허위 정보를 입력하는 행위</li>
              <li>서비스를 통해 얻은 정보를 무단으로 복제·배포·상업적으로 이용하는 행위</li>
              <li>회사의 서비스 운영을 방해하는 행위</li>
              <li>관련 법령에 위반되는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">제4조 (면책 조항)</h2>
            <p className="mb-2">
              본 서비스에서 제공하는 1RM 계산기, WOD 정보, 운동 가이드 등은 참고 목적으로만 제공됩니다.
              개인의 신체 조건 및 건강 상태에 따라 결과가 다를 수 있으며, 운동 전 전문가와 상담을 권장합니다.
            </p>
            <p>
              회사는 제공된 정보의 정확성·완전성을 보증하지 않으며, 이용자가 서비스를 통해 얻은 정보를 바탕으로
              한 행위로 인한 손해에 대해 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">제5조 (서비스 변경 및 중단)</h2>
            <p>
              회사는 운영상·기술상 필요에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있으며,
              이에 대해 이용자에게 별도의 보상을 하지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">제6조 (광고 및 제휴)</h2>
            <p>
              서비스 내에는 Google AdSense 광고 및 제휴 링크가 포함될 수 있습니다.
              광고 및 제휴 링크를 통한 거래는 이용자와 해당 업체 간의 거래이며,
              회사는 이에 대한 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">제7조 (준거법 및 관할)</h2>
            <p>
              본 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련한 분쟁은 대한민국 법원을 관할 법원으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-white font-bold text-lg mb-3">제8조 (문의)</h2>
            <p>
              이용약관에 관한 문의는 아래 이메일로 연락해 주시기 바랍니다.<br />
              이메일: bkbk881234@gmail.com
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
