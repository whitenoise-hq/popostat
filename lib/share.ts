import type { RefObject } from 'react'
import type { View } from 'react-native'
import { captureRef } from 'react-native-view-shot'
import * as Sharing from 'expo-sharing'

/**
 * 카드 뷰를 PNG 이미지로 캡처해 시스템 공유 시트로 공유한다.
 * 외부 API 키 노출 없이 클라이언트에서만 처리(이미지 캡처 → OS 공유).
 */
export async function shareCardImage(cardRef: RefObject<View | null>): Promise<void> {
  try {
    const node = cardRef.current
    if (!node) {
      throw new Error('공유할 카드를 찾을 수 없습니다')
    }

    const available = await Sharing.isAvailableAsync()
    if (!available) {
      throw new Error('이 기기에서는 공유를 사용할 수 없습니다')
    }

    const uri = await captureRef(node, {
      format: 'png',
      quality: 1,
      result: 'tmpfile',
    })

    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle: '전투력 카드 공유',
      UTI: 'public.png',
    })
  } catch (error) {
    console.error('Card share failed:', error)
    throw error instanceof Error ? error : new Error('카드 공유에 실패했습니다')
  }
}