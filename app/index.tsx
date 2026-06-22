import { Redirect } from 'expo-router'

export default function Index() {
  // TODO: 인증 상태에 따라 분기 (로그인 완료 시 탭, 미완료 시 로그인)
  return <Redirect href="/(tabs)/measure" />
}
