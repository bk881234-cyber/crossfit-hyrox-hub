'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Script from 'next/script'
import Header from '@/components/layout/Header'
import MobileNav from '@/components/layout/MobileNav'
import { useTranslations, useLocale } from 'next-intl'

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
  { id: 'all',  label: '전체',   labelEn: 'All',     lat: 36.5,    lng: 127.8,   level: 13 },
  { id: '서울',  label: '서울',   labelEn: 'Seoul',   lat: 37.5665, lng: 126.9780, level: 9  },
  { id: '경기',  label: '경기',   labelEn: 'Gyeonggi', lat: 37.4138, lng: 127.5183, level: 10 },
  { id: '인천',  label: '인천',   labelEn: 'Incheon', lat: 37.4563, lng: 126.7052, level: 10 },
  { id: '부산',  label: '부산',   labelEn: 'Busan',   lat: 35.1796, lng: 129.0756, level: 10 },
  { id: '대구',  label: '대구',   labelEn: 'Daegu',   lat: 35.8714, lng: 128.6014, level: 10 },
  { id: '대전',  label: '대전',   labelEn: 'Daejeon', lat: 36.3504, lng: 127.3845, level: 10 },
  { id: '광주',  label: '광주',   labelEn: 'Gwangju', lat: 35.1595, lng: 126.8526, level: 10 },
  { id: '울산',  label: '울산',   labelEn: 'Ulsan',   lat: 35.5384, lng: 129.3114, level: 10 },
  { id: '제주',  label: '제주도', labelEn: 'Jeju',    lat: 33.4996, lng: 126.5312, level: 10 },
]

// ── 구/시/군 이름 로마자 표기 (영문 로케일 표시용, 카카오 검색어 자체는 한글 유지) ──
const DISTRICT_LABELS_EN: Record<string, string> = {
  '강남구': 'Gangnam-gu', '강동구': 'Gangdong-gu', '강북구': 'Gangbuk-gu', '강서구': 'Gangseo-gu',
  '관악구': 'Gwanak-gu', '광진구': 'Gwangjin-gu', '구로구': 'Guro-gu', '금천구': 'Geumcheon-gu',
  '노원구': 'Nowon-gu', '도봉구': 'Dobong-gu', '동대문구': 'Dongdaemun-gu', '동작구': 'Dongjak-gu',
  '마포구': 'Mapo-gu', '서대문구': 'Seodaemun-gu', '서초구': 'Seocho-gu', '성동구': 'Seongdong-gu',
  '성북구': 'Seongbuk-gu', '송파구': 'Songpa-gu', '양천구': 'Yangcheon-gu', '영등포구': 'Yeongdeungpo-gu',
  '용산구': 'Yongsan-gu', '은평구': 'Eunpyeong-gu', '종로구': 'Jongno-gu', '중구': 'Jung-gu',
  '중랑구': 'Jungnang-gu',
  '수원시': 'Suwon-si', '고양시': 'Goyang-si', '용인시': 'Yongin-si', '성남시': 'Seongnam-si',
  '부천시': 'Bucheon-si', '화성시': 'Hwaseong-si', '안산시': 'Ansan-si', '남양주시': 'Namyangju-si',
  '안양시': 'Anyang-si', '평택시': 'Pyeongtaek-si', '시흥시': 'Siheung-si', '파주시': 'Paju-si',
  '의정부시': 'Uijeongbu-si', '김포시': 'Gimpo-si', '광주시': 'Gwangju-si', '광명시': 'Gwangmyeong-si',
  '하남시': 'Hanam-si', '군포시': 'Gunpo-si', '오산시': 'Osan-si', '이천시': 'Icheon-si',
  '양주시': 'Yangju-si', '구리시': 'Guri-si', '안성시': 'Anseong-si', '의왕시': 'Uiwang-si',
  '포천시': 'Pocheon-si', '양평군': 'Yangpyeong-gun', '여주시': 'Yeoju-si', '동두천시': 'Dongducheon-si',
  '과천시': 'Gwacheon-si', '가평군': 'Gapyeong-gun', '연천군': 'Yeoncheon-gun',
  '미추홀구': 'Michuhol-gu', '남동구': 'Namdong-gu', '부평구': 'Bupyeong-gu', '계양구': 'Gyeyang-gu',
  '서구': 'Seo-gu', '강화군': 'Ganghwa-gun', '옹진군': 'Ongjin-gun',
  '동구': 'Dong-gu', '영도구': 'Yeongdo-gu', '부산진구': 'Busanjin-gu', '동래구': 'Dongnae-gu',
  '남구': 'Nam-gu', '북구': 'Buk-gu', '해운대구': 'Haeundae-gu', '사하구': 'Saha-gu',
  '금정구': 'Geumjeong-gu', '연제구': 'Yeonje-gu', '수영구': 'Suyeong-gu', '사상구': 'Sasang-gu',
  '기장군': 'Gijang-gun',
  '수성구': 'Suseong-gu', '달서구': 'Dalseo-gu', '달성군': 'Dalseong-gun', '군위군': 'Gunwi-gun',
  '유성구': 'Yuseong-gu', '대덕구': 'Daedeok-gu', '광산구': 'Gwangsan-gu', '울주군': 'Ulju-gun',
  '제주시': 'Jeju-si', '서귀포시': 'Seogwipo-si',
}

// 카카오 검색 결과의 시·군·구 이름이 DISTRICT_LABELS_EN에 없을 때 쓰는 로마자(국어 로마자 표기법) 변환
const RR_INITIAL = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h']
const RR_VOWEL = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i']
const RR_FINAL = ['','k','kk','k','n','n','n','t','l','k','m','l','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t']
function romanizeKo(text: string): string {
  let out = ''
  for (const ch of text) {
    const c = ch.charCodeAt(0) - 0xac00
    if (c < 0 || c > 11171) { out += ch; continue }
    out += RR_INITIAL[Math.floor(c / 588)] + RR_VOWEL[Math.floor((c % 588) / 28)] + RR_FINAL[c % 28]
  }
  return out
}
function districtLabelEn(name: string): string {
  if (DISTRICT_LABELS_EN[name]) return DISTRICT_LABELS_EN[name]
  const m = name.match(/^(.+?)(구|시|군)$/)
  if (!m) return romanizeKo(name).replace(/^./, (x) => x.toUpperCase())
  const stem = romanizeKo(m[1]).replace(/^./, (x) => x.toUpperCase())
  return `${stem}-${m[2] === '구' ? 'gu' : m[2] === '시' ? 'si' : 'gun'}`
}

// ── 세부 지역 (구/시 단위) 데이터 ──────────────────────────────────────────
const SUB_REGIONS: Record<string, string[]> = {
  '서울': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  '경기': ['수원시', '고양시', '용인시', '성남시', '부천시', '화성시', '안산시', '남양주시', '안양시', '평택시', '시흥시', '파주시', '의정부시', '김포시', '광주시', '광명시', '하남시', '군포시', '오산시', '이천시', '양주시', '구리시', '안성시', '의왕시', '포천시', '양평군', '여주시', '동두천시', '과천시', '가평군', '연천군'],
  '인천': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
  '부산': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
  '대구': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군', '군위군'],
  '대전': ['동구', '중구', '서구', '유성구', '대덕구'],
  '광주': ['동구', '서구', '남구', '북구', '광산구'],
  '울산': ['중구', '남구', '동구', '북구', '울주군'],
  '제주': ['제주시', '서귀포시'],
}

// ── 정식 어필리에이트 등 "크로스핏/CrossFit/HYROX" 일반 키워드로는 안 잡히는
//    실제 박스 — 상호명으로 직접 검색해 항상 뜨도록 보강 (crossfit.com 공식 지도로 검증) ──
const VERIFIED_BOX_NAMES = [
  '얼티밋트레이닝',
  'CrossFit Apgujeong',
  'Golden Crown CrossFit',
  'Muhan CrossFit',
  'CrossFit HON',
  'CrossFit Yeongtong',
  'N Camp CrossFit',
  'CrossFit JSKW',
  'CrossFit Higher Gym',
  '스타디온 판교 크로스핏',
  'HACA TRAINING',
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
  directionsLabel: string,
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
      ${directionsLabel}
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
  const t = useTranslations('map')
  const locale = useLocale()

  const [selectedRegion, setSelectedRegion] = useState('서울')
  const [selectedSubRegion, setSelectedSubRegion] = useState('all')
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

  const directionsLabel = t('directions')

  // 마커 렌더링 헬퍼 (중복 제거된 결과를 받아 지도에 표시)
  const renderMarkers = useCallback((places: any[]) => {
    setResultCount(places.length)
    setSearchedBoxes(places)
    setVisibleBoxCount(8)
    places.forEach((place) => {
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
          directionsLabel,
        )
        const ov = new window.kakao.maps.CustomOverlay({ position, content: el, yAnchor: 1.12 })
        ov.setMap(mapRef.current)
        overlayRef.current = ov
      })
      markersRef.current.push(marker)
    })
  }, [closeOverlay, directionsLabel])

  // 장소 검색 — CrossFit(크로스핏·영문) + HYROX 다중 키워드 동시 검색, 중복 제거
  const searchPlaces = useCallback((regionId: string, subRegion: string = 'all', customKeyword?: string) => {
    if (!window.kakao?.maps?.services || !mapRef.current) return
    clearMarkers()

    const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0]
    const prefix = regionId === 'all' ? '' : `${region.label} `
    const subPrefix = subRegion === 'all' ? '' : `${subRegion} `

    // 사용자 입력이 있으면 그대로, 없으면 지역+서브지역+키워드
    const keywords: string[] = customKeyword
      ? [customKeyword]
      : [`${prefix}${subPrefix}크로스핏`, `${prefix}${subPrefix}CrossFit`, `${prefix}${subPrefix}HYROX`, ...VERIFIED_BOX_NAMES]

    const ps = new window.kakao.maps.services.Places()
    const accumulated: any[] = []
    const seenIds = new Set<string>()
    let pending = keywords.length

    const onAllDone = () => {
      // place.id 기준 중복 제거 후 렌더링
      const unique = accumulated.filter((p) => {
        const name = p.place_name.toUpperCase()
        if (name.includes('F45') || name.includes('버핏')) return false
        
        if (seenIds.has(p.id)) return false
        seenIds.add(p.id)
        return true
      })
      if (unique.length === 0) {
        setResultCount(0)
      } else {
        renderMarkers(unique)
        // 서브 지역(구 단위) 검색이거나 특정 검색어가 있을 때 마커를 기준으로 지도 영역 재조정
        if ((subRegion !== 'all' || customKeyword) && unique.length > 0) {
          const bounds = new window.kakao.maps.LatLngBounds()
          unique.forEach((p) => {
            bounds.extend(new window.kakao.maps.LatLng(p.y, p.x))
          })
          mapRef.current.setBounds(bounds)
          // 1개인 경우 너무 확대될 수 있으므로 레벨 조정
          if (unique.length === 1) {
            mapRef.current.setLevel(5)
          }
        }
      }
    }

    keywords.forEach((kw) => {
      const kwAccum: any[] = []
      const handlePage = (data: any[], status: string, pagination: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          kwAccum.push(...data)
          if (pagination.hasNextPage) {
            pagination.nextPage()
          } else {
            accumulated.push(...kwAccum)
            pending--
            if (pending === 0) onAllDone()
          }
        } else {
          pending--
          if (pending === 0) onAllDone()
        }
      }
      ps.keywordSearch(kw, handlePage)
    })
  }, [clearMarkers, renderMarkers])

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
      searchPlaces('서울', 'all')
    } catch (err) {
      console.error('[FITTERS STUDIO] 카카오맵 초기화 실패:', err)
      setMapError(true)
    }
  }, [kakaoReady, searchPlaces])

  // 지역 필터 클릭
  const handleRegionChange = useCallback((regionId: string) => {
    setSelectedRegion(regionId)
    setSelectedSubRegion('all')
    setSearch('')
    if (!mapRef.current || !window.kakao?.maps) return
    const region = REGIONS.find((r) => r.id === regionId) ?? REGIONS[0]
    mapRef.current.setCenter(new window.kakao.maps.LatLng(region.lat, region.lng))
    mapRef.current.setLevel(region.level)
    searchPlaces(regionId, 'all')
  }, [searchPlaces])

  // 서브 지역(구) 필터 클릭
  const handleSubRegionChange = useCallback((subRegion: string) => {
    setSelectedSubRegion(subRegion)
    setSearch('')
    if (!mapRef.current || !window.kakao?.maps) return
    searchPlaces(selectedRegion, subRegion)
  }, [selectedRegion, searchPlaces])

  // 검색 입력
  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!search.trim() || !mapRef.current) return
    searchPlaces(selectedRegion, selectedSubRegion, search.trim())
  }

  // 내 위치 — CrossFit + HYROX 반경 10km 다중 검색
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
          title: t('nearbyBtn'),
        })
        myLocationMarkerRef.current = myMarker

        const ps = new window.kakao.maps.services.Places()
        const nearbyKeywords = ['크로스핏', 'CrossFit', 'HYROX', ...VERIFIED_BOX_NAMES]
        const accumulated: any[] = []
        const seenIds = new Set<string>()
        let pending = nearbyKeywords.length

        const onAllDone = () => {
          const unique = accumulated.filter((p) => {
            const name = p.place_name.toUpperCase()
            if (name.includes('F45') || name.includes('버핏')) return false

            if (seenIds.has(p.id)) return false
            seenIds.add(p.id)
            return true
          })
          renderMarkers(unique)
          setLocating(false)
        }

        nearbyKeywords.forEach((kw) => {
          ps.keywordSearch(kw, (data: any[], status: string) => {
            if (status === window.kakao.maps.services.Status.OK) {
              accumulated.push(...data)
            }
            pending--
            if (pending === 0) onAllDone()
          }, { location: pos, radius: 10000 })
        })
      },
      () => {
        alert(t('locationPermission'))
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
    if (!form.name.trim()) { setFormError(t('formValidName')); return }
    if (!form.city.trim()) { setFormError(t('formValidCity')); return }
    if (!form.address.trim()) { setFormError(t('formValidAddress')); return }
    if (!form.contactName.trim() || !form.contactEmail.trim()) {
      setFormError(t('formValidContact')); return
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

  const featureLabels: Record<string, string> = {
    '주차가능': t('fParking'),
    '샤워실': t('fShower'),
    '에어컨': t('fAc'),
    '와이파이': t('fWifi'),
    '보충제판매': t('fSupplements'),
    '개인락커': t('fLockers'),
  }

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
        <h1 className="sr-only">{t('title')} — {t('subtitle')}</h1>

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
          <div className="max-w-[992px] mx-auto">
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
                placeholder={t('searchPlaceholder')}
                className="input pl-9 pr-20"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg gradient-bg text-white text-xs font-bold hover:opacity-90 transition-opacity"
              >
                {t('searchBtn')}
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
                      ? 'gradient-bg text-white'
                      : 'bg-rx-surface border border-rx-border text-rx-muted hover:text-white'
                  }`}
                >
                  {region.id === 'all' ? t('regionAll') : locale === 'en' ? region.labelEn : region.label}
                </button>
              ))}
            </div>

            {/* 서브 지역(구) 필터 - 선택된 지역에 하위 카테고리가 있을 때만 표시 */}
            {SUB_REGIONS[selectedRegion] && SUB_REGIONS[selectedRegion].length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 mt-2 scrollbar-none">
                <button
                  onClick={() => handleSubRegionChange('all')}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                    selectedSubRegion === 'all'
                      ? 'bg-rx-red text-white'
                      : 'bg-rx-surface border border-rx-border text-rx-muted hover:text-white'
                  }`}
                >
                  {t('regionAll')}
                </button>
                {SUB_REGIONS[selectedRegion].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleSubRegionChange(sub)}
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                      selectedSubRegion === sub
                        ? 'bg-rx-red text-white'
                        : 'bg-rx-surface border border-rx-border text-rx-muted hover:text-white'
                    }`}
                  >
                    {locale === 'en' ? districtLabelEn(sub) : sub}
                  </button>
                ))}
              </div>
            )}
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
              <p className="text-rx-muted text-sm relative z-10 mt-3">{t('mapLoading')}</p>
            </div>
          )}

          {/* 에러 */}
          {mapError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-rx-surface z-10">
              <svg className="text-rx-muted mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-white font-bold mb-1">{t('mapLoadError')}</p>
              <p className="text-rx-muted text-sm">{t('mapErrorHint')}</p>
            </div>
          )}

          {/* 검색 결과 수 배지 */}
          {mapLoaded && resultCount !== null && (
            <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-full bg-rx-bg/90 backdrop-blur-sm border border-white/10 text-white text-xs font-bold">
              {t('resultsBadge', { count: resultCount })}
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
            {locating ? t('locating') : t('nearbyBtn')}
          </button>
        </div>

        {/* ── 검색된 박스 리스트 영역 ─────────────────────────────────────────────── */}
        <div className="px-4 max-w-[992px] mx-auto mt-8">
          {searchedBoxes.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rx-red">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  {t('listView')} <span className="text-rx-muted font-normal text-sm ml-1">({searchedBoxes.length})</span>
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
                      <a href={`https://map.kakao.com/link/to/${encodeURIComponent(box.place_name)},${box.y},${box.x}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 rounded-lg bg-rx-bg border border-rx-border text-xs font-bold text-white hover:border-rx-red/50 transition-colors">{t('directions')}</a>
                      {box.place_url && <a href={box.place_url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 rounded-lg bg-rx-bg border border-rx-border text-xs font-bold text-white hover:border-rx-red/50 transition-colors">{t('listDetails')}</a>}
                    </div>
                  </div>
                ))}
              </div>

              {visibleBoxCount < searchedBoxes.length && (
                <button
                  onClick={() => setVisibleBoxCount(prev => prev + 8)}
                  className="w-full mt-4 py-3 rounded-xl border border-rx-border bg-rx-surface hover:bg-rx-border/50 text-white text-sm font-bold transition-colors"
                >
                  {t('loadMoreList', { current: visibleBoxCount, total: searchedBoxes.length })}
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
              {t('guideTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                  title: t('g1Title'),
                  desc: t('g1Desc'),
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                    </svg>
                  ),
                  title: t('g2Title'),
                  desc: t('g2Desc'),
                },
                {
                  icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  ),
                  title: t('g3Title'),
                  desc: t('g3Desc'),
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
              {t('mapNote')}
            </p>
          </section>

          {/* 박스 등록 CTA */}
          <section className="mb-10 p-6 rounded-2xl border border-rx-border bg-rx-surface text-center">
            <svg className="text-rx-muted mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <h3 className="text-white font-black text-lg mb-1">{t('noBoxTitle')}</h3>
            <p className="text-rx-muted text-sm mb-4">{t('noBoxDesc')}</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary px-6 py-2.5 rounded-xl text-sm"
            >
              {t('registerBtn')}
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
              <h2 className="font-black text-white text-xl">{t('modalTitle')}</h2>
              <button onClick={closeModal} className="text-rx-muted hover:text-white p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {addSubmitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🏋️</div>
                <h3 className="font-black text-white text-xl mb-2">{t('successTitle')}</h3>
                <p className="text-rx-muted text-sm mb-1">{t('successDesc')}</p>
                <p className="text-rx-muted text-sm mb-6">{t('successNote')}</p>
                <button onClick={closeModal} className="btn-primary px-8">{t('fSubmit')}</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">{t('fName')}</label>
                    <input type="text" className="input" placeholder={locale === 'en' ? 'John Doe' : '홍길동'}
                      value={form.contactName} onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">{t('fEmail')}</label>
                    <input type="email" className="input" placeholder="example@email.com"
                      value={form.contactEmail} onChange={(e) => setForm((p) => ({ ...p, contactEmail: e.target.value }))} />
                  </div>
                </div>
                <hr className="border-rx-border" />
                <div>
                  <label className="text-rx-muted text-sm block mb-1">{t('fBoxName')}</label>
                  <input type="text" className="input" placeholder="CrossFit OOO"
                    value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">{t('fCity')}</label>
                    <input type="text" className="input" placeholder={t('fCityPh')}
                      value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">{t('fDistrict')}</label>
                    <input type="text" className="input" placeholder={t('fDistrictPh')}
                      value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">{t('fAddress')}</label>
                  <input type="text" className="input" placeholder={t('fAddressPh')}
                    value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">{t('fFee')}</label>
                    <input type="text" className="input" placeholder={t('fFeePh')}
                      value={form.dropinFee} onChange={(e) => setForm((p) => ({ ...p, dropinFee: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-rx-muted text-sm block mb-1">{t('fPhone')}</label>
                    <input type="tel" className="input" placeholder={t('fPhonePh')}
                      value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-1">{t('fWebsite')}</label>
                  <input type="url" className="input" placeholder={t('fWebsitePh')}
                    value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
                </div>
                <div>
                  <label className="text-rx-muted text-sm block mb-2">{t('fFeatures')}</label>
                  <div className="flex flex-wrap gap-2">
                    {FEATURE_OPTIONS.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFeature(f)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                          form.features.includes(f)
                            ? 'gradient-bg text-white'
                            : 'bg-rx-card border border-rx-border text-rx-muted hover:text-white'
                        }`}
                      >
                        {featureLabels[f] ?? f}
                      </button>
                    ))}
                  </div>
                </div>
                {formError && <p className="text-rx-red text-sm font-bold">{formError}</p>}
                <div className="flex gap-3 pt-2">
                  <button onClick={closeModal} className="flex-1 btn-secondary text-sm py-3">{t('fCancel')}</button>
                  <button onClick={handleAddSubmit} className="flex-1 btn-primary text-sm py-3">{t('fSubmit')}</button>
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
