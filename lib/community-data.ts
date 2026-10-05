export interface HyroxEvent {
  id: string
  name: string
  city: string
  country: string
  date: string
  venue: string
  registrationUrl: string
  isOpen: boolean
  isPast?: boolean
  participants?: number
}

export interface BoardPost {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  likes: number
  comments: number
  tags: string[]
}

// 아래 일정은 전부 실제 공식 캘린더(roxradar, hyresult 등)로 검증한 데이터입니다.
// 하이록스 코리아는 역사상 인천·서울 단 두 도시에서만 개최되었고, 부산·대구 대회는
// 존재한 적이 없습니다 — 확인 안 되는 대회(2026년 도쿄·시카고 등)는 추측으로 지어내지
// 않고 제외했습니다. 날짜 확인 기준: 2026-10-05.
export const HYROX_EVENTS: HyroxEvent[] = [
  // ===== 한국 =====
  {
    id: 'hyrox-incheon-2025',
    name: 'HYROX Incheon 2025',
    city: '인천',
    country: '한국',
    date: '2025-05-17',
    venue: '송도 컨벤시아, 연수구',
    registrationUrl: 'https://korea.hyrox.com/',
    isOpen: false,
    isPast: true,
    participants: 3899,
  },
  {
    id: 'hyrox-seoul-2025',
    name: 'HYROX Seoul 2025 (한국 최초 서울 개최, 11.8~9 양일간)',
    city: '서울',
    country: '한국',
    date: '2025-11-08',
    venue: 'COEX, 강남구',
    registrationUrl: 'https://korea.hyrox.com/',
    isOpen: false,
    isPast: true,
  },
  {
    id: 'hyrox-incheon-2026',
    name: 'HYROX Incheon 2026',
    city: '인천',
    country: '한국',
    date: '2026-05-16',
    venue: '송도 컨벤시아, 연수구',
    registrationUrl: 'https://korea.hyrox.com/',
    isOpen: false,
    isPast: true,
  },
  {
    id: 'hyrox-seoul-2026',
    name: 'HYROX Seoul 2026 (11.14~15 양일간)',
    city: '서울',
    country: '한국',
    date: '2026-11-14',
    venue: 'COEX, 강남구',
    registrationUrl: 'https://korea.hyrox.com/',
    isOpen: true,
  },
  // ===== 해외 (검증된 주요 도시만) =====
  {
    id: 'hyrox-singapore-2026',
    name: 'HYROX Singapore 2026',
    city: '싱가포르',
    country: '싱가포르',
    date: '2026-04-03',
    venue: 'Singapore National Stadium',
    registrationUrl: 'https://hyrox.com/find-my-race/',
    isOpen: false,
    isPast: true,
  },
  {
    id: 'hyrox-sydney-2026',
    name: 'HYROX Sydney 2026',
    city: '시드니',
    country: '호주',
    date: '2026-07-01',
    venue: 'ICC Sydney, Darling Harbour',
    registrationUrl: 'https://hyrox.com/find-my-race/',
    isOpen: false,
    isPast: true,
  },
  {
    id: 'hyrox-hamburg-2026',
    name: 'HYROX Hamburg 2026',
    city: '함부르크',
    country: '독일',
    date: '2026-10-28',
    venue: 'Hamburg Messe, Messeplatz 1',
    registrationUrl: 'https://hyrox.com/find-my-race/',
    isOpen: true,
  },
  {
    id: 'hyrox-london-2026',
    name: 'HYROX London 2026',
    city: '런던',
    country: '영국',
    date: '2026-12-02',
    venue: 'ExCeL London, Royal Docks',
    registrationUrl: 'https://hyrox.com/find-my-race/',
    isOpen: true,
  },
  {
    id: 'hyrox-paris-2026',
    name: 'HYROX Paris 2026',
    city: '파리',
    country: '프랑스',
    date: '2026-12-12',
    venue: 'Paris Expo Porte de Versailles',
    registrationUrl: 'https://hyrox.com/find-my-race/',
    isOpen: true,
  },
]

export const BOARD_POSTS: BoardPost[] = [
  {
    id: 'post-1',
    title: 'Fran 처음으로 서브 5분 달성했습니다!',
    content: '6개월 동안 꾸준히 연습한 결과 드디어 Fran 서브 5분을 달성했습니다. 43kg Thruster로 4분 52초! 처음엔 60kg는커녕 30kg도 힘들었는데... 꾸준함이 답인 것 같습니다. 다음 목표는 서브 4분!',
    author: '강남크로스피터',
    createdAt: '2026-03-08',
    likes: 48,
    comments: 15,
    tags: ['Fran', '기록달성', 'Thruster'],
  },
  {
    id: 'post-2',
    title: 'Ring Muscle-up 처음 성공했어요 팁 공유합니다',
    content: '3개월 연습 끝에 드디어 Ring Muscle-up 성공! 핵심 팁: 1) Pull-up 20개 이상 되어야 시도 2) False Grip 반드시 연습 3) Dip 부분에서 팔꿈치 뒤로 빠르게. 저 같은 경우 Negative Muscle-up 300개 넘게 한 것 같아요.',
    author: 'CrossFitNewbie',
    createdAt: '2026-03-07',
    likes: 92,
    comments: 28,
    tags: ['Ring Muscle-up', '기술팁', '링운동'],
  },
  {
    id: 'post-3',
    title: 'HYROX 서울 2025 대회 후기 (처음 참가)',
    content: '생애 첫 HYROX 대회 완주했습니다! 예상보다 훨씬 힘들었어요. 특히 SkiErg → Sled Push 구간이 레그킬러... 준비 기간은 3개월, 완주 시간은 1시간 52분. 다음엔 1시간 30분 목표. 같이 참가하실 분 계세요?',
    author: '첫하이록스',
    createdAt: '2026-03-07',
    likes: 63,
    comments: 22,
    tags: ['HYROX', '대회후기', '첫참가'],
  },
  {
    id: 'post-4',
    title: '크로스핏 박스 드랍인 에티켓 알려드려요',
    content: '해외 여행 중 드랍인 많이 해봤는데 몇 가지 공유합니다: 1) 미리 예약하기 2) 클래스 시작 15분 전 도착 3) 코치 인사 먼저 4) 장비 사용법 물어보기 5) WOD 후 장비 정리. 기본적인 예의만 지켜도 환영받습니다!',
    author: '드랍인전문가',
    createdAt: '2026-03-06',
    likes: 105,
    comments: 18,
    tags: ['드랍인', '에티켓', '여행'],
  },
  {
    id: 'post-5',
    title: 'Murph 서브 40분 준비 루틴 (3개월)',
    content: '올해 메모리얼 데이 Murph 서브 40분 달성 목표입니다. 현재 Murph 54분... 매주 화목은 Running 인터벌, 월수금은 Pull-up/Push-up 볼륨 트레이닝. 비조끼로 먼저 45분 끊고 조끼 도전할 예정. 같이 준비하는 분?',
    author: 'MurphHunter',
    createdAt: '2026-03-06',
    likes: 57,
    comments: 31,
    tags: ['Murph', '목표설정', '훈련루틴'],
  },
  {
    id: 'post-6',
    title: 'Double-Under 100개 연속 드디어 성공!',
    content: '줄넘기 시작한 지 4개월 만에 Double-Under 연속 100개 달성! 처음엔 3개도 못 했는데... 핵심은 손목 스냅, 점프 높이 일정하게, 리듬감. 매일 15분씩 연습한 결과입니다. Annie WOD도 이제 자신 있어요.',
    author: '줄넘기마스터',
    createdAt: '2026-03-05',
    likes: 78,
    comments: 24,
    tags: ['Double-Under', '줄넘기', '기술'],
  },
  {
    id: 'post-7',
    title: '크로스핏 1년 전후 몸 변화 공유',
    content: '1년 전: 80kg, 체지방 28%, Deadlift 60kg. 현재: 74kg, 체지방 15%, Deadlift 120kg. 다이어트가 목적이 아니었는데 몸이 완전히 바뀌었어요. 식단은 크게 안 바꿨고 주 4회 WOD만 했습니다. 크로스핏 정말 효과있네요.',
    author: '변화의증인',
    createdAt: '2026-03-05',
    likes: 214,
    comments: 45,
    tags: ['몸변화', '1년후기', '다이어트'],
  },
  {
    id: 'post-8',
    title: 'Snatch 기술 향상을 위한 드릴 추천',
    content: 'Snatch 배우는 분들께 추천 드릴: 1) OHS 안정성 먼저 2) Snatch Grip DL 100개/주 3) Hang Snatch 포지션 반복 4) Snatch Balance 5) Box Snatch. 무게욕심 버리고 PVC로 3개월 해보세요. 기술이 완전히 달라집니다.',
    author: '스내치코치',
    createdAt: '2026-03-04',
    likes: 89,
    comments: 33,
    tags: ['Snatch', '기술', '드릴'],
  },
  {
    id: 'post-9',
    title: '워크아웃 영상 찍는 법 추천받고 싶어요',
    content: '기록용으로 WOD 영상을 찍고 싶은데 혼자 할 때 어떻게 세팅하시나요? 삼각대 각도, 카메라 위치 등 궁금합니다. 특히 바벨 동작은 측면에서 찍는 게 좋다고 들었는데... 코치님께 자세 피드백 받으려고요.',
    author: '영상기록러',
    createdAt: '2026-03-04',
    likes: 32,
    comments: 19,
    tags: ['영상촬영', '기록', '피드백'],
  },
  {
    id: 'post-10',
    title: 'CrossFit Games 2026 출전 선수 응원합니다',
    content: '올해 크로스핏 게임즈에 한국 선수 3명이 출전 예정이라고 들었어요! 크로스핏 게임즈 보면서 동기부여 많이 받는데 한국 선수가 있다니 더 기대됩니다. 같이 응원할 분들 여기 모여요!',
    author: '크피팬',
    createdAt: '2026-03-03',
    likes: 156,
    comments: 41,
    tags: ['CrossFitGames', '응원', '한국선수'],
  },
  {
    id: 'post-11',
    title: '박스 고를 때 가장 중요한 것은?',
    content: '이사 후 새 박스를 찾고 있어요. 코치 자질 vs 시설 vs 위치 vs 가격 vs 분위기... 어떤 걸 가장 중요하게 생각하시나요? 저는 코치 자질이 제일 중요하다고 생각하는데 다들 어떻게 고르셨어요?',
    author: '박스찾는중',
    createdAt: '2026-03-03',
    likes: 44,
    comments: 38,
    tags: ['박스선택', '조언', '커뮤니티'],
  },
  {
    id: 'post-12',
    title: 'Isabel (Snatch 30개) 처음 완주 후기',
    content: '오늘 Isabel 처음 했는데 너무 힘들었어요. 43kg로 도전했다가 중간에 30kg로 낮췄습니다ㅠ. 그래도 완주가 목표였으니 OK! 다음엔 43kg 완주가 목표. Snatch 기술이 아직 부족한 것 같아 기술 연습을 더 해야할 것 같아요.',
    author: '스내치도전기',
    createdAt: '2026-03-02',
    likes: 36,
    comments: 14,
    tags: ['Isabel', 'WOD후기', 'Snatch'],
  },
  {
    id: 'post-13',
    title: '크로스핏 부상 예방 스트레칭 루틴 공유',
    content: '2년 전 어깨 부상으로 6개월 쉰 이후로 준비운동에 진심입니다. 매일 하는 루틴: 폼롤러 흉추 10분 + 밴드 숄더 워밍업 5분 + 힙 모빌리티 5분. 귀찮아도 절대 안 빠져요. 부상은 예방이 최고입니다.',
    author: '부상예방전도사',
    createdAt: '2026-03-02',
    likes: 127,
    comments: 29,
    tags: ['부상예방', '스트레칭', '컨디셔닝'],
  },
  {
    id: 'post-14',
    title: 'HYROX vs CrossFit 어떤 게 더 맞을까요?',
    content: '둘 다 해보신 분들 의견 부탁드려요. 저는 현재 크로스핏 1년 했고 HYROX에 관심이 생겼습니다. 크로스핏이 워크아웃 다양성이 있다면 HYROX는 목표가 명확하다는 느낌? 둘 다 병행하시는 분도 계신가요?',
    author: '둘다궁금',
    createdAt: '2026-03-01',
    likes: 73,
    comments: 52,
    tags: ['HYROX', '크로스핏', '비교'],
  },
  {
    id: 'post-15',
    title: '오늘의 WOD: Cindy 25라운드 달성!',
    content: '박스 오픈 이후 3년만에 Cindy 25라운드 달성! 처음엔 8라운드도 힘들었는데... 꾸준히 하면 됩니다. Cindy는 기준점이 명확해서 실력 측정에 딱 좋은 것 같아요. 다음 목표는 30라운드입니다. 오늘 같이 Cindy 하신 분?',
    author: 'CindyKing',
    createdAt: '2026-03-01',
    likes: 88,
    comments: 17,
    tags: ['Cindy', '기록', 'AMRAP'],
  },
]
