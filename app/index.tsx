import { Redirect } from 'expo-router'

export default function Index() {
  // 세션 분기는 _layout.tsx의 useProtectedRoute가 담당
  // 여기는 초기 진입점으로 탭을 기본으로 보여주고,
  // 미로그인이면 useProtectedRoute가 로그인으로 리다이렉트
  return <Redirect href="/(tabs)/measure" />
}
