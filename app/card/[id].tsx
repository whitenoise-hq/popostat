import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { BattleCardDark } from '../../components/BattleCardDark'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'
import type { Card } from '../../types/card'

// TODO: 실제 데이터는 id로 조회. 지금은 목데이터
const MOCK_CARD: Card = {
  id: 'mock-1',
  user_id: 'user-1',
  created_at: '2026-06-22T00:00:00Z',
  pet_name: '뽀삐',
  image_url: '',
  detected: '강아지',
  name_guess: '포메라니안',
  power: 6842,
  grade: 'A',
  title: '솜뭉치 폭격기',
  analysis: '작지만 강력한 에너지를 품고 있다. 솜털 속에 숨겨진 전투력이 상당하다.',
  special_move: '솜사탕 돌진 — 폭신한 털로 적을 감싸 무력화',
  stats: {
    attack: 72,
    defense: 45,
    agility: 68,
    cuteness: 92,
    laziness: 35,
  },
}

export default function CardDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>카드 상세</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BattleCardDark card={MOCK_CARD} />

        <View style={styles.analysisCard}>
          <Ionicons name="chatbox-ellipses" size={16} color={colors.accent} />
          <Text style={styles.analysisText}>{MOCK_CARD.analysis}</Text>
        </View>

        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>측정일</Text>
            <Text style={styles.metaValue}>
              {new Date(MOCK_CARD.created_at).toLocaleDateString('ko-KR')}
            </Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>종류</Text>
            <Text style={styles.metaValue}>{MOCK_CARD.detected}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>품종</Text>
            <Text style={styles.metaValue}>{MOCK_CARD.name_guess}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <Pressable style={styles.primaryButton}>
            <Ionicons name="share-outline" size={18} color={colors.button.primaryText} />
            <Text style={styles.primaryButtonText}>공유하기</Text>
          </Pressable>
        </View>
        <Pressable style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={16} color={colors.error} />
          <Text style={styles.deleteButtonText}>카드 삭제</Text>
        </Pressable>
      </View>
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
    paddingBottom: 8,
    gap: 14,
  },
  analysisCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 10,
    alignItems: 'flex-start',
  },
  analysisText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  metaCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  metaLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text.muted,
  },
  metaValue: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text.primary,
  },
  metaDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 14,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.button.primary,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.button.primaryText,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  deleteButtonText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.error,
  },
})