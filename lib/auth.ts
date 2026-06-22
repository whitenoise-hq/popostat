import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
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

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function deleteAccount() {
  // TODO: delete_account RPC 호출 (security definer)
  const { error } = await supabase.rpc('delete_account')
  if (error) throw error
}
