# 1단계 빠른 개선 (Phase 1 Quick Wins) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 홈 첫 화면을 도구 중심으로 바꾸고, 계산기·타이머·WOD 연결을 매끄럽게 하며, 사이트맵 날짜와 광고 로딩 도메인을 바로잡는다.

**Architecture:** 판단 로직은 순수 함수로 `lib/`에 두고 vitest로 검증한다. 페이지 컴포넌트는 그 함수를 호출만 한다. 디자인 토큰 교체(글꼴·색)는 2단계 범위라 이번에는 기존 Tailwind 클래스(`rx-*`, `card`, `btn-primary`)를 그대로 쓴다.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind 3, next-intl 4, vitest(신규 devDependency).

**Spec:** `docs/superpowers/specs/2026-11-03-fittersstudio-uiux-seo-geo-design.md` (3-1 U1~U5, 5-1~5-3, 6-2의 1·5, 8의 마지막 항목, 9의 1단계)

## Global Constraints

- 홈 첫 화면 인페이지 광고 제외(애드센스 제외 영역)는 **하지 않는다**. 소유자가 보류했다. 광고 배치는 현재 그대로 둔다.
- 한국어·영어 문구는 모두 `messages/ko.json`, `messages/en.json`에 넣는다. 화면에 하드코딩 금지(기존 locale 분기 패턴 예외 없음).
- 영어 화면에 한글이 보이면 안 된다(기존 검증 기준 유지).
- 1RM 공식은 Epley: `weight × (1 + reps / 30)`, reps가 1이면 weight 그대로.
- 기본 단위: `ko` → `kg`, `en` → `lb`.
- 광고 스크립트는 `www.fittersstudio.com`, `fittersstudio.com`에서만 불러온다. 기존 제외 경로(login, mypage, privacy, terms)는 유지한다.
- localStorage는 try/catch로 감싸고, 실패해도 기본값으로 동작한다.
- 확인되지 않은 정보를 새로 쓰지 않는다.

## Review Focus

1. 주소 파라미터가 엉망일 때(`?mode=xyz`, `?min=abc`, `?min=-5`, `?min=9999`) 타이머는 깨지지 않고 기본 화면을 보여줘야 한다 → Task 3 테스트에 포함.
2. 계산기 무게 입력이 비었거나 0, 음수, 숫자가 아닐 때 결과는 `NaN`이 아니라 "—"로 보여야 한다 → Task 2 테스트(`estimate1RM`이 null 반환).
3. localStorage를 쓸 수 없는 브라우저(사생활 보호 모드)에서도 계산기는 언어별 기본 단위로 동작해야 한다 → Task 2 `readSavedUnit` 테스트.
4. "오늘의 벤치마크"는 한국 시간 기준 같은 날이면 같은 WOD여야 하고, 서버 렌더링과 브라우저 렌더링이 달라서 하이드레이션 경고가 나면 안 된다 → Task 4 테스트 + 마운트 후 계산.
5. 미리보기 주소(`*.vercel.app`)와 `localhost`에서는 광고가 로드되지 않아야 한다 → Task 6 테스트.

---

## File Structure

| 파일 | 역할 |
|---|---|
| `vitest.config.ts` (신규) | vitest 설정, `@` 경로 별칭 |
| `lib/one-rm.ts` (신규) | `estimate1RM`, `defaultUnitForLocale`, `readSavedUnit`, `saveUnit` |
| `lib/timer-preset.ts` (신규) | `parseTimerPreset`, `timerHrefForWod` |
| `lib/daily-wod.ts` (신규) | `pickDailyWod` |
| `lib/ads.ts` (신규) | `shouldLoadAds` |
| `lib/content-dates.ts` (신규) | 사이트맵용 실제 수정일 상수 |
| `tests/*.test.ts` (신규) | 위 순수 함수 테스트 |
| `app/[locale]/calculator/page.tsx` | 기본 단위, 결과 위치, PR 배너 위치 |
| `app/[locale]/timer/page.tsx` | 주소 파라미터로 사전 설정 |
| `app/[locale]/wod/[id]/page.tsx` | 타이머 링크를 사전 설정 주소로 |
| `app/[locale]/page.tsx` | 첫 화면 개편, 통계 카운트업 제거 |
| `components/home/QuickOneRm.tsx` (신규) | 홈 1RM 빠른 계산 위젯 |
| `components/home/DailyBenchmark.tsx` (신규) | 오늘의 벤치마크 카드 |
| `components/layout/AdSenseLoader.tsx` | `shouldLoadAds` 사용 |
| `app/sitemap.ts` | `new Date()` 대신 실제 날짜 |
| `messages/ko.json`, `messages/en.json` | 새 문구 |

---

### Task 1: 테스트 환경

**Files:**
- Create: `vitest.config.ts`, `tests/smoke.test.ts`
- Modify: `package.json` (devDependency `vitest`, script `"test": "vitest run"`)

**Interfaces:**
- Produces: `npm test` 명령, `@/` 별칭이 프로젝트 루트를 가리킴

- [ ] **Step 1:** `npm i -D vitest@^2` 설치, `package.json`에 `"test": "vitest run"` 추가.
- [ ] **Step 2:** `vitest.config.ts`에 `resolve.alias: { '@': <프로젝트 루트> }`, `test.include: ['tests/**/*.test.ts']`, `environment: 'node'`.
- [ ] **Step 3:** `tests/smoke.test.ts`: `import { WODS } from '@/lib/wod-data'`; `expect(WODS.length).toBe(82)`.
- [ ] **Step 4:** Run `npm test` → Expected: 1 passed.
- [ ] **Step 5:** `npx tsc --noEmit` → 오류 없음. Commit `test: add vitest setup`.

### Task 2: 1RM 계산 로직과 계산기 화면

**Files:**
- Create: `lib/one-rm.ts`, `tests/one-rm.test.ts`
- Modify: `app/[locale]/calculator/page.tsx`, `messages/*.json`(필요 시)

**Interfaces:**
- Produces:
  - `type Unit = 'kg' | 'lb'`
  - `estimate1RM(weight: number, reps: number): number | null` — weight가 유한한 양수가 아니면 `null`. reps는 1~30으로 자름. reps=1이면 weight.
  - `defaultUnitForLocale(locale: string): Unit`
  - `readSavedUnit(storage: Pick<Storage,'getItem'> | null, locale: string): Unit` — 키 `fs-unit`. 값이 `kg`/`lb`가 아니거나 storage가 null이거나 getItem이 throw하면 `defaultUnitForLocale(locale)`.
  - `saveUnit(storage: Pick<Storage,'setItem'> | null, unit: Unit): void` — throw를 삼킨다.

- [ ] **Step 1: 실패하는 테스트 작성** (`tests/one-rm.test.ts`)
  - `estimate1RM(100, 5)` ≈ `116.67` (`toBeCloseTo(116.67, 2)`)
  - `estimate1RM(100, 1)` → `100`
  - `estimate1RM(100, 40)` → `estimate1RM(100, 30)`과 같음(=200)
  - `estimate1RM(0, 5)`, `estimate1RM(-10, 5)`, `estimate1RM(NaN, 5)` → `null`
  - `defaultUnitForLocale('ko')` → `'kg'`, `('en')` → `'lb'`
  - `readSavedUnit(null, 'ko')` → `'kg'`
  - `readSavedUnit({ getItem: () => { throw new Error('blocked') } }, 'en')` → `'lb'`
  - `readSavedUnit({ getItem: () => 'kg' }, 'en')` → `'kg'`
  - `readSavedUnit({ getItem: () => 'stone' }, 'ko')` → `'kg'`
- [ ] **Step 2:** `npm test` → FAIL(모듈 없음).
- [ ] **Step 3:** `lib/one-rm.ts` 구현.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: 계산기 화면 수정** (`app/[locale]/calculator/page.tsx`)
  - 파일 안의 Epley 함수를 `estimate1RM`으로 교체.
  - 단위 초기값: 첫 렌더는 `defaultUnitForLocale(locale)`, 마운트 후 `readSavedUnit(window.localStorage 접근을 try로 감싼 값, locale)`로 갱신. 단위 전환 시 `saveUnit`.
  - 추정 1RM 결과 블록을 무게 입력 카드 **위**로 옮기고, 모바일(`md` 미만)에서는 `sticky top-20` + 배경색으로 스크롤 중에도 보이게 한다. 결과가 null이면 "—".
  - "나의 PR 기록하기" 배너를 퍼센트 표 아래로 옮긴다.
- [ ] **Step 6:** `npx tsc --noEmit` 통과. 로컬 `npm run build && npm run start -- -p 3121`에서 `/ko/calculator`의 단위 표시가 kg, `/en/calculator`가 lb인지 curl 또는 playwright로 확인.
- [ ] **Step 7:** Commit `feat(calculator): locale default unit, pinned result, shared 1RM logic`.

### Task 3: 타이머 사전 설정 주소와 WOD 연결

**Files:**
- Create: `lib/timer-preset.ts`, `tests/timer-preset.test.ts`
- Modify: `app/[locale]/timer/page.tsx`, `app/[locale]/wod/[id]/page.tsx`

**Interfaces:**
- Produces:
  - `type TimerPreset = { mode: 'amrap'; minutes: number } | { mode: 'fortime'; minutes?: number } | { mode: 'emom'; rounds: number }`
  - `parseTimerPreset(search: string): TimerPreset | null` — 입력은 `window.location.search` 문자열. 형식: `?mode=amrap&min=20`, `?mode=fortime&min=12`(제한 시간), `?mode=fortime`(제한 없음), `?mode=emom&min=30`(= 30라운드, 매 분 60초). `min`은 정수 1~90만 허용, 벗어나면 그 값 무시(amrap/emom은 preset 전체 null, fortime은 minutes 없이).
  - `timerHrefForWod(wod: WOD): string` — **한국어 원본 WOD**(`lib/wod-data.ts`의 레코드)를 받는다. 설명에서 형식을 읽는다: `(\d+)분 AMRAP` 또는 `AMRAP (\d+)분` → amrap, `(\d+)분 EMOM` → emom, `For Time \((\d+)분 제한\)` → fortime+min, 그 외 → `/timer?mode=fortime`.
- Consumes: `WOD` 타입(`lib/wod-data.ts`)

- [ ] **Step 1: 실패하는 테스트 작성** (`tests/timer-preset.test.ts`)
  - `parseTimerPreset('?mode=amrap&min=20')` → `{ mode: 'amrap', minutes: 20 }`
  - `parseTimerPreset('?mode=fortime&min=12')` → `{ mode: 'fortime', minutes: 12 }`
  - `parseTimerPreset('?mode=fortime')` → `{ mode: 'fortime' }`
  - `parseTimerPreset('?mode=emom&min=30')` → `{ mode: 'emom', rounds: 30 }`
  - `parseTimerPreset('?mode=xyz&min=20')`, `('?mode=amrap&min=abc')`, `('?mode=amrap&min=-5')`, `('?mode=amrap&min=9999')`, `('')` → `null`
  - `parseTimerPreset('?mode=fortime&min=abc')` → `{ mode: 'fortime' }`
  - WOD id별 `timerHrefForWod`: `fran` → `/timer?mode=fortime`, `cindy` → `/timer?mode=amrap&min=20`, `chelsea` → `/timer?mode=emom&min=30`, `26-1` → `/timer?mode=amrap&min=15`, `26-3` → `/timer?mode=fortime&min=10`, `open-12-1` → `/timer?mode=amrap&min=7`
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** `lib/timer-preset.ts` 구현.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5: 타이머 화면** — 마운트 시 `parseTimerPreset(window.location.search)`를 읽어 결과가 있으면 `setMode`와 해당 `config`만 갱신(amrap.minutes / fortime.minutes / emom.rounds, emom.workSeconds=60). `useSearchParams`는 쓰지 않는다(정적 렌더링에서 Suspense 경계 요구).
- [ ] **Step 6: WOD 상세** — "타이머로 이동" 링크 두 곳(`href="/timer"`)을 `timerHrefForWod(base)`로 바꾼다. `base`는 지역화 전 한국어 원본 레코드(`WODS_KO`에서 찾은 것).
- [ ] **Step 7:** 빌드 후 `/ko/wod/cindy`의 타이머 링크가 `/ko/timer?mode=amrap&min=20`인지 확인, 그 주소를 열었을 때 AMRAP 20분이 선택되는지 playwright로 확인.
- [ ] **Step 8:** Commit `feat(timer): preset via URL and WOD pages link with presets`.

### Task 4: 홈 첫 화면 개편

**Files:**
- Create: `lib/daily-wod.ts`, `tests/daily-wod.test.ts`, `components/home/QuickOneRm.tsx`, `components/home/DailyBenchmark.tsx`
- Modify: `app/[locale]/page.tsx`, `messages/ko.json`, `messages/en.json`

**Interfaces:**
- Consumes: `estimate1RM`, `defaultUnitForLocale`, `readSavedUnit`, `saveUnit`(Task 2), `timerHrefForWod`(Task 3), `localizeWod`(`lib/wod-data-en.ts`)
- Produces: `pickDailyWod(wods: WOD[], now: Date): WOD` — 한국 시간(UTC+9) 날짜 문자열 `YYYY-MM-DD`의 간단한 해시로 인덱스를 고른다.

- [ ] **Step 1: 실패하는 테스트 작성** (`tests/daily-wod.test.ts`)
  - `2026-11-03T15:30:00Z`(KST 11/4 00:30)와 `2026-11-04T14:30:00Z`(KST 11/4 23:30) → 같은 id
  - `2026-11-03T14:30:00Z`(KST 11/3 23:30)와 `2026-11-03T15:30:00Z` 결과는 각각 `WODS` 안의 원소
  - 결과는 항상 `WODS`에 포함됨(10개 날짜 반복)
- [ ] **Step 2:** `npm test` → FAIL. **Step 3:** 구현. **Step 4:** PASS.
- [ ] **Step 5: 컴포넌트**
  - `QuickOneRm({ locale }: { locale: string })`: 무게 입력(숫자), 반복 수 선택(1,2,3,5,8,10), 결과를 크게 표시(null이면 "—"), "전체 계산기 열기" 링크(`/calculator`). 단위 규칙은 Task 2와 동일.
  - `DailyBenchmark({ locale }: { locale: string })`: 첫 렌더는 `WODS[0]`(Fran)으로 고정해 서버·브라우저가 같게 만들고, 마운트 후 `pickDailyWod(WODS, new Date())`로 교체. 이름, 종류, 운동 구성 3줄, "이 WOD로 타이머 시작"(`timerHrefForWod`), "자세히"(`/wod/[id]`).
- [ ] **Step 6: 홈 페이지**
  - 타이핑 제목(`HeroTypeTitle`)과 큰 빈 공간을 없애고, 첫 섹션을 `id="fs-hero-tools"`로: 짧은 h1(브랜드명 + 한 줄 설명), `QuickOneRm`, 큰 버튼 2개(타이머 시작 `/timer`, WOD 찾기 `/wod`), `DailyBenchmark`.
  - 통계 섹션과 `CountUp`을 삭제한다(U3).
  - 나머지 섹션(도구 카드, 크로스핏 소개)은 유지한다.
  - 새 문구 키: `home.quick.title`, `home.quick.weight`, `home.quick.reps`, `home.quick.result`, `home.quick.openFull`, `home.daily.title`, `home.daily.startTimer`, `home.daily.details`, `home.cta.timer`, `home.cta.wod` (ko/en 둘 다).
- [ ] **Step 7:** 빌드 후 모바일 390px에서 `/ko`, `/en` 첫 화면(높이 844px) 안에 1RM 입력칸이 보이는지 playwright 캡처로 확인. 영어 화면 한글 0건. 콘솔 하이드레이션 경고 0건.
- [ ] **Step 8:** Commit `feat(home): tool-first hero with quick 1RM and daily benchmark; remove count-up stats`.

### Task 5: 사이트맵 실제 수정일

**Files:**
- Create: `lib/content-dates.ts`, `tests/sitemap.test.ts`
- Modify: `app/sitemap.ts`

**Interfaces:**
- Produces: `CONTENT_DATES: Record<string, string>`(정적 경로 → `YYYY-MM-DD`), `WOD_CONTENT_DATE: string`, `MOVEMENT_CONTENT_DATE: string`. 값은 `git log -1 --format=%cs -- <해당 파일>`로 확인한 실제 날짜를 넣는다.

- [ ] **Step 1:** 테스트: `sitemap()`의 모든 항목 `lastModified`가 `/^\d{4}-\d{2}-\d{2}$/` 형식 문자열이고, 오늘 날짜(`new Date().toISOString().slice(0,10)`)와 같은 항목이 없다(오늘 수정한 파일이 없다는 전제. 오늘 수정했다면 그 경로만 예외 목록에).
- [ ] **Step 2:** FAIL 확인. **Step 3:** 구현. **Step 4:** PASS.
- [ ] **Step 5:** Commit `fix(seo): sitemap lastmod uses real content dates`.

### Task 6: 광고를 정식 도메인에서만

**Files:**
- Create: `lib/ads.ts`, `tests/ads.test.ts`
- Modify: `components/layout/AdSenseLoader.tsx`

**Interfaces:**
- Produces: `shouldLoadAds(hostname: string, pathname: string): boolean`

- [ ] **Step 1:** 테스트
  - `('www.fittersstudio.com', '/ko')` → true, `('fittersstudio.com', '/en/wod')` → true
  - `('crossfit-hyrox-abc.vercel.app', '/ko')` → false, `('localhost', '/ko')` → false
  - `('www.fittersstudio.com', '/ko/login')`, `'/en/mypage'`, `'/ko/privacy'`, `'/en/terms'` → false
- [ ] **Step 2:** FAIL. **Step 3:** 구현(기존 `NO_AD_PATHS` 이동). **Step 4:** PASS.
- [ ] **Step 5:** `AdSenseLoader`에서 `shouldLoadAds(window.location.hostname, pathname)` 사용.
- [ ] **Step 6:** Commit `fix(ads): load AdSense only on the production domain`.

### Task 7: 전체 검증과 배포

- [ ] **Step 1:** `npm test`, `npx tsc --noEmit`, `npm run build` 모두 통과.
- [ ] **Step 2:** 로컬 서버에서 영어 페이지 한글 검사(기존 크롤 스크립트 방식), 홈·계산기·타이머·WOD 상세 모바일/PC 캡처 확인.
- [ ] **Step 3:** `git push origin main`, GitHub 커밋 상태 API로 Vercel 배포 성공 확인, 실제 사이트에서 Task 2~6 동작 재확인.
- [ ] **Step 4:** IndexNow로 변경 페이지 제출.
