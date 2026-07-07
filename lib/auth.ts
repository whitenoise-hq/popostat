import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from './supabase'
import type { Provider } from '@supabase/supabase-js'

// Expo 앱으로 돌아오기 위한 redirect URI
const redirectTo = makeRedirectUri()

/**
 * provider 추상화: 카카오 단독이지만 Sign in with Apple 추가 대비
 * 새 provider 추가 시 이 함수만 수정하면 됨
 */
export async function signInWithProvider(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  })

  if (error) throw error
  if (!data.url) throw new Error('OAuth URL을 받지 못했습니다')

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)

  if (result.type === 'success' && result.url) {
    // URL에서 세션 토큰 추출
    const url = new URL(result.url)
    const params = new URLSearchParams(url.hash.substring(1))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (accessToken && refreshToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      if (sessionError) throw sessionError
    }
  }
}

export async function signInWithKakao() {
  return signInWithProvider('kakao')
}

/**
 * 게스트(익명) 로그인. 소셜 로그인 없이 앱을 바로 쓸 수 있게 한다(5.1.1(v) 대응).
 * Supabase가 익명 UUID를 자동 생성하고, 표시용 닉네임(Guest####)을 함께 부여한다.
 * 닉네임을 sign-in 시점에 metadata로 넣어 닉네임 입력 화면을 건너뛴다.
 * 카드 저장/RLS는 소셜 계정과 동일하게 동작(user_id = 익명 uid).
 */
export async function signInAsGuest() {
  const nickname = `Guest${Math.floor(1000 + Math.random() * 9000)}`
  const { error } = await supabase.auth.signInAnonymously({
    options: { data: { nickname } },
  })
  if (error) throw error
}

/**
 * Sign in with Apple (네이티브 플로우).
 * 카카오와 달리 OAuth 웹 리다이렉트가 아니라 네이티브 시트 → identityToken을
 * Supabase에 전달해 세션을 만든다. 실기기/dev build에서만 동작(Expo Go 불가).
 */
export async function signInWithApple() {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  })

  if (!credential.identityToken) {
    throw new Error('Apple identityToken을 받지 못했습니다')
  }

  const { error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: credential.identityToken,
  })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function deleteAccount() {
  const { error } = await supabase.rpc('delete_account')
  if (error) throw error
}

// 닉네임: 한글/영어 2~6자
export const NICKNAME_MIN_LENGTH = 2
export const NICKNAME_MAX_LENGTH = 6
const NICKNAME_PATTERN = /^[가-힣a-zA-Z]+$/

export function isValidNickname(nickname: string): boolean {
  const trimmed = nickname.trim()
  return (
    trimmed.length >= NICKNAME_MIN_LENGTH &&
    trimmed.length <= NICKNAME_MAX_LENGTH &&
    NICKNAME_PATTERN.test(trimmed)
  )
}

/**
 * 닉네임을 auth user_metadata에 저장한다.
 * USER_UPDATED 이벤트가 발생해 useSession 구독이 갱신된다.
 */
export async function updateNickname(nickname: string) {
  const trimmed = nickname.trim()
  if (!isValidNickname(trimmed)) {
    throw new Error('닉네임은 한글/영어 2~6자여야 합니다')
  }
  const { error } = await supabase.auth.updateUser({ data: { nickname: trimmed } })
  if (error) throw error
}
