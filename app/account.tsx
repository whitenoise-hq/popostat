import { useState } from 'react'
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSession } from '../hooks/useSession'
import { signOut, deleteAccount } from '../lib/auth'
import { queryClient } from '../lib/query-client'
import { MenuItem } from '../components/ui/MenuItem'
import { AppModal } from '../components/ui/AppModal'
import { NicknameEditModal } from '../components/settings/NicknameEditModal'
import { colors } from '../theme/colors'
import { fonts } from '../theme/fonts'

const PROVIDER_LABELS: Record<string, string> = {
  kakao: '카카오',
  apple: 'Apple',
}

export default function AccountScreen() {
  const router = useRouter()
  const { session } = useSession()
  const nickname = session?.user?.user_metadata?.nickname as string | undefined
  const userEmail = session?.user?.email
  const isGuest = session?.user?.is_anonymous === true
  const provider = session?.user?.app_metadata?.provider
  const providerLabel = provider ? (PROVIDER_LABELS[provider] ?? null) : null

  const [showNicknameModal, setShowNicknameModal] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  async function handleConfirmLogout() {
    try {
      setShowLogoutModal(false)
      queryClient.clear()
      await signOut()
    } catch (error) {
      console.error('Logout failed:', error)
      Alert.alert('오류', '로그아웃에 실패했습니다.')
    }
  }

  async function handleConfirmDelete() {
    try {
      setShowDeleteModal(false)
      queryClient.clear()
      await deleteAccount()
      await signOut()
    } catch (error) {
      console.error('Delete account failed:', error)
      Alert.alert('오류', '계정 삭제에 실패했습니다.')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>계정</Text>
        <View style={styles.headerSpacer} />
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
            <Text style={styles.profileName}>{nickname ?? '닉네임 미설정'}</Text>
            <Text style={styles.profileSub}>
              {isGuest ? '게스트 모드 · 카드는 7일 후 삭제돼요' : (userEmail ?? '-')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>프로필</Text>
          <View style={styles.sectionCard}>
            <MenuItem
              icon="pencil-outline"
              label="닉네임 수정"
              subtitle={nickname}
              onPress={() => setShowNicknameModal(true)}
            />
            {providerLabel ? (
              <>
                <View style={styles.menuDivider} />
                <MenuItem
                  icon="link-outline"
                  label="연동 계정"
                  subtitle={`${providerLabel} 연동`}
                  showChevron={false}
                />
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정 관리</Text>
          <View style={styles.sectionCard}>
            <MenuItem
              icon="log-out-outline"
              label="로그아웃"
              showChevron={false}
              onPress={() => setShowLogoutModal(true)}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="trash-outline"
              label="계정 삭제"
              danger
              showChevron={false}
              onPress={() => setShowDeleteModal(true)}
            />
          </View>
        </View>
      </ScrollView>

      <NicknameEditModal
        visible={showNicknameModal}
        currentNickname={nickname ?? ''}
        onClose={() => setShowNicknameModal(false)}
        onSaved={() => setShowNicknameModal(false)}
      />

      <AppModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        icon="log-out-outline"
        iconColor={colors.text.primary}
        title="로그아웃 할까요?"
        message="언제든 다시 로그인할 수 있어요."
        buttons={[
          { label: '취소', onPress: () => setShowLogoutModal(false), variant: 'secondary' },
          { label: '로그아웃', onPress: handleConfirmLogout, variant: 'primary' },
        ]}
      />

      <AppModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        icon="alert-circle"
        iconColor={colors.error}
        title="계정을 삭제할까요?"
        message="모든 카드와 데이터가 영구 삭제되며 복구할 수 없어요."
        buttons={[
          { label: '취소', onPress: () => setShowDeleteModal(false), variant: 'secondary' },
          { label: '삭제', onPress: handleConfirmDelete, variant: 'danger' },
        ]}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.text.primary,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 36,
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
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 48,
  },
})