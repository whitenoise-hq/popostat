import { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { updateNickname, isValidNickname, NICKNAME_MAX_LENGTH } from '../../lib/auth'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'

export default function NicknameScreen() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const isValid = isValidNickname(nickname)

  async function handleSubmit() {
    if (!isValid || isSaving) return
    try {
      setIsSaving(true)
      await updateNickname(nickname)
      router.replace('/(tabs)/measure')
    } catch (error) {
      console.error('Nickname save failed:', error)
      Alert.alert('오류', '닉네임 저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <View style={styles.headerArea}>
            <View style={styles.iconWrapper}>
              <Ionicons name="person" size={32} color={colors.accent} />
            </View>
            <Text style={styles.title}>닉네임을 정해주세요</Text>
            <Text style={styles.subtitle}>한글·영어 2~6자로 입력해주세요</Text>
          </View>

          <View style={styles.inputArea}>
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
                onSubmitEditing={handleSubmit}
              />
              <Text style={styles.charCount}>
                {nickname.length}/{NICKNAME_MAX_LENGTH}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={[styles.button, isValid ? styles.buttonActive : styles.buttonDisabled]}
            disabled={!isValid || isSaving}
            onPress={handleSubmit}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.button.primaryText} />
            ) : (
              <>
                <Text style={[styles.buttonText, isValid ? styles.buttonTextActive : styles.buttonTextDisabled]}>
                  시작하기
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color={isValid ? colors.button.primaryText : colors.button.disabledText}
                />
              </>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text.muted,
  },
  inputArea: {
    paddingHorizontal: 12,
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
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 6,
  },
  buttonActive: {
    backgroundColor: colors.button.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.button.disabled,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  buttonTextActive: {
    color: colors.button.primaryText,
  },
  buttonTextDisabled: {
    color: colors.button.disabledText,
  },
})