'use client'
import { useState, useMemo } from 'react'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { BOXES } from '@/lib/box-data'

const CITIES = ['전체', '서울', '부산', '대구', '인천', '기타']

export default function MapPage() {
  const [selectedCity, setSelectedCity] = useState('전체')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return BOXES.filter((box) => {
      const matchCity = selectedCity === '전체' ||
        box.city === selectedCity ||
        (selectedCity === '기타' && !['서울', '부산', '대구', '인천'].includes(box.city))
      const matchSearch = search === '' ||
        box.name.toLowerCase().includes(search.toLowerCase()) ||
        box.address.includes(search) ||
        box.district.includes(search)
      return matchCity && matchSearch
    })
  }, [selectedCity, search])

  const sponsored = filtered.filter((b) => b.sponsored)
  const regular = filtered.filter((b) => !b.sponsored)

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10">
        {/* Map Placeholder */}
        <div className="w-full h-48 md:h-64 bg-rx-surface border-b border-rx-border flex flex-col items-center justify-center gap-3 relative overflow-hidden">
          {/* Fake map grid */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
          <svg className="text-rx-muted relative z-10" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div className="text-center relative z-10">
            <p className="text-white font-bold text-sm">구글 맵 API 연동 예정</p>
            <p className="text-rx-muted text-xs mt-1">박스 위치를 지도에서 확인할 수 있습니다</p>
          </div>
          <div className="flex gap-2 relative z-10">
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-rx-card border border-rx-border text-xs text-rx-muted">
              <span className="w-2 h-2 rounded-full bg-rx-red" />
              일반 박스
            </span>
            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-rx-card border border-rx-red/50 text-xs text-rx-muted">
              <span className="w-2 h-2 rounded-full bg-rx-orange" />
              스폰서 박스
            </span>
          </div>
        </div>

        <div className="px-4 max-w-5xl mx-auto mt-6">
          <h1 className="section-title">드랍인 지도</h1>
          <p className="section-sub">전국 크로스핏 박스 · 드랍인 요금 · 편의시설 안내</p>

          {/* Search */}
          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-rx-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="박스 이름, 지역, 주소 검색..."
              className="input pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* City Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {CITIES.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
                  selectedCity === city
                    ? 'bg-rx-red text-white'
                    : 'bg-rx-surface border border-rx-border text-rx-muted hover:text-white'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <p className="text-rx-muted text-sm mb-4">{filtered.length}개의 박스</p>

          {/* Sponsored Boxes */}
          {sponsored.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge bg-rx-red/20 text-rx-red border border-rx-red/30">SPONSORED</span>
                <span className="text-rx-muted text-xs">제휴 박스</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sponsored.map((box) => (
                  <BoxCard key={box.id} box={box} />
                ))}
              </div>
            </div>
          )}

          {/* Regular Boxes */}
          {regular.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regular.map((box) => (
                <BoxCard key={box.id} box={box} />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-rx-muted text-4xl mb-3">🗺️</p>
              <p className="text-white font-bold mb-1">검색 결과가 없습니다</p>
              <p className="text-rx-muted text-sm">다른 지역이나 검색어를 사용해보세요</p>
            </div>
          )}

          {/* Add Box CTA */}
          <div className="mt-8 p-5 bg-rx-surface border border-rx-border rounded-xl text-center">
            <p className="text-white font-bold mb-1">우리 박스를 등록하고 싶으신가요?</p>
            <p className="text-rx-muted text-sm mb-3">아래 버튼을 통해 박스 등록을 요청하세요.</p>
            <button className="btn-secondary text-sm">박스 등록 요청</button>
          </div>
        </div>
      </main>
      <MobileNav />
    </div>
  )
}

function BoxCard({ box }: { box: import('@/lib/box-data').CrossFitBox }) {
  return (
    <div className={`card ${box.sponsored ? 'border-rx-orange/40 bg-rx-orange/5' : ''} hover:border-rx-red/40 transition-all duration-200`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-white">{box.name}</h3>
            {box.sponsored && (
              <span className="badge bg-rx-red/20 text-rx-red border border-rx-red/30 text-[10px]">SPONSORED</span>
            )}
          </div>
          <p className="text-rx-muted text-xs">{box.city} · {box.district}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-rx-muted text-xs mb-0.5">드랍인</p>
          <p className="text-rx-red font-black text-sm">{box.dropinFee}</p>
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-3">
        <svg className="text-rx-muted flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <p className="text-rx-muted text-xs leading-snug">{box.address}</p>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1 mb-3">
        {box.features.map((f) => (
          <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-rx-surface border border-rx-border text-rx-muted">
            {f}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-rx-border">
        <a
          href={`tel:${box.phone}`}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red text-xs font-bold transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.11 6.11l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          전화
        </a>
        {box.website && (
          <a
            href={box.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red text-xs font-bold transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            웹사이트
          </a>
        )}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red text-xs font-bold transition-colors ml-auto">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          길찾기
        </button>
      </div>
    </div>
  )
}
