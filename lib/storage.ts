import { supabase } from './supabase'

/**
 * Storage 경로를 공개 URL로 변환
 * 예: "userId/123.webp" → "https://xxx.supabase.co/storage/v1/object/public/card-images/userId/123.webp"
 */
export function getImageUrl(path: string): string {
  const { data } = supabase.storage.from('card-images').getPublicUrl(path)
  return data.publicUrl
}
