export type Stats = {
  attack: number
  defense: number
  agility: number
  cuteness: number
  laziness: number
}

export type Grade = 'F' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS'

export type DetectedType = '강아지' | '고양이' | '기타동물' | '없음'

export type Card = {
  id: string
  userId: string
  createdAt: string
  petName: string
  imageUrl: string
  detected: DetectedType
  nameGuess: string | null
  power: number
  grade: Grade
  title: string | null
  analysis: string | null
  specialMove: string | null
  stats: Stats
}

export type AnalyzeResponse = {
  detected: DetectedType
  nameGuess: string
  power: number
  grade: Grade
  title: string
  stats: Stats
  analysis: string
  specialMove: string
  error: string | null
}