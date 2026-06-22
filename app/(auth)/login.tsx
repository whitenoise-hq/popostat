import { useState } from 'react'
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { signInWithKakao } from '../../lib/auth'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'

const KAKAO_YELLOW = '#FEE500'
const KAKAO_BROWN = '#3C1E1E'

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleKakaoLogin() {
    try {
      setIsLoading(true)
      await signInWithKakao()
      // 로그인 성공 시 useProtectedRoute가 자동으로 탭으로 리다이렉트
    } catch (error) {
      console.error('Login failed:', error)
      Alert.alert('로그인 실패', '다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoArea}>
          <View style={styles.logoIcon}>
            <Ionicons name="flash" size={40} color={colors.accent} />
          </View>
          <Text style={styles.appName}>포포스탯</Text>
          <Text style={styles.tagline}>반려동물 전투력 측정기</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.kakaoButton, isLoading && styles.kakaoButtonDisabled]}
          onPress={handleKakaoLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={KAKAO_BROWN} />
          ) : (
            <Ionicons name="chatbubble" size={20} color={KAKAO_BROWN} />
          )}
          <Text style={styles.kakaoButtonText}>
            {isLoading ? '로그인 중...' : '카카오로 시작하기'}
          </Text>
        </Pressable>
        <Text style={styles.terms}>
          시작하면 이용약관 및 개인정보 처리방침에 동의합니다
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoArea: {
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  appName: {
    fontSize: 26,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text.muted,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  kakaoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: KAKAO_YELLOW,
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
  },
  kakaoButtonDisabled: {
    opacity: 0.7,
  },
  kakaoButtonText: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: KAKAO_BROWN,
  },
  terms: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    textAlign: 'center',
  },
})
