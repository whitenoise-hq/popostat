import type { Card } from '../types/card'

/**
 * 측정 플로우에서 화면 간 데이터 전달용 임시 저장소
 * scan → result 화면 간 데이터 공유
 */
type MeasureState = {
  imageUri: string | null
  petName: string | null
  result: Card | null
  error: string | null
}

let state: MeasureState = {
  imageUri: null,
  petName: null,
  result: null,
  error: null,
}

export function setMeasureInput(imageUri: string, petName: string) {
  state = { imageUri, petName, result: null, error: null }
}

export function setMeasureResult(card: Card) {
  state = { ...state, result: card, error: null }
}

export function setMeasureError(error: string) {
  state = { ...state, error }
}

export function getMeasureState(): MeasureState {
  return state
}

export function clearMeasureState() {
  state = { imageUri: null, petName: null, result: null, error: null }
}