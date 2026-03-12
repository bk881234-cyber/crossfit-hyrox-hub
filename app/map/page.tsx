'use client'
import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { BOXES, type CrossFitBox } from '@/lib/box-data'

declare global {
  interface Window { kakao: any }
}

// 데이터에 존재하는 도시만 동적으로 추출
const ALL_CITIES = ['전체', ...Array.from(new Set(BOXES.map((b) => b.city))).sort()]

const FEATURE_OPTIONS = ['주차가능', '샤워실', '에어컨', '와이파이', '보충제판매', '개인락커']

interface UserBox {
  id: string
  name: string
  city: string
  district: string
  address: string
  dropinFee: string
  phone: string
  website: string
  features: string[]
  isUserAdded: true
}

type AnyBox = CrossFitBox | UserBox

const emptyForm = {
  name: '', city: '', district: '', address: '',
  dropinFee: '', phone: '', website: '',
  contactName: '', contactEmail: '',
  features: [] as string[],
}

export default function MapPage() {
  const [selectedCity, setSelectedCity] = useState('전체')
  const [search, setSearch] = useState('')
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [locating, setLocating] = useState(false)

  // 사용자 추가 박스
  const [userBoxes, setUserBoxes] = useState<UserBox[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [addSubmitted, setAddSubmitted] = useState(false)

  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const infoWindowRef = useRef<any>(null)

  // 전체 박스 목록 (사용자 추가 먼저)
  const allBoxes: AnyBox[] = [...userBoxes, ...BOXES]

  // 도시 목록: 사용자 추가 박스 도시도 포함
  const cities = useMemo(() => {
    const userCities = userBoxes.map((b) => b.city)
    const merged = Array.from(new Set([...ALL_CITIES.slice(1), ...userCities])).sort()
    return ['전체', ...merged]
  }, [userBoxes])

  const filtered = useMemo(() => {
    return allBoxes.filter((box) => {
      const matchCity = selectedCity === '전체' || box.city === selectedCity
      const matchSearch = search === '' ||
        box.name.toLowerCase().includes(search.toLowerCase()) ||
        box.address.includes(search) ||
        box.district.includes(search)
      return matchCity && matchSearch
    })
  }, [allBoxes, selectedCity, search])

  // ── 카카오 지도 초기화 ────────────────────────────────────────────────────
  const createMap = useCallback(() => {
    if (!mapContainerRef.current || mapRef.current) return
    try {
      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center: new window.kakao.maps.LatLng(36.5, 127.8),
        level: 13,
      })
      mapRef.current = map
      const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 })
      infoWindowRef.current = infowindow
      BOXES.forEach((box) => addMarker(map, box, infowindow))
      setMapLoaded(true)
    } catch {
      setMapError(true)
    }
  }, [])

  // 카카오 지도 SDK 동적 로드
  useEffect(() => {
    if (window.kakao?.maps) {
      window.kakao.maps.load(createMap)
      return
    }
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`
    script.async = true
    script.onload = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(createMap)
      } else {
        setMapError(true)
      }
    }
    script.onerror = () => setMapError(true)
    document.head.appendChild(script)
  }, [createMap])

  const addMarker = (map: any, box: CrossFitBox, infowindow: any) => {
    const position = new window.kakao.maps.LatLng(box.lat, box.lng)
    const marker = new window.kakao.maps.Marker({ map, position })
    const content = `
      <div style="padding:10px 14px;min-width:190px;background:#1A1A1A;border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#fff;font-family:sans-serif;">
        <div style="font-weight:900;font-size:14px;margin-bottom:6px;">${box.name}</div>
        <div style="color:#999;font-size:12px;margin-bottom:4px;">📍 ${box.address}</div>
        <div style="color:#999;font-size:11px;">드랍인·연락처는 방문 전 직접 확인하세요</div>
      </div>`
    window.kakao.maps.event.addListener(marker, 'click', () => {
      infowindow.setContent(content)
      infowindow.open(map, marker)
    })
  }

  const handleFindNearby = () => {
    if (!mapRef.current || !window.kakao) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = new window.kakao.maps.LatLng(coords.latitude, coords.longitude)
        mapRef.current.setCenter(pos)
        mapRef.current.setLevel(8)
        const marker = new window.kakao.maps.Marker({ map: mapRef.current, position: pos })
        const iw = new window.kakao.maps.InfoWindow({
          content: '<div style="padding:6px 10px;background:#1A1A1A;border:1px solid rgba(232,50,26,0.4);border-radius:6px;color:#E8321A;font-weight:700;font-size:12px;">📍 내 위치</div>',
          zIndex: 2,
        })
        iw.open(mapRef.current, marker)
        setLocating(false)
      },
      () => {
        alert('위치 권한이 필요합니다.')
        setLocating(false)
      }
    )
  }

  // ── 박스 등록 제출 ────────────────────────────────────────────────────────
  const toggleFeature = (f: string) => {
    setForm(p => ({
      ...p,
      features: p.features.includes(f) ? p.features.filter(x => x !== f) : [...p.features, f],
    }))
  }

  const handleAddSubmit = () => {
    setFormError('')
    if (!form.name.trim()) { setFormError('박스명을 입력해주세요.'); return }
    if (!form.city.trim()) { setFormError('지역(시)을 입력해주세요.'); return }
    if (!form.address.trim()) { setFormError('주소를 입력해주세요.'); return }
    if (!form.contactName.trim() || !form.contactEmail.trim()) {
      setFormError('신청자 이름과 이메일을 입력해주세요.'); return
    }

    const newBox: UserBox = {
      id: `user-${Date.now()}`,
      name: form.name.trim(),
      city: form.city.trim(),
      district: form.district.trim(),
      address: form.address.trim(),
      dropinFee: form.dropinFee.trim() || '문의',
      phone: form.phone.trim() || '-',
      website: form.website.trim(),
      features: form.features,
      isUserAdded: true,
    }
    setUserBoxes(prev => [newBox, ...prev])
    setAddSubmitted(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setForm(emptyForm)
    setFormError('')
    setAddSubmitted(false)
  }

  return (
    <div className="min-h-screen bg-rx-bg">
      <Header />
      <main className="pt-20 pb-24 md:pb-10">

        {/* 카카오 지도 */}
        {!mapError && (
          <div className="relative w-full" style={{ height: '400px' }}>
            <div ref={mapContainerRef} className="w-full h-full" id="kakao-map" />
            {!mapLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-rx-surface">
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'linear-gradient(#333 1px,transparent 1px),linear-gradient(90deg,#333 1px,transparent 1px)',
                  backgroundSize: '40px 40px',
                }} />
                <svg className="text-rx-muted relative z-10 animate-pulse" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <p className="text-rx-muted text-sm relative z-10 mt-2">지도 로딩 중...</p>
              </div>
            )}
            <button
              onClick={handleFindNearby}
              disabled={!mapLoaded || locating}
              className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rx-bg/90 backdrop-blur-md border border-white/20 text-white text-sm font-bold hover:border-rx-red/60 transition-all disabled:opacity-50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {locating ? '위치 확인 중...' : '내 주변 박스 찾기'}
            </button>
          </div>
        )}

        <div className="px-4 max-w-5xl mx-auto mt-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="section-title">드랍인 지도</h1>
              <p className="section-sub">전국 크로스핏 박스 · 드랍인 요금 · 편의시설 안내</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl btn-primary text-sm mt-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              박스 등록하기
            </button>
          </div>

          {/* 검색 */}
          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-rx-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="박스 이름, 지역, 주소 검색..."
              className="input pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* 도시 필터 — 데이터 기반 자동 생성 */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            {cities.map((city) => (
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

          {/* 박스 목록 — 단일 리스트 */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((box) => (
                'isUserAdded' in box
                  ? <UserBoxCard key={box.id} box={box} />
                  : <BoxCard key={box.id} box={box} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-rx-muted text-4xl mb-3">🗺️</p>
              <p className="text-white font-bold mb-1">검색 결과가 없습니다</p>
              <p className="text-rx-muted text-sm">다른 지역이나 검색어를 사용해보세요</p>
            </div>
          )}
        </div>
      </main>

      {/* ── 박스 등록 모달 ──────────────────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-rx-surface border border-rx-border rounded-t-2xl md:rounded-2xl p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-white text-xl">박스 등록하기</h2>
              <button onClick={closeModal} className="text-rx-muted hover:text-white p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {addSubmitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🏋️</div>
                <h3 className="font-black text-white text-xl mb-2">등록 완료!</h3>
                <p className="text-rx-muted text-sm mb-1">박스가 목록에 추가되었습니다.</p>
                <p className="text-rx-muted text-sm mb-6">검토 후 정식 등록됩니다.</p>
                <button onClick={closeModal} className="btn-primary px-8">확인</button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 신청자 정보 */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">신청자 이름 *</label>
                    <input type="text" className="input" placeholder="홍길동"
                      value={form.contactName} onChange={e => setForm(p => ({ ...p, contactName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">이메일 *</label>
                    <input type="email" className="input" placeholder="example@email.com"
                      value={form.contactEmail} onChange={e => setForm(p => ({ ...p, contactEmail: e.target.value }))} />
                  </div>
                </div>

                <hr className="border-rx-border" />

                {/* 박스 정보 */}
                <div>
                  <label className="text-rx-muted text-sm block mb-1">박스명 *</label>
                  <input type="text" className="input" placeholder="CrossFit OOO"
                    value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">지역(시) *</label>
                    <input type="text" className="input" placeholder="서울, 부산..."
                      value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">구/동</label>
                    <input type="text" className="input" placeholder="강남구"
                      value={form.district} onChange={e => setForm(p => ({ ...p, district: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">주소 *</label>
                  <input type="text" className="input" placeholder="서울특별시 강남구 테헤란로 123"
                    value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">드랍인 비용</label>
                    <input type="text" className="input" placeholder="20,000원"
                      value={form.dropinFee} onChange={e => setForm(p => ({ ...p, dropinFee: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">전화번호</label>
                    <input type="tel" className="input" placeholder="02-000-0000"
                      value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">웹사이트 / SNS</label>
                  <input type="url" className="input" placeholder="https://..."
                    value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
                </div>

                {/* 편의시설 */}
                <div>
                  <label className="text-rx-muted text-sm block mb-2">편의시설</label>
                  <div className="flex flex-wrap gap-2">
                    {FEATURE_OPTIONS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFeature(f)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                          form.features.includes(f)
                            ? 'bg-rx-red text-white'
                            : 'bg-rx-card border border-rx-border text-rx-muted hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {formError && <p className="text-rx-red text-sm font-bold">{formError}</p>}

                <div className="flex gap-3 pt-2">
                  <button onClick={closeModal} className="flex-1 btn-secondary text-sm py-3">취소</button>
                  <button onClick={handleAddSubmit} className="flex-1 btn-primary text-sm py-3">등록하기</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <MobileNav />
    </div>
  )
}

// ── 기존 박스 카드 ───────────────────────────────────────────────────────────
function BoxCard({ box }: { box: CrossFitBox }) {
  const hasPhone = box.phone !== '문의'
  return (
    <div className="card hover:border-rx-red/40 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-black text-white mb-0.5">{box.name}</h3>
          <p className="text-rx-muted text-xs">{box.city} · {box.district}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-rx-muted text-xs mb-0.5">드랍인</p>
          <p className={`font-black text-sm ${box.dropinFee === '문의' ? 'text-rx-muted' : 'text-rx-red'}`}>
            {box.dropinFee}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2 mb-2">
        <svg className="text-rx-muted flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
        <p className="text-rx-muted text-xs leading-snug">{box.address}</p>
      </div>

      {/* 정보 확인 안내 */}
      <p className="text-xs text-rx-muted/60 mb-3 pl-4">방문 전 인스타그램 또는 전화로 확인하세요</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {box.features.map((f) => (
          <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-rx-surface border border-rx-border text-rx-muted">{f}</span>
        ))}
      </div>

      <div className="flex gap-2 pt-3 border-t border-rx-border">
        {hasPhone ? (
          <a href={`tel:${box.phone}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red text-xs font-bold transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.11 6.11l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            전화
          </a>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted/50 text-xs font-bold cursor-default">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.11 6.11l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            번호 문의
          </span>
        )}
        {box.website && (
          <a href={box.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red text-xs font-bold transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            웹사이트
          </a>
        )}
        <a href={`https://map.kakao.com/link/search/${encodeURIComponent(box.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red text-xs font-bold transition-colors ml-auto">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          길찾기
        </a>
      </div>
    </div>
  )
}

// ── 사용자 등록 박스 카드 ────────────────────────────────────────────────────
function UserBoxCard({ box }: { box: UserBox }) {
  return (
    <div className="card border-rx-orange/30 hover:border-rx-red/40 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-black text-white">{box.name}</h3>
            <span className="badge bg-rx-orange/20 text-rx-orange border border-rx-orange/30 text-xs">신규</span>
          </div>
          <p className="text-rx-muted text-xs">{box.city}{box.district ? ` · ${box.district}` : ''}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-rx-muted text-xs mb-0.5">드랍인</p>
          <p className="text-rx-red font-black text-sm">{box.dropinFee}</p>
        </div>
      </div>
      <div className="flex items-start gap-2 mb-3">
        <svg className="text-rx-muted flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
        <p className="text-rx-muted text-xs leading-snug">{box.address}</p>
      </div>
      {box.features.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {box.features.map((f) => (
            <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-rx-surface border border-rx-border text-rx-muted">{f}</span>
          ))}
        </div>
      )}
      <div className="flex gap-2 pt-3 border-t border-rx-border">
        {box.phone !== '-' && (
          <a href={`tel:${box.phone}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red text-xs font-bold transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.11 6.11l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            전화
          </a>
        )}
        {box.website && (
          <a href={box.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red text-xs font-bold transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            웹사이트
          </a>
        )}
        <a href={`https://map.kakao.com/link/search/${encodeURIComponent(box.name)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red text-xs font-bold transition-colors ml-auto">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          길찾기
        </a>
      </div>
    </div>
  )
}
