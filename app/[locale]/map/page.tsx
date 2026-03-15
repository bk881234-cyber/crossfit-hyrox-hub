'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Script from 'next/script'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'

declare global {
  interface Window { kakao: any }
}

// kakao.maps.load()를 안전하게 호출하는 헬퍼
function loadKakaoMaps(callback: () => void) {
  if (!window.kakao?.maps) return
  window.kakao.maps.load(callback)
}

// ── 지역 데이터 (좌표 + 줌 레벨) ──────────────────────────────────────────
const REGIONS = [
  { id: 'all',  label: '전체',   lat: 36.5,    lng: 127.8,   level: 13 },
  { id: '서울',  label: '서울',   lat: 37.5665, lng: 126.9780, level: 9  },
  { id: '경기',  label: '경기',   lat: 37.4138, lng: 127.5183, level: 10 },
  { id: '인천',  label: '인천',   lat: 37.4563, lng: 126.7052, level: 10 },
  { id: '부산',  label: '부산',   lat: 35.1796, lng: 129.0756, level: 10 },
  { id: '대구',  label: '대구',   lat: 35.8714, lng: 128.6014, level: 10 },
  { id: '대전',  label: '대전',   lat: 36.3504, lng: 127.3845, level: 10 },
  { id: '광주',  label: '광주',   lat: 35.1595, lng: 126.8526, level: 10 },
  { id: '울산',  label: '울산',   lat: 35.5384, lng: 129.3114, level: 10 },
  { id: '제주',  label: '제주도', lat: 33.4996, lng: 126.5312, level: 10 },
]

// ── 추천 파트너 박스 (실제 데이터) ──────────────────────────────────────────
const SPONSOR_BOXES = [
  {
    id: 'ultimate-isu',
    name: '얼티밋 트레이닝 이수',
    tag: '파트너',
    address: '서울 동작구 동작대로13길 12 지하 1층',
    near: '이수역 7번 출구 · 사당역 10번 출구',
    phone: '02-525-2022',
    website: 'http://ultimatetraining.kr',
    instagram: '',
    features: ['크로스핏', '맞춤 코칭', '체성분 분석'],
    dropinFee: '문의',
  },
]

const FEATURE_OPTIONS = ['주차가능', '샤워실', '에어컨', '와이파이', '보충제판매', '개인락커']

const emptyForm = {
  name: '', city: '', district: '', address: '',
  dropinFee: '', phone: '', website: '',
  contactName: '', contactEmail: '',
  features: [] as string[],
}

// ── 인포 오버레이 DOM 생성 헬퍼 ──────────────────────────────────────────────
function buildOverlayEl(
  placeName: string,
  addressText: string,
  kakaoPlaceId: string,
  lat: string,
  lng: string,
  onClose: () => void,
): HTMLDivElement {
  const wrap = document.createElement('div')
  wrap.style.cssText = 'position:relative;'

  const dirUrl = `https://map.kakao.com/link/to/${encodeURIComponent(placeName)},${lat},${lng}`

  const bubble = document.createElement('div')
  bubble.style.cssText = [
    'background:#1A1A1A',
    'border:1px solid rgba(255,255,255,0.15)',
    'border-radius:12px',
    'padding:12px 14px 10px',
    'min-width:200px',
    'max-width:260px',
    'font-family:sans-serif',
    'box-shadow:0 4px 24px rgba(0,0,0,0.6)',
    'position:relative',
  ].join(';')

  bubble.innerHTML = `
    <button id="ov-close-btn" style="
      position:absolute;top:7px;right:8px;
      background:transparent;border:none;
      color:#666;font-size:18px;line-height:1;
      cursor:pointer;padding:2px 4px;
    ">×</button>
    <div style="font-weight:900;font-size:14px;color:#fff;margin-bottom:4px;padding-right:20px;line-height:1.3;">
      ${placeName}
    </div>
    <div style="color:#888;font-size:11px;margin-bottom:9px;line-height:1.4;">
      📍 ${addressText}
    </div>
    <a href="${dirUrl}" target="_blank" rel="noopener noreferrer" style="
      display:inline-flex;align-items:center;gap:4px;
      padding:5px 11px;border-radius:6px;
      background:rgba(232,50,26,0.12);
      border:1px solid rgba(232,50,26,0.4);
      color:#E8321A;font-size:11px;font-weight:700;
      text-decoration:none;
    ">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      길찾기
    </a>
  `

  // 꼬리
  const tail = document.createElement('div')
  tail.style.cssText = [
    'width:14px',
    'height:14px',
    'background:#1A1A1A',
    'border-right:1px solid rgba(255,255,255,0.15)',
    'border-bottom:1px solid rgba(255,255,255,0.15)',
    'transform:rotate(45deg)',
    'margin:-7px auto 0',
  ].join(';')

  wrap.appendChild(bubble)
  wrap.appendChild(tail)

  bubble.querySelector('#ov-close-btn')?.addEventListener('click', (e) => {
    e.stopPropagation()
    onClose()
  })

  return wrap
}

export default function MapPage() {
  const [selectedRegion, setSelectedRegion] = useState('서울')
  const [search, setSearch] = useState('')
  const [kakaoReady, setKakaoReady] = useState(false)  // SDK 준비 완료 플래그
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const [locating, setLocating] = useState(false)
  const [resultCount, setResultCount] = useState<number | null>(null)
  const [searchedBoxes, setSearchedBoxes] = useState<any[]>([])
  const [visibleBoxCount, setVisibleBoxCount] = useState<number>(8)
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [addSubmitted, setAddSubmitted] = useState(false)

  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const myLocationMarkerRef = useRef<any>(null)

  // 마커 + 오버레이 초기화
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m?.setMap(null))
    markersRef.current = []
    overlayRef.current?.setMap(null)
    overlayRef.current = null
  }, [])

  const closeOverlay = useCallback(() => {
    overlayRef.current?.setMap(null)
    overlayRef.current = null
  }, [])

  // 장소 검색 후 마커 생성
  const searchPlaces = useCallback((regionId: string, keyword?: string) => {
    if (!window.kakao?.maps?.services || !mapRef.current) return
    clearMarkers()

    const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0]

    // 1. 검색 키워드 강제 조합: 입력값 없으면 항상 "크로스핏" 포함 키워드 사용
    const q = keyword
      ? keyword
      : regionId === 'all'
        ? '크로스핏'
        : `${region.label} 크로스핏`

    const ps = new window.kakao.maps.services.Places()
    const accumulated: any[] = []

    // 전체 마커를 한 번에 지도에 렌더링 + 3. 프론트엔드 단어 필터링
    const renderAllMarkers = (places: any[]) => {
      const filtered = places.filter((place) => {
        const name = place.place_name ?? ''
        const category = place.category_name ?? ''
        return name.includes('크로스핏') || category.includes('크로스핏')
      })
      setResultCount(filtered.length)
      setSearchedBoxes(filtered)
      setVisibleBoxCount(8)
      filtered.forEach((place) => {
        const position = new window.kakao.maps.LatLng(place.y, place.x)
        const marker = new window.kakao.maps.Marker({ map: mapRef.current, position })
        window.kakao.maps.event.addListener(marker, 'click', () => {
          overlayRef.current?.setMap(null)
          const el = buildOverlayEl(
            place.place_name,
            place.road_address_name || place.address_name,
            place.id,
            place.y,
            place.x,
            closeOverlay,
          )
          const ov = new window.kakao.maps.CustomOverlay({ position, content: el, yAnchor: 1.12 })
          ov.setMap(mapRef.current)
          overlayRef.current = ov
        })
        markersRef.current.push(marker)
      })
    }

    // 2. 페이지네이션 끝까지 연속 호출: 모든 페이지 결과 누적 후 한 번에 렌더링
    const handleResult = (data: any[], status: string, pagination: any) => {
      if (status !== window.kakao.maps.services.Status.OK) {
        if (accumulated.length === 0) setResultCount(0)
        else renderAllMarkers(accumulated)
        return
      }
      accumulated.push(...data)
      if (pagination.hasNextPage) {
        pagination.nextPage()
      } else {
        renderAllMarkers(accumulated)
      }
    }

    // 카카오맵에는 체육시설 전용 category_group_code가 없으므로 옵션을 비우고 검색 (이후 프론트엔드 단편에서 필터링)
    ps.keywordSearch(q, handleResult)
  }, [clearMarkers, closeOverlay])

  // 환경변수 누락 체크
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_KAKAO_MAP_KEY) {
      console.error('[FITTERS STUDIO] NEXT_PUBLIC_KAKAO_MAP_KEY 환경변수가 설정되지 않았습니다. .env.local을 확인하세요.')
      setMapError(true)
    }
  }, [])

  // 페이지 재방문 시 SDK가 이미 로드된 경우 즉시 kakaoReady 설정
  useEffect(() => {
    if (window.kakao?.maps) {
      loadKakaoMaps(() => setKakaoReady(true))
    }
  }, [])

  // kakaoReady가 되면 지도 초기화 (stale closure 없이 안전하게)
  useEffect(() => {
    if (!kakaoReady) return
    if (!window.kakao?.maps) return   // 방어 코드: SDK 미준비 시 early return
    if (!mapContainerRef.current) return
    if (mapRef.current) return        // 이미 초기화된 경우 중복 방지
    try {
      const map = new window.kakao.maps.Map(mapContainerRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780),
        level: 9,
      })
      mapRef.current = map
      setMapLoaded(true)
      searchPlaces('서울')
    } catch (err) {
      console.error('[FITTERS STUDIO] 카카오맵 초기화 실패:', err)
      setMapError(true)
    }
  }, [kakaoReady, searchPlaces])

  // 지역 필터 클릭
  const handleRegionChange = useCallback((regionId: string) => {
    setSelectedRegion(regionId)
    setSearch('')
    if (!mapRef.current || !window.kakao?.maps) return
    const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0]
    mapRef.current.setCenter(new window.kakao.maps.LatLng(region.lat, region.lng))
    mapRef.current.setLevel(region.level)
    searchPlaces(regionId)
  }, [searchPlaces])

  // 검색 입력
  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim() || !mapRef.current) return
    const q = search.includes('크로스핏') ? search : `${search} 크로스핏`
    searchPlaces(selectedRegion, q)
  }

  // 내 위치
  const handleFindNearby = () => {
    if (!mapRef.current || !window.kakao?.maps?.services) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = new window.kakao.maps.LatLng(coords.latitude, coords.longitude)
        myLocationMarkerRef.current?.setMap(null)
        clearMarkers()
        mapRef.current.setCenter(pos)
        mapRef.current.setLevel(7)

        const myMarker = new window.kakao.maps.Marker({
          map: mapRef.current,
          position: pos,
          title: '내 위치',
        })
        myLocationMarkerRef.current = myMarker

        const ps = new window.kakao.maps.services.Places()
        ps.keywordSearch('크로스핏', (data: any[], status: string) => {
          if (status === window.kakao.maps.services.Status.OK) {
            setResultCount(data.length)
            data.forEach((place) => {
              const position = new window.kakao.maps.LatLng(place.y, place.x)
              const marker = new window.kakao.maps.Marker({ map: mapRef.current, position })
              window.kakao.maps.event.addListener(marker, 'click', () => {
                overlayRef.current?.setMap(null)
                const el = buildOverlayEl(
                  place.place_name,
                  place.road_address_name || place.address_name,
                  place.id,
                  place.y,
                  place.x,
                  closeOverlay,
                )
                const ov = new window.kakao.maps.CustomOverlay({ position, content: el, yAnchor: 1.12 })
                ov.setMap(mapRef.current)
                overlayRef.current = ov
              })
              markersRef.current.push(marker)
            })
          }
          setLocating(false)
        }, { location: pos, radius: 10000 })
      },
      () => {
        alert('위치 권한이 필요합니다.')
        setLocating(false)
      }
    )
  }

  // 박스 등록 폼
  const toggleFeature = (f: string) => {
    setForm((p) => ({
      ...p,
      features: p.features.includes(f) ? p.features.filter((x) => x !== f) : [...p.features, f],
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
    setAddSubmitted(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setForm(emptyForm)
    setFormError('')
    setAddSubmitted(false)
  }

  const kakaoSrc = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
    ? `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`
    : null

  return (
    <div className="min-h-screen bg-rx-bg">
      {/* 카카오맵 SDK — Next.js Script 컴포넌트로 안전하게 로드
          onLoad에서 createMap을 직접 넘기지 않고 kakaoReady 상태만 업데이트 →
          실제 지도 생성은 useEffect에서 처리해 stale closure 완전 차단 */}
      {kakaoSrc && (
        <Script
          src={kakaoSrc}
          strategy="afterInteractive"
          onLoad={() => {
            if (!window.kakao?.maps) return  // 방어 코드
            window.kakao.maps.load(() => setKakaoReady(true))
          }}
          onError={() => setMapError(true)}
        />
      )}
      <Header />
      <main className="pt-20 pb-24 md:pb-10">

        {/* ── 상단 고정 검색 + 지역 필터 ───────────────────────────────────── */}
        <div
          className="sticky top-20 z-40 px-4"
          style={{
            background: '#09090b',
            paddingTop: '10px',
            paddingBottom: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="max-w-5xl mx-auto">
            {/* 검색창 */}
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-rx-muted"
                width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="지역명, 박스 이름으로 검색 후 Enter..."
                className="input pl-9 pr-20"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-rx-red text-white text-xs font-bold hover:bg-rx-red/80 transition-colors"
              >
                검색
              </button>
            </form>

            {/* 지역 필터 */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {REGIONS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionChange(region.id)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    selectedRegion === region.id
                      ? 'bg-rx-red text-white'
                      : 'bg-rx-surface border border-rx-border text-rx-muted hover:text-white'
                  }`}
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 카카오 지도 ──────────────────────────────────────────────────── */}
        <div className="relative w-full" style={{ height: '45vh', minHeight: '400px' }}>
          {/* 지도 컨테이너 */}
          <div ref={mapContainerRef} className="w-full h-full" id="kakao-map" />

          {/* 로딩 */}
          {!mapLoaded && !mapError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-rx-surface z-10">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(#333 1px,transparent 1px),linear-gradient(90deg,#333 1px,transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
              <svg className="text-rx-muted relative z-10 animate-pulse" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p className="text-rx-muted text-sm relative z-10 mt-3">지도 불러오는 중...</p>
            </div>
          )}

          {/* 에러 */}
          {mapError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-rx-surface z-10">
              <svg className="text-rx-muted mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-white font-bold mb-1">지도를 불러올 수 없습니다</p>
              <p className="text-rx-muted text-sm">API 키를 확인해주세요</p>
            </div>
          )}

          {/* 검색 결과 수 배지 */}
          {mapLoaded && resultCount !== null && (
            <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full bg-rx-bg/90 backdrop-blur-sm border border-white/10 text-white text-xs font-bold">
              크로스핏 박스 {resultCount}개 검색됨
            </div>
          )}

          {/* 내 위치 버튼 */}
          <button
            onClick={handleFindNearby}
            disabled={!mapLoaded || locating}
            className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rx-bg/90 backdrop-blur-md border border-white/20 text-white text-sm font-bold hover:border-rx-red/60 transition-all disabled:opacity-50 shadow-lg"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {locating ? '위치 확인 중...' : '내 주변 박스'}
          </button>
        </div>

        {/* ── 검색된 박스 리스트 영역 ─────────────────────────────────────────────── */}
        <div className="px-4 max-w-5xl mx-auto mt-8">
          {searchedBoxes.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rx-red">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  목록 보기 <span className="text-rx-muted font-normal text-sm ml-1">({searchedBoxes.length})</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {searchedBoxes.slice(0, visibleBoxCount).map((box) => (
                  <div key={box.id} className="p-4 rounded-xl bg-rx-surface border border-rx-border hover:border-rx-red/40 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-white text-base leading-tight break-keep">{box.place_name}</h3>
                      {box.phone && <span className="text-xs text-rx-muted whitespace-nowrap ml-2">{box.phone}</span>}
                    </div>
                    <p className="text-rx-muted text-xs mb-3 flex items-start gap-1">
                      <svg className="flex-shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      {box.road_address_name || box.address_name}
                    </p>
                    <div className="flex gap-2">
                      <a href={`https://map.kakao.com/link/to/${encodeURIComponent(box.place_name)},${box.y},${box.x}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 rounded-lg bg-rx-bg border border-rx-border text-xs font-bold text-white hover:border-rx-red/50 transition-colors">길찾기</a>
                      {box.place_url && <a href={box.place_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 rounded-lg bg-rx-bg border border-rx-border text-xs font-bold text-white hover:border-rx-red/50 transition-colors">상세정보</a>}
                    </div>
                  </div>
                ))}
              </div>

              {visibleBoxCount < searchedBoxes.length && (
                <button
                  onClick={() => setVisibleBoxCount(prev => prev + 8)}
                  className="w-full mt-4 py-3 rounded-xl border border-rx-border bg-rx-surface hover:bg-rx-border/50 text-white text-sm font-bold transition-colors"
                >
                  더보기 ({visibleBoxCount} / {searchedBoxes.length})
                </button>
              )}
            </section>
          )}

          {/* 이용 안내 */}
          <section className="mt-10 mb-10">
            <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rx-red">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              지도 이용 안내
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                  title: '마커 클릭',
                  desc: '지도의 마커(핀)를 클릭하면 박스 이름, 주소, 길찾기 링크가 담긴 말풍선이 표시됩니다.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                    </svg>
                  ),
                  title: '드랍인 매너',
                  desc: '드랍인 시 반드시 방문 전 해당 박스에 사전 연락하세요. 클래스 인원 제한 및 규정이 다를 수 있습니다.',
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  ),
                  title: '정보 수정 요청',
                  desc: '지도에 표시된 박스 정보(주소·운영시간 등)가 정확하지 않은 경우, 하단 [박스 등록하기]를 통해 수정 요청을 보내주세요.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-4 rounded-xl bg-rx-surface border border-rx-border">
                  <span className="text-rx-muted flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                    <p className="text-rx-muted text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-rx-muted text-xs mt-4 leading-relaxed">
              ※ 지도 데이터는 카카오맵 Places API를 기반으로 하며, 실제 운영 여부 및 드랍인 요금은 반드시 각 박스에 직접 확인하세요.
              데이터 오류나 누락된 박스는 아래 박스 등록 기능을 통해 제보 부탁드립니다.
            </p>
          </section>

          {/* 추천 파트너 박스 */}
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <h2 className="text-xl font-black text-white">추천 파트너 박스</h2>
              <span className="badge bg-rx-orange/20 text-rx-orange border-rx-orange/30">스폰서</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPONSOR_BOXES.map((box) => (
                <SponsorBoxCard key={box.id} box={box} />
              ))}
            </div>
          </section>

          {/* 박스 등록 CTA */}
          <section className="mb-10 p-6 rounded-2xl border border-rx-border bg-rx-surface text-center">
            <svg className="text-rx-muted mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <h3 className="text-white font-black text-lg mb-1">우리 박스가 없나요?</h3>
            <p className="text-rx-muted text-sm mb-4">박스 정보를 등록하면 검토 후 지도에 반영됩니다</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary px-6 py-2.5 rounded-xl text-sm"
            >
              + 박스 등록하기
            </button>
          </section>
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
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {addSubmitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🏋️</div>
                <h3 className="font-black text-white text-xl mb-2">등록 완료!</h3>
                <p className="text-rx-muted text-sm mb-1">소중한 제보 감사합니다.</p>
                <p className="text-rx-muted text-sm mb-6">검토 후 지도에 반영됩니다.</p>
                <button onClick={closeModal} className="btn-primary px-8">확인</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">신청자 이름 *</label>
                    <input type="text" className="input" placeholder="홍길동"
                      value={form.contactName} onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">이메일 *</label>
                    <input type="email" className="input" placeholder="example@email.com"
                      value={form.contactEmail} onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))} />
                  </div>
                </div>
                <hr className="border-rx-border" />
                <div>
                  <label className="text-rx-muted text-sm block mb-1">박스명 *</label>
                  <input type="text" className="input" placeholder="CrossFit OOO"
                    value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">지역(시) *</label>
                    <input type="text" className="input" placeholder="서울, 부산..."
                      value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">구/동</label>
                    <input type="text" className="input" placeholder="강남구"
                      value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">주소 *</label>
                  <input type="text" className="input" placeholder="서울특별시 강남구 테헤란로 123"
                    value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">드랍인 비용</label>
                    <input type="text" className="input" placeholder="20,000원"
                      value={form.dropinFee} onChange={(e) => setForm((p) => ({ ...p, dropinFee: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">전화번호</label>
                    <input type="tel" className="input" placeholder="02-000-0000"
                      value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">웹사이트 / SNS</label>
                  <input type="url" className="input" placeholder="https://..."
                    value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
                </div>
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

// ── 추천 파트너 박스 카드 ─────────────────────────────────────────────────────
interface SponsorBox {
  id: string
  name: string
  tag: string
  address: string
  near: string
  phone: string
  website: string
  instagram: string
  features: string[]
  dropinFee: string
}

function SponsorBoxCard({ box }: { box: SponsorBox }) {
  return (
    <div className="card border-rx-orange/30 hover:border-rx-orange/60 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-white text-base">{box.name}</h3>
            <span className="badge bg-rx-orange/20 text-rx-orange border-rx-orange/30">{box.tag}</span>
          </div>
          <p className="text-rx-muted text-xs">{box.near}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-rx-muted text-xs mb-0.5">드랍인</p>
          <p className="text-rx-muted font-black text-sm">{box.dropinFee}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 mb-3">
        <svg className="text-rx-muted flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
        <p className="text-rx-muted text-xs leading-snug">{box.address}</p>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {box.features.map((f) => (
          <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-rx-surface border border-rx-border text-rx-muted">{f}</span>
        ))}
      </div>

      <div className="flex gap-2 pt-3 border-t border-rx-border flex-wrap">
        <a
          href={`tel:${box.phone}`}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-orange/50 text-xs font-bold transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.11 6.11l1.97-1.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {box.phone}
        </a>
        <a
          href={box.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-orange/50 text-xs font-bold transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          웹사이트
        </a>
        <a
          href={`https://map.kakao.com/link/search/${encodeURIComponent(box.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rx-surface border border-rx-border text-rx-muted hover:text-white hover:border-rx-red/50 text-xs font-bold transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          길찾기
        </a>
      </div>
    </div>
  )
}
