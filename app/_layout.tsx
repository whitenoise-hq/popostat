import { useCallback, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { queryClient } from '../lib/query-client'
import { useSession } from '../hooks/useSession'
import { colors } from '../theme/colors'

SplashScreen.preventAutoHideAsync()

function useProtectedRoute(session: ReturnType<typeof useSession>['session'], isLoading: boolean) {
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'

    if (!session && !inAuthGroup) {
      // 미로그인 + 인증 화면 아님 → 로그인으로
      router.replace('/(auth)/login')
    } else if (session && inAuthGroup) {
      // 로그인됨 + 인증 화면에 있음 → 탭으로
      router.replace('/(tabs)/measure')
    }
  }, [session, isLoading, segments, router])
}

export default function RootLayout() {
  const { session, isLoading } = useSession()

  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('../assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.otf'),
  })

  useProtectedRoute(session, isLoading)

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && !isLoading) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded, isLoading])

  if (!fontsLoaded || isLoading) {
    return null
  }

  return (
    <View style={styles.root} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/nickname" />
          <Stack.Screen name="scan" options={{ animation: 'fade' }} />
          <Stack.Screen name="result" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="card/[id]" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </QueryClientProvider>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
})
