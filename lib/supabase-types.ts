// Auto-generated types — keep in sync with supabase/migrations/

export type WodType = 'For Time' | 'AMRAP' | 'EMOM' | 'Tabata' | 'Strength' | 'Custom'

export type LiftType =
  | 'deadlift'
  | 'back_squat'
  | 'bench_press'
  | 'front_squat'
  | 'overhead_press'
  | 'clean'
  | 'snatch'

export type WeightUnit = 'kg' | 'lbs'

export interface WodLog {
  id: string
  user_id: string
  wod_id: string | null
  wod_name: string
  wod_type: WodType | null
  date: string           // ISO date: 'YYYY-MM-DD'
  time: string | null    // e.g. '04:52'
  rounds: string | null
  weight: string | null
  difficulty: number | null  // 1–5
  notes: string | null
  created_at: string
}

export type WodLogInsert = Omit<WodLog, 'id' | 'created_at'>

export interface OneRmRecord {
  id: string
  user_id: string
  lift_type: LiftType
  weight: number
  unit: WeightUnit
  date: string           // ISO date: 'YYYY-MM-DD'
  created_at: string
}

export type OneRmInsert = Omit<OneRmRecord, 'id' | 'created_at'>
