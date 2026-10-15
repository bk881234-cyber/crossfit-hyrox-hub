import type { GuideBlock } from '@/components/layout/GuideSection'

type Loc = 'ko' | 'en'

export const CALCULATOR_GUIDE: Record<Loc, { title: string; blocks: GuideBlock[] }> = {
  en: {
    title: 'How the 1RM calculator works',
    blocks: [
      {
        heading: 'What is a 1RM?',
        paragraphs: [
          'Your one-rep max (1RM) is the heaviest weight you can lift for a single clean repetition. Testing it directly is tiring and risky, so most athletes estimate it from a lighter set of 2–10 reps.',
        ],
      },
      {
        heading: 'The Epley formula',
        paragraphs: [
          'This calculator uses the Epley formula: 1RM = weight × (1 + reps ÷ 30). For example, 100 kg for 5 reps gives about 117 kg. Estimates are most accurate between 2 and 10 reps; beyond that, fatigue and technique make the result less reliable, so treat it as a training guide rather than a tested max.',
        ],
      },
      {
        heading: 'How to use it',
        items: [
          'Pick Barbell, Dumbbell or Bodyweight mode.',
          'Enter the weight you lifted and choose how many reps you completed.',
          'Read your estimated 1RM and the 60–100% percentage table for programming working sets.',
          'Switch between kg and lb at any time. The converter shows the other unit alongside.',
        ],
      },
      {
        heading: 'Using the percentage table',
        paragraphs: [
          'Most strength programs prescribe loads as a percentage of 1RM: roughly 60–70% for technique and high reps, 75–85% for strength sets of 3–6 reps, and 90%+ for heavy singles. Pair this tool with the WOD Library to pick RX weights and scaling for benchmark workouts.',
        ],
      },
    ],
  },
  ko: {
    title: '1RM 계산기 사용법',
    blocks: [
      {
        heading: '1RM이란?',
        paragraphs: [
          '1RM(원 렙 맥스)은 한 번만 들어 올릴 수 있는 최대 중량입니다. 직접 측정하면 피로와 부상 위험이 커서, 보통 가벼운 무게로 2~10회 수행한 기록으로 추정합니다.',
        ],
      },
      {
        heading: 'Epley 공식',
        paragraphs: [
          '이 계산기는 Epley 공식을 사용합니다: 1RM = 무게 × (1 + 반복 횟수 ÷ 30). 예를 들어 100kg으로 5회를 했다면 약 117kg입니다. 2~10회 구간에서 가장 정확하고, 그보다 많으면 피로와 자세 영향으로 오차가 커지므로 실제 측정값이 아니라 훈련 가이드로 활용하세요.',
        ],
      },
      {
        heading: '사용 방법',
        items: [
          '바벨, 덤벨, 맨몸 중 모드를 선택합니다.',
          '들어 올린 무게를 입력하고 수행한 반복 횟수를 고릅니다.',
          '추정 1RM과 60~100% 퍼센트 테이블을 확인하고 작업 세트 무게로 활용합니다.',
          'kg과 lb는 언제든 전환할 수 있고, 다른 단위로 변환된 값이 함께 표시됩니다.',
        ],
      },
      {
        heading: '퍼센트 테이블 활용',
        paragraphs: [
          '대부분의 근력 프로그램은 1RM의 퍼센트로 무게를 정합니다. 기술 연습과 고반복은 60~70%, 3~6회 근력 세트는 75~85%, 무거운 싱글은 90% 이상이 일반적입니다. WOD 라이브러리와 함께 쓰면 벤치마크 WOD의 RX 중량과 스케일링을 정하는 데 도움이 됩니다.',
        ],
      },
    ],
  },
}

export const TIMER_GUIDE: Record<Loc, { title: string; blocks: GuideBlock[] }> = {
  en: {
    title: 'WOD timer modes explained',
    blocks: [
      {
        heading: 'AMRAP — As Many Rounds As Possible',
        paragraphs: ['Set a time cap and complete as many rounds or reps as you can. Your score is the total rounds plus extra reps when the clock ends.'],
      },
      {
        heading: 'EMOM — Every Minute On the Minute',
        paragraphs: ['At the start of every minute you perform a set task, then rest for whatever time is left in that minute. A faster set means more rest.'],
      },
      {
        heading: 'Tabata',
        paragraphs: ['The classic Tabata protocol is 20 seconds of all-out work and 10 seconds of rest, repeated for 8 rounds (4 minutes). It is a very high-intensity interval format.'],
      },
      {
        heading: 'For Time',
        paragraphs: ['Finish a prescribed amount of work as fast as possible. The clock counts up and you stop it when you are done, which is how benchmark WODs such as Fran and Grace are scored.'],
      },
      {
        heading: 'Interval',
        paragraphs: ['Alternate work and rest periods that you set yourself, for as many rounds as you choose. Useful for HYROX-style running and station practice.'],
      },
      {
        heading: 'Handy features',
        items: [
          'A 10-second countdown before the clock starts so you can get into position.',
          'Sound alerts for the final seconds and each new round.',
          'Screen wake lock keeps the display on during a workout on most mobile browsers.',
        ],
      },
    ],
  },
  ko: {
    title: 'WOD 타이머 모드 설명',
    blocks: [
      {
        heading: 'AMRAP — 제한 시간 내 최대 라운드',
        paragraphs: ['정해진 시간 안에 최대한 많은 라운드나 반복을 수행합니다. 시간이 끝났을 때의 완료 라운드와 추가 반복 수가 기록입니다.'],
      },
      {
        heading: 'EMOM — 매 분 시작',
        paragraphs: ['매 분이 시작될 때 정해진 동작을 수행하고, 그 분이 끝날 때까지 남은 시간은 휴식합니다. 빨리 끝낼수록 휴식이 길어집니다.'],
      },
      {
        heading: 'Tabata',
        paragraphs: ['20초 운동, 10초 휴식을 8라운드(4분) 반복하는 고강도 인터벌 프로토콜입니다.'],
      },
      {
        heading: 'For Time',
        paragraphs: ['정해진 운동량을 최대한 빨리 끝내는 방식입니다. 시계가 올라가고 완료하는 순간 멈추며, Fran·Grace 같은 벤치마크 WOD가 이 방식으로 기록됩니다.'],
      },
      {
        heading: 'Interval',
        paragraphs: ['운동 시간과 휴식 시간을 직접 정해 원하는 라운드 수만큼 반복합니다. HYROX 러닝·스테이션 연습에 활용하기 좋습니다.'],
      },
      {
        heading: '편의 기능',
        items: [
          '시작 전 10초 카운트다운으로 준비 자세를 잡을 수 있습니다.',
          '마지막 몇 초와 새 라운드마다 소리로 알려줍니다.',
          '대부분의 모바일 브라우저에서 화면이 꺼지지 않도록 유지합니다.',
        ],
      },
    ],
  },
}

export const PR_GUIDE: Record<Loc, { title: string; blocks: GuideBlock[] }> = {
  en: {
    title: 'About the PR tracker',
    blocks: [
      {
        heading: 'Track your personal records',
        paragraphs: [
          'Log your deadlift, back squat, bench press and other max lifts, and see a 6-month trend chart so you can tell whether your strength is actually progressing. Your records are saved to your account, so you can open them from any device after signing in with Google.',
        ],
      },
      {
        heading: 'What you can do',
        items: [
          'Record a new PR with weight, date and unit (kg or lb).',
          'See your current best and recent change for each lift.',
          'View a growth chart over the last six months.',
          'Share a progress card with friends or on social media.',
        ],
      },
      {
        heading: 'Need an estimate first?',
        paragraphs: ['If you have not tested a true max, use the 1RM calculator to estimate it from a lighter set, then log that number here.'],
      },
    ],
  },
  ko: {
    title: 'PR 기록 트래커 소개',
    blocks: [
      {
        heading: '나의 최고 기록 관리',
        paragraphs: [
          '데드리프트, 백 스쿼트, 벤치프레스 등 최대 중량을 기록하고 6개월 추세 그래프로 근력이 실제로 늘고 있는지 확인하세요. 기록은 계정에 저장되어 구글 로그인만 하면 어느 기기에서든 볼 수 있습니다.',
        ],
      },
      {
        heading: '할 수 있는 것',
        items: [
          '무게, 날짜, 단위(kg/lb)와 함께 새 PR을 기록합니다.',
          '종목별 현재 최고 기록과 최근 변화를 확인합니다.',
          '최근 6개월 성장 그래프를 봅니다.',
          '진행 상황 카드를 친구나 SNS에 공유합니다.',
        ],
      },
      {
        heading: '먼저 추정이 필요하다면?',
        paragraphs: ['실제 최대 중량을 측정하지 않았다면 1RM 계산기로 가벼운 세트에서 추정한 뒤 그 값을 여기에 기록하세요.'],
      },
    ],
  },
}
