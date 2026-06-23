import { useEffect, useState } from 'react'
import { Modal, View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { updateNickname, isValidNickname, NICKNAME_MAX_LENGTH } from '../../lib/auth'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'

type Props = {
  visible: boolean
  currentNickname: string
  onClose: () => void
  onSaved: () => void
}

/**
 * 닉네임 수정 모달 (한글·영어 2~6자).
 * AppModal은 입력을 지원하지 않아 별도 작성.
 */
export function NicknameEditModal({ visible, currentNickname, onClose, onSaved }: Props) {
  const [nickname, setNickname] = useState(currentNickname)
  const [isSaving, setIsSaving] = useState(false)
  const isValid = isValidNickname(nickname)

  // 모달이 열릴 때 현재 닉네임으로 초기화
  useEffect(() => {
    if (visible) setNickname(currentNickname)
  }, [visible, currentNickname])

  async function handleSave() {
    if (!isValid || isSaving) return
    try {
      setIsSaving(true)
      await updateNickname(nickname)
      onSaved()
    } catch (error) {
      console.error('Nickname update failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>닉네임 수정</Text>
          <Text style={styles.subtitle}>한글·영어 2~6자</Text>

          <View style={[styles.inputWrapper, nickname.length > 0 && styles.inputWrapperFocus]}>
            <TextInput
              style={styles.input}
              value={nickname}
              onChangeText={setNickname}
              placeholder="한글·영어 2~6자"
              placeholderTextColor={colors.input.placeholder}
              maxLength={NICKNAME_MAX_LENGTH}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />
            <Text style={styles.charCount}>
              {nickname.length}/{NICKNAME_MAX_LENGTH}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose} disabled={isSaving}>
              <Text style={styles.cancelText}>취소</Text>
            </Pressable>
            <Pressable
              style={[styles.button, isValid ? styles.saveButton : styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!isValid || isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.button.primaryText} />
              ) : (
                <Text style={[styles.saveText, !isValid && styles.saveTextDisabled]}>저장</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    marginTop: -6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.input.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputWrapperFocus: {
    borderColor: colors.input.borderFocus,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.text.primary,
    padding: 0,
  },
  charCount: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 14,
  },
  cancelButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text.secondary,
  },
  saveButton: {
    backgroundColor: colors.button.primary,
  },
  saveButtonDisabled: {
    backgroundColor: colors.button.disabled,
  },
  saveText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.button.primaryText,
  },
  saveTextDisabled: {
    color: colors.button.disabledText,
  },
})