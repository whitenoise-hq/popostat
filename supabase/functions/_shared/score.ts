export type Stats = {
  attack: number
  defense: number
  agility: number
  cuteness: number
  laziness: number
}

export function calcPower(s: Stats): number {
  const raw =
    s.attack   * 0.30 +
    s.defense  * 0.25 +
    s.agility  * 0.25 +
    s.cuteness * 0.10 -
    s.laziness * 0.20
  const norm = Math.max(0, Math.min(1, (raw + 20) / 110))
  const curved = Math.pow(norm, 1.3)
  return Math.round(curved * 10000)
}

export function calcGrade(power: number): string {
  if (power <= 1500) return 'F'
  if (power <= 3000) return 'D'
  if (power <= 4500) return 'C'
  if (power <= 6000) return 'B'
  if (power <= 7500) return 'A'
  if (power <= 8500) return 'S'
  if (power <= 9500) return 'SS'
  return 'SSS'
}