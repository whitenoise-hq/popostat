import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '../../theme/colors'
import { fonts } from '../../theme/fonts'
import { gradeColors } from '../../theme/colors'
import type { Card, Grade } from '../../types/card'

const MOCK_CARDS: Card[] = [
  {
    id: '1', userId: 'u1', createdAt: '2026-06-22T00:00:00Z',
    petName: '뽀삐', imageUrl: '', detected: '강아지', nameGuess: '포메라니안',
    power: 6842, grade: 'A', title: '솜뭉치 폭격기', analysis: '', specialMove: '솜사탕 돌진',
    stats: { attack: 72, defense: 45, agility: 68, cuteness: 92, laziness: 35 },
  },
  {
    id: '2', userId: 'u1', createdAt: '2026-06-21T00:00:00Z',
    petName: '루나', imageUrl: '', detected: '고양이', nameGuess: '러시안 블루',
    power: 9200, grade: 'SS', title: '달빛의 암살자', analysis: '', specialMove: '그림자 습격',
    stats: { attack: 88, defense: 75, agility: 95, cuteness: 82, laziness: 15 },
  },
  {
    id: '3', userId: 'u1', createdAt: '2026-06-20T00:00:00Z',
    petName: '콩이', imageUrl: '', detected: '강아지', nameGuess: '시츄',
    power: 3200, grade: 'D', title: '낮잠의 왕', analysis: '', specialMove: '무한 졸음',
    stats: { attack: 25, defense: 40, agility: 20, cuteness: 78, laziness: 85 },
  },
  {
    id: '4', userId: 'u1', createdAt: '2026-06-19T00:00:00Z',
    petName: '제우스', imageUrl: '', detected: '강아지', nameGuess: '시베리안 허스키',
    power: 9800, grade: 'SSS', title: '폭풍의 지배자', analysis: '', specialMove: '번개 울부짖음',
    stats: { attack: 96, defense: 88, agility: 92, cuteness: 85, laziness: 8 },
  },
  {
    id: '5', userId: 'u1', createdAt: '2026-06-18T00:00:00Z',
    petName: '모찌', imageUrl: '', detected: '고양이', nameGuess: '스코티시 폴드',
    power: 5100, grade: 'B', title: '동글동글 수비수', analysis: '', specialMove: '떡뭉치 방어',
    stats: { attack: 35, defense: 72, agility: 40, cuteness: 95, laziness: 60 },
  },
  {
    id: '6', userId: 'u1', createdAt: '2026-06-17T00:00:00Z',
    petName: '번개', imageUrl: '', detected: '강아지', nameGuess: '보더콜리',
    power: 8100, grade: 'S', title: '질풍의 목양견', analysis: '', specialMove: '섬광 질주',
    stats: { attack: 70, defense: 65, agility: 98, cuteness: 60, laziness: 10 },
  },
]

function MiniCard({ card, onPress }: { card: Card; onPress: () => void }) {
  const grade = gradeColors[card.grade]

  return (
    <Pressable style={styles.miniCard} onPress={onPress}>
      <View style={[styles.miniImageArea, { borderColor: `${grade.primary}44` }]}>
        <Ionicons name="paw" size={28} color={grade.primary} />
      </View>
      <View style={styles.miniInfo}>
        <View style={styles.miniTopRow}>
          <Text style={styles.miniName} numberOfLines={1}>{card.petName}</Text>
          <View style={[styles.miniGradeBadge, { backgroundColor: grade.primary }]}>
            <Text style={styles.miniGradeText}>{card.grade}</Text>
          </View>
        </View>
        <Text style={styles.miniTitle} numberOfLines={1}>{card.title}</Text>
        <View style={styles.miniPowerRow}>
          <Ionicons name="flash" size={11} color={grade.primary} />
          <Text style={[styles.miniPower, { color: grade.primary }]}>
            {card.power.toLocaleString()}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

export default function DeckScreen() {
  const router = useRouter()
  const hasCards = MOCK_CARDS.length > 0

  if (!hasCards) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>덱</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconWrapper}>
            <Ionicons name="albums-outline" size={56} color={colors.text.muted} />
          </View>
          <Text style={styles.emptyTitle}>아직 카드가 없어요</Text>
          <Text style={styles.emptySubtitle}>측정해서 첫 카드를 만들어보세요</Text>
          <Pressable
            style={styles.emptyButton}
            onPress={() => router.push('/(tabs)/measure')}
          >
            <Ionicons name="flash" size={18} color={colors.button.primaryText} />
            <Text style={styles.emptyButtonText}>측정하러 가기</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>덱</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.sortButton}>
            <Ionicons name="swap-vertical" size={18} color={colors.text.secondary} />
          </Pressable>
          <Pressable style={styles.sortButton}>
            <Ionicons name="filter" size={18} color={colors.text.secondary} />
          </Pressable>
        </View>
      </View>

      <Text style={styles.cardCount}>{MOCK_CARDS.length}장의 카드</Text>

      <FlatList
        data={MOCK_CARDS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MiniCard
            card={item}
            onPress={() => router.push(`/card/${item.id}`)}
          />
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fonts.bold,
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCount: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text.muted,
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 4,
  },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridRow: {
    gap: 12,
    marginBottom: 12,
  },
  miniCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  miniImageArea: {
    aspectRatio: 1.3,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  miniInfo: {
    padding: 10,
    gap: 4,
  },
  miniTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  miniName: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    flex: 1,
  },
  miniGradeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginLeft: 6,
  },
  miniGradeText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: colors.text.inverse,
  },
  miniTitle: {
    fontSize: 11,
    fontFamily: fonts.regular,
    color: colors.text.muted,
  },
  miniPowerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  miniPower: {
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.text.primary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.button.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.button.primaryText,
  },
})