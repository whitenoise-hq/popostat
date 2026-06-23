import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'

type Props = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  subtitle?: string
  value?: string
  danger?: boolean
  showChevron?: boolean
  onPress?: () => void
}

/**
 * 설정·계정 화면 공용 메뉴 행.
 * showChevron=false면 오른쪽 화살표를 숨긴다(탭 불가 정보 행 등).
 * value를 주면 오른쪽에 회색 값 텍스트를 표시한다(버전 등).
 */
export function MenuItem({ icon, label, subtitle, value, danger, showChevron = true, onPress }: Props) {
  const iconColor = danger ? colors.error : colors.text.secondary
  const labelColor = danger ? colors.error : colors.text.primary

  return (
    <Pressable style={styles.menuItem} onPress={onPress} disabled={!onPress}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <View style={styles.menuItemContent}>
        <Text style={[styles.menuItemLabel, { color: labelColor }]}>{label}</Text>
        {subtitle ? <Text style={styles.menuItemSubtitle}>{subtitle}</Text> : null}
      </View>
      {value ? <Text style={styles.menuItemValue}>{value}</Text> : null}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 15,
    fontFamily: fonts.medium,
  },
  menuItemSubtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    marginTop: 1,
  },
  menuItemValue: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.text.muted,
  },
})
