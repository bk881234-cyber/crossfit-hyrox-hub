import { getMovementBySlug, type Movement, type MovementCategory } from './movements-data'
import { MOVEMENTS_EN_PART1 } from './movements-en/part1'
import { MOVEMENTS_EN_PART2 } from './movements-en/part2'
import { MOVEMENTS_EN_PART3 } from './movements-en/part3'
import type { MovementEn } from './movements-en/types'

export const MOVEMENTS_EN: Record<string, MovementEn> = {
  ...MOVEMENTS_EN_PART1,
  ...MOVEMENTS_EN_PART2,
  ...MOVEMENTS_EN_PART3,
}

export const CATEGORY_LABELS_EN: Record<MovementCategory, string> = {
  upper_power: 'Upper Body Power',
  lower_strength: 'Lower Body Strength',
  metabolic: 'Metabolic Conditioning',
}

export const DIFFICULTY_LABELS_EN = ['', 'Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert']

/** Overlay English content onto a Korean movement record. Returns the movement with `name` set to the English name for `en`. */
export function localizeMovement(movement: Movement, locale: string): Movement {
  if (locale !== 'en') return movement
  const en = MOVEMENTS_EN[movement.slug]
  return { ...movement, ...(en ?? {}), name: movement.nameEn }
}

export function getMovementLocalized(slug: string, locale: string): Movement | undefined {
  const m = getMovementBySlug(slug)
  return m ? localizeMovement(m, locale) : undefined
}
