import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { useSession } from '../../hooks/useSession'
import { MenuItem } from '../../components/ui/MenuItem'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'

const TERMS_URL = 'https://spring-fang-155.notion.site/38822734852d80eead6be30bda1523a5'
const PRIVACY_URL = 'https://spring-fang-155.notion.site/38822734852d80a1b657e16eda065e0b'

export default function SettingsScreen() {
  const router = useRouter()
  const { session } = useSession()
  const nickname = session?.user?.user_metadata?.nickname as string | undefined
  const userEmail = session?.user?.email

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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          <Pressable style={styles.profileCard} onPress={() => router.push('/account')}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={28} color={colors.text.muted} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {nickname ?? '닉네임 미설정'}
              </Text>
              <Text style={styles.profileSub}>
                {userEmail ?? '로그인이 필요합니다'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <View style={styles.sectionCard}>
            <MenuItem
              icon="document-text-outline"
              label="이용약관"
              onPress={() => WebBrowser.openBrowserAsync(TERMS_URL)}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="shield-checkmark-outline"
              label="개인정보 처리방침"
              onPress={() => WebBrowser.openBrowserAsync(PRIVACY_URL)}
            />
            <View style={styles.menuDivider} />
            <MenuItem
              icon="information-circle-outline"
              label="앱 정보"
              value="v1.0.0"
              showChevron={false}
            />
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
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 48,
  },
})