import type { Grade } from '../types/card'

type GradeColor = {
  readonly primary: string
  readonly glow: string
}

export const gradeColors: Record<Grade, GradeColor> = {
  F:   { primary: '#6B7280', glow: '#6B728044' },
  D:   { primary: '#2DD4BF', glow: '#2DD4BF44' },
  C:   { primary: '#60A5FA', glow: '#60A5FA44' },
  B:   { primary: '#C084FC', glow: '#C084FC44' },
  A:   { primary: '#FB923C', glow: '#FB923C44' },
  S:   { primary: '#FBBF24', glow: '#FBBF2466' },
  SS:  { primary: '#F472B6', glow: '#F472B666' },
  SSS: { primary: '#F59E0B', glow: '#F59E0B88' },
} as const

export const colors = {
  background: '#0F0F1A',
  surface: '#1A1B2E',
  card: '#1E1F35',
  border: '#2A2B4A',
  text: {
    primary: '#E8E8F0',
    secondary: '#8B8BA8',
    muted: '#6B6B8D',
    inverse: '#0F0F1A',
  },
  accent: '#7C5CFC',
  error: '#EF4444',
  tabBar: {
    active: '#E8E8F0',
    inactive: '#6B6B8D',
    background: '#12132A',
    border: '#1E1F35',
  },
  input: {
    background: '#12132A',
    border: '#2A2B4A',
    borderFocus: '#7C5CFC',
    placeholder: '#4A4A6A',
  },
  button: {
    primary: '#7C5CFC',
    primaryText: '#FFFFFF',
    secondary: '#1A1B2E',
    secondaryText: '#E8E8F0',
    disabled: '#2A2B4A',
    disabledText: '#4A4A6A',
  },
} as const