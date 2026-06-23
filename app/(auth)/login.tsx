import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Alert, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import * as AppleAuthentication from 'expo-apple-authentication'
import { signInWithKakao, signInWithApple } from '../../lib/auth'
import { SocialButton } from '../../components/auth/SocialButton'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'

const KAKAO_YELLOW = '#FEE500'
const KAKAO_BROWN = '#3C1E1E'
const APPLE_BLACK = '#000000'
const APPLE_WHITE = '#FFFFFF'

type Loading = 'kakao' | 'apple' | null

export default function LoginScreen() {
  const [loading, setLoading] = useState<Loading>(null)
  const [appleAvailable, setAppleAvailable] = useState(false)

  useEffect(() => {
    if (Platform.OS !== 'ios') return
    AppleAuthentication.isAvailableAsync().then(setAppleAvailable)
  }, [])

  async function handleKakaoLogin() {
    try {
      setLoading('kakao')
      await signInWithKakao()
      // 로그인 성공 시 useProtectedRoute가 자동으로 리다이렉트
    } catch (error) {
      console.error('Kakao login failed:', error)
      Alert.alert('로그인 실패', '다시 시도해주세요.')
    } finally {
      setLoading(null)
    }
  }

  async function handleAppleLogin() {
    try {
      setLoading('apple')
      await signInWithApple()
    } catch (error) {
      // 사용자가 Apple 로그인 시트를 취소한 경우는 오류로 처리하지 않음
      if ((error as { code?: string })?.code === 'ERR_REQUEST_CANCELED') return
      console.error('Apple login failed:', error)
      Alert.alert('로그인 실패', '다시 시도해주세요.')
    } finally {
      setLoading(null)
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
        <SocialButton
          label={loading === 'kakao' ? '로그인 중...' : '카카오로 시작하기'}
          icon="chatbubble"
          backgroundColor={KAKAO_YELLOW}
          textColor={KAKAO_BROWN}
          onPress={handleKakaoLogin}
          loading={loading === 'kakao'}
          disabled={loading !== null}
        />
        {appleAvailable ? (
          <SocialButton
            label={loading === 'apple' ? '로그인 중...' : 'Apple로 시작하기'}
            icon="logo-apple"
            backgroundColor={APPLE_BLACK}
            textColor={APPLE_WHITE}
            onPress={handleAppleLogin}
            loading={loading === 'apple'}
            disabled={loading !== null}
          />
        ) : null}
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
  terms: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    textAlign: 'center',
  },
})
