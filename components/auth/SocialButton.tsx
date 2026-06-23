import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { fonts } from '../../theme/fonts'

type Props = {
  label: string
  icon: keyof typeof Ionicons.glyphMap
  backgroundColor: string
  textColor: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
}

/**
 * 소셜 로그인 버튼 (카카오/애플 공용).
 * 아이콘은 프로젝트 컨벤션대로 Ionicons만 사용.
 */
export function SocialButton({
  label,
  icon,
  backgroundColor,
  textColor,
  onPress,
  loading,
  disabled,
}: Props) {
  return (
    <Pressable
      style={[styles.button, { backgroundColor }, (loading || disabled) && styles.disabled]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Ionicons name={icon} size={20} color={textColor} />
      )}
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  disabled: {
    opacity: 0.7,
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
})