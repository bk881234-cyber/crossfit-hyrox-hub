/**
 * 사이트맵 lastmod에 쓰는 실제 콘텐츠 수정일 (YYYY-MM-DD).
 * 페이지를 이루는 파일의 마지막 커밋 날짜(`git log -1 --format=%cs -- <파일>`)로 정했다.
 * 페이지 내용을 바꾸면 해당 날짜도 같이 갱신한다. 요청 시각으로 채우면 검색엔진이 신뢰하지 않는다.
 */
export const CONTENT_DATES: Record<string, string> = {
  '': '2026-11-03',
  '/calculator': '2026-11-03',
  '/calculator/1rm': '2026-10-15',
  '/timer': '2026-11-03',
  '/wod': '2026-10-20',
  '/wod/log': '2026-10-14',
  '/movements': '2026-10-20',
  '/map': '2026-10-14',
  '/competitions': '2026-10-20',
  '/about': '2026-10-14',
}

/** WOD 상세 페이지(데이터·번역·가이드·타이머 연결)의 마지막 수정일 */
export const WOD_CONTENT_DATE = '2026-11-03'

/** 무브먼트 상세 페이지의 마지막 수정일 */
export const MOVEMENT_CONTENT_DATE = '2026-10-14'
