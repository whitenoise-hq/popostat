import { View, Text, StyleSheet, Pressable, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'

type ModalButton = {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'danger'
}

type Props = {
  visible: boolean
  onClose: () => void
  icon?: keyof typeof Ionicons.glyphMap
  iconColor?: string
  title: string
  message?: string
  buttons?: ModalButton[]
}

export function AppModal({ visible, onClose, icon, iconColor, title, message, buttons }: Props) {
  const resolvedButtons = buttons ?? [{ label: '확인', onPress: onClose, variant: 'primary' as const }]

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>
          {icon ? (
            <View style={styles.iconWrapper}>
              <Ionicons name={icon} size={32} color={iconColor ?? colors.accent} />
            </View>
          ) : null}

          <Text style={styles.title}>{title}</Text>

          {message ? (
            <Text style={styles.message}>{message}</Text>
          ) : null}

          <View style={styles.buttonRow}>
            {resolvedButtons.map((btn) => {
              const btnStyle = btn.variant === 'danger'
                ? styles.dangerButton
                : btn.variant === 'secondary'
                  ? styles.secondaryButton
                  : styles.primaryButton

              const textStyle = btn.variant === 'danger'
                ? styles.dangerButtonText
                : btn.variant === 'secondary'
                  ? styles.secondaryButtonText
                  : styles.primaryButtonText

              return (
                <Pressable key={btn.label} style={[styles.button, btnStyle]} onPress={btn.onPress}>
                  <Text style={textStyle}>{btn.label}</Text>
                </Pressable>
              )
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  container: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.button.primary,
  },
  primaryButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.button.primaryText,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.text.primary,
  },
  dangerButton: {
    backgroundColor: colors.error,
  },
  dangerButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: '#FFFFFF',
  },
})