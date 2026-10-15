// 도구 페이지(계산기·타이머·PR 기록) 아래에 붙는 설명 섹션.
// 서버에서 그대로 렌더링되어 검색엔진이 페이지의 목적과 사용법을 읽을 수 있다.
export interface GuideBlock {
  heading: string
  paragraphs?: string[]
  items?: string[]
}

export default function GuideSection({ title, blocks }: { title: string; blocks: GuideBlock[] }) {
  return (
    <section className="px-4 max-w-[992px] mx-auto pb-24 md:pb-12 pt-4">
      <h2 className="text-2xl font-black text-white mb-6">{title}</h2>
      <div className="space-y-8">
        {blocks.map((b) => (
          <div key={b.heading}>
            <h3 className="text-lg font-bold text-white mb-2">{b.heading}</h3>
            {b.paragraphs?.map((p, i) => (
              <p key={i} className="text-white/70 text-base leading-relaxed mb-2">{p}</p>
            ))}
            {b.items && (
              <ul className="list-disc list-inside space-y-1 text-white/70 text-base leading-relaxed">
                {b.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
