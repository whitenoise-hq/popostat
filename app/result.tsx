import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { BattleCardDark } from '../components/BattleCardDark'
import { colors } from '../theme/colors'
import { fonts } from '../theme/fonts'
import type { Card } from '../types/card'

const MOCK_CARD: Card = {
  id: 'mock-1',
  userId: 'user-1',
  createdAt: '2026-06-22T00:00:00Z',
  petName: '제우스',
  imageUrl: '',
  detected: '강아지',
  nameGuess: '시베리안 허스키',
  power: 9800,
  grade: 'SSS',
  title: '폭풍의 지배자',
  analysis: '전설의 전투력. 모든 스탯이 극한에 달한 초월적 존재. 눈보라를 다스린다.',
  specialMove: '번개 울부짖음 — 하늘을 가르는 포효로 모든 적을 제압한다',
  stats: {
    attack: 96,
    defense: 88,
    agility: 92,
    cuteness: 85,
    laziness: 8,
  },
}

export default function ResultScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>

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
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => router.replace('/(tabs)/deck')}
          >
            <Ionicons name="albums" size={18} color={colors.button.primaryText} />
            <Text style={styles.primaryButtonText}>덱에 저장하기</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Ionicons name="share-outline" size={18} color={colors.text.primary} />
            <Text style={styles.secondaryButtonText}>공유하기</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.retryButton}
          onPress={() => router.replace('/(tabs)/measure')}
        >
          <Ionicons name="refresh" size={16} color={colors.text.muted} />
          <Text style={styles.retryButtonText}>다시 측정하기</Text>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 8,
    gap: 16,
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
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.text.primary,
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
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  retryButtonText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text.muted,
  },
})