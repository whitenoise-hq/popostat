import type { Grade } from '../types/card'

type GradeColor = {
  readonly primary: string
  readonly bg: string
}

export const gradeColors: Record<Grade, GradeColor> = {
  F:   { primary: '#9E9E9E', bg: '#F5F5F5' },
  D:   { primary: '#26A69A', bg: '#E0F2F1' },
  C:   { primary: '#42A5F5', bg: '#E3F2FD' },
  B:   { primary: '#AB47BC', bg: '#F3E5F5' },
  A:   { primary: '#FF7043', bg: '#FBE9E7' },
  S:   { primary: '#FFD54F', bg: '#FFF8E1' },
  SS:  { primary: '#F48FB1', bg: '#FCE4EC' },
  SSS: { primary: '#FF6F00', bg: '#FFF3E0' },
} as const

export const colors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  tabBar: {
    active: '#1A1A1A',
    inactive: '#9CA3AF',
    background: '#FFFFFF',
  },
} as const