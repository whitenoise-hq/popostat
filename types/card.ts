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
  user_id: string
  created_at: string
  pet_name: string
  image_url: string
  detected: DetectedType
  name_guess: string | null
  power: number
  grade: Grade
  title: string | null
  analysis: string | null
  special_move: string | null
  stats: Stats
}