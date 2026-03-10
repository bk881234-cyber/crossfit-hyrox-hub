import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-rx-bg" style={{ borderTop: '1px solid #333' }}>
      <div className="px-6 py-6 max-w-6xl mx-auto">
        {/* Main row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <p className="text-rx-muted leading-relaxed" style={{ fontSize: '16px' }}>
            상호명: Fitters Studio&nbsp;&nbsp;|&nbsp;&nbsp;대표자: 임병권&nbsp;&nbsp;|&nbsp;&nbsp;이메일: bkbk881234@gmail.com
          </p>
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link href="/terms" className="text-rx-muted hover:text-white transition-colors" style={{ fontSize: '16px' }}>이용약관</Link>
            <Link href="/privacy" className="text-rx-muted hover:text-white transition-colors" style={{ fontSize: '16px' }}>개인정보 처리방침</Link>
          </div>
        </div>
        {/* Copyright */}
        <p className="text-rx-muted text-center mt-4" style={{ fontSize: '14px' }}>
          Copyright © 2026 Fitters Studio. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
