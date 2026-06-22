import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useSession } from '../../hooks/useSession'
import { signOut, deleteAccount } from '../../lib/auth'
import { queryClient } from '../../lib/query-client'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'

type MenuItemProps = {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  subtitle?: string
  danger?: boolean
  onPress?: () => void
}

function MenuItem({ icon, label, subtitle, danger, onPress }: MenuItemProps) {
  const iconColor = danger ? colors.error : colors.text.secondary
  const labelColor = danger ? colors.error : colors.text.primary

  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <View style={styles.menuItemContent}>
        <Text style={[styles.menuItemLabel, { color: labelColor }]}>{label}</Text>
        {subtitle ? (
          <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
    </Pressable>
  )
}

export default function SettingsScreen() {
  const { session } = useSession()
  const userEmail = session?.user?.email
  const provider = session?.user?.app_metadata?.provider

  function handleLogout() {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        onPress: async () => {
          try {
            queryClient.clear()
            await signOut()
          } catch (error) {
            console.error('Logout failed:', error)
            Alert.alert('오류', '로그아웃에 실패했습니다.')
          }
        },
      },
    ])
  }

  function handleDeleteAccount() {
    Alert.alert(
      '계정 삭제',
      '모든 데이터가 영구 삭제됩니다. 정말 삭제하시겠어요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              queryClient.clear()
              await deleteAccount()
              await signOut()
            } catch (error) {
              console.error('Delete account failed:', error)
              Alert.alert('오류', '계정 삭제에 실패했습니다.')
            }
          },
        },
      ],
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>설정</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={28} color={colors.text.muted} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {userEmail ?? '로그인이 필요합니다'}
            </Text>
            <Text style={styles.profileSub}>
              {provider ? `${provider} 연동` : '카카오 계정으로 시작하기'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          <View style={styles.sectionCard}>
            <MenuItem icon="log-out-outline" label="로그아웃" onPress={handleLogout} />
            <View style={styles.menuDivider} />
            <MenuItem icon="trash-outline" label="계정 삭제" danger onPress={handleDeleteAccount} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <View style={styles.sectionCard}>
            <MenuItem icon="document-text-outline" label="이용약관" />
            <View style={styles.menuDivider} />
            <MenuItem icon="shield-checkmark-outline" label="개인정보 처리방침" />
            <View style={styles.menuDivider} />
            <MenuItem icon="information-circle-outline" label="앱 정보" subtitle="v1.0.0" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    gap: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  profileSub: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    marginTop: 2,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemLabel: {
    fontSize: 15,
    fontFamily: fonts.medium,
  },
  menuItemSubtitle: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    marginTop: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 48,
  },
})