// WOD 데이터의 movements 문자열(wod-data.ts)을 동작가이드 슬러그(movements-data.ts)로 매핑합니다.
// 느슨하게 관련된 변형 동작(예: "Chest-to-Bar Pull-up" → pull-up)도 포함하되,
// 조합 동작(예: "Burpee Box Jump")처럼 단일 가이드로 대표하기 애매한 건 제외합니다.
export const MOVEMENT_SLUG_MAP: Record<string, string> = {
  'Air Squat': 'air-squat',
  'Bar Muscle-up': 'muscle-up',
  'Bar-Facing Burpee': 'burpee',
  'Box Jump': 'box-jump',
  'Box Jump Over': 'box-jump',
  'Burpee': 'burpee',
  'Chest-to-Bar Pull-up': 'pull-up',
  'Clean': 'clean',
  'Clean & Jerk': 'clean',
  'Deadlift': 'deadlift',
  'Double Dumbbell Thruster': 'thruster',
  'Double-Under': 'double-under',
  'Dumbbell Clean & Jerk': 'clean',
  'Dumbbell Deadlift': 'deadlift',
  'Dumbbell Hang Clean & Jerk': 'clean',
  'Handstand Push-up': 'handstand-push-up',
  'Hang Power Clean': 'clean',
  'Kettlebell Swing': 'kettlebell-swing',
  'Power Clean': 'clean',
  'Pull-up': 'pull-up',
  'Push-up': 'push-up',
  'Ring Muscle-up': 'muscle-up',
  'Row': 'rowing',
  'Squat Clean': 'clean',
  'Thruster': 'thruster',
  'Wall Ball': 'wall-ball',
  'Wall Ball Shot': 'wall-ball',
}

export function getMovementSlug(movementName: string): string | null {
  return MOVEMENT_SLUG_MAP[movementName] ?? null
}
