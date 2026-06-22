import * as ImageManipulator from 'expo-image-manipulator'
import { File } from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import { supabase } from './supabase'
import type { Card } from '../types/card'

/**
 * 이미지 압축/리사이즈 → WebP (~1080px)
 */
async function compressImage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1080 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.WEBP }
  )
  return result.uri
}

/**
 * Supabase Storage에 이미지 업로드
 * 경로: {user_id}/{timestamp}.webp
 */
async function uploadImage(uri: string, userId: string): Promise<string> {
  const compressedUri = await compressImage(uri)

  const fileName = `${userId}/${Date.now()}.webp`

  const file = new File(compressedUri)
  const base64 = await file.base64()

  const { error } = await supabase.storage
    .from('card-images')
    .upload(fileName, decode(base64), {
      contentType: 'image/webp',
      upsert: false,
    })

  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`)

  return fileName
}

/**
 * 전체 측정 플로우:
 * 1. 이미지 압축 + Storage 업로드
 * 2. Edge Function 호출 (AI 분석 + power/grade 계산 + DB 저장)
 * 3. 완성된 카드 반환
 */
export async function measurePet(imageUri: string, petName: string): Promise<Card> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요합니다')

  // 1. 이미지 업로드
  const imagePath = await uploadImage(imageUri, user.id)

  // 2. Edge Function 호출
  console.log('[measure] calling edge function with:', { image_url: imagePath, pet_name: petName })
  const { data, error } = await supabase.functions.invoke('analyze-pet', {
    body: {
      image_url: imagePath,
      pet_name: petName,
    },
  })

  console.log('[measure] response data:', JSON.stringify(data))
  console.log('[measure] response error:', JSON.stringify(error))

  if (error) {
    // non-2xx 시 응답 body를 직접 읽어봄
    let detail = error.message
    try {
      const ctx = (error as any).context
      if (ctx && typeof ctx.json === 'function') {
        const body = await ctx.json()
        detail = body?.error ?? detail
      }
    } catch { /* ignore */ }
    console.log('[measure] error detail:', detail)
    throw new Error(`측정 실패: ${detail}`)
  }

  if (!data) throw new Error('서버 응답이 비어있습니다')

  // 동물 미검출
  if (data.detected === '없음' || data.error) {
    throw new Error(data.error || '동물을 찾을 수 없습니다')
  }

  return data as Card
}