import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-rx-bg w-full overflow-hidden">
      
      {/* ── Marquee Section ── */}
      <div className="relative w-full overflow-hidden flex items-center py-2 border-y border-white/5 bg-rx-bg">
        <div className="flex whitespace-nowrap animate-marquee" style={{ width: 'max-content' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="relative flex items-center" style={{ marginRight: '100px', userSelect: 'none' }}>
              {/* Back Layer: Thick gradient stroke (Outside stroke effect) */}
              <span 
                className="font-heading font-black uppercase absolute left-0 top-0 w-full"
                style={{ 
                  background: 'linear-gradient(135deg, #E8321A, #FF2D8B)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  WebkitTextStroke: '2px transparent', // 2px center gives 1px outside stroke
                  fontSize: 'clamp(3rem, 9vw, 6rem)', 
                  lineHeight: 1, 
                  letterSpacing: '5px',
                  zIndex: 0,
                }}
              >
                FITTERS STUDIO
              </span>
              {/* Front Layer: Solid background color to hide inner half of the stroke */}
              <span 
                className="font-heading font-black uppercase relative"
                style={{ 
                  fontSize: 'clamp(3rem, 9vw, 6rem)', 
                  lineHeight: 1, 
                  letterSpacing: '5px',
                  zIndex: 1,
                  WebkitTextFillColor: '#0A0A0A',
                }}
              >
                FITTERS STUDIO
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Info Section ── */}
      <div className="px-6 py-4 max-w-6xl mx-auto flex flex-col items-center">
        <div className="flex flex-col md:flex-row md:items-start justify-between w-full gap-4 text-footer relative">
          
          <div className="flex flex-col gap-2">
            <p className="text-rx-muted leading-relaxed text-center md:text-left text-footer">
              상호명: Fitters Studio&nbsp;&nbsp;|&nbsp;&nbsp;대표자: 임병권&nbsp;&nbsp;|&nbsp;&nbsp;이메일: bkbk881234@gmail.com
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 flex-shrink-0">
              <Link href="/terms" className="text-rx-muted hover:text-white transition-colors text-footer">이용약관</Link>
              <Link href="/privacy" className="text-rx-muted hover:text-white transition-colors text-footer">개인정보 처리방침</Link>
            </div>
            {/* The red line from the reference image implies some vertical alignment. */}
          </div>
          
        </div>
        <div className="w-full h-px bg-white/5 my-4" />
        <p className="text-rx-muted/60 text-center w-full text-footer flex items-center justify-center">
          Copyright &copy; 2026 Fitters Studio. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
