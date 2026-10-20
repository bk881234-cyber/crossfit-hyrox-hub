// 도구 페이지(계산기·타이머·PR 기록) 아래에 붙는 설명 섹션.
// 서버에서 그대로 렌더링되어 검색엔진이 페이지의 목적과 사용법을 읽을 수 있다.
// 가로폭은 위쪽 도구 영역(max-w-[640px])과 같게 맞춘다.
export interface GuideBlock {
  heading: string
  paragraphs?: string[]
  items?: string[]
}

export default function GuideSection({ title, blocks, wide = false }: { title: string; blocks: GuideBlock[]; wide?: boolean }) {
  return (
    <section className={`px-4 ${wide ? 'max-w-[992px]' : 'max-w-[640px]'} mx-auto pb-28 md:pb-16 pt-2`}>
      <div className="flex items-center gap-3 mb-5">
        <span className="w-1 h-6 rounded-full bg-rx-red" aria-hidden="true" />
        <h2 className="text-xl font-black text-white">{title}</h2>
      </div>
      <div className="space-y-3">
        {blocks.map((b) => (
          <div key={b.heading} className="rounded-2xl bg-white/[0.03] border border-white/5 p-5">
            <h3 className="text-base font-bold text-white mb-2">{b.heading}</h3>
            {b.paragraphs?.map((p, i) => (
              <p key={i} className="text-white/65 text-sm leading-relaxed [&:not(:last-child)]:mb-2">{p}</p>
            ))}
            {b.items && (
              <ul className="space-y-1.5 mt-1">
                {b.items.map((it) => (
                  <li key={it} className="flex gap-2 text-white/65 text-sm leading-relaxed">
                    <span className="mt-2 w-1 h-1 rounded-full bg-rx-red flex-shrink-0" aria-hidden="true" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
