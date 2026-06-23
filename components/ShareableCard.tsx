import { forwardRef } from 'react'
import { View, StyleSheet } from 'react-native'
import { BattleCardDark } from './BattleCardDark'
import type { Card } from '../types/card'
import { colors } from '../theme/colors'

type Props = {
  card: Card
}

/**
 * 공유 캡처 대상 래퍼.
 * ref를 통해 react-native-view-shot이 이 뷰를 PNG로 캡처한다.
 * 카드 주변에 배경 여백을 둬 글로우/그림자가 캡처 영역 밖으로 잘리지 않게 한다.
 */
export const ShareableCard = forwardRef<View, Props>(function ShareableCard({ card }, ref) {
  return (
    <View ref={ref} collapsable={false} style={styles.wrapper}>
      <BattleCardDark card={card} />
    </View>
  )
})

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 24,
  },
})